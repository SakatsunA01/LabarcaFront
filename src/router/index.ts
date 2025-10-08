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
      path: '/comunidad',
      name: 'comunidad',
      component: () => import('../views/ComunidadView.vue'),
    },
    {
      path: '/comunidad/:id',
      name: 'comunidad-detalle',
      component: () => import('../views/PostDetailView.vue'),
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
        path: '/lanzamientos',
        name: 'lanzamientos',
        component: () => import('../views/LanzamientosView.vue'),
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
        path: '/contacto',
        name: 'contacto',
        component: PlaceholderView,
    },
    {
        path: '/privacidad',
        name: 'privacidad',
        component: PlaceholderView,
    },
    {
      path: '/peticion-oracion',
      name: 'peticion-oracion',
      component: () => import('../views/PrayerRequestView.vue'),
    },
    // Las rutas de login y registro ahora se manejan a través de modales
    // y no como páginas independientes.
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
        {
          path: 'posts',
          name: 'admin-posts',
          component: () => import('../views/admin/AdminPostsView.vue'),
        },
        {
          path: 'categories',
          name: 'admin-categories',
          component: () => import('../views/admin/AdminCategoriesView.vue'),
        },
        {
          path: 'hero',
          name: 'admin-hero',
          component: () => import('../views/admin/AdminHeroView.vue'),
        },
        // Aquí añadiremos las otras rutas de admin (eventos, galería, etc.)
        {
          path: 'eventos',
          name: 'admin-eventos',
          component: () => import('../views/admin/AdminEventosView.vue'),
        },
        {
          path: 'lanzamientos',
          name: 'admin-lanzamientos',
          component: () => import('../views/admin/AdminLanzamientosView.vue'),
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
        {
          path: 'prayer-requests',
          name: 'admin-prayer-requests',
          component: () => import('../views/admin/AdminPrayerRequestsView.vue'),
        },
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('../views/admin/AdminUsersView.vue'),
        },
        {
            path: 'sorteos',
            name: 'admin-sorteos',
            component: PlaceholderView,
        },
        {
            path: 'configuraciones',
            name: 'admin-configuraciones',
            component: PlaceholderView,
        },
      ],
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 }
  },
})

export default router