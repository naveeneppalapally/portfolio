'use client';

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { isLighthouse, prefersReducedMotion, getLenis, safeExternalUrl } from '../lib/utils';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/* ============================== DATA ============================== */

type Category = 'client' | 'concept' | 'lab';

interface Project {
  id: string;
  title: string;
  category: Category;
  categoryLabel: string;
  year: string;
  tags: string[];
  blurb: string;
  role: string;
  metrics: [string, string][];
  link?: string;
  art: 'solar' | 'bank' | 'atelier' | 'pulse' | 'orbit' | 'grid';
  artBg: string;
}

const PROJECTS: Project[] = [
  {
    id: 'myhomesolar',
    title: 'MyHome Solar',
    category: 'client',
    categoryLabel: 'Client Work',
    year: '2026',
    tags: ['Next.js 15', 'GSAP', 'SEO'],
    blurb:
      'Production solar platform for the Indian market — hash-routed SPA shell, LCP-first hero strategy, and a local-SEO engine that took it to #1 in its district within 90 days.',
    role: 'Design · Build · SEO',
    metrics: [
      ['98', 'Lighthouse'],
      ['0.9s', 'LCP mobile'],
      ['+164%', 'Enquiries'],
    ],
    link: 'https://myhomesolar.co.in',
    art: 'solar',
    artBg: '#141007',
  },
  {
    id: 'lumen',
    title: 'Lumen Bank',
    category: 'concept',
    categoryLabel: 'Concept',
    year: '2026',
    tags: ['Fintech', 'Dashboard', 'Motion'],
    blurb:
      'A digital banking concept exploring spring-physics accordions, glass stat layers, and silk-gradient ambience — proof that fintech doesn’t have to feel like a spreadsheet.',
    role: 'Concept — Design · Front-end',
    metrics: [
      ['12', 'Screens'],
      ['5', 'Motion studies'],
    ],
    art: 'bank',
    artBg: '#0A0D18',
  },
  {
    id: 'atelier',
    title: 'Atelier Nine',
    category: 'concept',
    categoryLabel: 'Concept',
    year: '2026',
    tags: ['Gallery', 'Editorial', 'GSAP Flip'],
    blurb:
      'A design-studio gallery concept: masonry rhythms, category wipe transitions, and FLIP lightboxes. The study that became this site’s work index.',
    role: 'Concept — Design · Front-end',
    metrics: [
      ['4', 'Layouts'],
      ['60fps', 'Transitions'],
    ],
    art: 'atelier',
    artBg: '#100C18',
  },
  {
    id: 'pulse',
    title: 'Pulse Type',
    category: 'lab',
    categoryLabel: 'Lab',
    year: '2026',
    tags: ['Canvas', 'Kinetic Type', 'WIP'],
    blurb:
      'A kinetic typography engine rendered on Canvas 2D — glyphs displaced by pointer velocity fields. An ongoing experiment in tactile lettering.',
    role: 'Lab — In development',
    metrics: [
      ['60', 'fps target'],
      ['0', 'Libraries'],
    ],
    art: 'pulse',
    artBg: '#0A120C',
  },
  {
    id: 'orbit',
    title: 'Orbit Commerce',
    category: 'concept',
    categoryLabel: 'Concept',
    year: '2026',
    tags: ['E-commerce', '3D Cards', 'WebGL-ready'],
    blurb:
      'A headless commerce concept with a scroll-scrubbed product stage and spring card-stack navigation — the storefront as an object you turn in your hands.',
    role: 'Concept — Design · Front-end',
    metrics: [
      ['3', 'Product stages'],
      ['120Hz', 'Card physics'],
    ],
    art: 'orbit',
    artBg: '#120A14',
  },
  {
    id: 'grid',
    title: 'Gridfolio OS',
    category: 'lab',
    categoryLabel: 'Lab',
    year: '2026',
    tags: ['Design System', 'Tokens', 'Open Source'],
    blurb:
      'The token + component engine that powers this very site — themable sections, per-accent palettes, and motion primitives published as a starter.',
    role: 'Lab — Design system',
    metrics: [
      ['40+', 'Tokens'],
      ['12', 'Primitives'],
    ],
    art: 'grid',
    artBg: '#0A1014',
  },
];

const FILTERS: { key: 'all' | Category; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'client', label: 'Client Work' },
  { key: 'concept', label: 'Concepts' },
  { key: 'lab', label: 'Lab' },
];

/* ====================== GENERATIVE ART LAYER ======================
   Pure CSS/SVG "renders" — no image assets, each card is a tiny
   generative piece with its own palette. Scales on card hover. */

