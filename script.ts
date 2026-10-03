/**
 * Sai Srikar B — Personal Portfolio Core Script
 * Fully Type-Locked TypeScript Architecture
 */

// ============================================================================
// 1. GLOBAL TYPE DECLARATIONS & BRANDING
// ============================================================================

declare global {
  interface Window {
    readonly lucide?: {
      readonly createIcons: () => void;
    };
    va?: ((...args: unknown[]) => void) & {
      q?: unknown[][];
    };
  }
}

// ============================================================================
// 2. TYPE-LOCKED THEME ENUMS & CONSTANTS
// ============================================================================

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

export type Theme = (typeof THEMES)[keyof typeof THEMES];

export interface ThemeConfig {
  readonly theme: Theme;
  readonly metaColor: string;
  readonly iconName: 'sun' | 'moon';
}

export const THEME_CONFIG: Readonly<Record<Theme, ThemeConfig>> = Object.freeze({
  [THEMES.LIGHT]: Object.freeze({
    theme: THEMES.LIGHT,
    metaColor: '#FFFFFF',
    iconName: 'moon',
  }),
  [THEMES.DARK]: Object.freeze({
    theme: THEMES.DARK,
    metaColor: '#000000',
    iconName: 'sun',
  }),
} as const);

export const STORAGE_KEYS = {
  THEME: 'theme',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

// Type Guard for Theme
export function isTheme(value: unknown): value is Theme {
  return value === THEMES.LIGHT || value === THEMES.DARK;
}

// ============================================================================
// 3. SAFE DOM UTILITIES WITH STRICT TYPE GUARDS
// ============================================================================

export function getElement<T extends HTMLElement>(
  idOrSelector: string,
  isId = true
): T | null {
  const element = isId
    ? document.getElementById(idOrSelector)
    : document.querySelector(idOrSelector);

  return element instanceof HTMLElement ? (element as T) : null;
}

export function getAllElements<T extends HTMLElement>(selector: string): readonly T[] {
  const nodes = document.querySelectorAll(selector);
  const elements: T[] = [];
  nodes.forEach((node) => {
    if (node instanceof HTMLElement) {
      elements.push(node as T);
    }
  });
  return Object.freeze(elements);
}

export function safeCreateIcons(): void {
  try {
    if (typeof window !== 'undefined' && window.lucide?.createIcons) {
      window.lucide.createIcons();
    }
  } catch (error: unknown) {
    console.warn('[Lucide] Unable to instantiate icons:', error);
  }
}

// ============================================================================
// 4. TYPE-LOCKED THEME CONTROLLER
// ============================================================================

export class ThemeController {
  private readonly root: HTMLElement;
  private readonly toggleButton: HTMLButtonElement | null;
  private readonly metaThemeColor: HTMLMetaElement | null;

  constructor() {
    this.root = document.documentElement;
    this.toggleButton = getElement<HTMLButtonElement>('theme-toggle');
    this.metaThemeColor = getElement<HTMLMetaElement>('theme-color-meta');
  }

  public get currentTheme(): Theme {
    const rawTheme = this.root.getAttribute('data-theme');
    return isTheme(rawTheme) ? rawTheme : THEMES.LIGHT;
  }

  public applyTheme(theme: Theme): void {
    const config = THEME_CONFIG[theme];
    this.root.setAttribute('data-theme', config.theme);

    if (this.metaThemeColor) {
      this.metaThemeColor.setAttribute('content', config.metaColor);
    }

    if (this.toggleButton) {
      this.toggleButton.innerHTML =
        config.theme === THEMES.DARK
          ? '<i data-lucide="sun"></i>'
          : '<i data-lucide="moon"></i>';
      safeCreateIcons();
    }

    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch {
      // Ignore localStorage restrictions
    }
  }

  public toggle(): void {
    const nextTheme: Theme =
      this.currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    this.applyTheme(nextTheme);
  }

  public init(): void {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (isTheme(saved)) {
      this.applyTheme(saved);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.applyTheme(prefersDark ? THEMES.DARK : THEMES.LIGHT);
    }

    if (this.toggleButton) {
      this.toggleButton.addEventListener('click', () => this.toggle());
    }
  }
}

// ============================================================================
// 5. TYPE-LOCKED CUSTOM CURSOR CONTROLLER
// ============================================================================

export class CursorController {
  private readonly dot: HTMLElement | null;
  private readonly ring: HTMLElement | null;
  private readonly isFinePointer: boolean;

  constructor() {
    this.dot = getElement<HTMLElement>('.cursor-dot', false);
    this.ring = getElement<HTMLElement>('.cursor-ring', false);
    this.isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  }

  public init(): void {
    if (!this.isFinePointer || !this.dot || !this.ring) {
      return;
    }

    const dot = this.dot;
    const ring = this.ring;

    window.addEventListener(
      'mousemove',
      (event: MouseEvent) => {
        const { clientX, clientY } = event;
        dot.style.left = `${clientX}px`;
        dot.style.top = `${clientY}px`;

        ring.animate(
          {
            left: `${clientX}px`,
            top: `${clientY}px`,
          },
          { duration: 150, fill: 'forwards' }
        );
      },
      { passive: true }
    );

    const interactiveTargets = getAllElements<HTMLElement>(
      '.hover-target, a, button, input, textarea, select'
    );

    interactiveTargets.forEach((target) => {
      target.addEventListener('mouseenter', () => ring.classList.add('cursor-hover'));
      target.addEventListener('mouseleave', () => ring.classList.remove('cursor-hover'));
    });
  }
}

// ============================================================================
// 6. TYPE-LOCKED NAVBAR CONTROLLER
// ============================================================================

export class NavbarController {
  private readonly navbar: HTMLElement | null;
  private readonly SCROLL_THRESHOLD = 50 as const;

  constructor() {
    this.navbar = getElement<HTMLElement>('navbar');
  }

  public init(): void {
    if (!this.navbar) return;

    window.addEventListener(
      'scroll',
      () => {
        const isScrolled = window.scrollY > this.SCROLL_THRESHOLD;
        this.navbar?.classList.toggle('scrolled', isScrolled);
      },
      { passive: true }
    );
  }
}

// ============================================================================
// 7. TYPE-LOCKED SCROLL REVEAL OBSERVER
// ============================================================================

export class ScrollRevealController {
  private observer: IntersectionObserver | null = null;
  private readonly INTERSECTION_THRESHOLD = 0.1 as const;

  public init(): void {
    const sections = getAllElements<HTMLElement>('section');

    this.observer = new IntersectionObserver(
      (entries: readonly IntersectionObserverEntry[], obs: IntersectionObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target instanceof HTMLElement) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: this.INTERSECTION_THRESHOLD }
    );

    sections.forEach((section) => {
      section.classList.add('reveal');
      this.observer?.observe(section);
    });

    // Make hero section visible immediately
    window.setTimeout(() => {
      const hero = getElement<HTMLElement>('home');
      hero?.classList.add('visible');
    }, 100);
  }
}

// ============================================================================
// 8. LIFECYCLE BOOTSTRAP
// ============================================================================

export function bootstrapApplication(): void {
  const themeCtrl = new ThemeController();
  themeCtrl.init();

  safeCreateIcons();

  const cursorCtrl = new CursorController();
  cursorCtrl.init();

  const navCtrl = new NavbarController();
  navCtrl.init();

  const scrollCtrl = new ScrollRevealController();
  scrollCtrl.init();
}

// Initialize when DOM is parsed
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapApplication);
} else {
  bootstrapApplication();
}
