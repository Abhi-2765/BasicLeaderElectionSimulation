/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        theme: {
          bg: 'var(--color-bg)',
          surface: 'var(--color-surface)',
          'surface-subtle': 'var(--color-surface-subtle)',
          border: 'var(--color-border)',
          'border-strong': 'var(--color-border-strong)',
          text: 'var(--color-text)',
          muted: 'var(--color-muted)',
          undecided: 'var(--color-undecided)',
          follower: 'var(--color-follower)',
          leader: 'var(--color-leader)',
          warning: 'var(--color-warning)',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['SF Mono', 'ui-monospace', 'Menlo', 'Consolas', 'monospace']
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.07), 0 1px 2px -1px rgba(0, 0, 0, 0.07)',
        'tooltip': '0 4px 12px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.08)',
        'leader-glow': '0 0 20px 4px rgba(31, 138, 76, 0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
