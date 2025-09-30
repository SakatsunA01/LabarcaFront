<template>
  <div
    class="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row transition-all duration-300 hover:shadow-2xl">
    <div class="md:w-1/3 lg:w-2/5 xl:w-1/3 h-48 md:h-auto relative">
      <img
:src="evento.imagenUrl
        ? `${API_BASE_URL}${evento.imagenUrl}`
        : `https://placehold.co/600x400/E2E2E2/171C1E?text=${encodeURIComponent(evento.nombre.substring(0, 10))}`"
        :alt="`Imagen de ${evento.nombre}`" class="w-full h-full object-cover" />
    </div>
    <div class="md:w-2/3 lg:w-3/5 xl:w-2/3 p-5 md:p-6 flex flex-col">
      <h3 class="text-xl lg:text-2xl font-bold text-brand-negro mb-1">
        {{ evento.nombre }}
      </h3>
      <p class="text-brand-camel text-sm md:text-base font-medium mb-2">
        <span class="font-semibold">{{ evento.fechaFormateada }}</span> - {{ evento.horaFormateada }}
      </p>
      <p v-if="evento.lugar" class="text-gray-600 text-sm mb-3">
        📍 {{ evento.lugar }}
      </p>
      <p v-if="evento.descripcion" class="text-gray-700 text-sm md:text-base mb-4 flex-grow leading-relaxed">
        {{ evento.descripcion.substring(0, 250) }}{{ evento.descripcion.length > 250 ? '...' : '' }}
      </p>
      <div v-else class="flex-grow"></div> <!-- Espaciador si no hay descripción -->

      <div class="mt-auto flex flex-col sm:flex-row gap-3 pt-3 border-t border-gray-200">
        <a
          v-if="evento.link_compra"
          :href="evento.link_compra"
          target="_blank"
          rel="noopener noreferrer"
          class="flex-1 text-center border border-brand-borgona text-brand-borgona py-2.5 px-5 rounded-md hover:bg-brand-borgona hover:text-white transition-colors text-sm font-medium"
        >
          Comprar Entradas
        </a>
        <router-link
          :to="`/eventos/${evento.id}`"
          class="flex-1 text-center bg-brand-borgona text-white py-2.5 px-5 rounded-md hover:bg-opacity-80 transition-colors text-sm font-medium"
          @click="prepararNavegacionDetalle"
        >
          Más Información
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  evento: any; // Deberías usar la interfaz Evento importada aquí también
}>();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import { useUiStore } from '@/stores/uiStore';
const uiStore = useUiStore();

const prepararNavegacionDetalle = async () => {
  // No es necesario esperar aquí si la navegación es inmediata,
  // el overlay se activará antes de que la ruta cambie si se configura en App.vue
  // o si se usa un manejador de clic como en los otros botones.
  // Por simplicidad, para router-link, el overlay se activará por los guardias de navegación si se implementan,
  // o por el efecto de carga de la nueva vista.
  // Si se quiere el overlay *antes* de que el router-link actúe, se debe convertir a botón + router.push
  // uiStore.showLoadingOverlay(); // Opcional, si se convierte a botón
};
</script>
