import { useEffect, useRef } from 'react';

// Shared IntersectionObserver instance — created once per page, reused for all reveals.
// This avoids spawning multiple observers which each have their own callback overhead.
let sharedObserver: IntersectionObserver | null = null;

function getSharedObserver(): IntersectionObserver {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            sharedObserver!.unobserve(entry.target);
          }
        }
      },
      {
        // Trigger slightly before element fully enters viewport for snappier feel
        rootMargin: '0px 0px -30px 0px',
        threshold: 0.06,
      }
    );
  }
  return sharedObserver;
}

/**
 * Firefox fallback for CSS scroll-driven scroll progress bar.
 * animation-timeline: scroll() is supported Chrome 115+, Safari 18+, Firefox 110+.
 * For older Firefox we drive scaleX via a rAF scroll listener instead.
 */
function initScrollProgressFallback() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  // Check if CSS scroll-driven animations are supported
  const supportsScrollTimeline =
    typeof CSS !== 'undefined' &&
    CSS.supports != null &&
    CSS.supports('animation-timeline', 'scroll()');

  if (supportsScrollTimeline) return; // CSS handles it natively

  // Fallback: scaleX calculation for Firefox < 110 and older Safari
  const update = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
    bar.style.transform = `scaleX(${progress})`;
    // Override CSS animation that won't work in this browser
    bar.style.animation = 'none';
  };

  // Only run when user is scrolling to avoid battery drain
  let scrolling = false;
  let rafId: number;
  const onScroll = () => {
    if (!scrolling) {
      scrolling = true;
      rafId = requestAnimationFrame(() => {
        update();
        scrolling = false;
      });
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  update(); // initial paint

  return () => {
    window.removeEventListener('scroll', onScroll);
    if (rafId) cancelAnimationFrame(rafId);
  };
}

/**
 * Attach this ref to any element with className="reveal" to get a
 * GPU-composited CSS scroll reveal with zero Framer Motion overhead.
 */
export function useScrollReveal<T extends Element = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof window === 'undefined') return;

    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-visible');
      return;
    }

    try {
      const observer = getSharedObserver();
      observer.observe(el);
      return () => observer.unobserve(el);
    } catch {
      el.classList.add('is-visible');
    }
  }, []);

  return ref;
}

/**
 * Fallback scroll listener driving CSS variables for older Safari/iOS.
 */
function initFallbackScrollVars() {
  const supportsSDA =
    typeof CSS !== 'undefined' &&
    CSS.supports != null &&
    CSS.supports('animation-timeline', 'scroll()');

  if (supportsSDA) return;

  let rafId: number;
  let scrolling = false;
  let docHeight = 0;
  let winHeight = 0;

  const cacheDimensions = () => {
    if (typeof document === 'undefined') return;
    docHeight = document.documentElement.scrollHeight;
    winHeight = window.innerHeight;
  };

  const update = () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = docHeight - winHeight;
    const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

    document.documentElement.style.setProperty('--scroll-y-raw', `${scrollY}`);
    document.documentElement.style.setProperty('--scroll-y', `${scrollY}px`);
    document.documentElement.style.setProperty('--scroll-progress', `${progress}`);

    scrolling = false;
  };

  const onScroll = () => {
    if (!scrolling) {
      scrolling = true;
      rafId = requestAnimationFrame(update);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', cacheDimensions, { passive: true });

  cacheDimensions();
  update();

  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', cacheDimensions);
    cancelAnimationFrame(rafId);
  };
}

/**
 * App-level scroll reveal init — call once in ClientApp.
 * Sets up Firefox scroll progress fallback and older browser scroll vars.
 */
export function initScrollReveal() {
  const cleanupProgress = initScrollProgressFallback();
  const cleanupVars = initFallbackScrollVars();

  return () => {
    if (cleanupProgress) cleanupProgress();
    if (cleanupVars) cleanupVars();
  };
}
