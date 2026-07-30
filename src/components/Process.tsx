'use client';

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { isLighthouse, prefersReducedMotion, scrollToSection } from '../lib/utils';
import { useStaticMode } from '../hooks/useStaticMode';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/* ============================================
   PROCESS — §04. Horizontal film-strip scrub.

   A 600vh section provides the scroll distance;
   a CSS `sticky` viewport holds the frame while
   GSAP ScrollTrigger (scrub — NO pin) maps that
   vertical progress onto the track's translateX.
   The browser owns the scroll height, so there
   are no pin-spacers, no miscalculated heights,
   and no jump when the section hands scroll back.
   ============================================ */

/* ---------- Code block styling ---------- */

const C = {
  kw: '#9B8CFF',     // keyword
  fn: '#6E8CFF',     // function/prop
  str: '#3FA66A',    // string/value
  com: 'rgba(243,241,236,0.35)', // comment
  txt: 'rgba(243,241,236,0.8)',  // plain
  acc: '#FF4D1C',
};

function CodeCard({ title, tilt, children }: { title: string; tilt: number; children: ReactNode }) {
  return (
    <div
      className="mt-8 w-full max-w-[420px] rounded-xl border border-white/10 bg-[#0C0C0E] shadow-[0_24px_60px_-20px_rgba(12,12,14,0.45)] transition-transform duration-500 ease-expo-out hover:rotate-0"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <div className="flex items-center gap-2 border-b border-white/[0.08] px-4 py-2.5">
        <i className="h-2 w-2 rounded-full bg-white/15" />
        <i className="h-2 w-2 rounded-full bg-white/15" />
        <span className="ml-2 font-mono text-[0.56rem] tracking-[0.18em] text-white/35">{title}</span>
      </div>
      <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[0.64rem] leading-[1.75]" data-lenis-prevent>
        {children}
      </pre>
    </div>
  );
}

/* ---------- Step data ---------- */

const STEPS: {
  num: string;
  title: string;
  body: string;
  artifact: ReactNode;
  file: string;
  tilt: number;
}[] = [
  {
    num: '01',
    title: 'Discover',
    body: 'Stakeholder call, analytics audit, competitor teardown. We define what "wow" must achieve — in numbers.',
    file: 'brief.md',
    tilt: -2,
    artifact: (
      <>
        <span style={{ color: C.acc }}>## Goal{'\n'}</span>
        <span style={{ color: C.str }}>+ 3x enquiry rate{'\n'}- LCP under 1.2s{'\n'}</span>
        <span style={{ color: C.acc }}>{'\n'}## Non-negotiable{'\n'}</span>
        <span style={{ color: C.txt }}>! Feels expensive</span>
      </>
    ),
  },
  {
    num: '02',
    title: 'Design',
    body: 'Type scale, palette, motion language — designed in the browser, not in a vacuum. You review real pages, not mockups.',
    file: 'tokens.css',
    tilt: 1.6,
    artifact: (
      <>
        <span style={{ color: C.fn }}>:root</span>
        <span style={{ color: C.txt }}> {'{'}{'\n'}</span>
        <span style={{ color: C.txt }}>  --accent: </span>
        <span style={{ color: C.acc }}>#FF4D1C</span>
        <span style={{ color: C.txt }}>;{'\n'}  --ease: </span>
        <span style={{ color: C.str }}>cubic-bezier(.16,1,.3,1)</span>
        <span style={{ color: C.txt }}>;{'\n'}{'}'}</span>
      </>
    ),
  },
  {
    num: '03',
    title: 'Build',
    body: 'Next.js + TypeScript, component systems you can extend. Pixel-faithful, accessible, fast by default.',
    file: 'hero.tsx',
    tilt: -1.4,
    artifact: (
      <>
        <span style={{ color: C.kw }}>export function</span>
        <span style={{ color: C.fn }}> Hero</span>
        <span style={{ color: C.txt }}>() {'{'}{'\n'}  </span>
        <span style={{ color: C.kw }}>return</span>
        <span style={{ color: C.txt }}> </span>
        <span style={{ color: C.acc }}>&lt;MeshGradient /&gt;</span>
        <span style={{ color: C.txt }}>{'\n'}{'}'}</span>
      </>
    ),
  },
  {
    num: '04',
    title: 'Animate',
    body: 'GSAP timelines, scrub and pin choreography — transform-only, verified on a 120Hz panel before you ever see it.',
    file: 'motion.ts',
    tilt: 2,
    artifact: (
      <>
        <span style={{ color: C.fn }}>gsap.timeline</span>
        <span style={{ color: C.txt }}>({'{'}{'\n'}  scrollTrigger: {'{'} </span>
        <span style={{ color: C.kw }}>scrub</span>
        <span style={{ color: C.txt }}>: </span>
        <span style={{ color: C.str }}>0.6</span>
        <span style={{ color: C.txt }}>, </span>
        <span style={{ color: C.kw }}>pin</span>
        <span style={{ color: C.txt }}>: </span>
        <span style={{ color: C.str }}>true</span>
        <span style={{ color: C.txt }}>{' }'}{'\n'}{'}'})</span>
      </>
    ),
  },
  {
    num: '05',
    title: 'Ship',
    body: 'Lighthouse ≥ 95, schema wired, analytics live. Then a 30-day iteration window — included, not extra.',
    file: 'report.json',
    tilt: -2,
    artifact: (
      <>
        <span style={{ color: C.txt }}>{'{'}{'\n'}  </span>
        <span style={{ color: C.fn }}>"perf"</span>
        <span style={{ color: C.txt }}>: </span>
        <span style={{ color: C.acc }}>98</span>
        <span style={{ color: C.txt }}>, </span>
        <span style={{ color: C.fn }}>"seo"</span>
        <span style={{ color: C.txt }}>: </span>
        <span style={{ color: C.acc }}>100</span>
        <span style={{ color: C.txt }}>,{'\n'}  </span>
        <span style={{ color: C.fn }}>"lcp"</span>
        <span style={{ color: C.txt }}>: </span>
        <span style={{ color: C.str }}>"0.9s"</span>
        <span style={{ color: C.txt }}>{'\n'}{'}'}</span>
      </>
    ),
  },
];

