<template>
  <transition name="modal-fade">
    <div
v-if="show"
      class="fixed inset-0 bg-brand-negro bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      @click.self="close">
      <div class="bg-brand-gris-claro p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-lg transform transition-all">
        <div class="flex justify-between items-start">
          <h2 class="text-2xl font-bold text-brand-negro mb-4">Detalle de la Petición</h2>
          <button
class="text-gray-400 hover:text-brand-negro transition-colors"
            @click="close">
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>
        
        <div v-if="request" class="mt-4 text-left">
          <p class="text-sm text-gray-500 mb-2"><strong>Usuario:</strong> {{ request.user?.name || 'Anónimo' }}</p>
          <div class="text-brand-negro whitespace-pre-wrap bg-white p-4 rounded-md border border-gray-200">
            {{ request.request_text }}
          </div>
        </div>

        <div class="mt-6 text-right">
           <button
class="bg-brand-camel text-white py-2 px-5 rounded-md hover:bg-opacity-90 transition-colors font-medium"
            @click="close">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline';

// Define la estructura del objeto de la petición que se espera
interface PrayerRequest {
  id: number;
  user: { name: string } | null;
  request_text: string;
}

defineProps<{
  show: boolean;
  request: PrayerRequest | null;
}>();

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};
</script>

<style scoped>
/* Estilos de transición copiados de LoginModal.vue para consistencia */
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.3s ease-out;
}

.modal-fade-enter-active .transform,
.modal-fade-leave-active .transform {
    transition: transform 0.3s ease-out;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-fade-enter-from .transform,
.modal-fade-leave-to .transform {
    transform: scale(0.95) translateY(-20px);
}
</style>
