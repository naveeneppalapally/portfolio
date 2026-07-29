'use client';

import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

/* ============================================
   SERVICES — "Bring me a brief" horizontal accordion.
   Spring flex physics (CSS expo), rotated vertical labels when
   collapsed, per-panel accent art, floating glass stat chips.
   ============================================ */

interface Service {
  id: string;
  num: string;
  title: string;
  brief: string;
  price: string;
  timeline: string;
  accent: string;
  onInk: boolean; // chip text on accent bg
}

const SERVICES: Service[] = [
  {
    id: 'marketing',
    num: '01',
    title: 'Marketing Sites',
    brief:
      'Sites that make brands feel inevitable. Hero-first design, motion baked in, SEO wired from day one.',
    price: 'From $2.5K',
    timeline: '2–4 weeks',
    accent: '#FF4D1C',
    onInk: true,
  },
  {
    id: 'apps',
    num: '02',
    title: 'Web Applications',
    brief:
      'Dashboards, portals, and internal tools with consumer-grade polish. Your team will actually enjoy using them.',
    price: 'From $5K',
    timeline: '4–8 weeks',
    accent: '#6E8CFF',
    onInk: true,
  },
  {
    id: 'commerce',
    num: '03',
    title: 'E-Commerce',
    brief:
      'Storefronts engineered around the buy button. Speed, trust signals, and checkout flows that don’t leak.',
    price: 'From $4K',
    timeline: '3–6 weeks',
    accent: '#3FA66A',
    onInk: true,
  },
  {
    id: 'motion',
    num: '04',
    title: 'Motion & Interaction',
    brief:
      'Scroll choreography, FLIP transitions, canvas engines. The layer that makes people ask how you did that.',
    price: 'From $1.5K',
    timeline: '1–3 weeks',
    accent: '#9B8CFF',
    onInk: true,
  },
  {
    id: 'performance',
    num: '05',
    title: 'Performance Rescue',
    brief:
      'Your site is slow and it’s costing you money. I audit, rebuild the critical path, and hand back a 95+ score.',
    price: 'From $1K',
    timeline: '1–2 weeks',
    accent: '#F3F1EC',
    onInk: false,
  },
];

