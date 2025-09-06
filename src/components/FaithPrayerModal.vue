<template>
  <transition name="modal-fade">
    <div v-if="show" tabindex="-1"
      class="fixed inset-0 bg-brand-negro bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      @click.self="close">
      <div
        class="bg-brand-gris-claro p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all max-h-[90vh] overflow-y-auto text-brand-negro text-center">
        <button @click="close"
          class="absolute top-4 right-4 text-gray-400 hover:text-brand-negro transition-colors">
          <XMarkIcon class="h-6 w-6" />
        </button>
        <h2 class="text-2xl font-bold mb-4 font-display">¡Bienvenido a la Familia!</h2>
        <p class="text-sm text-gray-600 mb-6">Gracias por registrarte. Te invitamos a leer esta oración de fe:</p>

        <div class="bg-white p-6 rounded-lg shadow-inner border border-gray-200 text-left mb-6">
          <p class="italic text-sm mb-3">Santiago 5:15-16 (Reina-Valera 1960)</p>
          <p class="mb-4 text-base leading-relaxed">
            <span class="font-semibold">15</span> Y la oración de fe salvará al enfermo, y el Señor lo levantará; y si hubiere cometido pecados, le serán perdonados.
            <span class="font-semibold">16</span> Confesaos vuestras ofensas unos a otros, y orad unos por otros, para que seáis sanados. La oración eficaz del justo puede mucho.
          </p>
          <hr class="my-4 border-brand-camel/30">
          <p class="text-base leading-relaxed">
            Señor Jesús, vengo ante ti con un corazón abierto. Reconozco mis errores y mi necesidad de Ti. Creo que eres el Hijo de Dios, que moriste en la cruz por mis pecados y resucitaste. Te recibo en mi corazón, te invito a ser mi Señor y Salvador. Te agradezco por tu amor y la salvación que me ofreces. Ayúdame a vivir una vida que te honre. Amén.
          </p>
        </div>

        <button @click="close"
          class="bg-brand-camel text-white py-2 px-6 rounded-md hover:bg-opacity-90 transition-colors font-medium shadow-md">
          Amén
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline';

defineProps<{
  show: boolean;
}>();

const emit = defineEmits(['close']);

const close = () => {
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
