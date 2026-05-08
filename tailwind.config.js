/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        void: '#0a0806',
        'deep-earth': '#110e0a',
        amber: {
          DEFAULT: '#c8822a',
          glow: '#e8a04a',
        },
        gold: '#D4AF37',
        ember: '#ff6b2b',
        cream: '#f0e8d8',
        mist: '#a89880',
        silence: '#5a4e40',
      },
      fontFamily: {
        cormorant: ['Cormorant Garamond', 'Georgia', 'serif'],
        spectral: ['Spectral', 'serif'],
      },
      animation: {
        'pulse-slow': 'pulseAmber 4s ease-in-out infinite',
        'pulse-ember': 'pulseAmber 8s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.8s ease forwards',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'ley-flow': 'leyFlow 8s linear infinite',
        'particle-drift': 'particleDrift 6s ease-in-out infinite',
      },
      keyframes: {
        pulseAmber: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 6px rgba(200,130,42,0.8), 0 0 12px rgba(200,130,42,0.4)' },
          '50%': { opacity: '0.5', boxShadow: '0 0 3px rgba(200,130,42,0.4), 0 0 6px rgba(200,130,42,0.2)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212,175,55,0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(212,175,55,0.4), 0 0 80px rgba(200,130,42,0.2)' },
        },
        leyFlow: {
          from: { strokeDashoffset: '0' },
          to: { strokeDashoffset: '-48' },
        },
        particleDrift: {
          '0%': { transform: 'translate(0,0) scale(1)', opacity: '0.8' },
          '33%': { transform: 'translate(3px,-5px) scale(1.1)', opacity: '1' },
          '66%': { transform: 'translate(-3px,-8px) scale(0.9)', opacity: '0.6' },
          '100%': { transform: 'translate(0,0) scale(1)', opacity: '0.8' },
        },
      },
      backgroundImage: {
        'amber-gradient': 'linear-gradient(135deg, #c8822a 0%, #D4AF37 100%)',
        'void-gradient': 'linear-gradient(180deg, #0a0806 0%, #110e0a 100%)',
      },
      boxShadow: {
        amber: '0 0 20px rgba(200,130,42,0.3)',
        'amber-lg': '0 0 40px rgba(200,130,42,0.4)',
        gold: '0 0 20px rgba(212,175,55,0.3)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};