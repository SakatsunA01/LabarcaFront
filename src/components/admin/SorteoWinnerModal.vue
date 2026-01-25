<template>
  <transition name="modal-fade">
    <div
      v-if="show"
      tabindex="-1"
      class="fixed inset-0 bg-brand-negro bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-bold text-brand-negro">Ganador del sorteo</h2>
          <button class="text-gray-500 hover:text-brand-negro" @click="closeModal">Cerrar</button>
        </div>
        <div class="p-6 text-center space-y-4">
          <div class="mx-auto h-16 w-16 rounded-full bg-brand-camel/10 flex items-center justify-center">
            <span class="text-brand-camel text-2xl font-bold">OK</span>
          </div>
          <h3 class="text-2xl font-playfair text-brand-negro">
            {{ winnerName || 'Sin ganador' }}
          </h3>
          <p v-if="winnerEmail" class="text-sm text-gray-500">{{ winnerEmail }}</p>
          <p v-else class="text-sm text-gray-400">No se recibio email del ganador.</p>
        </div>
        <div class="px-6 pb-6 flex justify-end">
          <button
            type="button"
            class="bg-brand-camel text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors"
            @click="closeModal"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean;
  winnerName: string | null;
  winnerEmail: string | null;
}>();

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease-out;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
