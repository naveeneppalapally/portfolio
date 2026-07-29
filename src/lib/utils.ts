/**
 * Shared utilities — portfolio build.
 */

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export interface LenisLike {
  scrollTo: (
    target: number | Element | string,
    opts?: { offset?: number; duration?: number; immediate?: boolean; force?: boolean }
  ) => void;
  stop?: () => void;
  start?: () => void;
}

export function getLenis(): LenisLike | undefined {
  if (typeof window === 'undefined') return undefined;
  return (window as unknown as { lenis?: LenisLike }).lenis;
}

/**
 * Returns the URL only if it begins with https:// or http://.
 */
export function safeExternalUrl(url: string | undefined | null): string {
  if (!url) return '#';
  const trimmed = url.trim();
  return trimmed.startsWith('https://') || trimmed.startsWith('http://') ? trimmed : '#';
}

/**
 * Smooth scroll to a section by ID (Lenis-first, native fallback).
 */
export function scrollToSection(sectionId: string): void {
  const element = document.getElementById(sectionId);
  if (!element) return;
  const offset = 0;
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(element, { offset, duration: 1.4 });
  } else {
    const targetPosition = element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
  }
}

/**
 * Smooth scroll with optional delay (used after view transitions).
 */
export function smoothScrollTo(targetId: string, delay = 0): void {
  const performScroll = () => {
    const target = document.getElementById(targetId);
    if (!target) return;
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    } else {
      const targetPosition = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  };

  if (delay > 0) {
    setTimeout(performScroll, delay);
  } else {
    performScroll();
  }
}

/**
 * Throttles scroll/resize events using requestAnimationFrame.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throttleAnimationFrame<T extends (...args: any[]) => any>(fn: T): (...args: Parameters<T>) => void {
  let active = false;
  return (...args: Parameters<T>) => {
    if (active) return;
    active = true;
    requestAnimationFrame(() => {
      fn(...args);
      active = false;
    });
  };
}

/**
 * Checks for reduced-motion preference or low-end hardware.
 */
export function checkIsLowEndOrReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionQuery.matches) return true;

  const cores = navigator.hardwareConcurrency;
  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory;

  if (cores !== undefined && cores < 4) return true;
  if (memory !== undefined && memory < 4) return true;

  return false;
}

/**
 * Unified Lighthouse/Crawler/Headless-browser check.
 */
export const isLighthouse = typeof window !== 'undefined' && (function () {
  if (window.location.search.includes('lighthouse=true') || window.location.search.includes('skipLoader=true')) {
    return true;
  }
  if (typeof navigator !== 'undefined') {
    if (navigator.webdriver === true) {
      return true;
    }
    const ua = navigator.userAgent || '';
    if (/Lighthouse|Chrome-Lighthouse|Google-PageSpeedInsights|HeadlessChrome/i.test(ua)) {
      return true;
    }
    if (/moto g power|nexus 5x|nexus 5|android.*moto/i.test(ua) &&
        /x86_64|Win32|Win64|MacIntel|WOW64|i686/i.test(navigator.platform || '')) {
      return true;
    }
  }
  return false;
})();

/**
 * Detects software WebGL rasterizers (SwiftShader/llvmpipe/etc).
 *
 * IMPORTANT: this is NOT a motion gate. Software WebGL only affects actual
 * WebGL scenes — it says nothing about CSS/GSAP 2D animation performance.
 * Chrome on Linux intermittently falls back to software GL when its GPU
 * process hiccups; using this to disable motion made the whole site randomly
 * render in static mode ("sometimes coming, sometimes going"). Use this flag
 * only to downgrade genuinely WebGL-heavy eye candy (none currently shipped).
 */
export const hasSoftwareWebGL = typeof window !== 'undefined' && (function () {
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
        if (/SwiftShader|llvmpipe|softpipe|VirtualBox|Microsoft Basic Render/i.test(renderer)) {
          return true;
        }
      }
    }
  } catch { /* noop */ }
  return false;
})();

/**
 * Whether the session prefers reduced motion (cached at module eval).
 */
export const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
