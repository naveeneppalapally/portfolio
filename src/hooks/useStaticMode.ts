'use client';

import { useEffect, useState } from 'react';
import { isLighthouse, prefersReducedMotion } from '../lib/utils';

/**
 * useStaticMode — hydration-safe version of `isLighthouse || prefersReducedMotion`.
 *
 * The module-level constants are client-only: on the server they are always
 * `false`, but in a gated browser (reduced motion, webdriver, software GL) they
 * are `true`. Branching on them during render produces different markup on
 * server vs client → React discards the tree mid-hydration → GSAP-pinned
 * sections get torn down and rebuilt (the "sections flicker in and out" bug).
 *
 * This hook returns `false` during SSR AND the first client render (guaranteeing
 * identical markup), then resolves to the real value post-mount. Gated users
 * get exactly one re-render into the static layout — before any GSAP effect has
 * touched the DOM, because effect gates keep using the module constants.
 *
 * RULES:
 *  - JSX / className / style branches  → use this hook.
 *  - Effect-only early returns          → use the module constants directly.
 */
export function useStaticMode(): boolean {
  const [staticMode, setStaticMode] = useState(false);
  useEffect(() => {
    setStaticMode(isLighthouse || prefersReducedMotion);
  }, []);
  return staticMode;
}
