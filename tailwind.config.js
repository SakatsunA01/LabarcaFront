/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  // Asegúrate de que sea `export default`
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}', // Estas rutas deben apuntar a tus archivos con clases de Tailwind
  ],
  theme: {
    extend: {
      colors: {
        'brand-borgona': '#5F0E1F',
        'brand-camel': '#A18059',
        'brand-verde-oscuro': '#234E4B',
        'brand-negro': '#171C1E',
        'brand-gris-claro': '#E2E2E2',
        'brand-cream': '#F5EFE6',
        'brand-carbon': '#0F1315',
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'], // Inter como fuente por defecto
        playfair: ['"Playfair Display"', 'serif'], // Playfair para títulos
      },
      spacing: {
        'section-sm': '5rem',    // 80px
        'section-md': '6.5rem',  // 104px
        'section-lg': '8rem',    // 128px
        'section-xl': '10rem',   // 160px
      },
      boxShadow: {
        'card': '0 4px 14px 0 rgba(0, 0, 0, 0.05)',
        'card-hover': '0 6px 20px 0 rgba(0, 0, 0, 0.07)',
      },
    },
  },
  plugins: [],
}
