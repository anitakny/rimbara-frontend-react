/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#1F3B2D',
          light: '#2A4F3C',
          dark: '#162A20',
        },
        moss: {
          DEFAULT: '#5C7A4A',
          light: '#7A9E64',
          dark: '#4A6238',
        },
        clay: {
          DEFAULT: '#B85C3E',
          light: '#D4714F',
          dark: '#9A4A30',
        },
        sienna: {
          DEFAULT: '#8B4A2B',
          light: '#A35A37',
          dark: '#6E3920',
        },
        bone: {
          DEFAULT: '#F5EFE3',
          dark: '#EDE4D2',
        },
        sand: {
          DEFAULT: '#E8DCC4',
          dark: '#D9C9A8',
        },
        ink: {
          DEFAULT: '#1A1814',
          light: '#2D2A24',
        },
        ash: {
          DEFAULT: '#6B665E',
          light: '#8A847B',
        },
      },
      fontFamily: {
        serif: ['"Fraunces"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', '"DM Sans"', 'system-ui', 'sans-serif'],
        accent: ['"Instrument Serif"', '"Playfair Display"', 'Georgia', 'serif'],
      },
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'h1': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'h2': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.005em' }],
        'h3': ['1.375rem', { lineHeight: '1.3' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body': ['1rem', { lineHeight: '1.65' }],
        'caption': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.08em' }],
      },
      borderRadius: {
        'card': '16px',
        'chip': '4px',
      },
      boxShadow: {
        'subtle': '0 2px 8px rgba(31, 59, 45, 0.08)',
        'elevated': '0 8px 24px rgba(31, 59, 45, 0.14)',
        'warm': '0 4px 16px rgba(31, 59, 45, 0.10)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        'default': '240ms',
        'page': '320ms',
      },
      maxWidth: {
        'content': '1280px',
        'reading': '720px',
      },
      backgroundImage: {
        'batik-subtle': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%231F3B2D' fill-opacity='0.04'%3E%3Cpath d='M20 20l-4-4 4-4 4 4-4 4zm0-8l-4-4 4-4 4 4-4 4zm0 16l-4-4 4-4 4 4-4 4zM12 20l-4-4 4-4 4 4-4 4zm16 0l-4-4 4-4 4 4-4 4z'/%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
