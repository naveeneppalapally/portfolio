'use client';

import { useEffect, useLayoutEffect, useRef, lazy, Suspense } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { isLighthouse, prefersReducedMotion, safeExternalUrl } from '../lib/utils';
import { useStaticMode } from '../hooks/useStaticMode';

const MetricSpark = lazy(() => import('./MetricSpark'));

/**
 * FEATURED SCRUB — pinned case study (the signature section).
 * Scroll scrubs a CSS-built browser mockup through three stages:
 * wireframe → designed UI → live metrics. Copy stages crossfade in lockstep.
 */
const STAGES = [
  {
    id: '01',
    title: 'The brief',
    body: 'A solar startup with zero digital presence needed homeowners to trust a ₹2L purchase — inside one scroll.',
  },
  {
    id: '02',
    title: 'The build',
    body: 'Next.js 15, a hand-rolled motion system, and an LCP budget under one second. Every animation earns its frame.',
  },
  {
    id: '03',
    title: 'The numbers',
    body: 'Ninety days post-launch. Real metrics, not vibes.',
  },
];

// Give each reveal more scroll room so the three stages feel deliberate rather
// than flashing past while the pinned case study is being scrubbed.
const FEATURED_SCROLL_DISTANCE = '+=600vh';

export default function FeaturedScrub() {
  const sectionRef = useRef<HTMLElement>(null);
  const staticMode = useStaticMode(); // JSX branches only (hydration-safe)
  const noMotion = isLighthouse || prefersReducedMotion; // effect gates only

  /* Master scrub timeline */
  useEffect(() => {
    if (noMotion) return;

    const ctx = gsap.context(() => {
      gsap.set('.fs-browser', { autoAlpha: 0, scale: 0.92, y: 40 });
      gsap.set('.fs-wire', { scaleX: 0, transformOrigin: 'left center' });
      gsap.set('.fs-ui', { autoAlpha: 0, y: 26 });
      gsap.set('.fs-metric', { autoAlpha: 0, scale: 0.7, y: 30, rotate: 4 });
      gsap.set('.fs-spark', { autoAlpha: 0, y: 20 });
      gsap.set('.fs-stage', { autoAlpha: 0, y: 24 });
      gsap.set('.fs-stage-1', { autoAlpha: 1, y: 0 });
      gsap.set('.fs-header > *', { autoAlpha: 0, y: 24 });

      const tl = gsap.timeline({
        defaults: { ease: 'expo.out' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: FEATURED_SCROLL_DISTANCE,
          scrub: 0.9,
          pin: true,
          anticipatePin: 0,
          invalidateOnRefresh: true,
        },
      });

      /* — Header in — */
      tl.to('.fs-header > *', { autoAlpha: 1, y: 0, stagger: 0.04, duration: 0.6 }, 0);

      /* — Browser frame assembles — */
      tl.to('.fs-browser', { autoAlpha: 1, scale: 1, y: 0, duration: 0.8 }, 0.15);

      /* — Stage 1: wireframe bars draw — */
      tl.to('.fs-wire', { scaleX: 1, stagger: 0.05, duration: 0.5, ease: 'power3.out' }, 0.55);

      /* — Stage swap 1→2 — */
      tl.to('.fs-stage-1', { autoAlpha: 0, y: -24, duration: 0.4 }, 1.25);
      tl.to('.fs-stage-2', { autoAlpha: 1, y: 0, duration: 0.4 }, 1.35);

      /* — Stage 2: wireframe dissolves, designed UI flies in — */
      tl.to('.fs-wire', { autoAlpha: 0, duration: 0.35 }, 1.4);
      tl.to('.fs-ui', { autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.55 }, 1.5);

      /* — Stage swap 2→3 — */
      tl.to('.fs-stage-2', { autoAlpha: 0, y: -24, duration: 0.4 }, 2.45);
      tl.to('.fs-stage-3', { autoAlpha: 1, y: 0, duration: 0.4 }, 2.55);

      /* — Stage 3: metric cards + sparkline — */
      tl.to(
        '.fs-metric',
        { autoAlpha: 1, scale: 1, y: 0, rotate: 0, stagger: 0.08, duration: 0.6, ease: 'back.out(1.6)' },
        2.6
      );
      tl.to('.fs-spark', { autoAlpha: 1, y: 0, duration: 0.5 }, 2.85);

      /* — Counters: fired once at stage-3 entry, NOT tied to scrub progress — */
      /* Using a separate ScrollTrigger with once:true prevents them resetting to 0 on backward scrub */
      const countEls = Array.from(document.querySelectorAll<HTMLElement>('.fs-count'));
      if (countEls.length) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          /* Stage 3 begins at ~83% of timeline, matching the main scrub. */
          start: 'top top',
          end: FEATURED_SCROLL_DISTANCE,
          onUpdate: (self) => {
            if (self.progress >= 0.83) {
              countEls.forEach((el) => {
                const end = parseFloat(el.dataset.end || '0');
                const decimals = parseInt(el.dataset.decimals || '0', 10);
                el.textContent = end.toFixed(decimals);
              });
            } else {
              countEls.forEach((el) => {
                el.textContent = '0';
              });
            }
          },
        });
      }

      /* — Settle — */
      tl.to({}, { duration: 0.3 });
    }, sectionRef);

    return () => ctx.revert();
  }, [noMotion]);

  return (
    <section
      ref={sectionRef}
      id="case"
      data-accent="signal"
      className="section relative min-h-screen"
      style={{ zIndex: 6 }}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col justify-center px-[clamp(1.5rem,5vw,4rem)] pb-[clamp(3rem,6vh,5rem)] pt-[clamp(6rem,12vh,8rem)]">
        {/* Header */}
        <div className="fs-header mb-[clamp(2rem,5vh,3.5rem)] flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">
              <span className="tick">{'// 01 — '}</span>Featured case — MyHomeSolar.co.in
            </p>
            <h2 className="display mt-4 text-[clamp(1.9rem,3.6vw,3.2rem)]">
              One build, <span className="serif-accent accent-tint">measured.</span>
            </h2>
          </div>
          <a
            href={safeExternalUrl('https://myhomesolar.co.in')}
            target="_blank"
            rel="noreferrer"
            className="link-sweep font-mono text-[0.68rem] uppercase tracking-[0.24em]"
            style={{ color: 'var(--fg)' }}
            data-cursor="link"
          >
            <span className="ls-a">Visit live site ↗</span>
            <span className="ls-b" aria-hidden="true">Visit live site ↗</span>
          </a>
        </div>

        <div className="grid grid-cols-12 items-center gap-[clamp(2rem,4vw,4rem)]">
          {/* Stage copy */}
          <div className="relative col-span-12 lg:col-span-4" style={{ minHeight: staticMode ? 'auto' : 240 }}>
            {STAGES.map((s, i) => (
              <div
                key={s.id}
                className={`fs-stage fs-stage-${i + 1} ${
                  staticMode ? 'relative mb-10' : 'absolute inset-0'
                }`}
              >
                <span className="font-mono text-[0.66rem] uppercase tracking-[0.3em] accent-tint">
                  Stage {s.id} / 03
                </span>
                <h3 className="display mt-4 text-[clamp(1.5rem,2.4vw,2.2rem)]">{s.title}</h3>
                <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed" style={{ color: 'var(--muted)' }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>

          {/* Browser mockup + metrics */}
          <div className="relative col-span-12 lg:col-span-8">
            <div className="fs-browser relative overflow-hidden rounded-2xl border border-white/10 bg-[#101013] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]">
              {/* Chrome bar */}
              <div className="flex h-10 items-center gap-3 border-b border-white/[0.07] px-4">
                <span className="flex gap-1.5">
                  <i className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <i className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <i className="h-2.5 w-2.5 rounded-full bg-white/15" />
                </span>
                <span className="mx-auto flex h-5 w-[46%] items-center justify-center rounded-md bg-white/[0.05] font-mono text-[0.58rem] tracking-[0.18em] text-white/35">
                  myhomesolar.co.in
                </span>
                <span className="w-10" />
              </div>

              {/* Viewport */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#0B0B0D] p-[4%]">
                {/* Wireframe layer */}
                <div className="absolute inset-0 flex flex-col gap-[4%] p-[4%]" aria-hidden="true">
                  <div className="fs-wire h-[6%] w-full rounded-full bg-white/[0.13]" />
                  <div className="fs-wire mt-[4%] h-[12%] w-[58%] rounded-md bg-white/[0.13]" />
                  <div className="fs-wire h-[12%] w-[44%] rounded-md bg-white/[0.13]" />
                  <div className="fs-wire h-[5%] w-[66%] rounded-full bg-white/[0.09]" />
                  <div className="mt-[5%] flex gap-[4%]">
                    <div className="fs-wire h-16 w-1/3 rounded-lg bg-white/[0.09] sm:h-20" />
                    <div className="fs-wire h-16 w-1/3 rounded-lg bg-white/[0.09] sm:h-20" />
                    <div className="fs-wire h-16 w-1/3 rounded-lg bg-white/[0.09] sm:h-20" />
                  </div>
                </div>

                {/* Designed UI layer */}
                <div className="absolute inset-0 flex flex-col p-[4%]">
                  <div className="fs-ui flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <i className="h-3 w-3 rounded-full bg-amber-400" />
                      <i className="h-1.5 w-14 rounded-full bg-white/25" />
                    </span>
                    <span className="flex items-center gap-2">
                      <i className="hidden h-1.5 w-10 rounded-full bg-white/15 sm:block" />
                      <i className="hidden h-1.5 w-10 rounded-full bg-white/15 sm:block" />
                      <i className="h-4 w-14 rounded-full bg-amber-400/90" />
                    </span>
                  </div>
                  <div className="fs-ui mt-[5%] font-display font-semibold uppercase leading-[1.02] tracking-tight text-white" style={{ fontSize: 'clamp(0.9rem, 2.6vw, 2rem)' }}>
                    Harness the power
                    <br />
                    <span className="text-amber-400">of the sun</span>
                  </div>
                  <div className="fs-ui mt-[2.5%] h-1.5 w-[52%] rounded-full bg-white/15" />
                  <div className="fs-ui mt-[3.5%] flex gap-3">
                    <i className="h-5 w-20 rounded-full bg-amber-400 sm:h-6 sm:w-24" />
                    <i className="h-5 w-20 rounded-full border border-white/20 sm:h-6 sm:w-24" />
                  </div>
                  <div className="fs-ui mt-auto flex gap-[3%]">
                    {['15+ Installs', '70+ kW', '25 Yr Warranty'].map((s) => (
                      <div key={s} className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2.5">
                        <div className="font-display text-[0.72rem] font-semibold text-amber-300 sm:text-[0.85rem]">
                          {s.split(' ')[0]}
                        </div>
                        <div className="mt-0.5 font-mono text-[0.5rem] uppercase tracking-[0.18em] text-white/35 sm:text-[0.55rem]">
                          {s.split(' ').slice(1).join(' ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating metric cards + sparkline */}
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:pointer-events-none lg:absolute lg:inset-0 lg:mt-0">
              <div className="fs-metric rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-md lg:absolute lg:-left-8 lg:top-6">
                <div className="display text-2xl text-white">
                  <span className="fs-count" data-end="98">98</span>
                </div>
                <div className="mt-1 font-mono text-[0.55rem] uppercase tracking-[0.2em] text-white/45">Lighthouse perf</div>
              </div>
              <div className="fs-metric rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-md lg:absolute lg:-right-6 lg:top-[22%]">
                <div className="display text-2xl text-white">
                  <span className="fs-count" data-end="0.9" data-decimals="1">0.9</span>s
                </div>
                <div className="mt-1 font-mono text-[0.55rem] uppercase tracking-[0.2em] text-white/45">LCP mobile</div>
              </div>
              <div className="fs-metric rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-md lg:absolute lg:-left-10 lg:bottom-[26%]">
                <div className="display text-2xl text-white">
                  <span className="fs-count" data-end="100">100</span>
                </div>
                <div className="mt-1 font-mono text-[0.55rem] uppercase tracking-[0.2em] text-white/45">SEO score</div>
              </div>
              <div className="fs-metric rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-md lg:absolute lg:-right-8 lg:bottom-[8%]">
                <div className="display text-2xl" style={{ color: 'var(--accent)' }}>
                  +<span className="fs-count" data-end="164">164</span>%
                </div>
                <div className="mt-1 font-mono text-[0.55rem] uppercase tracking-[0.2em] text-white/45">Enquiries</div>
              </div>
            </div>

            <div className="fs-spark mt-3 h-[92px] w-full rounded-xl border border-white/10 bg-white/[0.05] p-3 backdrop-blur-md lg:absolute lg:-bottom-10 lg:left-[14%] lg:mt-0 lg:w-[240px]">
              <div className="mb-1 font-mono text-[0.52rem] uppercase tracking-[0.2em] text-white/40">
                Enquiries / week — first 90 days
              </div>
              <div className="h-[58px]">
                <Suspense fallback={null}>
                  <MetricSpark />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
