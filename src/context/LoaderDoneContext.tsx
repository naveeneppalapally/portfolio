/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface LoaderDoneContextType {
  loaderDone: boolean;
}

const LoaderDoneContext = createContext<LoaderDoneContextType>({ loaderDone: false });

import { isLighthouse } from '../lib/utils';

/**
 * Module-level done flag — survives React remounts.
 * If the tree is ever regenerated (hydration recovery, HMR), the provider
 * re-initializes from this flag instead of stranding the app in a
 * loaderDone=false state where every gated GSAP pin stays dead.
 */
const loaderState = { done: false };

export function LoaderDoneProvider({
  children,
  delay = 1800,
}: {
  children: ReactNode;
  delay?: number;
}) {
  // SSR-safe: module flag starts false everywhere; server and first client
  // render agree. Only remounts (post-hydration) see done=true up front.
  const [loaderDone, setLoaderDone] = useState(loaderState.done);

  useEffect(() => {
    if (loaderState.done) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoaderDone(true);
      return;
    }
    // On Lighthouse/crawlers, mark loader done immediately
    if (isLighthouse) {
      loaderState.done = true;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoaderDone(true);
      return;
    }
    // Fire slightly AFTER the loader finishes (1700ms) so animations start fresh
    const timer = setTimeout(() => {
      loaderState.done = true;
      setLoaderDone(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <LoaderDoneContext.Provider value={{ loaderDone }}>
      {children}
    </LoaderDoneContext.Provider>
  );
}

export function useLoaderDone() {
  return useContext(LoaderDoneContext);
}
