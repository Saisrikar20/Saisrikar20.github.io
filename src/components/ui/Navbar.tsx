'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Education', href: '#experience' },
  { label: 'Blog', href: '/blog' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  // Handle Scroll state & Active Section Scrollspy
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Section scrollspy
      const sections = ['about', 'projects', 'skills', 'certificates', 'experience', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          return;
        }
      }
      if (window.scrollY < 200) {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Theme Sync
  useEffect(() => {
    const root = document.documentElement;
    const initialTheme = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    setCurrentTheme(initialTheme);

    const observer = new MutationObserver(() => {
      const updatedTheme = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      setCurrentTheme(updatedTheme);
    });

    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', nextTheme);
    const metaThemeColor = document.getElementById('theme-color-meta');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', nextTheme === 'dark' ? '#000000' : '#FFFFFF');
    }
    try {
      localStorage.setItem('theme', nextTheme);
    } catch {
      // Ignore localStorage error
    }
    setCurrentTheme(nextTheme);

    // Call window.lucide if available
    if (typeof window !== 'undefined' && (window as unknown as { lucide?: { createIcons: () => void } }).lucide?.createIcons) {
      setTimeout(() => (window as unknown as { lucide?: { createIcons: () => void } }).lucide?.createIcons(), 50);
    }
  };

  const handleLinkClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith('#')) {
      const targetId = href.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} id="navbar">
        {/* Brand Logo */}
        <Link href="/" className="nav-logo hover-target" aria-label="Sai Srikar Home">
          S<span>..</span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="nav-links">
          {NAV_ITEMS.map((item) => {
            const isTargetActive =
              item.href.startsWith('#') && activeSection === item.href.replace('#', '');
            return (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={`hover-target ${isTargetActive ? 'active' : ''}`}
                  onClick={(e) => {
                    if (item.href.startsWith('#')) {
                      e.preventDefault();
                      handleLinkClick(item.href);
                    }
                  }}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Actions (Theme Toggle, Let's Talk CTA, Mobile Hamburger) */}
        <div className="nav-actions">
          <button
            className="theme-toggle hover-target"
            id="theme-toggle"
            aria-label={`Switch to ${currentTheme === 'light' ? 'Dark' : 'Light'} Mode`}
            onClick={toggleTheme}
            type="button"
          >
            {currentTheme === 'dark' ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-sun"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-moon"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            )}
          </button>

          <a
            href="#contact"
            className="btn btn-primary hover-target nav-cta-desktop"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('#contact');
            }}
          >
            Let&apos;s Talk
          </a>

          <a
            href="#contact"
            className="btn btn-primary hover-target nav-cta-mobile"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('#contact');
            }}
          >
            Talk
          </a>

          {/* Mobile Hamburger Button */}
          <button
            className="mobile-nav-toggle hover-target"
            aria-label="Toggle Navigation Menu"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            type="button"
          >
            {isMobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Horizontal Quick-Nav Bar (Visible on mobile screens) */}
      <nav className="mobile-quick-nav" aria-label="Mobile quick navigation">
        {NAV_ITEMS.map((item) => {
          const isTargetActive =
            item.href.startsWith('#') && activeSection === item.href.replace('#', '');
          return (
            <a
              key={item.label}
              href={item.href}
              className={`mobile-quick-pill hover-target ${isTargetActive ? 'active' : ''}`}
              onClick={(e) => {
                if (item.href.startsWith('#')) {
                  e.preventDefault();
                  handleLinkClick(item.href);
                }
              }}
            >
              {item.label}
            </a>
          );
        })}
      </nav>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-drawer" role="dialog" aria-modal="true">
          {NAV_ITEMS.map((item) => {
            const isTargetActive =
              item.href.startsWith('#') && activeSection === item.href.replace('#', '');
            return (
              <a
                key={item.label}
                href={item.href}
                className={`mobile-nav-item hover-target ${isTargetActive ? 'active' : ''}`}
                onClick={(e) => {
                  if (item.href.startsWith('#')) {
                    e.preventDefault();
                  }
                  handleLinkClick(item.href);
                }}
              >
                <span>{item.label}</span>
                {isTargetActive && <span className="mobile-nav-dot">•</span>}
              </a>
            );
          })}
          <a
            href="#contact"
            className="btn btn-primary mobile-nav-cta hover-target"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('#contact');
            }}
          >
            Let&apos;s Talk
          </a>
        </div>
      )}
    </>
  );
}
