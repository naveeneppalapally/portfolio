'use client';

/**
 * MARQUEE — generic CSS-driven ticker (GPU transform, pauses on hover).
 * Content duplicated 2× for a seamless -50% loop.
 */
export default function Marquee({
  items,
  reverse = false,
  className = '',
  itemClassName = '',
}: {
  items: string[];
  reverse?: boolean;
  className?: string;
  itemClassName?: string;
}) {
  const loop = [...items, ...items];

  return (
    <div
      className={`group relative w-full overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div
        className={`flex w-max will-change-transform ${
          reverse ? 'animate-marquee-reverse' : 'animate-marquee'
        } group-hover:[animation-play-state:paused]`}
      >
        {loop.map((item, i) => (
          <div key={i} className="flex shrink-0 items-center">
            <span
              className={`whitespace-nowrap px-6 font-mono text-[0.7rem] uppercase tracking-[0.3em] ${itemClassName}`}
              style={{ color: 'var(--muted)' }}
            >
              {item}
            </span>
            <span className="accent-tint text-[0.55rem]">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
