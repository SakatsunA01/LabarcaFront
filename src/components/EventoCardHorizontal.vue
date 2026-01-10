<template>
  <div
    class="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row transition-all duration-300 hover:shadow-2xl">
    <div class="md:w-1/3 lg:w-2/5 xl:w-1/3 h-48 md:h-auto relative">
      <img
        :src="evento.imagenUrl
          ? `${API_BASE_URL}${evento.imagenUrl}`
          : `https://placehold.co/600x400/E2E2E2/171C1E?text=${encodeURIComponent(evento.nombre.substring(0, 10))}`"
        :alt="`Imagen de ${evento.nombre}`"
        class="w-full h-full object-cover" />
    </div>
    <div class="md:w-2/3 lg:w-3/5 xl:w-2/3 p-5 md:p-6 flex flex-col">
      <h3 class="text-xl lg:text-2xl font-bold text-brand-negro mb-1">
        {{ evento.nombre }}
      </h3>
      <p class="text-brand-camel text-sm md:text-base font-medium mb-2">
        <span class="font-semibold">{{ formattedDate }}</span>
        <span v-if="evento.horaFormateada" class="ml-2">{{ evento.horaFormateada }}</span>
      </p>
      <p v-if="evento.lugar" class="text-gray-600 text-sm mb-3">
        dY"? {{ evento.lugar }}
      </p>
      <p v-if="evento.descripcion" class="text-gray-700 text-sm md:text-base mb-4 flex-grow leading-relaxed">
        {{ evento.descripcion.substring(0, 250) }}{{ evento.descripcion.length > 250 ? '...' : '' }}
      </p>
      <div v-else class="flex-grow"></div>

      <div v-if="ticketBreakdown.length" class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div
          v-for="ticket in ticketBreakdown"
          :key="ticket.label"
          class="border border-gray-200 rounded-lg p-3 bg-gray-50 text-sm text-gray-700 flex flex-col gap-1">
          <span class="font-semibold text-gray-900">{{ ticket.label }}</span>
          <span class="text-brand-borgona font-bold">{{ ticket.displayPrice }}</span>
          <span class="text-xs" :class="ticket.stock > 0 ? 'text-green-600' : 'text-red-500'">
            {{ ticket.stock > 0 ? `Stock: ${ticket.stock}` : 'Agotado' }}
          </span>
        </div>
      </div>

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
import { computed, toRef } from 'vue';
import { useUiStore } from '@/stores/uiStore';

const props = defineProps<{
  evento: {
    id: number | string;
    nombre: string;
    fechaFormateada?: string;
    horaFormateada?: string;
    lugar?: string | null;
    descripcion?: string | null;
    imagenUrl?: string | null;
    link_compra?: string | null;
    general_product?: { price_ars?: number; stock?: number; is_active?: boolean };
    vip_product?: { price_ars?: number; stock?: number; is_active?: boolean };
  };
}>();

const evento = toRef(props, 'evento');
const uiStore = useUiStore();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const formattedDate = computed(() => evento.value.fechaFormateada ?? 'Fecha sin definir');

const ticketBreakdown = computed(() => {
  const entries: { label: string; displayPrice: string; stock: number }[] = [];
  const pushEntry = (label: string, product?: { price_ars?: number; stock?: number; is_active?: boolean }) => {
    if (!product || !product.is_active) return;
    const priceValue = Number(product.price_ars ?? 0);
    entries.push({
      label,
      displayPrice: formatPrice(priceValue),
      stock: product.stock ?? 0,
    });
  };

  pushEntry('Entrada General', evento.value.general_product);
  pushEntry('Entrada VIP', evento.value.vip_product);
  return entries;
});

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
};

const prepararNavegacionDetalle = () => {
  uiStore.setRouteLoading(true);
};
</script>
