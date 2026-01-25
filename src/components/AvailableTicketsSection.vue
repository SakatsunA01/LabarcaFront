<template>
  <section class="bg-brand-gris-claro py-4 md:py-8 px-6">
    <div class="container mx-auto max-w-7xl">

      <header class="flex flex-col md:flex-row md:items-end justify-between mb-3 border-b border-black/5 pb-2">
        <div class="space-y-1">
          <span class="text-brand-camel uppercase tracking-[0.4em] text-[10px] font-bold block">Próximas
            Experiencias</span>
          <h2 class="text-3xl md:text-4xl lg:text-5xl font-playfair text-brand-negro italic leading-tight">
            Entradas Disponibles
          </h2>
          <p class="text-gray-500 font-sans text-xs italic pt-1">
            Reserva tu lugar en nuestros próximos encuentros de adoración.
          </p>
        </div>
        <router-link to="/eventos"
          class="group mt-6 md:mt-0 flex items-center gap-2 text-brand-camel font-bold uppercase text-[10px] tracking-widest hover:text-brand-negro transition-colors">
          Explorar agenda completa
          <ArrowRightIcon class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </router-link>
      </header>

      <div v-if="isLoading" class="space-y-3">
        <div v-for="i in 2" :key="i" class="h-32 bg-white/40 animate-pulse rounded-2xl border border-white/60"></div>
      </div>

      <div v-else class="space-y-3 md:space-y-5">
        <article v-for="entry in availableEntries" :key="entry.event.id"
          class="bg-white rounded-2xl shadow-card border border-gray-50 overflow-hidden flex flex-col lg:flex-row transition-all hover:shadow-card-hover duration-500 group">
          <div class="w-full lg:w-72 h-32 lg:h-56 shrink-0 relative overflow-hidden">
            <img v-if="entry.event.imagenUrl" :src="`${baseUrl}${entry.event.imagenUrl}`"
              class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            <div v-else
              class="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 font-playfair italic">
              Sin imagen oficial
            </div>

            <div class="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-xl">
              <div class="text-center leading-none">
                <span class="block text-xl font-playfair font-bold text-brand-negro">
                  {{ entry.event.fechaFormateada?.split(' de ')[0] ?? '' }}
                </span>
                <span class="text-[9px] uppercase tracking-widest text-brand-camel font-bold">
                  {{ entry.event.fechaFormateada?.split(' de')[1]?.substring(0, 3) ?? '' }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex-1 p-4 md:p-5 flex flex-col justify-between">
            <div class="flex flex-col xl:flex-row justify-between items-start gap-5">
              <div class="space-y-2">
                <h3 class="text-2xl md:text-3xl font-playfair text-brand-negro italic leading-tight">
                  {{ entry.event.nombre }}
                </h3>
                <div class="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                  <MapPinIcon class="w-4 h-4 text-brand-camel" />
                  {{ entry.event.lugar || 'Lugar por confirmar' }}
                </div>
              </div>

              <div class="xl:text-right shrink-0">
                <span class="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-bold block mb-1">Inversión
                  Total</span>
                <span class="text-2xl md:text-3xl font-playfair text-brand-borgona italic leading-none">
                  {{ formattedTotalFor(entry) }}
                </span>
              </div>
            </div>

            <div class="mt-3 flex flex-wrap items-end gap-3 border-t border-gray-50 pt-3">
              <div class="flex-1 min-w-[180px] space-y-2">
                <label class="text-[9px] uppercase tracking-widest font-bold text-gray-400 flex items-center gap-2">
                  <TicketIcon class="w-3 h-3" /> Tipo de Experiencia
                </label>
                <div class="relative group/select">
                  <select v-model="stateFor(entry.event.id).ticketId"
                    class="w-full bg-brand-gris-claro/50 border border-transparent rounded-2xl px-4 py-3 text-sm font-medium focus:bg-white focus:border-brand-camel/30 outline-none transition-all cursor-pointer appearance-none">
                    <option v-for="t in entry.tickets" :key="t.id" :value="t.id">
                      {{ t.label }} — {{ formatPrice(t.price_ars) }}
                    </option>
                  </select>
                  <div class="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                    <ChevronDownIcon class="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div class="w-28 space-y-2">
                <label class="text-[9px] uppercase tracking-widest font-bold text-gray-400 flex items-center gap-2">
                  <UserGroupIcon class="w-3 h-3" /> Cant.
                </label>
                <select v-model.number="stateFor(entry.event.id).quantity"
                  class="w-full bg-brand-gris-claro/50 border border-transparent rounded-2xl px-4 py-3 text-sm font-medium focus:bg-white focus:border-brand-camel/30 outline-none transition-all cursor-pointer">
                  <option v-for="qty in quantityOptionsFor(entry.event.id, entry.tickets)" :key="qty" :value="qty">
                    {{ qty }}
                  </option>
                </select>
              </div>

              <button @click="handleCheckout(entry)" :disabled="submittingOrders[entry.event.id]"
                class="flex-1 lg:flex-none px-8 py-3 bg-brand-borgona hover:bg-brand-negro text-white rounded-2xl font-bold text-[9px] uppercase tracking-[0.2em] transition-all duration-500 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-3">
                <span v-if="!submittingOrders[entry.event.id]">Adquirir entrada</span>
                <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </button>
            </div>

            <p v-if="checkoutErrors[entry.event.id]"
              class="mt-4 text-[10px] text-red-500 italic font-bold uppercase tracking-widest">
              {{ checkoutErrors[entry.event.id] }}
            </p>
          </div>
        </article>
      </div>

      <div v-if="!availableEntries.length && !isLoading"
        class="text-center py-7 bg-white rounded-3xl border-2 border-dashed border-gray-100 shadow-card">
        <TicketIcon class="h-8 w-8 text-gray-200 mx-auto mb-2" />
        <p class="text-xl font-playfair text-brand-negro italic">Sin cupos disponibles</p>
        <p class="text-[9px] uppercase tracking-widest text-gray-400 mt-2">Vuelve pronto para nuevas fechas y preventas.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ChevronDownIcon } from '@heroicons/vue/24/outline';
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';
import { ArrowRightIcon, SparklesIcon, TicketIcon, UserGroupIcon, CurrencyDollarIcon, CalendarDaysIcon } from '@heroicons/vue/24/outline';
import { MapPinIcon } from '@heroicons/vue/24/solid';

