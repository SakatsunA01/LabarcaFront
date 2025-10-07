<template>
  <nav
    :class="[
      'fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out p-4 flex justify-between items-center',
      {
        'bg-white shadow-md': isScrolled,
        'bg-gradient-to-b from-black/20 to-transparent': !isScrolled,
      },
    ]"
  >
    <!-- Logo -->
    <div class="navbar-brand">
      <router-link to="/" class="text-2xl font-bold" :class="textColorClass">
        La Barca Music
      </router-link>
    </div>

    <!-- Desktop Menu Items -->
    <ul class="hidden md:flex items-center space-x-6">
      <li>
        <router-link to="/about" class="flex items-center space-x-2" :class="textColorClass">
          <UserGroupIcon class="h-5 w-5" />
          <span>Nosotros</span>
        </router-link>
      </li>
      <li>
        <router-link to="/eventos" class="flex items-center space-x-2" :class="textColorClass">
          <CalendarDaysIcon class="h-5 w-5" />
          <span>Eventos</span>
        </router-link>
      </li>
      <li>
        <router-link to="/artistas" class="flex items-center space-x-2" :class="textColorClass">
          <MicrophoneIcon class="h-5 w-5" />
          <span>Artistas</span>
        </router-link>
      </li>
      <li>
        <router-link to="/lanzamientos" class="flex items-center space-x-2" :class="textColorClass">
          <PlayCircleIcon class="h-5 w-5" />
          <span>Lanzamientos</span>
        </router-link>
      </li>
      <li>
        <router-link to="/comunidad" class="flex items-center space-x-2" :class="textColorClass">
          <ChatBubbleLeftRightIcon class="h-5 w-5" />
          <span>Comunidad</span>
        </router-link>
      </li>
    </ul>

    <!-- Actions & Mobile Menu Button -->
    <div class="flex items-center space-x-4">
      <!-- User/Login Section -->
      <div v-if="authStore.isAuthenticated && authStore.currentUser" ref="userMenuContainer" class="relative hidden md:block">
        <button class="flex items-center" :class="textColorClass" @click="toggleUserMenu">
          <span class="mr-2">{{ authStore.currentUser.name }}</span>
          <ChevronDownIcon class="h-5 w-5 transition-transform duration-200" :class="{ 'rotate-180': userMenuOpen }" />
        </button>
        <transition name="user-menu-fade">
          <div
            v-if="userMenuOpen"
            class="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 text-brand-negro z-50"
          >
            <router-link
              v-if="authStore.isAdmin"
              to="/admin"
              class="flex items-center space-x-3 block px-4 py-2 text-sm hover:bg-brand-gris-claro"
              @click="closeUserMenu"
            >
              <Cog8ToothIcon class="h-5 w-5" />
              <span>Panel Admin</span>
            </router-link>
            <router-link
              to="/peticion-oracion"
              class="flex items-center space-x-3 block px-4 py-2 text-sm hover:bg-brand-gris-claro"
              @click="closeUserMenu"
            >
              <HeartIcon class="h-5 w-5" />
              <span>Pedido de Oración</span>
            </router-link>
            <button
              class="flex items-center space-x-3 block w-full text-left px-4 py-2 text-sm hover:bg-brand-gris-claro"
              @click="handleLogout"
            >
              <ArrowLeftStartOnRectangleIcon class="h-5 w-5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </transition>
      </div>
      <button v-else class="text-xl hidden md:block" :class="textColorClass" aria-label="Login" @click="openLoginModal">
        <UserIcon class="h-7 w-7" />
      </button>

      <!-- Mobile Menu Button -->
      <button class="md:hidden text-xl" :class="textColorClass" aria-label="Open menu" @click="toggleMobileMenu">
        <Bars3Icon class="h-7 w-7" />
      </button>
    </div>

    <!-- Mobile Menu Panel -->
    <transition name="mobile-menu-fade">
      <div v-if="mobileMenuOpen" class="fixed inset-0 bg-white z-50 flex flex-col">
        <!-- Mobile Menu Header -->
        <div class="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 class="text-2xl font-bold text-brand-negro">Menu</h2>
          <button @click="toggleMobileMenu" class="text-brand-negro">
            <XMarkIcon class="h-8 w-8" />
          </button>
        </div>

        <!-- Mobile Menu Links -->
        <ul class="flex flex-col items-center justify-start pt-16 flex-grow space-y-6">
          <li>
            <router-link to="/about" @click="toggleMobileMenu" class="text-2xl text-brand-negro hover:text-brand-camel flex items-center space-x-3">
              <UserGroupIcon class="h-7 w-7" />
              <span>Nosotros</span>
            </router-link>
          </li>
          <li>
            <router-link to="/eventos" @click="toggleMobileMenu" class="text-2xl text-brand-negro hover:text-brand-camel flex items-center space-x-3">
              <CalendarDaysIcon class="h-7 w-7" />
              <span>Eventos</span>
            </router-link>
          </li>
          <li>
            <router-link to="/artistas" @click="toggleMobileMenu" class="text-2xl text-brand-negro hover:text-brand-camel flex items-center space-x-3">
              <MicrophoneIcon class="h-7 w-7" />
              <span>Artistas</span>
            </router-link>
          </li>
          <li>
            <router-link to="/lanzamientos" @click="toggleMobileMenu" class="text-2xl text-brand-negro hover:text-brand-camel flex items-center space-x-3">
              <PlayCircleIcon class="h-7 w-7" />
              <span>Lanzamientos</span>
            </router-link>
          </li>
          <li>
            <router-link to="/comunidad" @click="toggleMobileMenu" class="text-2xl text-brand-negro hover:text-brand-camel flex items-center space-x-3">
              <ChatBubbleLeftRightIcon class="h-7 w-7" />
              <span>Comunidad</span>
            </router-link>
          </li>
           <!-- Mobile Login/User Actions -->
          <li class="absolute bottom-16">
            <div v-if="authStore.isAuthenticated && authStore.currentUser" class="text-center">
                <router-link
                  v-if="authStore.isAdmin"
                  to="/admin"
                   @click="toggleMobileMenu"
                  class="flex items-center space-x-3 block px-4 py-2 text-lg"
                >
                  <Cog8ToothIcon class="h-6 w-6" />
                  <span>Panel Admin</span>
                </router-link>
                <router-link
                  to="/peticion-oracion"
                   @click="toggleMobileMenu"
                  class="flex items-center space-x-3 block px-4 py-2 text-lg"
                >
                  <HeartIcon class="h-6 w-6" />
                  <span>Pedido de Oración</span>
                </router-link>
                <button
                  class="flex items-center space-x-3 w-full text-left px-4 py-2 text-lg"
                  @click="handleLogout"
                >
                  <ArrowLeftStartOnRectangleIcon class="h-6 w-6" />
                  <span>Cerrar Sesión</span>
                </button>
            </div>
             <button v-else class="text-xl flex items-center space-x-3" aria-label="Login" @click="openLoginModal">
                <UserIcon class="h-7 w-7" />
                <span>Iniciar Sesión</span>
            </button>
          </li>
        </ul>
      </div>
    </transition>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted, onUnmounted } from 'vue';
