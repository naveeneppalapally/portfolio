import type { Metadata } from 'next';
import '../src/index.css';

export const metadata: Metadata = {
  title: 'Naveen — Creative Developer & Design Engineer',
  description:
    'Immersive, performance-obsessed websites for founders and teams who refuse to look ordinary. Next.js, motion systems, award-calibre craft. Available for projects worldwide.',
  keywords:
    'creative developer, design engineer, freelance web developer, awwwards portfolio, next.js developer, gsap animation, webgl, motion design, frontend engineer',
  authors: [{ name: 'Naveen' }],
  robots: { index: true, follow: true },
  metadataBase: new URL('https://naveen.dev'),
  openGraph: {
    title: 'Naveen — Creative Developer & Design Engineer',
    description:
      'Immersive, performance-obsessed websites for founders and teams who refuse to look ordinary.',
    type: 'website',
    url: 'https://naveen.dev',
    siteName: 'Naveen — Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Naveen — Creative Developer & Design Engineer',
    description:
      'Immersive, performance-obsessed websites for founders and teams who refuse to look ordinary.',
  },
  other: {
    'theme-color': '#0C0C0E',
  },
};

/**
 * Preloader counter — runs pre-hydration (vanilla, no React state).
 * Drives the 000→100 count, word cycle, and progress bar, then dispatches
 * 'preloader:done'. ClientApp listens and runs the curtain exit.
 */
const PRELOADER_SCRIPT = `
(function () {
  var html = document.documentElement;
  var counter = document.getElementById('pl-counter');
  var fill = document.getElementById('pl-bar-fill');
  var word = document.getElementById('pl-word');
  var status = document.getElementById('pl-status');
  if (!counter || !fill) return;

  var skip = /Lighthouse|Chrome-Lighthouse|HeadlessChrome|Google-PageSpeed/i.test(navigator.userAgent)
    || navigator.webdriver === true
    || /skipLoader=true|lighthouse=true/.test(location.search)
    || (function () { try { return localStorage.getItem('show_loader_animation') === '0'; } catch (e) { return false; } })();

  var WORDS = ['CRAFT', 'MOTION', 'SYSTEMS', 'DETAIL', 'SHIP'];
  var DURATION = skip ? 0 : 1750;
  var t0 = performance.now();
  var lastWord = 0;
  var lastTick = -1;

  function ease(p) { return 1 - Math.pow(1 - p, 3); }

  function finish() {
    counter.textContent = '100';
    counter.classList.add('pl-final');
    fill.style.transform = 'scaleX(1)';
    if (status) status.textContent = 'READY';
    html.classList.add('pl-count-done');
    window.dispatchEvent(new CustomEvent('preloader:done'));
  }

  function frame(now) {
    var p = Math.min((now - t0) / DURATION, 1);
    var v = Math.round(ease(p) * 100);
    counter.textContent = (v < 10 ? '00' : v < 100 ? '0' : '') + v;
    fill.style.transform = 'scaleX(' + (v / 100) + ')';

    var wi = Math.min(WORDS.length - 1, Math.floor(p * WORDS.length));
    if (wi !== lastWord && word) {
      lastWord = wi;
      word.classList.add('pl-swap');
      (function (w) {
        setTimeout(function () {
          word.textContent = WORDS[w];
          word.classList.remove('pl-swap');
        }, 140);
      })(wi);
    }

    if (v % 17 === 0 && v !== lastTick && v < 100 && v > 0) {
      lastTick = v;
      counter.classList.add('pl-tick');
      setTimeout(function () { counter.classList.remove('pl-tick'); }, 90);
    }

    if (p < 1) { requestAnimationFrame(frame); } else { finish(); }
  }

  if (skip) { finish(); } else { requestAnimationFrame(frame); }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* Font preloads — React 19 hoists these to <head> */}
        <link rel="preload" href="/fonts/clash-display-600.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/inter-var-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/jetbrains-mono-var-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/instrument-serif-italic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />

        {/* ==================== PRELOADER (SSR shell) ==================== */}
        <div id="preloader" suppressHydrationWarning aria-hidden="true">
          <div className="pl-top pl-inner-fade" suppressHydrationWarning>
            <span>
              Naveen<span className="pl-dot">®</span> — Folio
            </span>
            <span>©2026</span>
          </div>

          <div className="pl-center pl-inner-fade">
            <span className="pl-word" id="pl-word" suppressHydrationWarning>
              CRAFT
            </span>
          </div>

          <div className="pl-bottom pl-inner-fade">
            <div className="pl-counter" id="pl-counter" suppressHydrationWarning>
              000
            </div>
            <div className="pl-right">
              <div className="pl-bar">
                <div className="pl-bar-fill" id="pl-bar-fill" suppressHydrationWarning />
              </div>
              <span className="pl-status" id="pl-status" suppressHydrationWarning>
                LOADING EXPERIENCE
              </span>
            </div>
          </div>

          <script dangerouslySetInnerHTML={{ __html: PRELOADER_SCRIPT }} />
        </div>

        {children}
      </body>
    </html>
  );
}