export default function Services() {
  const [active, setActive] = useState(0);
  const headRef = useScrollReveal<HTMLDivElement>();
  const trackRef = useScrollReveal<HTMLDivElement>();

  return (
    <section
      id="services"
      style={{ zIndex: 4 }}
      data-accent="violet"
      className="section px-[clamp(1.5rem,5vw,4rem)] py-[clamp(5rem,12vh,9rem)]"
    >
      {/* Header */}
      <div ref={headRef} className="reveal-blur mx-auto mb-[clamp(2.5rem,6vh,4rem)] flex max-w-[1600px] flex-wrap items-end justify-between gap-8">
        <div>
          <p className="eyebrow">
            <span className="tick">{'// 03 — '}</span>Bring me a brief
          </p>
          <h2 className="display mt-4 text-[clamp(2.2rem,5.5vw,4.8rem)]">
            Every brief gets <span className="serif-accent accent-tint">a system.</span>
          </h2>
        </div>
        <p className="max-w-xs text-[0.9rem] leading-relaxed" style={{ color: 'var(--muted)' }}>
          Five engagement shapes. Fixed quotes, weekly demos, and code you own.
          Hover through — each one is a different way to work with me.
        </p>
      </div>

      {/* Accordion */}
      <div
        ref={trackRef}
        className="reveal-scale mx-auto flex h-[74vh] max-h-[760px] min-h-[540px] max-w-[1600px] gap-2.5 max-lg:flex-col"
      >
        {SERVICES.map((s, i) => {
          const isActive = i === active;
          return (
            <article
              key={s.id}
              onMouseEnter={() => setActive(i)}
              onClick={() => setActive(i)}
              className="relative cursor-pointer overflow-hidden rounded-2xl will-change-[flex-grow]"
              style={{
                flexGrow: isActive ? 3.4 : 1,
                flexBasis: 0,
                border: `1px solid ${isActive ? s.accent : 'var(--hair)'}`,
                background: 'var(--ink-2)',
                transition:
                  'flex-grow 0.85s cubic-bezier(0.16,1,0.3,1), border-color 0.5s ease',
              }}
              data-cursor={isActive ? 'link' : undefined}
              aria-expanded={isActive}
            >
              {/* Accent art layer */}
              <div
                aria-hidden="true"
                className="absolute inset-0 transition-opacity duration-700"
                style={{
                  background: `radial-gradient(ellipse 90% 70% at 70% 20%, ${s.accent}${isActive ? '33' : '14'} 0%, transparent 65%), radial-gradient(ellipse 60% 50% at 20% 90%, ${s.accent}${isActive ? '22' : '0A'} 0%, transparent 70%)`,
                  opacity: 1,
                }}
              />
              {/* Watermark number */}
              <span
                aria-hidden="true"
                className="display absolute -right-4 -top-6 select-none font-semibold transition-all duration-700"
                style={{
                  fontSize: 'clamp(5rem, 10vw, 9rem)',
                  color: 'transparent',
                  WebkitTextStroke: `1.5px ${s.accent}${isActive ? '55' : '28'}`,
                  lineHeight: 1,
                }}
              >
                {s.num}
              </span>

              {/* Collapsed: vertical label */}
              <div
                className="absolute inset-0 flex items-center justify-center transition-opacity duration-500 max-lg:hidden"
                style={{ opacity: isActive ? 0 : 1, pointerEvents: 'none' }}
              >
                <span
                  className="display whitespace-nowrap text-[clamp(1.1rem,1.6vw,1.5rem)] font-medium uppercase tracking-wide"
                  style={{
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                    color: 'var(--fg)',
                  }}
                >
                  {s.title}
                </span>
              </div>

              {/* Expanded content */}
              <div
                className="absolute inset-0 flex flex-col justify-between p-[clamp(1.25rem,2.5vw,2.25rem)] transition-opacity duration-500"
                style={{
                  opacity: isActive ? 1 : 0,
                  transitionDelay: isActive ? '0.25s' : '0s',
                  pointerEvents: isActive ? 'auto' : 'none',
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-[0.66rem] uppercase tracking-[0.28em]" style={{ color: s.accent }}>
                    Brief {s.num}
                  </span>
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: s.accent }}
                    aria-hidden="true"
                  />
                </div>

                <div className="max-w-[420px]">
                  <h3 className="display text-[clamp(1.5rem,2.6vw,2.4rem)]">{s.title}</h3>
                  <p
                    className="mt-4 text-[0.92rem] leading-relaxed max-lg:hidden"
                    style={{ color: 'var(--muted)' }}
                  >
                    {s.brief}
                  </p>

                  {/* Floating glass chips */}
                  <div className="mt-6 flex flex-wrap gap-2.5">
                    {[s.price, s.timeline, 'Fixed quote'].map((chip, ci) => (
                      <span
                        key={chip}
                        className="rounded-full px-4 py-2 font-mono text-[0.6rem] uppercase tracking-[0.18em]"
                        style={{
                          border: `1px solid ${s.accent}44`,
                          background: 'rgba(12,12,14,0.42)',
                          backdropFilter: 'blur(10px)',
                          color: 'var(--fg)',
                          animation: `svcFloat 5.5s ease-in-out ${ci * 0.7}s infinite`,
                        }}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile collapsed label (accordion is vertical below lg) */}
              <div
                className="absolute inset-x-0 top-0 hidden items-center justify-between p-5 max-lg:flex"
                style={{ opacity: isActive ? 0 : 1 }}
              >
                <span className="display text-lg font-medium uppercase">{s.title}</span>
                <span className="font-mono text-[0.6rem] tracking-[0.24em]" style={{ color: s.accent }}>
                  {s.num}
                </span>
              </div>
            </article>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes svcFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </section>
  );
}

