'use client';

import React, { useEffect, useRef } from 'react';

// Set global flag so fallback scripts do not compete with React custom cursor
if (typeof window !== 'undefined') {
  (window as unknown as { __CUSTOM_CURSOR_REACT_ACTIVE__?: boolean }).__CUSTOM_CURSOR_REACT_ACTIVE__ = true;
}

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isVisible = false;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
        ringX = mouseX;
        ringY = mouseY;
        document.documentElement.classList.add('has-custom-cursor');
      }

      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    };

    let rafId: number;
    const loop = () => {
      if (isVisible) {
        ringX += (mouseX - ringX) * 0.22;
        ringY += (mouseY - ringY) * 0.22;
        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest('a') ||
          target.closest('button') ||
          target.closest('input') ||
          target.closest('textarea') ||
          target.closest('select') ||
          target.closest('summary') ||
          target.closest('.hover-target') ||
          target.closest('.project-card') ||
          target.closest('.quick-link-card') ||
          target.closest('.learning-card') ||
          target.closest('.cert-card') ||
          target.closest('.info-card'))
      ) {
        ring.classList.add('cursor-hover');
      } else {
        ring.classList.remove('cursor-hover');
      }
    };

    const onMouseLeave = () => {
      isVisible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
      document.documentElement.classList.remove('has-custom-cursor');
    };

    const onTouchStart = () => {
      isVisible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
      document.documentElement.classList.remove('has-custom-cursor');
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('touchstart', onTouchStart, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('touchstart', onTouchStart);
      cancelAnimationFrame(rafId);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
