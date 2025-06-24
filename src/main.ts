import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/authStore'

import './assets/main.css' // ¡Importante! Asegúrate de que esta línea esté presente y la ruta sea correcta.

async function startApp() {
  const app = createApp(App)

  app.use(createPinia())

  // Intentar obtener el usuario al iniciar la app
  const authStore = useAuthStore()
  await authStore.fetchUser()

  app.use(router)
  app.mount('#app')
}

startApp()
