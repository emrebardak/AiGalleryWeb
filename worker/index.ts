import { appendGalleryItem, type NewCardInput } from './addCard';

interface Env {
  ASSETS: Fetcher;
  GITHUB_TOKEN: string;
  GITHUB_REPO: string;
  GITHUB_BRANCH: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/api/add-card') {
      return handleAddCard(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

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
