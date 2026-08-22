import { useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', reduceMotion ? '0%' : '20%']);

  function handleScrollClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section ref={sectionRef} className="flex min-h-[100dvh] flex-col overflow-hidden md:flex-row">
      <div className="relative flex flex-1 flex-col items-start justify-center gap-4 bg-zinc-50 px-8 py-16 dark:bg-zinc-950 md:px-16">
        <h1 className="font-hero text-5xl text-zinc-950 dark:text-zinc-50 md:text-7xl">
          AI Gallery
        </h1>
        <p className="max-w-md text-sm text-zinc-600 dark:text-zinc-300 md:text-base">
          Prompts and the images they became, before and after, side by side.
        </p>
        <a
          href="#gallery"
          onClick={handleScrollClick}
          aria-label="Scroll to gallery"
          className="mt-4 animate-bounce text-zinc-950 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-zinc-50"
        >
          <ChevronDown size={32} />
        </a>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <motion.div
          style={{ y: bgY, backgroundImage: 'url(/images/hero.jpg)' }}
          className="absolute inset-0 h-[130%] scale-110 bg-cover bg-center"
        />
      </div>
    </section>
  );
}
