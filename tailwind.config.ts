import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dashboard colors (legacy)
        canvas: 'var(--color-canvas)',
        panel: 'var(--color-panel)',
        'panel-hover': 'var(--color-panel-hover)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        'primary-text': 'var(--color-primary-text)',
        'secondary-text': 'var(--color-secondary-text)',
        'meta-text': 'var(--color-meta-text)',
        'table-header': 'var(--color-table-header)',
        'table-row-hover': 'var(--color-table-row-hover)',
        
        // shadcn/ui compatible colors (works in both themes)
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        card: {
          DEFAULT: 'var(--color-card)',
          foreground: 'var(--color-card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--color-popover)',
          foreground: 'var(--color-popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--color-primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          foreground: 'var(--color-secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--color-muted)',
          foreground: 'var(--color-muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--color-accent-bg)',
          foreground: 'var(--color-accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--color-destructive-bg)',
          foreground: 'var(--color-destructive-foreground)',
        },
        border: 'var(--color-border)',
        input: 'var(--color-input)',
        ring: 'var(--color-ring)',
        'accent-wash': 'var(--color-accent-wash)',
      },
      fontFamily: {
        sans: ['var(--font-family-sans)'],
        mono: ['var(--font-family-mono)'],
        brand: ['var(--font-family-brand)'],
      },
      fontWeight: {
        normal: '400',   // Body text
        medium: '500',   // Emphasized body, nav items
        semibold: '600', // Headings, card titles
        bold: '700',     // Buttons, CTAs, labels
      },
      boxShadow: {
        custom: 'var(--shadow-custom)',
        float: 'var(--shadow-float)',
      },
    },
  },
  plugins: [],
};

export default config;
