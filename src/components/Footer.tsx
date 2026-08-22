export function Footer() {
  const year = new Date().getFullYear();

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <footer className="border-t border-zinc-800 px-4 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 text-center">
        <span className="font-hero text-lg text-zinc-50">AI Gallery</span>
        <p className="text-sm text-zinc-400">Prompts and the images they became.</p>
        <button
          type="button"
          onClick={scrollToTop}
          className="mt-2 text-sm text-zinc-400 underline-offset-4 transition-colors hover:text-zinc-50 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Back to top
        </button>
        <p className="mt-4 text-xs text-zinc-600">© {year} AI Gallery</p>
      </div>
    </footer>
  );
}
