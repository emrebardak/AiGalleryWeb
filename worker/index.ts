import { appendGalleryItem, type NewCardInput } from './addCard';

interface Env {
  ASSETS: Fetcher;
  IMAGES: R2Bucket;
  GITHUB_TOKEN: string;
  GITHUB_REPO: string;
  GITHUB_BRANCH: string;
}

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/api/add-card') {
      return handleAddCard(request, env);
    }

    if (request.method === 'POST' && url.pathname === '/api/upload-image') {
      return handleUploadImage(request, env);
    }

    if (request.method === 'GET' && url.pathname.startsWith('/images/uploads/')) {
      return handleServeUpload(url, env);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleUploadImage(request: Request, env: Env): Promise<Response> {
  const contentType = request.headers.get('Content-Type') ?? '';
  if (!contentType.startsWith('image/')) {
    return jsonResponse({ error: 'Only image uploads are allowed' }, 400);
  }

  const body = await request.arrayBuffer();
  if (body.byteLength === 0) {
    return jsonResponse({ error: 'Empty upload' }, 400);
  }
  if (body.byteLength > MAX_UPLOAD_BYTES) {
    return jsonResponse({ error: 'Image too large (max 8MB)' }, 400);
  }

  const extension = contentType.split('/')[1]?.split('+')[0] || 'jpg';
  const filename = `${Date.now()}-${crypto.randomUUID()}.${extension}`;

  await env.IMAGES.put(`uploads/${filename}`, body, { httpMetadata: { contentType } });

  const origin = new URL(request.url).origin;
  return jsonResponse({ url: `${origin}/images/uploads/${filename}` }, 200);
}

async function handleServeUpload(url: URL, env: Env): Promise<Response> {
  const filename = url.pathname.slice('/images/uploads/'.length);
  const object = await env.IMAGES.get(`uploads/${filename}`);

  if (!object) {
    return new Response('Not found', { status: 404 });
  }

  return new Response(object.body, {
    headers: {
      'Content-Type': object.httpMetadata?.contentType ?? 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}

async function handleAddCard(request: Request, env: Env): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const input = validateInput(body);
  if (!input) {
    return jsonResponse({ error: 'category, afterImage, and prompt are required non-empty strings' }, 400);
  }

  const contentsPath = `https://api.github.com/repos/${env.GITHUB_REPO}/contents/src/data/gallery.json`;
  const githubHeaders = {
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'ai-gallery-add-card-worker',
  };

  const getResponse = await fetch(`${contentsPath}?ref=${env.GITHUB_BRANCH}`, { headers: githubHeaders });
  if (!getResponse.ok) {
    return jsonResponse({ error: `GitHub read failed: ${getResponse.status}` }, 502);
  }

  const file = (await getResponse.json()) as { content: string; sha: string };
  const currentJson = base64ToUtf8(file.content);
  const updatedJson = appendGalleryItem(currentJson, input);

  const putResponse = await fetch(contentsPath, {
    method: 'PUT',
    headers: { ...githubHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `Add gallery card: ${input.category}`,
      content: utf8ToBase64(updatedJson),
      sha: file.sha,
      branch: env.GITHUB_BRANCH,
    }),
  });

  if (!putResponse.ok) {
    return jsonResponse({ error: `GitHub write failed: ${putResponse.status}` }, 502);
  }

  return jsonResponse({ ok: true }, 200);
}

function validateInput(body: unknown): NewCardInput | null {
  if (typeof body !== 'object' || body === null) return null;
  const record = body as Record<string, unknown>;

  if (typeof record.category !== 'string' || record.category.trim() === '') return null;
  if (typeof record.afterImage !== 'string' || record.afterImage.trim() === '') return null;
  if (typeof record.prompt !== 'string' || record.prompt.trim() === '') return null;

  const beforeImage =
    typeof record.beforeImage === 'string' && record.beforeImage.trim() !== '' ? record.beforeImage : undefined;

  return { category: record.category, afterImage: record.afterImage, prompt: record.prompt, beforeImage };
}

function jsonResponse(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

function base64ToUtf8(base64: string): string {
  const binary = atob(base64.replace(/\n/g, ''));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function utf8ToBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}
