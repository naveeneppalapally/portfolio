'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap';
import { isLighthouse, prefersReducedMotion, getLenis } from '../lib/utils';
import Marquee from './Marquee';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/* ============================================
   FOOTER / CONTACT — giant "LET'S BUILD" display,
   SVG underline draw on enter, ticking IST clock,
   engagement tags, socials, back-to-top.
   ============================================ */

const EMAIL = 'hello@naveen.dev';

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
  { label: 'X / Twitter', href: 'https://x.com' },
  { label: 'Email', href: `mailto:${EMAIL}` },
];

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);
  const underlineRef = useRef<SVGPathElement>(null);
  const [time, setTime] = useState('');

  /* IST clock */
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Kolkata',
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  /* Underline draw + fades on scroll into view */
  useIsoLayoutEffect(() => {
    if (isLighthouse || prefersReducedMotion) return;
    const path = underlineRef.current;
    if (!path) return;

    const ctx = gsap.context(() => {
      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 1.1,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 62%', once: true },
      });
      gsap.set('.foot-fade', { autoAlpha: 0, y: 26 });
      gsap.to('.foot-fade', {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const backToTop = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { duration: 1.8 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <footer
      ref={sectionRef}
      id="contact"
      data-accent="signal"
      className="section overflow-hidden pt-[clamp(3rem,7vh,5rem)]"
    >
      <Marquee
        items={['Available for projects', 'Fixed scope', 'Retainer', 'Advisory', 'Worldwide']}
        className="border-y py-4"
        itemClassName="!text-[0.66rem]"
      />

      <div className="px-[clamp(1.5rem,5vw,4rem)] pb-10 pt-[clamp(4rem,10vh,7rem)]">
        <p className="eyebrow foot-fade">
          <span className="tick">{'// 07 — '}</span>Contact
        </p>

        {/* Giant display */}
        <h2 className="foot-fade display mt-6 uppercase leading-[0.92] text-[clamp(3.4rem,12.5vw,12rem)]">
          Let&apos;s{' '}
          <span className="relative inline-block">
            <span className="serif-accent accent-tint normal-case">build</span>
            <svg
              className="absolute -bottom-[0.06em] left-0 h-[0.16em] w-[102%]"
              viewBox="0 0 300 30"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                ref={underlineRef}
                d="M5 20 C 60 28, 140 6, 195 16 S 275 24, 295 10"
                stroke="var(--accent)"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h2>

        {/* Email */}
        <a
          href={`mailto:${EMAIL}`}
          className="link-sweep foot-fade mt-10 font-mono text-[clamp(0.95rem,2.2vw,1.5rem)] tracking-[0.06em]"
          style={{ color: 'var(--fg)' }}
          data-cursor="link"
        >
          <span className="ls-a">{EMAIL}</span>
          <span className="ls-b" aria-hidden="true">{EMAIL}</span>
        </a>

        {/* Meta grid */}
        <div className="foot-fade mt-[clamp(3rem,7vh,5rem)] grid grid-cols-12 gap-8 border-t pt-8" style={{ borderColor: 'var(--hair)' }}>
          <div className="col-span-12 md:col-span-5">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: 'var(--muted)' }}>
              Ways to work
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Fixed scope', 'Retainer', 'Advisory'].map((t) => (
                <span
                  key={t}
                  className="rounded-full px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.18em]"
                  style={{ border: '1px solid var(--hair)', color: 'var(--fg)' }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="col-span-6 md:col-span-3">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: 'var(--muted)' }}>
              Local time
            </p>
            <p className="mt-4 font-mono text-[0.9rem] tracking-[0.1em]" suppressHydrationWarning>
              {time || '—:—:—'} <span style={{ color: 'var(--accent)' }}>IST</span>
            </p>
          </div>

          <div className="col-span-6 md:col-span-4">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: 'var(--muted)' }}>
              Elsewhere
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noreferrer"
                    className="link-sweep font-mono text-[0.72rem] uppercase tracking-[0.16em]"
                    style={{ color: 'var(--fg)' }}
                    data-cursor="link"
                  >
                    <span className="ls-a">{s.label} ↗</span>
                    <span className="ls-b" aria-hidden="true">{s.label} ↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-[clamp(3rem,6vh,4rem)] flex flex-wrap items-center justify-between gap-4 border-t pt-6 font-mono text-[0.6rem] uppercase tracking-[0.2em]" style={{ borderColor: 'var(--hair)', color: 'var(--muted)' }}>
          <span>©2026 Naveen — Design &amp; code, one pair of hands</span>
          <span className="hidden md:inline">Next.js · GSAP · Lenis · Zero templates</span>
          <button onClick={backToTop} className="link-sweep uppercase tracking-[0.2em]" style={{ color: 'var(--fg)' }} data-cursor="link">
            <span className="ls-a">Back to top ↑</span>
            <span className="ls-b" aria-hidden="true">Back to top ↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
