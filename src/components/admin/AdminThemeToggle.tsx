'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export function AdminThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = document.documentElement;
    const current = (root.getAttribute('data-theme') as 'light' | 'dark') || 'light';
    setTheme(current);

    const observer = new MutationObserver(() => {
      const updated = (root.getAttribute('data-theme') as 'light' | 'dark') || 'light';
      setTheme(updated);
    });

    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    const metaThemeColor = document.getElementById('theme-color-meta');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', next === 'dark' ? '#000000' : '#FFFFFF');
    }
    try {
      localStorage.setItem('theme', next);
    } catch {
      // ignore
    }
    setTheme(next);
  };

  return (
    <button
      onClick={toggle}
      type="button"
      className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:text-[#D6544B] dark:text-gray-300 dark:hover:text-[#D6544B] border border-gray-200 dark:border-gray-800 hover:border-[#D6544B]/40 dark:hover:border-[#D6544B]/40 bg-white dark:bg-[#14141C] transition-all cursor-pointer shadow-sm"
      title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
    </button>
  );
}
