export function Footer() {
  const year = new Date().getFullYear();

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <footer className="border-t border-zinc-200 px-4 py-10 dark:border-zinc-800">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 text-center">
        <span className="font-hero text-lg text-zinc-950 dark:text-zinc-50">AI Gallery</span>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Prompts and the images they became.
        </p>
        <button
          type="button"
          onClick={scrollToTop}
          className="mt-2 text-sm text-zinc-500 underline-offset-4 transition-colors hover:text-zinc-950 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          Back to top
        </button>
        <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-600">© {year} AI Gallery</p>
      </div>
    </footer>
  );
}
