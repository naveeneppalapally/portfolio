'use client';

import { useEffect, useState, type ReactNode } from 'react';

/**
 * ClientOnly — mounts children after hydration.
 *
 * This portfolio is a full client SPA (Lenis + GSAP + Framer). SSR HTML exists
 * only for the first paint (LCP hero hint + preloader). Mounting the app tree
 * client-side avoids the fragile hydration path entirely: no mismatch windows,
 * no abandoned subtrees, deterministic effect execution on every browser.
 */
export default function ClientOnly({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <>{children}</>;
}
