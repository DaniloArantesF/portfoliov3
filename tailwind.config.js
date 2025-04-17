/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: 'var(--color-accent)',
          1: 'var(--color-accent-1)',
          2: 'var(--color-accent-2)',
          3: 'var(--color-accent-3)',
          4: 'var(--color-accent-4)',
        },
        background: 'var(--color-background)',
        surface: {
          0: 'var(--color-surface-0)',
          1: 'var(--color-surface-1)',
          2: 'var(--color-surface-2)',
          3: 'var(--color-surface-3)',
          4: 'var(--color-surface-4)',
        },
        'text-main': 'var(--color-text-main)',
        'text-sub': 'var(--color-text-sub)',
        'text-success': 'var(--color-text-success)',
        'text-error': 'var(--color-text-error)',
      },
      fontSize: {
        'xxs': 'var(--text-xxs)',
        'xs': 'var(--text-xs)',
        'sm': 'var(--text-sm)',
        'default': 'var(--text-default)',
        'md': 'var(--text-md)',
        'lg': 'var(--text-lg)',
        'xl': 'var(--text-xl)',
        '2xl': 'var(--text-2xl)',
      },
      spacing: {
        'padding-y': 'var(--spacing-padding-y)',
        'padding-x': 'var(--spacing-padding-x)',
        'main-margin-y': 'var(--spacing-main-margin-y)',
        'main-margin-x': 'var(--spacing-main-margin-x)',
      },
      borderRadius: {
        DEFAULT: 'var(--rounded)',
      },
      maxWidth: {
        'content': 'var(--width-content)',
      },
      height: {
        'header': 'var(--height-header)',
      },
      boxShadow: {
        DEFAULT: 'var(--shadow)',
        'low': 'var(--shadow-low)',
      },
      zIndex: {
        'ui': 'var(--z-ui)',
        'foreground': 'var(--z-foreground)',
        'midground': 'var(--z-midground)',
        'background': 'var(--z-background)',
      },
      fontFamily: {
        'ibm-plex': ['ibm-plex-sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}