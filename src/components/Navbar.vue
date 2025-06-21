<template>
  <nav class="bg-brand-negro text-brand-gris-claro p-4 flex justify-between items-center sticky top-0 z-40">
    <!-- Logo -->
    <!-- Brand -->
    <div class="navbar-brand">
      <router-link to="/" class="text-2xl font-bold hover:text-brand-camel">
        LaBarca producciones
      </router-link>
    </div>

    <!-- Menu Items -->
    <ul class="hidden md:flex space-x-6">
      <li>
        <router-link to="/eventos" class="hover:text-brand-camel">eventos</router-link>
      </li>
      <li>
        <router-link to="/artistas" class="hover:text-brand-camel">artistas</router-link>
      </li>
      <li>
        <router-link to="/lanzamientos" class="hover:text-brand-camel">lanzamientos</router-link>
      </li>
      <li>
        <router-link to="/como-estas-hoy" class="hover:text-brand-camel">¿cómo estas hoy?</router-link>
      </li>
    </ul>

    <!-- Actions: Login and Social Icons -->
    <div class="flex items-center space-x-4">
      <!-- User/Login Section -->
      <div v-if="authStore.isAuthenticated && authStore.currentUser" class="relative">
        <button @click="toggleUserMenu" class="flex items-center hover:text-brand-camel">
          <span class="mr-2">{{ authStore.currentUser.name }}</span>
          <ChevronDownIcon class="h-5 w-5 transition-transform duration-200" :class="{ 'rotate-180': userMenuOpen }" />
        </button>
        <transition name="user-menu-fade">
          <div v-if="userMenuOpen"
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-brand-negro z-50">
            <router-link v-if="authStore.isAdmin" to="/admin"
              class="block px-4 py-2 text-sm hover:bg-brand-gris-claro">Panel Admin</router-link>
            <button @click="handleLogout"
              class="block w-full text-left px-4 py-2 text-sm hover:bg-brand-gris-claro">Cerrar Sesión</button>
          </div>
        </transition>
      </div>
      <button v-else @click="openLoginModal" class="text-xl hover:text-brand-camel" aria-label="Login">
        <UserIcon class="h-7 w-7" />
      </button>

      <div class="flex space-x-3">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="text-xl hover:text-brand-camel"
          aria-label="Instagram">
          <LinkIcon class="h-6 w-6" /> <!-- Heroicons no tiene Instagram -->
        </a>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="text-xl hover:text-brand-camel"
          aria-label="Facebook">
          <LinkIcon class="h-6 w-6" /> <!-- Heroicons no tiene Facebook -->
        </a>
        <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" class="text-xl hover:text-brand-camel"
          aria-label="WhatsApp">
          <ChatBubbleOvalLeftEllipsisIcon class="h-6 w-6" />
        </a>
      </div>
    </div>
    <!-- Podrías añadir un botón para menú hamburguesa en móviles aquí -->
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { UserIcon, LinkIcon, ChatBubbleOvalLeftEllipsisIcon, ChevronDownIcon } from '@heroicons/vue/24/outline';
import { useUiStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'AppNavbar', // Aseguramos que el nombre sea AppNavbar
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

    const openLoginModal = () => {
      uiStore.setShowLoginModal(true);
    };

    const toggleUserMenu = () => {
      userMenuOpen.value = !userMenuOpen.value;
    };

    const handleLogout = () => {
      authStore.logout();
      userMenuOpen.value = false;
      router.push('/'); // O a donde quieras redirigir tras logout
    };

    return { openLoginModal, authStore, userMenuOpen, toggleUserMenu, handleLogout };
  }
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
