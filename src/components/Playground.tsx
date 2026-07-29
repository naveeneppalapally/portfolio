'use client';

import { useEffect, useRef } from 'react';
import { isLighthouse, prefersReducedMotion } from '../lib/utils';
import { useStaticMode } from '../hooks/useStaticMode';

/* ============================================
   PLAYGROUND — "The Lab" 3D ring carousel.
   CSS preserve-3d + pointer-drag with manual inertia.
   Every card names a system running live on this site.
   ============================================ */

const CARDS = [
  { id: 'mesh', num: 'EXP·A', title: 'Mesh Engine', glyph: '◉', note: 'Canvas 2D · 5-blob field', tint: '#FF4D1C' },
  { id: 'type', num: 'EXP·B', title: 'Kinetic Type', glyph: 'Aa', note: 'Clip-path word reveals', tint: '#F3F1EC' },
  { id: 'flip', num: 'EXP·C', title: 'FLIP Modals', glyph: '⧉', note: 'layoutId shared elements', tint: '#6E8CFF' },
  { id: 'magnet', num: 'EXP·D', title: 'Magnetic UI', glyph: '◎', note: 'Elastic pointer fields', tint: '#9B8CFF' },
  { id: 'scrub', num: 'EXP·E', title: 'Scrub System', glyph: '≣', note: 'Pin + scrub timelines', tint: '#3FA66A' },
  { id: 'theme', num: 'EXP·F', title: 'Theme Engine', glyph: '✦', note: 'Per-section accents', tint: '#FF4D1C' },
  { id: 'cursor', num: 'EXP·G', title: 'Cursor Physics', glyph: '↝', note: 'Lerped ring follow', tint: '#F3F1EC' },
  { id: 'lenis', num: 'EXP·H', title: 'Lenis Flow', glyph: '∿', note: 'GSAP-ticker synced', tint: '#6E8CFF' },
];

export default function Playground() {
  const ringRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const velRef = useRef(0);
  const dragRef = useRef<{ active: boolean; lastX: number }>({ active: false, lastX: 0 });
  const staticMode = useStaticMode(); // JSX branches only (hydration-safe)
  const noMotion = isLighthouse || prefersReducedMotion; // effect gates only

  useEffect(() => {
    if (noMotion) return;
    const ring = ringRef.current;
    if (!ring) return;

    const AUTO = 0.045;
    let raf = 0;

    const tick = () => {
      if (!dragRef.current.active) {
        velRef.current *= 0.955;
        if (Math.abs(velRef.current) < AUTO) {
          velRef.current += (AUTO - Math.abs(velRef.current)) * 0.02;
        }
      }
      angleRef.current += velRef.current;
      ring.style.transform = `translateZ(-430px) rotateY(${angleRef.current}deg)`;
      raf = requestAnimationFrame(tick);
    };
    velRef.current = AUTO;
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [noMotion]);

  useEffect(() => {
    if (noMotion) return;
    const ring = ringRef.current;
    const el = ring?.parentElement;
    if (!ring || !el) return;

    const down = (e: PointerEvent) => {
      dragRef.current = { active: true, lastX: e.clientX };
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragRef.current.active) return;
      const dx = e.clientX - dragRef.current.lastX;
      dragRef.current.lastX = e.clientX;
      velRef.current = dx * 0.22;
      angleRef.current += velRef.current;
    };
    const up = () => { dragRef.current.active = false; };

    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
    };
  }, [noMotion]);


  return (
    <section
      id="lab"
      style={{ zIndex: 2 }}
      data-accent="glacier"
      className="section overflow-hidden px-[clamp(1.5rem,5vw,4rem)] py-[clamp(5rem,12vh,9rem)]"
    >
      {/* Header */}
      <div className="mx-auto mb-[clamp(2rem,5vh,3.5rem)] flex max-w-[1600px] flex-wrap items-end justify-between gap-8">
        <div>
          <p className="eyebrow">
            <span className="tick">{'// 05 — '}</span>The Lab
          </p>
          <h2 className="display mt-4 text-[clamp(2.2rem,5.5vw,4.8rem)]">
            An engine, <span className="serif-accent accent-tint">not a template.</span>
          </h2>
        </div>
        <p className="max-w-xs text-[0.9rem] leading-relaxed" style={{ color: 'var(--muted)' }}>
          Every effect on this site is hand-built and running right now.
          {!staticMode && ' Drag the ring — it’s the same physics as everything else here.'}
        </p>
      </div>

      {staticMode ? (
        <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-4 lg:grid-cols-4">
          {CARDS.map((c) => (
            <div key={c.id} className="rounded-2xl border border-white/10 bg-[#131316] p-5">
              <span className="font-mono text-[0.56rem] tracking-[0.22em]" style={{ color: c.tint }}>{c.num}</span>
              <div className="display mt-6 text-4xl" style={{ color: c.tint }}>{c.glyph}</div>
              <h3 className="display mt-4 text-lg">{c.title}</h3>
              <p className="mt-1 font-mono text-[0.56rem] uppercase tracking-[0.16em]" style={{ color: 'var(--muted)' }}>{c.note}</p>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="relative mx-auto h-[68vh] max-h-[720px] min-h-[480px] w-full max-w-[1600px] touch-pan-y select-none"
          style={{ perspective: '1400px' }}
          data-cursor="link"
        >
          <div
            ref={ringRef}
            className="absolute inset-0 will-change-transform"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {CARDS.map((c, i) => (
              <article
                key={c.id}
                className="absolute left-1/2 top-1/2 -ml-[140px] -mt-[190px] h-[380px] w-[280px] overflow-hidden rounded-2xl border border-white/10 bg-[#131316]"
                style={{
                  transform: `rotateY(${i * 45}deg) translateZ(430px)`,
                  backfaceVisibility: 'hidden',
                }}
              >
                <div
                  className="flex h-[62%] items-center justify-center"
                  style={{
                    background: `radial-gradient(circle at 50% 40%, ${c.tint}26 0%, transparent 70%)`,
                    borderBottom: '1px solid rgba(243,241,236,0.08)',
                  }}
                >
                  <span
                    className="display select-none text-[5.5rem] font-semibold"
                    style={{ color: c.tint, lineHeight: 1 }}
                    aria-hidden="true"
                  >
                    {c.glyph}
                  </span>
                </div>
                <div className="flex h-[38%] flex-col justify-between p-5">
                  <div>
                    <span className="font-mono text-[0.56rem] tracking-[0.24em]" style={{ color: c.tint }}>
                      {c.num}
                    </span>
                    <h3 className="display mt-2 text-xl">{c.title}</h3>
                  </div>
                  <p className="font-mono text-[0.56rem] uppercase tracking-[0.16em]" style={{ color: 'var(--muted)' }}>
                    {c.note}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <span
            className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[0.62rem] uppercase tracking-[0.3em]"
            style={{ color: 'var(--muted)' }}
          >
            ← Drag →
          </span>
        </div>
      )}
    </section>
  );
}
