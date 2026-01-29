import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['"PT Sans"', 'sans-serif'],
        headline: ['"Playfair Display"', 'serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'calc(var(--radius) - 1rem)',
        md: 'calc(var(--radius) - 1.2rem)',
        sm: 'calc(var(--radius) - 1.3rem)',
        xl: 'calc(var(--radius) - 0.5rem)',
        '2xl': 'var(--radius)',
        '3xl': 'calc(var(--radius) + 0.5rem)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'ring-move': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '35%': { transform: 'translate(var(--ring-translate-x), -1px) rotate(var(--ring-rotate))' },
          '70%': { transform: 'translate(var(--ring-translate-x), -1px) rotate(var(--ring-rotate))' },
        },
        'draw-heart': {
          from: { strokeDashoffset: '1' },
          to: { strokeDashoffset: '0' },
        },
        'undraw-heart': {
          from: { strokeDashoffset: '0' },
          to: { strokeDashoffset: '1' },
        },
        'party-hat-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        'confetti-fade': {
          '0%, 100%': { opacity: '0', transform: 'translateY(0)' },
          '50%': { opacity: '1', transform: 'translateY(5px)' },
        },
        'camera-flash': {
          '0%, 80%, 100%': { opacity: '0' },
          '85%': { opacity: '1' },
          '90%': { opacity: '0' },
        },
        'camera-lens-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
        },
        'bus-move': {
          '0%, 100%': { transform: 'translateX(-1.5px)' },
          '50%': { transform: 'translateX(1.5px)' },
        },
        'wheels-rotate': {
          from: { transformOrigin: 'center', rotate: '0deg' },
          to: { transformOrigin: 'center', rotate: '360deg' },
        },
        'cup-clink': {
          '0%, 100%': { transform: 'rotate(0)' },
          '50%': { transform: 'rotate(var(--cup-rotate))' },
        },
        'shine-effect': {
          '0%, 100%': { strokeDashoffset: '40' },
          '50%': { strokeDashoffset: '-40' },
        },
        'disco-rotate': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'bus-away': {
          '0%': { transform: 'scale(1) translateX(0)', opacity: '1' },
          '100%': { transform: 'scale(0.92) translateX(10px)', opacity: '0' },
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
