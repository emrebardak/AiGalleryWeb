import { ChevronDown } from 'lucide-react';
import ShaderGroupSwitcher from './originkit/reflect-shader';

export function Hero() {
  function handleScrollClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden">
      <ShaderGroupSwitcher
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', minWidth: 0, minHeight: 0 }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-zinc-950" />
      <div className="relative flex flex-col items-center gap-4 px-4 text-center">
        <h1 className="font-hero text-5xl text-zinc-50 md:text-7xl">AI Gallery</h1>
        <p className="max-w-md text-sm text-zinc-300 md:text-base">
          Prompts and the images they became, before and after, side by side.
        </p>
        <a
          href="#add-card"
          className="mt-2 rounded-full border border-zinc-50/30 px-4 py-2 text-xs text-zinc-50 transition-colors hover:bg-zinc-50/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Add a card
        </a>
      </div>
      <a
        href="#gallery"
        onClick={handleScrollClick}
        aria-label="Scroll to gallery"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-zinc-50 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <ChevronDown size={32} />
      </a>
    </section>
  );
}
