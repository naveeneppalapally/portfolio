'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { useLoaderDone } from '../context/LoaderDoneContext';
import { isLighthouse, prefersReducedMotion, scrollToSection } from '../lib/utils';
import MeshGradient from './MeshGradient';
import MagneticButton from './MagneticButton';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * HERO — Immersive web *experiences* built to convert.
 * Per-word clip-path reveal · hand-drawn SVG underline · mesh silk bg ·
 * magnetic CTA · mouse parallax · scroll-out scrub.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const underlineRef = useRef<SVGPathElement>(null);
  const { loaderDone } = useLoaderDone();
  const playedRef = useRef(false);

  const animateIn = loaderDone && !isLighthouse && !prefersReducedMotion;

  /* Hide animated elements pre-paint (only when we're going to animate) */
  useIsoLayoutEffect(() => {
    if (isLighthouse || prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.set('.hw', { yPercent: 115 });
      gsap.set('.hero-fade', { autoAlpha: 0, y: 18 });
      if (underlineRef.current) {
        const len = underlineRef.current.getTotalLength();
        gsap.set(underlineRef.current, {
          strokeDasharray: len,
          strokeDashoffset: len,
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  /* Master entrance timeline — fires when the preloader curtain lifts */
  useEffect(() => {
    if (!animateIn || playedRef.current) return;
    playedRef.current = true;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.to('.hw', { yPercent: 0, duration: 1.4, stagger: 0.12 }).to(
        '.hero-fade',
        { autoAlpha: 1, y: 0, duration: 1.3, stagger: 0.14 },
        0.5
      );

      if (underlineRef.current) {
        tl.to(
          underlineRef.current,
          { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' },
          '-=0.7'
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [animateIn]);


  /* Mouse parallax on the headline block */
  useEffect(() => {
    if (isLighthouse || prefersReducedMotion) return;
    const el = headlineRef.current;
    const section = sectionRef.current;
    if (!el || !section) return;
    if (window.matchMedia('(hover: none)').matches) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3.out' });

    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      xTo(nx * 14);
      yTo(ny * 8);
    };
    section.addEventListener('mousemove', onMove);
    return () => section.removeEventListener('mousemove', onMove);
  }, []);

  /* Scroll-out scrub — content lifts and fades as you leave */
  useEffect(() => {
    if (isLighthouse || prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        yPercent: -14,
        autoAlpha: 0.15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const word = (text: string, key: string, extra = '') => (
    <span key={key} className="inline-block overflow-hidden align-bottom pb-[0.06em] -mb-[0.06em]">
      <span className={`hw inline-block will-change-transform ${extra}`}>{text}</span>
    </span>
  );

  return (
    <section
      ref={sectionRef}
      id="top"
      data-accent="signal"
      className="section relative flex min-h-screen flex-col overflow-hidden"
      style={{ backgroundColor: 'var(--ink)', zIndex: 7 }}
    >
      {/* Mesh silk background */}
      <div className="absolute inset-0" aria-hidden="true">
        <MeshGradient />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 90% 70% at 50% 45%, transparent 30%, var(--ink) 100%)',
          }}
        />
      </div>

      <div
        ref={contentRef}
        className="relative z-10 flex flex-1 flex-col justify-between px-[clamp(1.5rem,5vw,4rem)] pb-[clamp(1.5rem,3vw,2.5rem)] pt-[clamp(6rem,14vh,9rem)]"
      >
        <p className="eyebrow hero-fade">
          <span className="tick">{'// '}</span>Naveen — Creative Developer · Folio 2026
        </p>

        {/* Headline + side column */}
        <div className="mt-[clamp(2rem,6vh,4rem)] flex flex-wrap items-end justify-between gap-10">
          <h1
            ref={headlineRef}
            className="display uppercase text-[clamp(2.75rem,9vw,8.5rem)]"
          >
            <span className="block">
              {word('Immersive', 'w1')}
              {'\u00A0'}
              {word('web', 'w2')}
            </span>
            <span className="block normal-case">
              <span className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.06em]">
                <span className="hw inline-block will-change-transform">
                  <span className="serif-accent accent-tint relative inline-block pr-1 text-[1.04em]">
                    experiences
                    <svg
                      className="absolute -bottom-[0.08em] left-0 h-[0.22em] w-[104%]"
                      viewBox="0 0 320 36"
                      fill="none"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <path
                        ref={underlineRef}
                        d="M6 24 C 72 34, 148 8, 208 20 S 296 30, 314 14"
                        stroke="var(--accent)"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </span>
              </span>
            </span>
            <span className="block">
              {word('built', 'w4')}
              {'\u00A0'}
              {word('to', 'w5')}
              {'\u00A0'}
              {word('convert', 'w6')}
            </span>
          </h1>

          {/* Sub + CTAs */}
          <div className="mb-[0.5em] max-w-sm">
            <p className="hero-fade text-[0.95rem] leading-relaxed" style={{ color: 'var(--muted)' }}>
              I design &amp; engineer award-calibre websites for founders who
              refuse to look ordinary — where motion systems meet measurable
              business results.
            </p>
            <div className="hero-fade mt-7 flex flex-wrap items-center gap-5">
              <MagneticButton
                onClick={() => scrollToSection('contact')}
                className="rounded-full accent-bg px-7 py-4"
                innerClassName="font-mono text-[0.7rem] font-medium uppercase tracking-[0.22em] text-ink"
                ariaLabel="Available for projects — jump to contact"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-ink" />
                </span>
                Available for projects
              </MagneticButton>
              <button
                onClick={() => scrollToSection('work')}
                className="link-sweep font-mono text-[0.7rem] uppercase tracking-[0.22em]"
                style={{ color: 'var(--fg)' }}
                data-cursor="link"
              >
                <span className="ls-a">Selected work ↓</span>
                <span className="ls-b" aria-hidden="true">Selected work ↓</span>
              </button>
            </div>
          </div>
        </div>

        {/* Meta row */}
        <div className="hero-fade mt-[clamp(3rem,9vh,6rem)]">
          <div className="hair-x mb-5" />
          <div
            className="flex flex-wrap items-center justify-between gap-4 font-mono text-[0.62rem] uppercase tracking-[0.24em]"
            style={{ color: 'var(--muted)' }}
          >
            <span>Scroll to explore ↓</span>
            <span className="hidden md:inline">Based in India — Working worldwide</span>
            <span>GMT +5:30</span>
          </div>
        </div>
      </div>
    </section>
  );
}

