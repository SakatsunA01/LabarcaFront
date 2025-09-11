<template>
  <nav
    :class="['fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ease-in-out p-4 flex justify-between items-center', { 'bg-brand-negro shadow-md': isScrolled, 'bg-transparent': !isScrolled }]"
  >
    <!-- Logo -->
    <div class="navbar-brand">
      <router-link to="/" class="text-2xl font-bold hover:text-brand-camel text-white">
        La Barca Music
      </router-link>
    </div>

    <!-- Menu Items -->
    <ul class="hidden md:flex space-x-6">
      <li>
        <router-link to="/about" class="hover:text-brand-camel text-white">Nosotros</router-link>
      </li>
      <li>
        <router-link to="/eventos" class="hover:text-brand-camel text-white">Eventos</router-link>
      </li>
      <li>
        <router-link to="/artistas" class="hover:text-brand-camel text-white">Artistas</router-link>
      </li>
      <li>
        <router-link to="/lanzamientos" class="hover:text-brand-camel text-white">Lanzamientos</router-link>
      </li>
      <li>
        <router-link to="/comunidad" class="hover:text-brand-camel text-white">Comunidad</router-link>
      </li>
    </ul>

    <!-- Actions: Login and Social Icons -->
    <div class="flex items-center space-x-4">
      <!-- User/Login Section -->
      <div v-if="authStore.isAuthenticated && authStore.currentUser" ref="userMenuContainer" class="relative">
        <button class="flex items-center hover:text-brand-camel text-white" @click="toggleUserMenu">
          <span class="mr-2">{{ authStore.currentUser.name }}</span>
          <ChevronDownIcon class="h-5 w-5 transition-transform duration-200" :class="{ 'rotate-180': userMenuOpen }" />
        </button>
        <transition name="user-menu-fade">
          <div
            v-if="userMenuOpen"
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-brand-negro z-50"
          >
            <router-link
              v-if="authStore.isAdmin"
              to="/admin"
              class="block px-4 py-2 text-sm hover:bg-brand-gris-claro"
              @click="closeUserMenu"
            >Panel Admin</router-link>
            <router-link
              to="/peticion-oracion"
              class="block px-4 py-2 text-sm hover:bg-brand-gris-claro"
              @click="closeUserMenu"
            >Pedido de Oración</router-link>
            <button
              class="block w-full text-left px-4 py-2 text-sm hover:bg-brand-gris-claro"
              @click="handleLogout"
            >Cerrar Sesión</button>
          </div>
        </transition>
      </div>
      <button v-else class="text-xl hover:text-brand-camel text-white" aria-label="Login" @click="openLoginModal">
        <UserIcon class="h-7 w-7" />
      </button>

      <div class="flex space-x-3">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xl hover:text-brand-camel text-white"
          aria-label="Instagram"
        >
          <LinkIcon class="h-6 w-6" /> <!-- Heroicons no tiene Instagram -->
        </a>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xl hover:text-brand-camel text-white"
          aria-label="Facebook"
        >
          <LinkIcon class="h-6 w-6" /> <!-- Heroicons no tiene Facebook -->
        </a>
        <a
          href="https://whatsapp.com"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xl hover:text-brand-camel text-white"
          aria-label="WhatsApp"
        >
          <ChatBubbleOvalLeftEllipsisIcon class="h-6 w-6" />
        </a>
      </div>
    </div>
    <!-- Podrías añadir un botón para menú hamburguesa en móviles aquí -->
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, onUnmounted } from 'vue';
import { UserIcon, LinkIcon, ChatBubbleOvalLeftEllipsisIcon, ChevronDownIcon } from '@heroicons/vue/24/outline';
import { useUiStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'AppNavbar',
  components: {
    UserIcon,
    LinkIcon,
    ChatBubbleOvalLeftEllipsisIcon,
    ChevronDownIcon,
  },
  setup() {
    const uiStore = useUiStore();
    const authStore = useAuthStore();
    const router = useRouter();
    const userMenuOpen = ref(false);
    const userMenuContainer = ref<HTMLElement | null>(null);
    const isScrolled = ref(false);

    const handleScroll = () => {
      isScrolled.value = window.scrollY > 0;
    };

    onMounted(() => {
      window.addEventListener('scroll', handleScroll);
    });

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    });

    const openLoginModal = () => {
      uiStore.setShowLoginModal(true);
    };

    const closeUserMenu = () => {
      userMenuOpen.value = false;
    };

    const toggleUserMenu = () => {
      userMenuOpen.value = !userMenuOpen.value;
    };

    const handleLogout = () => {
      authStore.logout();
      closeUserMenu();
      router.push('/');
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuContainer.value && !userMenuContainer.value.contains(event.target as Node)) {
        closeUserMenu();
      }
    };

    watch(userMenuOpen, (isOpen) => {
      if (isOpen) {
        document.addEventListener('click', handleClickOutside);
      } else {
        document.removeEventListener('click', handleClickOutside);
      }
    });

    return {
      openLoginModal,
      authStore,
      userMenuOpen,
      userMenuContainer,
      toggleUserMenu,
      handleLogout,
      closeUserMenu,
      isScrolled,
    };
  },
});
</script>

<style scoped>
.user-menu-fade-enter-active,
.user-menu-fade-leave-active {
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
}

.user-menu-fade-enter-from,
.user-menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
