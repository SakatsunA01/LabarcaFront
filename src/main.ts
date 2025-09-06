import { createApp } from 'vue';
import { createPinia } from 'pinia';
import axios from 'axios';

import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/authStore';

import './assets/main.css';

// Configuración global de Axios
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

// Interceptor para añadir el token de autenticación a cada petición
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function startApp() {
  const app = createApp(App);

  app.use(createPinia());

  // Intentar obtener el usuario al iniciar la app
  // Esto ahora usará la configuración global de Axios con el token
  const authStore = useAuthStore();
  await authStore.fetchUser();

  app.use(router);
  app.mount('#app');
}

startApp();