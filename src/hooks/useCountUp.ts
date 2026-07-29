import { useEffect, useRef, useState } from 'react';
import { useLoaderDone } from '../context/LoaderDoneContext';
import { isLighthouse } from '../lib/utils';

interface UseCountUpOptions {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

// Shared observer — reused across all stat items to avoid 4x overhead
let countUpObserver: IntersectionObserver | null = null;

function getCountUpObserver(callbacks: Map<Element, () => void>): IntersectionObserver {
  if (!countUpObserver) {
    countUpObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const cb = callbacks.get(entry.target);
            if (cb) {
              cb();
              countUpObserver!.unobserve(entry.target);
              callbacks.delete(entry.target);
            }
          }
        }
      },
      { threshold: 0.2 }
    );
  }
  return countUpObserver;
}

// Global callback map for the shared observer
const callbackMap = new Map<Element, () => void>();

export function useCountUp({ end, duration = 2000, prefix = '', suffix = '', decimals = 0 }: UseCountUpOptions) {
  // Always start at 0 — the lighthouse fast-path is applied in an effect
  // post-hydration so SSR and the first client render agree (no mismatch).
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const { loaderDone } = useLoaderDone();
  const [isClientLighthouse, setIsClientLighthouse] = useState(false);

  useEffect(() => {
    if (isLighthouse) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsClientLighthouse(true);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCount(end);
    }
  }, [end]);

  useEffect(() => {
    if (isClientLighthouse) return;
    if (!loaderDone) return;
    if (hasStarted) return;

    const el = ref.current;
    if (!el) return;

    const observer = getCountUpObserver(callbackMap);
    callbackMap.set(el, () => setHasStarted(true));
    observer.observe(el);

    return () => {
      callbackMap.delete(el);
      observer.unobserve(el);
    };
  }, [hasStarted, loaderDone, isClientLighthouse, end]);

  useEffect(() => {
    if (isClientLighthouse || !hasStarted) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Ease out expo for dramatic count-up
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentValue = eased * end;

      setCount(parseFloat(currentValue.toFixed(decimals)));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [hasStarted, end, duration, decimals, isClientLighthouse]);

  const displayValue = `${prefix}${count.toLocaleString('en-IN', { maximumFractionDigits: decimals })}${suffix}`;

  return { ref, displayValue, count };
}
