import { useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.to(bgRef.current, {
          yPercent: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  function handleScrollClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    gsap.to(window, { duration: 1, scrollTo: '#gallery', ease: 'power2.inOut' });
  }

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden"
    >
      <div
        ref={bgRef}
        className="absolute inset-0 scale-125 bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/hero.svg)' }}
      />
      <div className="absolute inset-0 bg-zinc-950/50" />
      <h1 className="font-hero relative text-5xl text-zinc-50 md:text-7xl">
        AI Gallery
      </h1>
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
