/** @type {import('tailwindcss').Config} */
export default {
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
      },
      // Aquí puedes extender otras propiedades del tema si lo necesitas
    },
  },
  plugins: [],
}
