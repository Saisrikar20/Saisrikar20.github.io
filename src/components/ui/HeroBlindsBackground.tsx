'use client';

import React, { useEffect, useState } from 'react';
import GradientBlinds from './GradientBlinds';

export function HeroBlindsBackground() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    const updateTheme = () => {
      setIsDark(root.getAttribute('data-theme') === 'dark');
    };
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  if (!mounted) {
    return null;
  }

  // Signature terracotta palette matched to site (#D6544B)
  const darkColors = ['#D6544B', '#6E2520', '#2B1213', '#0E0E12'];
  const lightColors = ['#D6544B', '#EE8E86', '#FCDAD6', '#F9FAFB'];

  return (
    <div
      className="hero-blinds-wrapper"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: isDark ? 0.45 : 0.35,
        transition: 'opacity 0.5s ease',
      }}
      aria-hidden="true"
    >
      <GradientBlinds
        gradientColors={isDark ? darkColors : lightColors}
        angle={-24}
        blindCount={16}
        blindMinWidth={60}
        spotlightRadius={0.5}
        shine={0.4}
        relief={0.5}
        glow={0.4}
        sway={0.35}
        hoverTilt={0.6}
        clickEffect="ripple"
        noise={0.3}
        spotlightSoftness={1}
        spotlightOpacity={1}
        shineDirection="left"
        lightColor={isDark ? '#FFB3AC' : '#FFFFFF'}
        speed={1}
        perspective={0}
        gradientSpeed={0}
        distortAmount={0}
        mirrorGradient={false}
        mouseDampening={0.15}
        idle="drift"
        intro
        lightMode={!isDark}
      />
    </div>
  );
}
