/**
 * Sai Srikar B — Personal Portfolio Core Script
 * Fully Type-Locked TypeScript Architecture
 */
// ============================================================================
// 2. TYPE-LOCKED THEME ENUMS & CONSTANTS
// ============================================================================
export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
};
export const THEME_CONFIG = Object.freeze({
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
});
export const STORAGE_KEYS = {
    THEME: 'theme',
};
// Type Guard for Theme
export function isTheme(value) {
    return value === THEMES.LIGHT || value === THEMES.DARK;
}
// ============================================================================
// 3. SAFE DOM UTILITIES WITH STRICT TYPE GUARDS
// ============================================================================
export function getElement(idOrSelector, isId = true) {
    const element = isId
        ? document.getElementById(idOrSelector)
        : document.querySelector(idOrSelector);
    return element instanceof HTMLElement ? element : null;
}
export function getAllElements(selector) {
    const nodes = document.querySelectorAll(selector);
    const elements = [];
    nodes.forEach((node) => {
        if (node instanceof HTMLElement) {
            elements.push(node);
        }
    });
    return Object.freeze(elements);
}
export function safeCreateIcons() {
    try {
        if (typeof window !== 'undefined' && window.lucide?.createIcons) {
            window.lucide.createIcons();
        }
    }
    catch (error) {
        console.warn('[Lucide] Unable to instantiate icons:', error);
    }
}
// ============================================================================
// 4. TYPE-LOCKED THEME CONTROLLER
// ============================================================================
export class ThemeController {
    root;
    toggleButton;
    metaThemeColor;
    constructor() {
        this.root = document.documentElement;
        this.toggleButton = getElement('theme-toggle');
        this.metaThemeColor = getElement('theme-color-meta');
    }
    get currentTheme() {
        const rawTheme = this.root.getAttribute('data-theme');
        return isTheme(rawTheme) ? rawTheme : THEMES.LIGHT;
    }
    applyTheme(theme) {
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
        }
        catch {
            // Ignore localStorage restrictions
        }
    }
    toggle() {
        const nextTheme = this.currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
        this.applyTheme(nextTheme);
    }
    init() {
        const saved = localStorage.getItem(STORAGE_KEYS.THEME);
        if (isTheme(saved)) {
            this.applyTheme(saved);
        }
        else {
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
    dot;
    ring;
    isFinePointer;
    constructor() {
        this.dot = getElement('.cursor-dot', false);
        this.ring = getElement('.cursor-ring', false);
        this.isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    }
    init() {
        if (!this.isFinePointer || !this.dot || !this.ring) {
            return;
        }
        const dot = this.dot;
        const ring = this.ring;
        window.addEventListener('mousemove', (event) => {
            const { clientX, clientY } = event;
            dot.style.left = `${clientX}px`;
            dot.style.top = `${clientY}px`;
            ring.animate({
                left: `${clientX}px`,
                top: `${clientY}px`,
            }, { duration: 150, fill: 'forwards' });
        }, { passive: true });
        const interactiveTargets = getAllElements('.hover-target, a, button, input, textarea, select');
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
    navbar;
    SCROLL_THRESHOLD = 50;
    constructor() {
        this.navbar = getElement('navbar');
    }
    init() {
        if (!this.navbar)
            return;
        window.addEventListener('scroll', () => {
            const isScrolled = window.scrollY > this.SCROLL_THRESHOLD;
            this.navbar?.classList.toggle('scrolled', isScrolled);
        }, { passive: true });
    }
}
// ============================================================================
// 7. TYPE-LOCKED SCROLL REVEAL OBSERVER
// ============================================================================
export class ScrollRevealController {
    observer = null;
    INTERSECTION_THRESHOLD = 0.1;
    init() {
        const sections = getAllElements('section');
        this.observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.target instanceof HTMLElement) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: this.INTERSECTION_THRESHOLD });
        sections.forEach((section) => {
            section.classList.add('reveal');
            this.observer?.observe(section);
        });
        // Make hero section visible immediately
        window.setTimeout(() => {
            const hero = getElement('home');
            hero?.classList.add('visible');
        }, 100);
    }
}
// ============================================================================
// 8. LIFECYCLE BOOTSTRAP
// ============================================================================
export function bootstrapApplication() {
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
}
else {
    bootstrapApplication();
}
