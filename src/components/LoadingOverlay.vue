<template>
  <transition name="loading-overlay-fade">
    <div
v-if="isLoading"
      class="fixed inset-0 bg-brand-gris-claro flex items-center justify-center z-[9999] overflow-hidden">
      <!-- Opcional: Una barra de progreso muy sutil en la parte superior -->
      <!-- <div class="absolute top-0 left-0 h-1 bg-brand-camel animate-pulse-fast w-full"></div> -->
    </div>
  </transition>
</template>

<script setup lang="ts">
defineProps<{
  isLoading: boolean;
}>();
</script>

<style scoped>
.loading-overlay-fade-enter-active,
.loading-overlay-fade-leave-active {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  /* Transición más suave */
}

.loading-overlay-fade-enter-from,
.loading-overlay-fade-leave-to {
  opacity: 0;
}

/* Animación opcional para la barra de progreso */
/* @keyframes pulse-fast {
  0%, 100% { opacity: 0.7; transform: scaleX(0.1); transform-origin: left; }
  50% { opacity: 1; transform: scaleX(1); transform-origin: left; }
} */
/* .animate-pulse-fast {
  animation: pulse-fast 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
} */
</style>
