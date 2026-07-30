'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { checkIsLowEndOrReducedMotion } from '../lib/utils';

/* ============================================
   CUSTOM CURSOR — accent dot + trailing ring
   data-cursor="view"  → big accent disc w/ label
   data-cursor="link"  → ring expands
   Desktop (hover-capable) only.

   Uses GSAP quickTo for buttery-smooth interpolation
   instead of raw mousemove — zero jitter, 60fps.
   ============================================ */

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const enabledRef = useRef(false);

  useEffect(() => {
    const isTouch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(hover: none)').matches;
    const shouldEnable = !isTouch && !checkIsLowEndOrReducedMotion();

    if (!shouldEnable) return;
    enabledRef.current = true;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring) return;

    // Show cursor elements
    dot.style.display = '';
    ring.style.display = '';

    // Hide the native cursor
    const style = document.createElement('style');
    style.id = 'custom-cursor-style';
    style.textContent = `*, *:hover, *::before, *::after { cursor: none !important; }`;
    document.head.appendChild(style);

    // GSAP quickTo — spring-damped followers, buttery smooth
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.15, ease: 'power2.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.15, ease: 'power2.out' });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });

    let currentVariant = 'default';

    const onMove = (e: MouseEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);

      // Show on first move
      dot.style.opacity = '1';
      ring.style.opacity = '1';

      // Detect variant from data-cursor attribute (no React setState = no re-renders)
      const target = (e.target as HTMLElement).closest?.('[data-cursor]') as HTMLElement | null;
      const next = target?.dataset.cursor || 'default';

      if (next !== currentVariant) {
        currentVariant = next;
        const isView = next === 'view';
        const isLink = next === 'link';

        // Dot hides during view mode
        dot.style.opacity = isView ? '0' : '1';

        // Ring size transitions
        const size = isView ? 84 : isLink ? 56 : 38;
        ring.style.width = `${size}px`;
        ring.style.height = `${size}px`;
        ring.style.border = isView ? 'none' : '1px solid var(--accent)';
        ring.style.background = isView ? 'var(--accent)' : 'transparent';

        if (label) {
          label.style.opacity = isView ? '1' : '0';
        }
      }
    };

    const onLeave = () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    const onEnter = () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
      document.getElementById('custom-cursor-style')?.remove();
    };
  }, []);

  return (
    <>
      {/* Dot — snappy follow */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full"
        style={{
          display: 'none',
          width: 8,
          height: 8,
          background: 'var(--accent)',
          opacity: 0,
          transform: 'translate(-50%, -50%)',
          transition: 'opacity 0.2s ease, background 0.6s ease',
          willChange: 'transform',
        }}
      />
      {/* Ring — smooth trailing follow */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9998] flex items-center justify-center rounded-full"
        style={{
          display: 'none',
          width: 38,
          height: 38,
          border: '1px solid var(--accent)',
          background: 'transparent',
          opacity: 0,
          transform: 'translate(-50%, -50%)',
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
            opacity: 0,
            transition: 'opacity 0.25s ease',
          }}
        >
          View
        </span>
      </div>
    </>
  );
}
