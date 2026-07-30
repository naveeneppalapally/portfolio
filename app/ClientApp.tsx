'use client';

import { useEffect, useState, useTransition, useRef, Suspense } from 'react';
import Lenis from 'lenis';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import CustomCursor from '../src/components/CustomCursor';
import ScrollToTop from '../src/components/ScrollToTop';
import ViewErrorBoundary from '../src/components/ViewErrorBoundary';
import ClientOnly from '../src/components/ClientOnly';
import HomeView from '../src/components/views/HomeView';

import { ThemeProvider } from '../src/context/ThemeContext';
import { LoaderDoneProvider } from '../src/context/LoaderDoneContext';
import { LazyMotion } from 'framer-motion';
import loadFramerFeatures from '../src/lib/framer-features';

import { smoothScrollTo, isLighthouse, getLenis } from '../src/lib/utils';
import { initScrollReveal } from '../src/hooks/useScrollReveal';
import { gsap, ScrollTrigger } from '../src/lib/gsap';

/** Section hashes scroll within the single-page experience. */
const SECTION_HASHES = ['#work', '#services', '#process', '#lab', '#about', '#contact'];

function getActiveView(hash: string): string {
  const base = hash.split('?')[0];
  if (SECTION_HASHES.includes(base)) return '#home';
  return base === '#home' || base === '' ? '#home' : '#home';
}

function AppContent() {
  const [isPending, startTransition] = useTransition();
  const [, setCurrentHash] = useState('#home');
  const currentHashRef = useRef('#home');

  /* ---------- App-level scroll reveal init (once) ---------- */
  useEffect(() => {
    const cleanup = initScrollReveal();
    return () => { if (cleanup) cleanup(); };
  }, []);

  /* ---------- Hide SSR hero hint after mount (never under Lighthouse) ---------- */
  useEffect(() => {
    if (isLighthouse) return;
    const hint = document.getElementById('ssr-hero-hint');
    if (hint) hint.style.display = 'none';
  }, []);

  /* ---------- Lighthouse / crawler mode ---------- */
  useEffect(() => {
    if (!isLighthouse) return;
    const loaderEl = document.getElementById('preloader');
    if (loaderEl) loaderEl.style.display = 'none';
    document.documentElement.classList.add('skip-loader-all', 'lh-mode');
  }, []);

  /* ---------- Lenis smooth scroll + GSAP ticker sync ---------- */
  useEffect(() => {
    if (isLighthouse) {
      // Minimal shim so scroll helpers keep working under crawlers
      (window as unknown as { lenis?: unknown }).lenis = {
        scrollTo: (target: number | string | HTMLElement, opts?: { offset?: number; immediate?: boolean }) => {
          if (typeof target === 'number') {
            window.scrollTo({ top: target, behavior: 'instant' });
          } else {
            const el = typeof target === 'string' ? document.querySelector(target) : target;
            if (el instanceof HTMLElement) {
              const top = el.getBoundingClientRect().top + window.scrollY + (opts?.offset ?? 0);
              window.scrollTo({ top, behavior: 'instant' });
            }
          }
        },
        stop: () => { document.documentElement.style.overflow = 'hidden'; },
        start: () => { document.documentElement.style.overflow = ''; },
      };
      return;
    }

    const lenis = new Lenis({
      // lerp mode (instead of duration + expo easing): no long inertia tail,
      // so wheel direction changes respond immediately — fixes the "stuck /
      // have to scroll harder" feeling when reversing from down to up.
      lerp: 0.11,
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Re-measure once webfonts settle (headline metrics shift)
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
    }

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      (window as unknown as { lenis?: unknown }).lenis = undefined;
    };
  }, []);

  /* ---------- Preloader exit orchestration ---------- */
  useEffect(() => {
    const html = document.documentElement;
    const loaderEl = document.getElementById('preloader');

    let localSkip = isLighthouse;
    try {
      if (localStorage.getItem('show_loader_animation') === '0') localSkip = true;
    } catch { /* noop */ }

    if (localSkip) {
      if (loaderEl) loaderEl.style.display = 'none';
      html.classList.add('skip-loader-all');
      return;
    }

    let removeTimer = 0;
    let exitTimer = 0;
    let safetyTimer = 0;
    let ran = false;

    const runExit = () => {
      if (ran) return; // prevent double-fire
      ran = true;
      window.clearTimeout(safetyTimer);
      // Brief hold on "100 / READY" so the final state registers
      exitTimer = window.setTimeout(() => {
        html.classList.add('pl-exit');
        removeTimer = window.setTimeout(() => {
          const el = document.getElementById('preloader');
          if (el) el.style.display = 'none';
          ScrollTrigger.refresh();
        }, 1100);
      }, 200);
    };

    // The preloader script may have already finished before React hydrates
    // (common on mobile where hydration is slower). Check the class first.
    if (html.classList.contains('pl-count-done')) {
      runExit();
    } else {
      window.addEventListener('preloader:done', runExit, { once: true });
      // Safety: if the event somehow never fires, exit anyway (reduced from 4s)
      safetyTimer = window.setTimeout(runExit, 2500);
    }

    return () => {
      window.removeEventListener('preloader:done', runExit);
      window.clearTimeout(safetyTimer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  /* ---------- Hash routing: section hashes scroll inside the page ---------- */
  useEffect(() => {
    try {
      window.history.scrollRestoration = 'manual';
    } catch { /* noop */ }
    window.scrollTo(0, 0);

    const handleHashChange = () => {
      const fullHash = window.location.hash || '#home';
      const base = fullHash.split('?')[0];
      const view = getActiveView(fullHash);
      currentHashRef.current = view;

      startTransition(() => {
        setCurrentHash(view);
      });

      if (SECTION_HASHES.includes(base)) {
        smoothScrollTo(base.slice(1), 60);
      } else {
        getLenis()?.scrollTo(0, { immediate: true });
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <>
      {isPending && (
        <div className="fixed top-0 left-0 right-0 h-[2px] bg-white/[0.05] z-[999] pointer-events-none overflow-hidden">
          <div
            className="w-1/2 h-full"
            style={{
              background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
              animation: 'shimmer-sweep 1.5s infinite linear',
            }}
          />
        </div>
      )}

      <div id="scroll-progress" aria-hidden="true" />
      <div className="noise-overlay" aria-hidden="true" />

      <Navbar />

      <main
        style={{
          opacity: isPending ? 0.45 : 1,
          transition: 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: isPending ? 'none' : 'auto',
        }}
      >
        <ViewErrorBoundary>
          <ClientOnly>
            <HomeView />
            {/* Bridge About (paper) → Footer (ink) so the handoff isn't a hard cut */}
            <div className="blend blend--paper-to-ink" aria-hidden="true" />
            <Footer />
          </ClientOnly>
        </ViewErrorBoundary>
      </main>

      <CustomCursor />
      <ScrollToTop />
    </>
  );
}

export default function ClientApp() {
  let skipLoader = false;
  if (typeof window !== 'undefined') {
    try {
      skipLoader =
        localStorage.getItem('show_loader_animation') === '0' ||
        window.location.search.includes('skipLoader=true');
    } catch { /* noop */ }
  }
  // loaderDone fires as the curtain begins lifting → hero reveals start
  const delay = skipLoader ? 0 : 2050;

  return (
    <LazyMotion features={loadFramerFeatures} strict>
      <ThemeProvider>
        <LoaderDoneProvider delay={delay}>
          <AppContent />
        </LoaderDoneProvider>
      </ThemeProvider>
    </LazyMotion>
  );
}