function ProjectArt({ kind }: { kind: Project['art'] }) {
  switch (kind) {
    case 'solar':
      return (
        <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <radialGradient id="wa-sun" cx="50%" cy="62%" r="55%">
              <stop offset="0%" stopColor="#FFB43A" stopOpacity="0.95" />
              <stop offset="45%" stopColor="#FF7A1C" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#FF7A1C" stopOpacity="0" />
            </radialGradient>
          </defs>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <line key={`h${i}`} x1="0" y1={60 + i * 40} x2="400" y2={60 + i * 40} stroke="#F3F1EC" strokeOpacity="0.07" />
          ))}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <line key={`v${i}`} x1={i * 44.5} y1="0" x2={i * 44.5} y2="300" stroke="#F3F1EC" strokeOpacity="0.05" />
          ))}
          <circle cx="200" cy="186" r="120" fill="url(#wa-sun)" />
          {[70, 105, 140, 175].map((r) => (
            <path key={r} d={`M ${200 - r} 186 A ${r} ${r} 0 0 1 ${200 + r} 186`} fill="none" stroke="#FFB43A" strokeOpacity="0.5" strokeWidth="1.2" />
          ))}
          <rect x="120" y="210" width="160" height="46" rx="6" fill="#0C0C0E" fillOpacity="0.75" stroke="#FFB43A" strokeOpacity="0.35" />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={132 + i * 36} y="220" width="26" height="26" rx="3" fill="#FFB43A" fillOpacity={0.25 + i * 0.18} />
          ))}
        </svg>
      );
    case 'bank':
      return (
        <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="wb-wave1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6E8CFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#3E57C9" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="wb-wave2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#9B8CFF" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#6E8CFF" stopOpacity="0.25" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`M -20 ${210 - i * 34} C 90 ${150 - i * 30}, 180 ${250 - i * 38}, 300 ${170 - i * 26} S 420 ${200 - i * 30}, 440 ${160 - i * 28} L 440 320 L -20 320 Z`}
              fill={i % 2 === 0 ? 'url(#wb-wave1)' : 'url(#wb-wave2)'}
              fillOpacity={0.32 + i * 0.14}
            />
          ))}
          <rect x="248" y="52" width="112" height="70" rx="10" fill="#F3F1EC" fillOpacity="0.08" stroke="#F3F1EC" strokeOpacity="0.2" />
          <rect x="262" y="66" width="44" height="6" rx="3" fill="#F3F1EC" fillOpacity="0.5" />
          <rect x="262" y="82" width="70" height="12" rx="4" fill="#6E8CFF" fillOpacity="0.8" />
          <rect x="262" y="102" width="56" height="6" rx="3" fill="#F3F1EC" fillOpacity="0.3" />
        </svg>
      );
    case 'atelier':
      return (
        <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="wc-block" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#9B8CFF" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#5A43D6" stopOpacity="0.45" />
            </linearGradient>
          </defs>
          <rect x="28" y="30" width="150" height="200" rx="8" fill="url(#wc-block)" fillOpacity="0.9" />
          <rect x="196" y="30" width="176" height="90" rx="8" fill="#F3F1EC" fillOpacity="0.1" stroke="#9B8CFF" strokeOpacity="0.4" />
          <rect x="196" y="138" width="80" height="132" rx="8" fill="#F3F1EC" fillOpacity="0.14" />
          <rect x="292" y="138" width="80" height="132" rx="8" fill="none" stroke="#F3F1EC" strokeOpacity="0.25" strokeDasharray="5 6" />
          <text x="46" y="70" fill="#F3F1EC" fontFamily="monospace" fontSize="13" letterSpacing="4">01</text>
          <text x="214" y="70" fill="#9B8CFF" fontFamily="monospace" fontSize="13" letterSpacing="4">02</text>
          <text x="212" y="180" fill="#F3F1EC" fillOpacity="0.6" fontFamily="monospace" fontSize="13" letterSpacing="4">03</text>
          <circle cx="332" cy="236" r="18" fill="none" stroke="#9B8CFF" strokeWidth="1.5" />
          <path d="M 326 236 L 338 236 M 332 230 L 332 242" stroke="#9B8CFF" strokeWidth="1.5" />
        </svg>
      );
    case 'pulse':
      return (
        <div className="flex h-full w-full flex-col items-start justify-center gap-1 overflow-hidden px-6" aria-hidden="true">
          {['PULSE', 'KINETIC', 'GLYPH', 'FIELD'].map((t, i) => (
            <div
              key={t}
              className="display whitespace-nowrap font-semibold uppercase leading-[0.95]"
              style={{
                fontSize: 'clamp(2rem, 4.5vw, 3.4rem)',
                color: i === 1 ? '#3FA66A' : 'transparent',
                WebkitTextStroke: i === 1 ? '0' : '1px rgba(63,166,106,0.55)',
                transform: `translateX(${i % 2 === 0 ? 0 : 14}%) skewX(-6deg)`,
                letterSpacing: '-0.02em',
              }}
            >
              {t}
            </div>
          ))}
        </div>
      );
    case 'orbit':
      return (
        <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <radialGradient id="wo-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#9B8CFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#5A43D6" stopOpacity="0" />
            </radialGradient>
          </defs>
          {[0, 1, 2].map((i) => (
            <ellipse
              key={i}
              cx="200"
              cy="150"
              rx={60 + i * 45}
              ry={60 + i * 45}
              fill="none"
              stroke="#9B8CFF"
              strokeOpacity={0.5 - i * 0.14}
              strokeWidth="1.2"
              transform={`rotate(${i * 22} 200 150) scale(1 ${0.55 + i * 0.18}) translate(0 ${i * -18})`}
            />
          ))}
          <circle cx="200" cy="150" r="58" fill="url(#wo-core)" />
          <circle cx="200" cy="150" r="16" fill="#9B8CFF" fillOpacity="0.85" />
          {[
            [268, 96],
            [128, 210],
            [296, 208],
          ].map(([x, y], i) => (
            <g key={i}>
              <rect x={x - 26} y={y - 16} width="52" height="32" rx="6" fill="#0C0C0E" fillOpacity="0.7" stroke="#9B8CFF" strokeOpacity="0.4" />
              <rect x={x - 18} y={y - 8} width="24" height="4" rx="2" fill="#9B8CFF" fillOpacity="0.7" />
              <rect x={x - 18} y={y + 1} width="34" height="4" rx="2" fill="#F3F1EC" fillOpacity="0.3" />
            </g>
          ))}
        </svg>
      );
    case 'grid':
      return (
        <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <line key={`h${i}`} x1="0" y1={i * 43} x2="400" y2={i * 43} stroke="#3FA66A" strokeOpacity="0.08" />
          ))}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <line key={`v${i}`} x1={i * 44.5} y1="0" x2={i * 44.5} y2="300" stroke="#3FA66A" strokeOpacity="0.06" />
          ))}
          {(
            [
              [30, 34, 120, 80, '#3FA66A', 0.85],
              [166, 34, 90, 80, '#F3F1EC', 0.1],
              [272, 34, 98, 80, '#6E8CFF', 0.7],
              [30, 130, 80, 120, '#F3F1EC', 0.14],
              [126, 130, 130, 120, '#FF4D1C', 0.8],
              [272, 130, 98, 120, '#F3F1EC', 0.1],
            ] as [number, number, number, number, string, number][]
          ).map(([x, y, w, h, c, o], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx="8" fill={c} fillOpacity={o} />
          ))}
          <rect x="30" y="34" width="340" height="216" rx="8" fill="none" stroke="#3FA66A" strokeOpacity="0.35" strokeDasharray="4 6" />
        </svg>
      );
  }
}



