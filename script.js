// Dark Mode Toggle — runs immediately since script is at bottom of body
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

function safeCreateIcons() {
    try { lucide.createIcons(); } catch(e) {}
}

function updateThemeColorMeta(theme) {
    const metaThemeColor = document.getElementById('theme-color-meta');
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', theme === 'dark' ? '#000000' : '#F9FAFB');
    }
}

function updateThemeIcon(theme) {
    if (!themeToggle) return;
    themeToggle.innerHTML = theme === 'dark'
        ? '<i data-lucide="sun"></i>'
        : '<i data-lucide="moon"></i>';
    safeCreateIcons();
}

// Apply saved or system theme BEFORE paint (script is deferred to end of body)
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
    updateThemeColorMeta(savedTheme);
    updateThemeIcon(savedTheme);
} else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = prefersDark ? 'dark' : 'light';
    html.setAttribute('data-theme', initialTheme);
    updateThemeColorMeta(initialTheme);
    updateThemeIcon(initialTheme);
}

// Toggle on click
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        updateThemeColorMeta(newTheme);
    });
}

// Init Lucide Icons
safeCreateIcons();

// Custom Cursor — desktop only
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    window.addEventListener('mousemove', (e) => {
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
        cursorRing.animate({
            left: `${e.clientX}px`,
            top: `${e.clientY}px`
        }, { duration: 150, fill: "forwards" });
    });

    document.querySelectorAll('.hover-target, a, button').forEach(target => {
        target.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-hover'));
        target.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-hover'));
    });
}

// Navbar Shrink on Scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// Scroll Reveal Animations
const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(section => {
    section.classList.add('reveal');
    sectionObserver.observe(section);
});

// Hero visible immediately
setTimeout(() => {
    const home = document.getElementById('home');
    if (home) home.classList.add('visible');
}, 100);