import {
  UserIcon,
  ChevronDownIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  MicrophoneIcon,
  PlayCircleIcon,
  ChatBubbleLeftRightIcon,
  Cog8ToothIcon,
  HeartIcon,
  ArrowLeftStartOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/vue/24/outline';
import { useUiStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'AppNavbar',
  components: {
    UserIcon,
    ChevronDownIcon,
    UserGroupIcon,
    CalendarDaysIcon,
    MicrophoneIcon,
    PlayCircleIcon,
    ChatBubbleLeftRightIcon,
    Cog8ToothIcon,
    HeartIcon,
    ArrowLeftStartOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
  },
  setup() {
    const uiStore = useUiStore();
    const authStore = useAuthStore();
    const router = useRouter();
    const userMenuOpen = ref(false);
    const mobileMenuOpen = ref(false);
    const userMenuContainer = ref<HTMLElement | null>(null);
    const isScrolled = ref(false);

    const textColorClass = computed(() => {
      return isScrolled.value
        ? 'text-brand-negro hover:text-brand-camel'
        : 'text-white hover:text-brand-gris-claro';
    });

    const handleScroll = () => {
      isScrolled.value = window.scrollY > 50;
    };

    onMounted(() => {
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Set initial state
    });

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    });

    const openLoginModal = () => {
      uiStore.setShowLoginModal(true);
      mobileMenuOpen.value = false; // Close mobile menu when login modal opens
    };

    const closeUserMenu = () => {
      userMenuOpen.value = false;
    };

    const toggleUserMenu = () => {
      userMenuOpen.value = !userMenuOpen.value;
    };
    
    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value;
    };

    const handleLogout = () => {
      authStore.logout();
      closeUserMenu();
      mobileMenuOpen.value = false;
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
      mobileMenuOpen,
      userMenuContainer,
      toggleUserMenu,
      toggleMobileMenu,
      handleLogout,
      closeUserMenu,
      isScrolled,
      textColorClass,
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

.mobile-menu-fade-enter-active,
.mobile-menu-fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.mobile-menu-fade-enter-from,
.mobile-menu-fade-leave-to {
  opacity: 0;
}
</style>