/* ============================== COMPONENT ============================== */

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<'all' | Category>('all');
  const [selected, setSelected] = useState<Project | null>(null);
  const animatingRef = useRef(false);
  const staticMode = isLighthouse || prefersReducedMotion;

  const visible = PROJECTS.filter((p) => filter === 'all' || p.category === filter);

  /* ---------- Scroll entrance: center-out clip expansion (batch) ---------- */
  useIsoLayoutEffect(() => {
    if (staticMode) return;
    const ctx = gsap.context(() => {
      gsap.set('.work-card', { autoAlpha: 0, y: 56, clipPath: 'inset(18% 8% 18% 8% round 20px)' });
      ScrollTrigger.batch('.work-card', {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            clipPath: 'inset(0% 0% 0% 0% round 20px)',
            duration: 1.1,
            ease: 'expo.out',
            stagger: 0.12,
          }),
      });
      gsap.set('.work-head > *', { autoAlpha: 0, y: 28 });
      ScrollTrigger.batch('.work-head > *', {
        start: 'top 90%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.08 }),
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [staticMode]);

  /* ---------- Category wipe on filter change ---------- */
  const applyFilter = useCallback(
    (next: 'all' | Category) => {
      if (next === filter || animatingRef.current) return;

      if (staticMode) {
        setFilter(next);
        return;
      }

      animatingRef.current = true;
      const cards = gridRef.current?.querySelectorAll('.work-card');
      if (!cards || cards.length === 0) {
        setFilter(next);
        animatingRef.current = false;
        return;
      }

      gsap.to(cards, {
        clipPath: 'inset(0% 0% 100% 0% round 20px)',
        y: -28,
        autoAlpha: 0,
        duration: 0.4,
        ease: 'power3.in',
        stagger: 0.045,
        onComplete: () => {
          setFilter(next);
          requestAnimationFrame(() => {
            const fresh = gridRef.current?.querySelectorAll('.work-card');
            if (fresh && fresh.length) {
              gsap.fromTo(
                fresh,
                { clipPath: 'inset(100% 0% 0% 0% round 20px)', y: 28, autoAlpha: 0 },
                {
                  clipPath: 'inset(0% 0% 0% 0% round 20px)',
                  y: 0,
                  autoAlpha: 1,
                  duration: 0.7,
                  ease: 'expo.out',
                  stagger: 0.07,
                  onComplete: () => {
                    animatingRef.current = false;
                    ScrollTrigger.refresh();
                  },
                }
              );
            } else {
              animatingRef.current = false;
            }
          });
        },
      });
    },
    [filter, staticMode]
  );

  /* ---------- Modal scroll lock (Lenis + fallback) ---------- */
  useEffect(() => {
    if (!selected) return;
    const lenis = getLenis();
    const hadLenis = !!lenis;
    if (lenis) {
      lenis.stop?.();
    } else {
      document.documentElement.style.overflow = 'hidden';
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      if (hadLenis) {
        getLenis()?.start?.();
      } else {
        document.documentElement.style.overflow = '';
      }
      window.removeEventListener('keydown', onKey);
    };
  }, [selected]);

  return (
    <>
    <section
      ref={sectionRef}
      id="work"
      data-accent="glacier"
      className="section section--paper px-[clamp(1.5rem,5vw,4rem)] py-[clamp(5rem,12vh,9rem)]"
      style={{ zIndex: 5 }}
    >
      {/* Header */}
      <div className="work-head mx-auto mb-[clamp(2.5rem,6vh,4.5rem)] flex max-w-[1600px] flex-wrap items-end justify-between gap-8">
        <div>
          <p className="eyebrow">
            <span className="tick">{'// 02 — '}</span>Selected Work
          </p>
          <h2 className="display mt-4 text-[clamp(2.2rem,5.5vw,4.8rem)]">
            Work that <span className="serif-accent accent-tint">ships.</span>
          </h2>
        </div>
        <span className="font-mono text-[0.66rem] uppercase tracking-[0.24em]" style={{ color: 'var(--muted)' }}>
          {String(visible.length).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')} projects
        </span>
      </div>

      {/* Filters */}
      <div className="work-head mx-auto mb-10 flex max-w-[1600px] flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => applyFilter(f.key)}
              className="rounded-full px-5 py-2.5 font-mono text-[0.64rem] uppercase tracking-[0.2em] transition-all duration-300"
              style={{
                border: `1px solid ${active ? 'var(--accent)' : 'var(--hair)'}`,
                background: active ? 'var(--accent)' : 'transparent',
                color: active ? '#0C0C0E' : 'var(--muted)',
              }}
              data-cursor="link"
              aria-pressed={active}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div ref={gridRef} className="mx-auto grid max-w-[1600px] grid-cols-12 gap-x-6 gap-y-14">
        {visible.map((p, idx) => (
          <article
            key={p.id}
            className={`work-card group col-span-12 ${
              idx % 2 === 0 ? 'md:col-span-7' : 'md:col-span-5'
            } will-change-transform`}
            style={{ clipPath: 'inset(0% 0% 0% 0% round 20px)' }}
          >
            <button
              className="block w-full text-left"
              onClick={() => setSelected(p)}
              data-cursor="view"
              aria-label={`Open case study: ${p.title}`}
            >
              {/* Media — shared element with the modal */}
              <m.div
                layoutId={`media-${p.id}`}
                className="relative overflow-hidden rounded-[20px]"
                style={{ background: p.artBg, aspectRatio: '16/10.5' }}
              >
                <div className="absolute inset-0 transition-transform duration-700 ease-expo-out group-hover:scale-[1.045]">
                  <ProjectArt kind={p.art} />
                </div>
                <span
                  className="absolute left-4 top-4 rounded-full px-3 py-1.5 font-mono text-[0.56rem] uppercase tracking-[0.22em]"
                  style={{ background: 'rgba(12,12,14,0.72)', color: '#F3F1EC', backdropFilter: 'blur(8px)' }}
                >
                  {p.categoryLabel}
                </span>
                <span
                  className="absolute right-4 top-4 font-mono text-[0.6rem] tracking-[0.2em]"
                  style={{ color: 'rgba(243,241,236,0.55)' }}
                >
                  {p.year}
                </span>
              </m.div>

              {/* Meta */}
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="display text-[clamp(1.3rem,2.2vw,1.9rem)]">{p.title}</h3>
                  <p className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.2em]" style={{ color: 'var(--muted)' }}>
                    {p.tags.join(' · ')}
                  </p>
                </div>
                <span
                  className="mt-1 inline-block text-xl transition-transform duration-500 ease-expo-out group-hover:-translate-y-1 group-hover:translate-x-1"
                  style={{ color: 'var(--accent)' }}
                  aria-hidden="true"
                >
                  ↗
                </span>
              </div>
            </button>
          </article>
        ))}
      </div>

    </section>

      {/* ==================== FLIP CASE-STUDY MODAL ==================== */}
      <AnimatePresence>
        {selected && (
          <m.div
            key="work-modal"
            className="fixed inset-0 z-[200] flex items-center justify-center p-[clamp(1rem,4vw,3rem)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${selected.title} case study`}
          >
            {/* Overlay */}
            <button
              className="absolute inset-0"
              style={{ background: 'rgba(12,12,14,0.9)', backdropFilter: 'blur(14px)' }}
              onClick={() => setSelected(null)}
              aria-label="Close case study"
            />

            <m.div
              className="relative z-10 grid max-h-[88vh] w-full max-w-5xl grid-cols-1 overflow-y-auto rounded-[24px] border border-white/10 bg-[#131316] md:grid-cols-2"
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              exit={{ y: 40 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              data-lenis-prevent
            >
              {/* Shared media element */}
              <m.div
                layoutId={`media-${selected.id}`}
                className="relative min-h-[280px] md:min-h-full"
                style={{ background: selected.artBg }}
              >
                <ProjectArt kind={selected.art} />
              </m.div>

              {/* Details */}
              <div className="flex flex-col gap-6 p-[clamp(1.5rem,3vw,2.5rem)]">
                <div>
                  <p className="eyebrow">
                    <span className="tick">{'// '}</span>
                    {selected.categoryLabel} — {selected.year}
                  </p>
                  <h3 className="display mt-3 text-[clamp(1.6rem,3vw,2.4rem)] text-[#F3F1EC]">
                    {selected.title}
                  </h3>
                </div>

                <p className="text-[0.92rem] leading-relaxed" style={{ color: 'rgba(243,241,236,0.6)' }}>
                  {selected.blurb}
                </p>

                <div className="hair-x" />

                <div>
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.24em]" style={{ color: 'rgba(243,241,236,0.45)' }}>
                    Role
                  </p>
                  <p className="mt-2 font-mono text-[0.72rem] tracking-[0.08em] text-[#F3F1EC]">{selected.role}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selected.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/12 px-3.5 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[#F3F1EC]/75"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {selected.metrics.map(([v, l]) => (
                    <div key={l} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3">
                      <div className="display text-lg" style={{ color: 'var(--accent)' }}>{v}</div>
                      <div className="mt-1 font-mono text-[0.52rem] uppercase tracking-[0.16em] text-[#F3F1EC]/45">
                        {l}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto flex items-center justify-between gap-4 pt-2">
                  {selected.link ? (
                    <a
                      href={safeExternalUrl(selected.link)}
                      target="_blank"
                      rel="noreferrer"
                      className="accent-bg rounded-full px-6 py-3.5 font-mono text-[0.64rem] font-medium uppercase tracking-[0.2em] text-[#0C0C0E]"
                      data-cursor="link"
                    >
                      Visit live site ↗
                    </a>
                  ) : (
                    <span className="rounded-full border border-white/15 px-6 py-3.5 font-mono text-[0.64rem] uppercase tracking-[0.2em] text-[#F3F1EC]/60">
                      Case study on request
                    </span>
                  )}
                  <button
                    onClick={() => setSelected(null)}
                    className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-[#F3F1EC]/70 underline-offset-4 hover:underline"
                    data-cursor="link"
                  >
                    Close ✕
                  </button>
                </div>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}

