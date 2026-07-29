import type { Variants } from 'framer-motion';

// ===== CONTAINER VARIANTS =====
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

// ===== FADE IN UP =====
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// ===== FADE IN DOWN =====
export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// ===== SLIDE IN LEFT =====
export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.65,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// ===== SLIDE IN RIGHT =====
export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.65,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// ===== SCALE IN =====
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// ===== WORD STAGGER (for hero headline) =====
export const wordStagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

// Pure opacity+translate — GPU-composited in all browsers (no rotateX = no 3D repaint in Firefox)
export const wordReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 22,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// ===== LINE REVEAL (for cinematic text entry) =====
// clipPath animation is NOT GPU-composited on Firefox — replaced with opacity+y
export const lineReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// ===== CARD HOVER =====
export const cardHover = {
  rest: {
    y: 0,
    boxShadow: '0 4px 30px rgba(0,0,0,0.4)',
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  hover: {
    y: -8,
    boxShadow: '0 8px 40px rgba(245,158,11,0.15), 0 0 30px rgba(245,158,11,0.08)',
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

// ===== SECTION VIEWPORT OPTIONS =====
export const sectionViewport = {
  once: true,
  amount: 0.12,
  margin: '0px 0px -30px 0px',
};

// ===== BADGE STAGGER =====
export const badgeStagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.5,
    },
  },
};

export const badgeReveal: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

// ===== GLOW PULSE =====
export const glowPulse: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

// ===== COUNTER REVEAL =====
export const counterReveal: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};