interface TicketProduct {
  id: number;
  name: string;
  price_ars: number;
  stock: number;
  is_active: boolean;
}

interface EventEntry {
  id: number | string;
  nombre: string;
  fecha: string;
  lugar?: string | null;
  imagenUrl?: string | null;
  fechaFormateada?: string;
  horaFormateada?: string;
  generalProduct?: TicketProduct | null;
  vipProduct?: TicketProduct | null;
  general_product_id?: number | null;
  vip_product_id?: number | null;
}

type FormState = {
  ticketId: number | null;
  quantity: number;
};

const events = ref<EventEntry[]>([]);
const products = ref<Record<number, TicketProduct>>({});
const isLoading = ref(true);
const formState = ref<Record<string, FormState>>({});
const submittingOrders = ref<Record<string, boolean>>({});
const checkoutErrors = ref<Record<string, string>>({});

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${baseUrl}/api`;
const uiStore = useUiStore();
const authStore = useAuthStore();
const MAX_TICKETS_PER_ORDER = 5;

const formatPrice = (value: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);

const parseDates = (event: EventEntry) => {
  const fecha = new Date(event.fecha.replace(/-/g, '/'));
  event.fechaFormateada = fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  event.horaFormateada = fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
};

interface AvailableEntryTicket {
  id: number;
  label: string;
  price_ars: number;
  stock: number;
}

interface AvailableEntry {
  event: EventEntry;
  tickets: AvailableEntryTicket[];
}

const availableEntries = computed<AvailableEntry[]>(() =>
  events.value
    .map((event) => {
      const tickets: AvailableEntryTicket[] = [];
      const pushTicket = (label: string, productId?: number | null) => {
        if (!productId) return;
        const product = products.value[productId];
        if (!product || !product.is_active || product.stock <= 0) return;
        tickets.push({
          id: product.id,
          label,
          price_ars: Number(product.price_ars),
          stock: product.stock,
        });
      };
      pushTicket('Entrada General', event.general_product_id ?? event.generalProduct?.id);
      pushTicket('Entrada VIP', event.vip_product_id ?? event.vipProduct?.id);
      return {
        event,
        tickets,
      };
    })
    .filter((entry) => entry.tickets.length)
);

const stateFor = (entryId: number | string) => {
  const key = String(entryId);
  if (!formState.value[key]) {
    const firstTicket = availableEntries.value.find((entry) => String(entry.event.id) === key)?.tickets[0];
    formState.value[key] = {
      ticketId: firstTicket?.id ?? null,
      quantity: 1,
    };
  }
  return formState.value[key];
};

watch(
  availableEntries,
  (entries) => {
    entries.forEach((entry) => {
      stateFor(entry.event.id);
    });
  },
  { immediate: true }
);

const getSelectedTicket = (entry: AvailableEntry) => {
  const state = stateFor(entry.event.id);
  return entry.tickets.find((ticket) => ticket.id === state.ticketId) || entry.tickets[0] || null;
};

const quantityOptionsFor = (entryId: number | string, tickets: { stock: number; id: number }[]) => {
  const state = stateFor(entryId);
  const selected = tickets.find((ticket) => ticket.id === state.ticketId) || tickets[0];
  if (!selected) return [1];
  const maxAllowed = Math.max(1, Math.min(MAX_TICKETS_PER_ORDER, selected.stock));
  return Array.from({ length: maxAllowed }, (_, idx) => idx + 1);
};

const formattedTotalFor = (entry: AvailableEntry) => {
  const state = stateFor(entry.event.id);
  const ticket = entry.tickets.find((item) => item.id === state.ticketId) || entry.tickets[0];
  if (!ticket) return formatPrice(0);
  const qty = state.quantity ?? 1;
  return formatPrice(ticket.price_ars * qty);
};

const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    const data: TicketProduct[] = response.data;
    products.value = data.reduce((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {} as Record<number, TicketProduct>);
  } catch (error) {
    console.error('Error al cargar entradas disponibles:', error);
  }
};

const fetchEvents = async () => {
  try {
    const response = await axios.get(`${API_URL}/eventos`);
    const data: EventEntry[] = response.data;
    data.forEach(parseDates);
    events.value = data;
  } catch (error) {
    console.error('No se pudieron cargar las entradas disponibles:', error);
  }
};

const handleCheckout = async (entry: AvailableEntry) => {
  const key = String(entry.event.id);
  if (!authStore.isAuthenticated) {
    uiStore.setShowLoginModal(true);
    return;
  }
  const ticket = getSelectedTicket(entry);
  if (!ticket) return;
  submittingOrders.value[key] = true;
  checkoutErrors.value[key] = '';
  try {
    const response = await axios.post(`${API_URL}/ticket-checkout`, {
      event_id: entry.event.id,
      product_id: ticket.id,
      quantity: formState.value[key]?.quantity ?? 1,
    });
    if (response.data?.init_point) {
      window.location.href = response.data.init_point;
    } else {
      checkoutErrors.value[key] = 'No se pudo iniciar el pago. Intentá nuevamente.';
    }
  } catch (error: any) {
    checkoutErrors.value[key] = error.response?.data?.message || 'Error al iniciar el checkout.';
  } finally {
    submittingOrders.value[key] = false;
  }
};

const loadData = async () => {
  isLoading.value = true;
  await Promise.all([fetchProducts(), fetchEvents()]);
  isLoading.value = false;
};

onMounted(loadData);
</script>
<style scoped>
.shadow-card { box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.05); }
.shadow-card-hover { box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.08); }
select { -webkit-appearance: none; -moz-appearance: none; appearance: none; }
</style>
