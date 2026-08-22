import { ChevronDown } from 'lucide-react';

export function Hero() {
  return (
    <section
      className="relative flex min-h-[100dvh] items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: 'url(/images/hero.svg)' }}
    >
      <div className="absolute inset-0 bg-zinc-950/50" />
      <h1 className="font-hero relative text-5xl text-zinc-50 md:text-7xl">
        AI Gallery
      </h1>
      <a
        href="#gallery"
        aria-label="Scroll to gallery"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-zinc-50 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <ChevronDown size={32} />
      </a>
    </section>
  );
}
