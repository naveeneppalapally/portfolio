'use client';

import { useEffect, useRef, type ReactNode, type CSSProperties } from 'react';
import { gsap } from '../lib/gsap';
import { checkIsLowEndOrReducedMotion } from '../lib/utils';

/**
 * MagneticButton — wraps children in a magnetic field.
 * The shell pulls toward the cursor; the inner label pulls further
 * (parallax). Springs back with elastic ease on leave.
 * Disabled on touch / reduced-motion / low-end.
 */
export default function MagneticButton({
  children,
  className = '',
  innerClassName = '',
  strength = 0.35,
  href,
  onClick,
  style,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  strength?: number;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  style?: CSSProperties;
  ariaLabel?: string;
}) {
  const shellRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const shell = shellRef.current;
    const inner = innerRef.current;
    if (!shell || !inner) return;
    if (checkIsLowEndOrReducedMotion()) return;
    if (window.matchMedia('(hover: none)').matches) return;

    const xTo = gsap.quickTo(shell, 'x', { duration: 0.9, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(shell, 'y', { duration: 0.9, ease: 'elastic.out(1, 0.4)' });
    const ixTo = gsap.quickTo(inner, 'x', { duration: 0.9, ease: 'elastic.out(1, 0.4)' });
    const iyTo = gsap.quickTo(inner, 'y', { duration: 0.9, ease: 'elastic.out(1, 0.4)' });

    const handleMove = (e: MouseEvent) => {
      const rect = shell.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      xTo(relX * strength);
      yTo(relY * strength);
      ixTo(relX * strength * 0.5);
      iyTo(relY * strength * 0.5);
    };

    const handleLeave = () => {
      xTo(0); yTo(0); ixTo(0); iyTo(0);
    };

    shell.addEventListener('mousemove', handleMove);
    shell.addEventListener('mouseleave', handleLeave);
    return () => {
      shell.removeEventListener('mousemove', handleMove);
      shell.removeEventListener('mouseleave', handleLeave);
    };
  }, [strength]);

  const Tag = (href ? 'a' : 'button') as 'a';

  return (
    <Tag
      ref={shellRef as React.RefObject<HTMLAnchorElement>}
      href={href}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`inline-block will-change-transform ${className}`}
      style={style}
      data-cursor="link"
    >
      <span ref={innerRef} className={`inline-flex items-center gap-3 will-change-transform ${innerClassName}`}>
        {children}
      </span>
    </Tag>
  );
}
