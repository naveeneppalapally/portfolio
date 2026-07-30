'use client';

import { useEffect, useRef } from 'react';
import { isLighthouse, prefersReducedMotion } from '../lib/utils';

/**
 * MeshGradient — 60fps Canvas 2D flowing silk field.
 *
 * Replaces SunParticles. Blobs are drawn at 1/8 resolution with 'lighter'
 * compositing, then the canvas is CSS-scaled and blurred — the GPU does the
 * heavy work, so the rAF loop only paints a 240×135 image per frame.
 *
 * Pauses off-screen. Static single frame under Lighthouse / reduced-motion.
 */

interface Blob {
  hue: [number, number, number]; // rgb
  alpha: number;
  radius: number; // fraction of min(w,h)
  // layered sine field params
  ax: number; bx: number; cx: number;
  ay: number; by: number; cy: number;
  sx: number; sy: number; // speeds
  px: number; py: number; // phases
}

const BLOBS: Blob[] = [
  // signal
  { hue: [255, 77, 28], alpha: 0.5, radius: 0.55, ax: 0.32, bx: 0.18, cx: 0.5, ay: 0.24, by: 0.16, cy: 0.52, sx: 0.9, sy: 0.7, px: 0.0, py: 1.3 },
  // violet
  { hue: [155, 140, 255], alpha: 0.42, radius: 0.5, ax: 0.3, bx: 0.22, cx: 0.48, ay: 0.3, by: 0.14, cy: 0.5, sx: 0.6, sy: 0.85, px: 2.1, py: 4.0 },
  // glacier
  { hue: [110, 140, 255], alpha: 0.38, radius: 0.46, ax: 0.36, bx: 0.12, cx: 0.52, ay: 0.26, by: 0.2, cy: 0.46, sx: 0.75, sy: 0.55, px: 4.4, py: 2.2 },
  // deep ember (dim warm) — cx pushed right to fill the dark right edge on mobile
  { hue: [255, 122, 60], alpha: 0.22, radius: 0.62, ax: 0.26, bx: 0.2, cx: 0.68, ay: 0.3, by: 0.12, cy: 0.55, sx: 0.5, sy: 0.62, px: 5.6, py: 0.4 },
  // indigo depth
  { hue: [80, 92, 220], alpha: 0.26, radius: 0.58, ax: 0.3, bx: 0.16, cx: 0.5, ay: 0.22, by: 0.18, cy: 0.5, sx: 0.55, sy: 0.8, px: 1.0, py: 5.1 },
];

export default function MeshGradient({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const SCALE = 0.125; // render at 1/8 res — blur hides it anyway
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let start = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(2, Math.round(rect.width * SCALE));
      h = Math.max(2, Math.round(rect.height * SCALE));
      canvas.width = w;
      canvas.height = h;
    };

    const paint = (t: number) => {
      const time = (t - start) / 1000;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';

      for (const b of BLOBS) {
        const x =
          (b.cx + Math.sin(time * b.sx * 0.31 + b.px) * b.ax * 0.5 + Math.cos(time * b.sx * 0.17 + b.px * 2.1) * b.bx * 0.5) * w;
        const y =
          (b.cy + Math.cos(time * b.sy * 0.27 + b.py) * b.ay * 0.5 + Math.sin(time * b.sy * 0.13 + b.py * 1.7) * b.by * 0.5) * h;
        const r = Math.max(4, b.radius * Math.min(w, h) * (1 + Math.sin(time * 0.23 + b.px) * 0.12));

        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `rgba(${b.hue[0]},${b.hue[1]},${b.hue[2]},${b.alpha})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (t: number) => {
      paint(t);
      raf = requestAnimationFrame(loop);
    };

    const startLoop = () => {
      if (running) return;
      running = true;
      start = performance.now() - 1600; // pre-roll so first frame isn't uniform
      raf = requestAnimationFrame(loop);
    };
    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();

    if (isLighthouse || prefersReducedMotion) {
      paint(start + 1600); // one rich static frame
      window.addEventListener('resize', resize);
      return () => window.removeEventListener('resize', resize);
    }

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? startLoop() : stopLoop()),
      { threshold: 0 }
    );
    io.observe(canvas);

    const onVis = () => (document.hidden ? stopLoop() : startLoop());
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('resize', resize);

    return () => {
      stopLoop();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full ${className}`}
      style={{ filter: 'blur(70px) saturate(1.25)', transform: 'scale(1.15)' }}
    />
  );
}
