'use client';

import { useCountUp } from '../hooks/useCountUp';
import { useScrollReveal } from '../hooks/useScrollReveal';
import Marquee from './Marquee';

/* ============================================
   ABOUT — "The Maker". Generative portrait block,
   editorial statement, spring count-up stats,
   capabilities ticker. One pair of hands.
   ============================================ */

function Stat({ end, suffix = '', decimals = 0, label }: { end: number; suffix?: string; decimals?: number; label: string }) {
  const { ref, count } = useCountUp({ end, decimals, duration: 1800 });
  const display = decimals > 0 ? count.toFixed(decimals) : String(Math.round(count)).padStart(2, '0');
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="border-t pt-5" style={{ borderColor: 'var(--hair)' }}>
      <div className="display text-[clamp(2rem,3.6vw,3.2rem)]" style={{ color: 'var(--accent)' }}>
        {display}
        {suffix}
      </div>
      <div className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.22em]" style={{ color: 'var(--muted)' }}>
        {label}
      </div>
    </div>
  );
}

const CAPABILITIES = [
  'Next.js', 'React 19', 'TypeScript', 'GSAP', 'Framer Motion', 'Three.js',
  'Tailwind', 'Node', 'Cloudflare Edge', 'Technical SEO', 'Motion Systems', 'Canvas 2D',
];

export default function About() {
  const textRef = useScrollReveal<HTMLDivElement>();
  const portraitRef = useScrollReveal<HTMLDivElement>();
  const statsRef = useScrollReveal<HTMLDivElement>();

  return (
    <section
      id="about"
      style={{ zIndex: 1 }}
      data-accent="signal"
      className="section section--paper px-[clamp(1.5rem,5vw,4rem)] py-[clamp(5rem,12vh,9rem)] max-sm:pb-[3.5rem]"
    >
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div ref={textRef} className="reveal mb-[clamp(3rem,7vh,5rem)]">
          <p className="eyebrow">
            <span className="tick">{'// 06 — '}</span>The Maker
          </p>
        </div>

        <div className="grid grid-cols-12 gap-[clamp(2rem,4vw,4rem)]">
          {/* Portrait block */}
          <div ref={portraitRef} className="reveal-left col-span-12 lg:col-span-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#0C0C0E]">
              {/* Generative backdrop */}
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(circle at 70% 20%, rgba(255,77,28,0.35) 0%, transparent 55%), radial-gradient(circle at 20% 85%, rgba(110,140,255,0.3) 0%, transparent 60%)',
                }}
              />
              <span
                aria-hidden="true"
                className="serif-accent absolute -bottom-[12%] -right-[6%] select-none text-[22rem] leading-none"
                style={{ color: 'rgba(243,241,236,0.07)' }}
              >
                n
              </span>
              {/* Meta */}
              <div className="absolute left-5 top-5 font-mono text-[0.58rem] uppercase tracking-[0.24em] text-[#F3F1EC]/60">
                17.38°N · 78.48°E
              </div>
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                <span className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-[#F3F1EC]/60">
                  Hyderabad · IN
                </span>
                <span
                  className="flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[0.54rem] uppercase tracking-[0.2em]"
                  style={{ background: 'rgba(243,241,236,0.1)', backdropFilter: 'blur(8px)', color: '#F3F1EC' }}
                >
                  Open for Q3
                </span>
              </div>
            </div>
          </div>

          {/* Statement + stats */}
          <div className="col-span-12 flex flex-col justify-between lg:col-span-8">
            <div ref={statsRef} className="reveal-right">
              <h2 className="display text-[clamp(1.9rem,3.8vw,3.4rem)] leading-[1.05]">
                One developer. <span className="serif-accent accent-tint">Design brain,</span>
                <br />
                engineering hands.
              </h2>
              <div className="mt-8 grid max-w-2xl gap-6 md:grid-cols-2">
                <p className="text-[0.95rem] leading-relaxed" style={{ color: 'var(--muted)' }}>
                  I&apos;m Naveen — a developer who designs and a designer who
                  ships. I built my first production platform entirely with
                  AI-assisted workflows, then spent a year learning what the
                  tools can&apos;t do: the last 10% is taste, and it&apos;s manual.
                </p>
                <p className="text-[0.95rem] leading-relaxed" style={{ color: 'var(--muted)' }}>
                  That shows up in the numbers — sub-second LCP, 95+ Lighthouse,
                  motion that never drops a frame. I take on a small number of
                  projects and treat each one like a portfolio piece.
                  Because it is.
                </p>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
              <Stat end={2} label="Production builds" />
              <Stat end={98} label="Avg Lighthouse" />
              <Stat end={0.9} decimals={1} suffix="s" label="Avg LCP" />
              <Stat end={100} suffix="%" label="Solo-built" />
            </div>
          </div>
        </div>
      </div>

      {/* Capabilities ticker */}
      <div className="mt-[clamp(3rem,8vh,5rem)] border-t pt-8" style={{ borderColor: 'var(--hair)' }}>
        <Marquee items={CAPABILITIES} />
      </div>
    </section>
  );
}
