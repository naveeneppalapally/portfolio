/* eslint-disable react-refresh/only-export-components */
/**
 * ThemeContext — per-section accent theming ("Ink & Signal" system).
 *
 * Repurposed from the old SolarTimeContext: instead of time-of-day phases,
 * each <section data-accent="glacier"> declares an accent. A ScrollTrigger
 * watcher flips --accent on <html> as the user scrolls, so the entire page
 * (cursor, links, eyebrows, progress bar) re-tints itself per section.
 */
import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { ScrollTrigger } from '../lib/gsap';
import { isLighthouse } from '../lib/utils';

export type AccentName = 'signal' | 'glacier' | 'moss' | 'violet';

export const ACCENTS: Record<AccentName, string> = {
  signal: '#FF4D1C',
  glacier: '#6E8CFF',
  moss: '#3FA66A',
  violet: '#9B8CFF',
};

interface ThemeContextType {
  accent: AccentName;
  accentHex: string;
  setAccent: (accent: AccentName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accent, setAccentState] = useState<AccentName>('signal');

  const setAccent = useCallback((next: AccentName) => {
    setAccentState((prev) => {
      if (prev === next) return prev;
      document.documentElement.style.setProperty('--accent', ACCENTS[next]);
      document.documentElement.dataset.accentName = next;
      return next;
    });
  }, []);

  // Watch every [data-accent] section and flip the global accent on scroll.
  // Re-scans when lazy-loaded views materially change the DOM tree.
  useEffect(() => {
    if (isLighthouse) return;

    let triggers: ScrollTrigger[] = [];
    let rebindTimer = 0;

    const bind = () => {
      triggers.forEach((t) => t.kill());
      triggers = [];
      const sections = document.querySelectorAll<HTMLElement>('[data-accent]');
      sections.forEach((section) => {
        const name = section.dataset.accent as AccentName | undefined;
        if (!name || !(name in ACCENTS)) return;
        triggers.push(
          ScrollTrigger.create({
            trigger: section,
            start: 'top 55%',
            end: 'bottom 55%',
            onEnter: () => setAccent(name),
            onEnterBack: () => setAccent(name),
          })
        );
      });
    };

    const timer = window.setTimeout(() => {
      bind();
      ScrollTrigger.refresh();
    }, 400);

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.addedNodes.length > 0) {
          window.clearTimeout(rebindTimer);
          rebindTimer = window.setTimeout(() => {
            bind();
            ScrollTrigger.refresh();
          }, 500);
          break;
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(rebindTimer);
      triggers.forEach((t) => t.kill());
      observer.disconnect();
    };
  }, [setAccent]);

  const value = useMemo(
    () => ({ accent, accentHex: ACCENTS[accent], setAccent }),
    [accent, setAccent]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
