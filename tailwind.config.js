/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // All dynamic opacity variants used in JS
    { pattern: /bg-brand-(violet|pink|emerald|amber|blue|red|cyan|purple)\/(10|15|20|25|30)/ },
    { pattern: /border-brand-(violet|pink|emerald|amber|blue|red|cyan)\/(20|25|30|40)/ },
    { pattern: /text-brand-(violet|pink|emerald|amber|blue|red|cyan)/ },
    { pattern: /from-brand-(violet|pink|emerald|amber|blue)\/(10|15|20)/ },
    { pattern: /to-brand-(violet|pink|emerald|amber|blue)\/(10|15|20)/ },
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          root:      '#0c0e1a',
          primary:   '#0c0e1a',
          secondary: '#111325',
          card:      '#161929',
          elevated:  '#1c2038',
          border:    '#252d4a',
        },
        brand: {
          violet:  '#6c75ff',
          purple:  '#7c3aed',
          pink:    '#f472b6',
          emerald: '#10b981',
          amber:   '#f59e0b',
          red:     '#f43f5e',
          blue:    '#3b82f6',
          cyan:    '#06b6d4',
        },
        text: {
          primary:   '#f0f2ff',
          secondary: '#8b90b8',
          muted:     '#4a5070',
          accent:    '#7c8cff',
        },
      },
      fontFamily: {
        sans:    ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'xs':   ['0.8125rem', { lineHeight: '1.5'  }],   // 13px
        'sm':   ['0.9375rem', { lineHeight: '1.55' }],   // 15px
        'base': ['1.0625rem', { lineHeight: '1.65' }],   // 17px
        'lg':   ['1.1875rem', { lineHeight: '1.6'  }],   // 19px
        'xl':   ['1.3125rem', { lineHeight: '1.5'  }],   // 21px
        '2xl':  ['1.5625rem', { lineHeight: '1.4'  }],   // 25px
        '3xl':  ['1.875rem',  { lineHeight: '1.3'  }],   // 30px — keep bold
        '4xl':  ['2.25rem',   { lineHeight: '1.2'  }],   // 36px — keep bold
        '5xl':  ['3rem',      { lineHeight: '1.1'  }],   // 48px — keep bold
        '6xl':  ['3.75rem',   { lineHeight: '1.05' }],   // 60px — keep bold
        '7xl':  ['4.5rem',    { lineHeight: '1'    }],   // 72px — keep bold
        '8xl':  ['6rem',      { lineHeight: '1'    }],
        '9xl':  ['8rem',      { lineHeight: '1'    }],
      },
      borderRadius: {
        'DEFAULT': '8px',
        'sm':  '6px',
        'md':  '8px',
        'lg':  '12px',
        'xl':  '14px',
        '2xl': '18px',
        '3xl': '24px',
        'full': '9999px',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #5b6cf9 0%, #a78bfa 100%)',
        'gradient-cool':  'linear-gradient(135deg, #3b82f6 0%, #5b6cf9 100%)',
        'gradient-warm':  'linear-gradient(135deg, #f59e0b 0%, #f472b6 100%)',
      },
      boxShadow: {
        'card':         '0 1px 4px rgba(91,108,249,0.05), 0 4px 16px rgba(91,108,249,0.06)',
        'card-hover':   '0 4px 20px rgba(91,108,249,0.12), 0 1px 4px rgba(0,0,0,0.04)',
        'glow-sm':      '0 0 0 3px rgba(91,108,249,0.12)',
        'glow-violet':  '0 4px 16px rgba(91,108,249,0.3)',
        'glow-violet-sm': '0 2px 8px rgba(91,108,249,0.25)',
        'glow-pink':    '0 4px 16px rgba(244,114,182,0.3)',
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-out',
        'slide-up':   'slideUp 0.25s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer':    'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' },                              '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(8px)' },'100%': { opacity: '1', transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' },             '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
}
