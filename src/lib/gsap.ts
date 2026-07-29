/**
 * Single source of truth for GSAP.
 * Import { gsap, ScrollTrigger } from here — never from 'gsap' directly,
 * so plugin registration happens exactly once.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  // Sensible global defaults for the whole site
  gsap.defaults({ ease: 'expo.out', duration: 1 });
  ScrollTrigger.config({
    ignoreMobileResize: true,
  });
  // Debug handles (used by automated QA; negligible cost)
  (window as unknown as { __gsap?: unknown; __ST?: unknown }).__gsap = gsap;
  (window as unknown as { __gsap?: unknown; __ST?: unknown }).__ST = ScrollTrigger;
}

export { gsap, ScrollTrigger };
