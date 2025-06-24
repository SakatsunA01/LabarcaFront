<template>
  <div class="min-h-screen bg-gray-100 flex">
    <!-- Overlay para móviles -->
    <div v-if="sidebarOpen" class="fixed inset-0 bg-brand-negro bg-opacity-50 z-40 md:hidden"
      @click="sidebarOpen = false"></div>

    <!-- Sidebar -->
    <aside class="fixed h-screen top-0 left-0 w-64 bg-brand-negro text-brand-gris-claro p-4 flex flex-col z-50
                   transform transition-transform duration-300 ease-in-out
                   md:translate-x-0" :class="{ '-translate-x-full': !sidebarOpen }">
      <h1 class="text-2xl font-bold mb-8 text-center">Admin Panel</h1>
      <nav class="flex-grow">
        <ul>
          <li v-for="item in navItems" :key="item.name" class="mb-2">
            <router-link :to="item.path" class="flex items-center p-2 rounded-md transition-colors"
              @click="sidebarOpen = false"
              :class="isActive(item.path) ? 'bg-brand-camel text-white' : 'hover:bg-gray-700'">
              <component :is="item.icon" class="h-6 w-6 mr-3" />
              <span>{{ item.name }}</span>
            </router-link>
          </li>
        </ul>
      </nav>
      <div class="mt-auto">
        <button @click="handleLogout"
          class="w-full flex items-center p-2 rounded-md hover:bg-red-700 transition-colors">
          <ArrowLeftOnRectangleIcon class="h-6 w-6 mr-3" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6 md:p-10 w-full md:ml-64">
      <!-- Botón de hamburguesa para móviles -->
      <button @click="sidebarOpen = true"
        class="md:hidden fixed top-4 left-4 z-50 bg-brand-camel text-white p-2 rounded-md shadow-lg">
        <Bars3Icon class="h-6 w-6" />
      </button>
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router'; // Import ref
import {
  Cog6ToothIcon, UserGroupIcon, CalendarDaysIcon, GiftIcon,
  ChatBubbleBottomCenterTextIcon, PhotoIcon, ArrowLeftOnRectangleIcon,
  Bars3Icon // Import Bars3Icon
} from '@heroicons/vue/24/outline';
import { useAuthStore } from '@/stores/authStore';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const navItems = [
  { name: 'Artistas', path: '/admin/artistas', icon: UserGroupIcon },
  { name: 'Eventos', path: '/admin/eventos', icon: CalendarDaysIcon },
  { name: 'Galería', path: '/admin/galeria', icon: PhotoIcon },
  { name: 'Testimonios', path: '/admin/testimonios', icon: ChatBubbleBottomCenterTextIcon },
  { name: 'Sorteos', path: '/admin/sorteos', icon: GiftIcon },
  { name: 'Configuraciones', path: '/admin/configuraciones', icon: Cog6ToothIcon },
];
const sidebarOpen = ref(false); // Estado para controlar la visibilidad del sidebar en móviles

const isActive = (path: string) => route.path.startsWith(path);

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};
</script>
