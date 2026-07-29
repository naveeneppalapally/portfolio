import { useEffect, useState } from 'react';
import { throttleAnimationFrame } from '../lib/utils';

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPast30, setIsPast30] = useState(false);

  useEffect(() => {
    // Throttle to one setState call per animation frame — prevents a React
    // re-render on every single scroll pixel (critical on mobile).
    const handleScroll = throttleAnimationFrame(() => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = totalHeight > 0 ? window.scrollY / totalHeight : 0;
      setProgress(currentProgress);
      setIsScrolled(window.scrollY > 50);
      setIsPast30(currentProgress > 0.3);
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { progress, isScrolled, isPast30 };
}
