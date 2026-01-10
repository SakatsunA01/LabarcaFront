<template>
  <div :class="['min-h-screen flex', uiStore.theme === 'dark' ? 'bg-brand-carbon text-white' : 'bg-gray-100 text-brand-negro']">
    <!-- Overlay para móviles -->
    <div
v-if="sidebarOpen" class="fixed inset-0 bg-brand-negro bg-opacity-50 z-40 md:hidden"
      @click="sidebarOpen = false"></div>

    <!-- Sidebar -->
    <aside
      class="fixed h-screen top-0 left-0 w-64 p-4 flex flex-col z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0"
      :class="[
        uiStore.theme === 'dark' ? 'bg-brand-negro text-brand-gris-claro' : 'bg-brand-negro text-brand-gris-claro',
        { '-translate-x-full': !sidebarOpen },
      ]">
      <div class="mb-6">
        <router-link to="/" class="flex items-center justify-center text-sm text-brand-gris-claro/80 hover:text-white">
          <span class="mr-2">&larr;</span>
          <span>Volver al inicio</span>
        </router-link>
      </div>
      <h1 class="text-2xl font-bold mb-8 text-center">Admin Panel</h1>
      <nav class="flex-grow overflow-y-auto pr-1">
        <div v-if="activeSection" class="space-y-4">
          <button
            class="flex items-center text-sm text-brand-gris-claro/80 hover:text-white"
            @click="closeSection">
            <span class="mr-2">&larr;</span>
            <span>Volver</span>
          </button>
          <p class="text-xs uppercase tracking-wider text-brand-gris-claro/70">{{ activeSection.title }}</p>
          <ul>
            <li v-for="item in activeSection.items" :key="item.name" class="mb-2">
              <router-link
                :to="item.path" class="flex items-center p-2 rounded-md transition-colors"
                :class="isActive(item.path) ? 'bg-brand-camel text-white' : 'hover:bg-gray-700'"
                @click="sidebarOpen = false">
                <component :is="item.icon" class="h-6 w-6 mr-3" />
                <span>{{ item.name }}</span>
              </router-link>
            </li>
          </ul>
        </div>
        <div v-else class="space-y-6">
          <div>
            <p class="text-xs uppercase tracking-wider text-brand-gris-claro/70 mb-2">Agrupaciones</p>
            <ul class="space-y-2">
              <li v-for="section in groupedSections" :key="section.title">
                <button
                  class="w-full flex items-center p-2 rounded-md transition-colors hover:bg-gray-700 text-left"
                  @click="openSection(section)">
                  <component :is="section.icon" class="h-6 w-6 mr-3" />
                  <span>{{ section.title }}</span>
                </button>
              </li>
            </ul>
          </div>
          <div>
            <p class="text-xs uppercase tracking-wider text-brand-gris-claro/70 mb-2">Secciones</p>
            <ul>
              <li v-for="item in standaloneItems" :key="item.name" class="mb-2">
                <router-link
                  :to="item.path" class="flex items-center p-2 rounded-md transition-colors"
                  :class="isActive(item.path) ? 'bg-brand-camel text-white' : 'hover:bg-gray-700'"
                  @click="sidebarOpen = false">
                  <component :is="item.icon" class="h-6 w-6 mr-3" />
                  <span>{{ item.name }}</span>
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div class="mt-auto">
        <button
class="w-full flex items-center p-2 rounded-md hover:bg-red-700 transition-colors"
          @click="handleLogout">
          <ArrowLeftOnRectangleIcon class="h-6 w-6 mr-3" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6 md:p-10 w-full md:ml-64 overflow-x-auto">
      <!-- Botón de hamburguesa para móviles -->
      <button
class="md:hidden fixed top-4 left-4 z-50 bg-brand-camel text-white p-2 rounded-md shadow-lg"
        @click="sidebarOpen = true">
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
  Bars3Icon, NewspaperIcon, TagIcon // Import Bars3Icon
} from '@heroicons/vue/24/outline';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const uiStore = useUiStore();

const groupedSections = [
  {
    title: 'Historias y categorias',
    icon: TagIcon,
    items: [
      { name: 'Historias', path: '/admin/posts', icon: NewspaperIcon },
      { name: 'Categorias', path: '/admin/categories', icon: TagIcon },
    ],
  },
  {
    title: 'Eventos y ventas',
    icon: CalendarDaysIcon,
    items: [
      { name: 'Eventos', path: '/admin/eventos', icon: CalendarDaysIcon },
      { name: 'Entradas', path: '/admin/products', icon: TagIcon },
      { name: 'Ventas', path: '/admin/ticket-orders', icon: NewspaperIcon },
      { name: 'Galeria', path: '/admin/galeria', icon: PhotoIcon },
      { name: 'Testimonios', path: '/admin/testimonios', icon: ChatBubbleBottomCenterTextIcon },
    ],
  },
];

const standaloneItems = [
  { name: 'Hero Carousel', path: '/admin/hero', icon: PhotoIcon },
  { name: 'Artistas', path: '/admin/artistas', icon: UserGroupIcon },
  { name: 'Lanzamientos', path: '/admin/lanzamientos', icon: CalendarDaysIcon },
  { name: 'Peticiones Oracion', path: '/admin/prayer-requests', icon: ChatBubbleBottomCenterTextIcon },
  { name: 'Usuarios', path: '/admin/users', icon: UserGroupIcon },
  { name: 'Sorteos', path: '/admin/sorteos', icon: GiftIcon },
  { name: 'Configuraciones', path: '/admin/configuraciones', icon: Cog6ToothIcon },
];
const activeSection = ref<{ title: string; items: { name: string; path: string; icon: any }[] } | null>(null);
const sidebarOpen = ref(false); // Estado para controlar la visibilidad del sidebar en móviles

const isActive = (path: string) => route.path.startsWith(path);

const openSection = (section: { title: string; items: { name: string; path: string; icon: any }[] }) => {
  activeSection.value = section;
};

const closeSection = () => {
  activeSection.value = null;
};

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};
</script>
