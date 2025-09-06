<script setup lang="ts">
import { ref } from 'vue';
import { RouterView } from 'vue-router'
import AppNavbar from '@/components/Navbar.vue'
import AppFooter from '@/components/AppFooter.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import LoginModal from '@/components/LoginModal.vue';
import RegisterModal from '@/components/RegisterModal.vue';
import FaithPrayerModal from '@/components/FaithPrayerModal.vue'; // Importar el nuevo modal
import { useUiStore } from '@/stores/uiStore';

const uiStore = useUiStore();
const showFaithPrayerModal = ref(false);

const handleRegistrationSuccess = () => {
  uiStore.setShowRegisterModal(false); // Asegurarse de que el modal de registro se cierre
  showFaithPrayerModal.value = true; // Mostrar el modal de oración
};

const closeFaithPrayerModal = () => {
  showFaithPrayerModal.value = false;
};

</script>

<template>
  <div class="min-h-screen bg-brand-gris-claro text-brand-negro font-sans flex flex-col">
    <AppNavbar />
    <main class="flex-grow">
      <RouterView v-slot="{ Component }">
        <transition name="route-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
    <LoadingOverlay :is-loading="uiStore.isRouteLoading" />
    <LoginModal :show="uiStore.showLoginModal" @close="uiStore.setShowLoginModal(false)" />
    <RegisterModal :show="uiStore.showRegisterModal" @close="uiStore.setShowRegisterModal(false)" @registration-success="handleRegistrationSuccess" />
    <FaithPrayerModal :show="showFaithPrayerModal" @close="closeFaithPrayerModal" />
    <AppFooter />
  </div>
</template>

<style scoped>
/* Puedes añadir estilos globales adicionales aquí si es necesario,
   o importar una fuente personalizada en tu main.css/main.ts */
/* Ejemplo para una fuente sans-serif más suave, si la tienes configurada:
body {
  font-family: 'TuFuentePersonalizada', sans-serif;
}
*/

.route-fade-enter-active,
.route-fade-leave-active {
  transition: opacity 0.2s ease-out;
}

.route-fade-enter-from,
.route-fade-leave-to {
  opacity: 0;
}

.route-fade-enter-to,
.route-fade-leave-from {
  opacity: 1;
}
</style>