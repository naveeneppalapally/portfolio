'use client';

import { useEffect, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { throttleAnimationFrame, getLenis } from '../lib/utils';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = throttleAnimationFrame(() => {
      setVisible(window.innerWidth > 768 && window.scrollY > 700);
    });
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.6 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <m.button
          initial={{ opacity: 0, scale: 0.5, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 10 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed z-50 flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-sm"
          style={{
            bottom: 28,
            right: 28,
            border: '1px solid var(--hair)',
            background: 'rgba(12,12,14,0.7)',
            color: 'var(--accent)',
          }}
          aria-label="Scroll to top"
          data-cursor="link"
        >
          <ArrowUp size={17} />
        </m.button>
      )}
    </AnimatePresence>
  );
}
