'use client';

import { useEffect, useState } from 'react';
import { scrollToSection } from '../lib/utils';

const LINKS = [
  { label: 'Work', id: 'work' },
  { label: 'Services', id: 'services' },
  { label: 'Process', id: 'process' },
  { label: 'About', id: 'about' },
];

/**
 * NAVBAR — floating, blend-difference so it inverts over paper sections.
 * A dark scrim fades in after 40px of scroll for readability.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.replaceState(null, '', `#${id}`);
    scrollToSection(id);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-[80]">
      {/* Scroll scrim */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-20 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(180deg, rgba(12,12,14,0.45) 0%, transparent 100%)',
          opacity: scrolled ? 1 : 0,
        }}
      />

      <nav className="relative flex items-center justify-between px-[clamp(1.5rem,5vw,4rem)] py-5 mix-blend-difference">
        {/* Wordmark */}
        <a
          href="#top"
          onClick={go('top')}
          className="flex items-baseline gap-3 text-[#F3F1EC]"
          data-cursor="link"
        >
          <span className="display text-lg font-semibold tracking-tight">
            Naveen<span style={{ color: 'var(--accent)' }}>®</span>
          </span>
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.28em] opacity-60">
            Folio/26
          </span>
        </a>

        {/* Links */}
        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={go(link.id)}
                className="link-sweep font-mono text-[0.66rem] uppercase tracking-[0.24em] text-[#F3F1EC]"
                data-cursor="link"
              >
                <span className="ls-a">{link.label}</span>
                <span className="ls-b" aria-hidden="true">{link.label}</span>
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="#contact"
          onClick={go('contact')}
          className="group flex items-center gap-3 font-mono text-[0.66rem] uppercase tracking-[0.24em] text-[#F3F1EC]"
          data-cursor="link"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span
              className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full"
              style={{ background: 'var(--accent)' }}
            />
          </span>
          <span className="link-sweep">
            <span className="ls-a">Start a project</span>
            <span className="ls-b" aria-hidden="true">Start a project</span>
          </span>
        </a>
      </nav>
    </header>
  );
}
