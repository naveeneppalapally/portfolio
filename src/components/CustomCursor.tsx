'use client';

import { useEffect, useRef, useState } from 'react';
import { checkIsLowEndOrReducedMotion } from '../lib/utils';

/* ============================================
   CUSTOM CURSOR — accent dot + hairline ring
   data-cursor="view"  → big accent disc w/ label
   data-cursor="link"  → ring expands
   Desktop (hover-capable) only.
   ============================================ */

type CursorVariant = 'default' | 'link' | 'view';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  const [variant, setVariant] = useState<CursorVariant>('default');
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isTouch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(hover: none)').matches;
    const shouldEnable = !isTouch && !checkIsLowEndOrReducedMotion();

    const timer = setTimeout(() => setEnabled(shouldEnable), 0);
    if (!shouldEnable) return () => clearTimeout(timer);

    const style = document.createElement('style');
    style.id = 'custom-cursor-style';
    style.textContent = `*, *:hover, *::before, *::after { cursor: none !important; }`;
    document.head.appendChild(style);

    const mouse = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      setVisible(true);

      const dot = dotRef.current;
      if (dot) dot.style.transform = `translate(${mouse.x}px, ${mouse.y}px) translate(-50%,-50%)`;

      const target = (e.target as HTMLElement).closest?.('[data-cursor]') as HTMLElement | null;
      const next = (target?.dataset.cursor as CursorVariant) || 'default';
      setVariant((prev) => (prev === next ? prev : next));
    };

    const loop = () => {
      ring.x += (mouse.x - ring.x) * 0.16;
      ring.y += (mouse.y - ring.y) * 0.16;
      const el = ringRef.current;
      if (el) el.style.transform = `translate(${ring.x}px, ${ring.y}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    document.addEventListener('mousemove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
      document.getElementById('custom-cursor-style')?.remove();
    };
  }, []);

  if (!enabled) return null;

  const isView = variant === 'view';

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full"
        style={{
          width: 8,
          height: 8,
          background: 'var(--accent)',
          opacity: visible && !isView ? 1 : 0,
          transition: 'opacity 0.2s ease, background 0.6s ease',
          willChange: 'transform',
        }}
      />
      {/* Ring / view disc */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9998] flex items-center justify-center rounded-full"
        style={{
          width: isView ? 84 : variant === 'link' ? 56 : 38,
          height: isView ? 84 : variant === 'link' ? 56 : 38,
          border: isView ? 'none' : '1px solid var(--accent)',
          background: isView ? 'var(--accent)' : 'transparent',
          opacity: visible ? 1 : 0,
          transition:
            'width 0.35s cubic-bezier(0.16,1,0.3,1), height 0.35s cubic-bezier(0.16,1,0.3,1), background 0.3s ease, border-color 0.6s ease, opacity 0.2s ease',
          willChange: 'transform',
        }}
      >
        <span
          ref={labelRef}
          className="font-mono text-[0.6rem] font-medium uppercase tracking-[0.2em]"
          style={{
            color: 'var(--ink)',
            opacity: isView ? 1 : 0,
            transition: 'opacity 0.25s ease',
          }}
        >
          View
        </span>
      </div>
    </>
  );
}