const TOTAL_STEPS = STEPS.length + 1; // 5 steps + 1 CTA card = 6 panels

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const staticMode = useStaticMode();
  const noMotion = isLighthouse || prefersReducedMotion;

  /* Vertical scroll → horizontal track position.
     CSS sticky holds the frame; ScrollTrigger only scrubs.
     No pin, no anticipatePin, no spacer divs. */
  useIsoLayoutEffect(() => {
    if (noMotion) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const endX = () => {
        const last = track.lastElementChild as HTMLElement | null;
        if (!last) return 0;
        // Stop when the last card's right edge hits the viewport right edge (with padding)
        const pad = window.innerWidth * 0.05;
        return -(last.offsetLeft + last.offsetWidth - window.innerWidth + pad);
      };

      gsap.to(track, {
        x: endX,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self: ScrollTrigger) => {
            if (barRef.current) {
              barRef.current.style.transform = `scaleX(${self.progress})`;
            }
            if (counterRef.current) {
              const step = Math.min(TOTAL_STEPS, Math.max(1, Math.ceil(self.progress * TOTAL_STEPS)));
              counterRef.current.textContent = `0${step} / 0${TOTAL_STEPS}`;
            }
          },
        },
      });
    }, section);

    let cancelled = false;
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready
        .then(() => { if (!cancelled) ScrollTrigger.refresh(); })
        .catch(() => {});
    }

    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, [noMotion]);

  return (
    <section
      ref={sectionRef}
      id="process"
      data-accent="moss"
      className={`section section--paper ${staticMode ? 'h-auto' : 'h-[450vh]'}`}
      style={{ zIndex: 5 }}
    >
      <div className={`flex items-center ${staticMode ? 'overflow-x-auto py-[clamp(4rem,10vh,7rem)]' : 'sticky top-0 h-screen overflow-hidden'}`} style={{ position: staticMode ? undefined : 'sticky' }}>
        <div
          ref={trackRef}
          className={`flex items-stretch will-change-transform ${staticMode ? 'w-full snap-x snap-mandatory gap-[5vw] overflow-x-auto px-[clamp(1.5rem,5vw,4rem)] pb-8' : 'w-max'}`}
          {...(staticMode ? { 'data-lenis-prevent': true } : {})}
        >
          {/* Left padding spacer */}
          {!staticMode && <div className="w-[clamp(1.5rem,5vw,4rem)] shrink-0" aria-hidden="true" />}

          {/* Intro panel */}
          <div className="flex w-[86vw] shrink-0 flex-col justify-center sm:w-[42vw] lg:w-[34vw]">
            <p className="eyebrow">
              <span className="tick">{'// 04 — '}</span>Process
            </p>
            <h2 className="display mt-4 text-[clamp(2.2rem,4.5vw,4rem)]">
              From brief to <span className="serif-accent accent-tint">bleeding edge.</span>
            </h2>
            <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed" style={{ color: 'var(--muted)' }}>
              Five steps, zero black boxes. You see the work every Friday —
              and every step leaves an artifact you keep.
            </p>
            <span className="mt-10 font-mono text-[0.66rem] uppercase tracking-[0.3em]" style={{ color: 'var(--muted)' }}>
              Keep scrolling →
            </span>
          </div>

          {/* Step cards 01–05 */}
          {STEPS.map((s) => (
            <article
              key={s.num}
              className={`flex w-[84vw] shrink-0 flex-col justify-center sm:w-[46vw] lg:w-[34vw] ml-[5vw] ${staticMode ? 'snap-center' : ''}`}
            >
              <span
                className="display select-none font-semibold"
                style={{
                  fontSize: 'clamp(4rem, 7vw, 6.5rem)',
                  lineHeight: 1,
                  color: 'transparent',
                  WebkitTextStroke: '1.5px var(--accent)',
                }}
                aria-hidden="true"
              >
                {s.num}
              </span>
              <h3 className="display mt-4 text-[clamp(1.6rem,2.6vw,2.4rem)]">{s.title}</h3>
              <p className="mt-4 max-w-md text-[0.92rem] leading-relaxed" style={{ color: 'var(--muted)' }}>
                {s.body}
              </p>
              <CodeCard title={s.file} tilt={s.tilt}>
                {s.artifact}
              </CodeCard>
            </article>
          ))}

          {/* CTA card 06 */}
          <div className={`ml-[5vw] flex w-[84vw] shrink-0 flex-col items-center justify-center text-center sm:w-[46vw] lg:w-[34vw] ${staticMode ? 'snap-center' : ''}`}>
            <span
              className="display select-none font-semibold"
              style={{
                fontSize: 'clamp(4rem, 7vw, 6.5rem)',
                lineHeight: 1,
                color: 'transparent',
                WebkitTextStroke: '1.5px var(--hair)',
              }}
              aria-hidden="true"
            >
              06
            </span>
            <h3 className="display mt-4 text-[clamp(1.6rem,2.6vw,2.4rem)]">
              Your <span className="serif-accent accent-tint">project.</span>
            </h3>
            <p className="mt-4 max-w-sm text-[0.92rem] leading-relaxed" style={{ color: 'var(--muted)' }}>
              Step six is where your brief walks through this exact pipeline.
            </p>
            <button
              onClick={() => scrollToSection('contact')}
              className="accent-bg mt-8 rounded-full px-7 py-4 font-mono text-[0.68rem] font-medium uppercase tracking-[0.22em] text-[#0C0C0E]"
              data-cursor="link"
            >
              Start the clock ↗
            </button>
          </div>
        </div>

        {/* Progress rail — inside sticky container so it disappears with the section */}
        {!staticMode && (
          <div className="pointer-events-none absolute inset-x-[clamp(1.5rem,5vw,4rem)] bottom-8 flex items-center gap-6">
            <span
              ref={counterRef}
              className="font-mono text-[0.66rem] uppercase tracking-[0.24em]"
              style={{ color: 'var(--muted)' }}
            >
              01 / 06
            </span>
            <div className="hair-x relative flex-1">
              <div
                ref={barRef}
                className="accent-bg absolute inset-0 origin-left"
                style={{ transform: 'scaleX(0)' }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
