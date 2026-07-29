import ClientApp from './ClientApp';

/**
 * SSG hero hint: this h1 is in the initial HTML response — the browser paints
 * it immediately (~200ms), making it the LCP element. ClientApp hides this
 * div once React mounts the real animated hero. Mirrors Hero.tsx copy.
 */
export default async function Page() {
  return (
    <>
      <div
        id="ssr-hero-hint"
        style={{
          position: 'fixed',
          inset: 0,
          padding: 'clamp(5.5rem, 14vh, 9rem) clamp(1.5rem, 5vw, 4rem) 0',
          pointerEvents: 'none',
          zIndex: 1,
          background: '#0C0C0E',
          overflow: 'hidden',
          fontFamily: "'Clash Display', system-ui, -apple-system, sans-serif",
        }}
      >
        <p
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: '0.6875rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(243,241,236,0.55)',
            margin: '0 0 2rem',
          }}
        >
          {'// Naveen — Creative Developer · Folio 2026'}
        </p>
        <h1
          style={{
            fontSize: 'clamp(2.75rem, 9vw, 8.5rem)',
            fontWeight: 600,
            lineHeight: 0.98,
            letterSpacing: '-0.03em',
            color: '#F3F1EC',
            margin: 0,
            textTransform: 'uppercase',
          }}
        >
          {'Immersive web'}
          <br />
          <span
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: 'italic',
              fontWeight: 400,
              textTransform: 'none',
              color: '#FF4D1C',
            }}
          >
            {'experiences'}
          </span>
          <br />
          {'built to convert'}
        </h1>
      </div>

      {/* Full React SPA shell — mounts and hides the SSR hint above */}
      <ClientApp />
    </>
  );
}
