import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import { LucideVueNext } from 'lucide-vue-next'; // Opcional: si quieres registrar todos globalmente

import App from './App.vue'
import router from './router'

import './assets/main.css' // ¡Importante! Asegúrate de que esta línea esté presente y la ruta sea correcta.

const app = createApp(App)

app.use(createPinia())
app.use(router)
// app.use(LucideVueNext); // Opcional: si quieres registrar todos globalmente

app.mount('#app')
