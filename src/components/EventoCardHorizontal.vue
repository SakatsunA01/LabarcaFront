<template>
  <div
    class="bg-white rounded-2xl shadow-card overflow-hidden flex flex-col md:flex-row transition-all duration-500 hover:shadow-card-hover group border border-gray-100">
    <div class="md:w-1/3 lg:w-2/5 xl:w-[30%] h-56 md:h-auto relative overflow-hidden shrink-0">
      <img :src="evento.imagenUrl
        ? `${API_BASE_URL}${evento.imagenUrl}`
        : `https://placehold.co/600x400/F5EFE6/171C1E?text=${encodeURIComponent(evento.nombre.substring(0, 10))}`"
        :alt="evento.nombre"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div class="absolute top-4 left-4">
        <span
          class="bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest text-brand-negro shadow-sm">
          Evento
        </span>
      </div>
    </div>

    <div class="md:w-2/3 lg:w-3/5 xl:w-[70%] p-6 md:p-8 flex flex-col min-w-0">
      <div class="mb-4">
        <h3
          class="text-2xl lg:text-3xl font-playfair text-brand-negro mb-2 group-hover:text-brand-camel transition-colors truncate">
          {{ evento.nombre }}
        </h3>
        <div
          class="flex flex-wrap items-center gap-y-2 gap-x-6 text-[10px] uppercase tracking-[0.2em] font-bold text-brand-camel">
          <div class="flex items-center gap-2">
            <CalendarIcon class="w-4 h-4" />
            {{ formattedDate }}
            <span v-if="evento.horaFormateada" class="opacity-50">—</span>
            {{ evento.horaFormateada }}
          </div>
          <div v-if="evento.lugar" class="flex items-center gap-2">
            <MapPinIcon class="w-4 h-4" />
            {{ evento.lugar }}
          </div>
        </div>
      </div>

      <div v-if="evento.descripcion"
        class="text-gray-500 text-sm md:text-base mb-6 flex-grow leading-relaxed font-sans line-clamp-2 md:line-clamp-3 description-container overflow-hidden"
        v-html="evento.descripcion"></div>
      <div v-else class="flex-grow"></div>

      <div v-if="ticketBreakdown.length" class="flex flex-wrap gap-4 mb-6 pt-2">
        <div v-for="ticket in ticketBreakdown" :key="ticket.label"
          class="flex flex-col border-l-2 border-brand-camel/20 pl-4 py-1">
          <span class="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-1">{{ ticket.label }}</span>
          <span class="text-lg font-bold text-brand-borgona leading-none">{{ ticket.displayPrice }}</span>
          <span class="text-[9px] mt-1 font-bold" :class="ticket.stock > 0 ? 'text-green-600/70' : 'text-red-400'">
            {{ ticket.stock > 0 ? `${ticket.stock} disponibles` : 'Agotado' }}
          </span>
        </div>
      </div>

      <div class="mt-auto flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-50">
        <router-link :to="`/eventos/${evento.id}`"
          class="flex-1 text-center bg-brand-borgona text-white py-3 px-6 rounded-xl hover:bg-brand-negro transition-all duration-300 text-[10px] font-bold uppercase tracking-[0.2em] shadow-md active:scale-95"
          @click="prepararNavegacionDetalle">
          Más Información
        </router-link>

        <a v-if="evento.link_compra" :href="evento.link_compra" target="_blank" rel="noopener noreferrer"
          class="flex-1 text-center border border-gray-200 text-gray-600 py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-300 text-[10px] font-bold uppercase tracking-[0.2em] active:scale-95">
          Comprar Entradas
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue';
import { useUiStore } from '@/stores/uiStore';
import { CalendarIcon, MapPinIcon } from '@heroicons/vue/24/outline';

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

  pushEntry('General', evento.value.general_product);
  pushEntry('VIP', evento.value.vip_product);
  return entries;
});

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
};

const prepararNavegacionDetalle = () => {
  uiStore.setRouteLoading(true);
};
</script>

<style scoped>
/* Evita que los párrafos internos de v-html rompan el line-clamp */
.description-container :deep(p) {
  display: inline;
  margin: 0;
  padding: 0;
}

.description-container :deep(p + p)::before {
  content: " ";
  display: inline;
}

/* Forzado de line-clamp para navegadores que no lo soportan nativamente */
.description-container {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.shadow-card {
  box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.05);
}

.shadow-card-hover {
  box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.07);
}
</style>