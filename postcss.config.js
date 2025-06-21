import tailwindConfig from './tailwind.config.js'

export default {
  plugins: {
    tailwindcss: { config: tailwindConfig }, // Pasa explícitamente la configuración
    autoprefixer: {},
  },
}
