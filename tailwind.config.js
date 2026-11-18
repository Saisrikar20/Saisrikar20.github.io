/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        canvas: '#000000',
        'surface-card': '#0A0A0A',
        'surface-raised': '#141414',
        'border-subtle': '#222222',
        accent: {
          DEFAULT: '#D6544B',
          hover: '#C2443C',
          glow: 'rgba(214, 84, 75, 0.25)',
          subtle: 'rgba(214, 84, 75, 0.12)',
        },
        emerald: {
          300: '#F08B84',
          400: '#E06B63',
          500: '#D6544B',
          600: '#C2443C',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
        display: ['Syne', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
