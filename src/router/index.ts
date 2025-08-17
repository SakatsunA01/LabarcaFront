import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PlaceholderView from '../views/PlaceholderView.vue' // Importa la vista placeholder
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/eventos',
      name: 'eventos',
      // route level code-splitting
      component: () => import('../views/EventosView.vue'),
    },
    {
      path: '/eventos/:id', // Ruta dinámica para el detalle del evento
      name: 'evento-detalle',
      component: () => import('../views/EventoDetalleView.vue'),
    },
    {
      path: '/artistas',
      name: 'artistas',
      component: () => import('../views/ArtistasView.vue'),
    },
    {
      path: '/artistas/:id', // Ruta dinámica para el detalle del artista
      name: 'artista-detalle',
      component: () => import('../views/ArtistaDetalleView.vue'),
    },
    {
      path: '/noticias/:slug',
      name: 'noticia-detalle',
      component: () => import('../views/NoticiaDetalleView.vue'),
    },
    {
      path: '/lanzamientos/:id',
      name: 'lanzamiento-detalle',
      component: () => import('../views/LanzamientoDetalleView.vue'),
    },
    {
      path: '/tienda/:id',
      name: 'producto-detalle',
      component: () => import('../views/ProductoDetalleView.vue'),
    },
    {
      path: '/como-estas-hoy',
      name: 'como-estas-hoy',
      component: PlaceholderView, // Usa la vista placeholder
    },
    {
      path: '/login',
      name: 'login',
      // Ya no necesitamos una vista /login, se maneja con modal.
      // Si quieres mantenerla por alguna razón, puedes hacerlo,
      // pero el flujo principal será el modal.
      // Por ahora, la redirigimos o la quitamos si el modal es suficiente.
      // component: PlaceholderView,
      redirect: '/', // Opcional: redirigir si se intenta acceder directamente
    },
    {
      path: '/admin',
      name: 'admin',
      redirect: '/admin/artistas', // Redirige a la primera sección por defecto
      component: () => import('../views/AdminLayout.vue'), // Usamos el nuevo layout
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        if (authStore.isAuthenticated && authStore.isAdmin) {
          next()
        } else {
          next({ name: 'home' })
        }
      },
      children: [
        {
          path: 'artistas',
          name: 'admin-artistas',
          component: () => import('../views/admin/AdminArtistasView.vue'),
        },
        // Aquí añadiremos las otras rutas de admin (eventos, galería, etc.)
        {
          path: 'eventos',
          name: 'admin-eventos',
          component: () => import('../views/admin/AdminEventosView.vue'),
        },
        {
          path: 'galeria',
          name: 'admin-galeria',
          component: () => import('../views/admin/AdminGaleriaView.vue'),
        },
        {
          path: 'testimonios',
          name: 'admin-testimonios',
          component: () => import('../views/admin/AdminTestimoniosView.vue'),
        },
      ],
    },
  ],
})

export default router
