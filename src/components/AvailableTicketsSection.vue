<template>
  <section class="bg-brand-cream py-10 lg:py-12 px-2 sm:px-4 lg:px-6">
    <div class="container mx-auto max-w-7xl space-y-4">

      <div class="flex flex-col gap-2 border-b border-black/10 pb-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 class="text-3xl md:text-4xl font-playfair text-brand-negro leading-tight">Entradas disponibles</h2>
          <p class="text-gray-600 font-sans text-sm tracking-wide mt-1">
            Reserva tu lugar en nuestros próximos encuentros.
          </p>
        </div>
        <router-link to="/eventos"
          class="hidden md:inline-flex items-center gap-2 bg-brand-camel hover:opacity-90 text-white px-5 py-2 rounded-lg text-sm transition-all shadow-sm">
          Ver todos los eventos
          <ArrowRightIcon class="w-4 h-4" />
        </router-link>
      </div>

      <div v-if="isLoading" class="grid gap-6 sm:gap-8">
        <div v-for="i in 2" :key="i" class="h-48 bg-white/50 animate-pulse rounded-xl"></div>
      </div>

      <div v-else class="space-y-4">
        <article v-for="entry in availableEntries" :key="entry.event.id"
          class="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden flex flex-col md:flex-row transition-all hover:shadow-card-hover duration-300">

          <div class="w-full md:w-72 h-48 md:h-auto shrink-0 relative">
            <img v-if="entry.event.imagenUrl" :src="`${baseUrl}${entry.event.imagenUrl}`"
              class="w-full h-full object-cover" />
            <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
              Sin imagen
            </div>

            <div
              class="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded text-brand-negro text-xs font-bold shadow-sm">
              <div class="flex items-center gap-1 text-[11px] font-bold">
                <CalendarDaysIcon class="w-3 h-3 text-brand-camel" />
                <span>{{ entry.event.fechaFormateada?.split(' de ')[0] ?? '' }}</span>
                <span class="text-[10px] uppercase text-gray-500">
                  {{ entry.event.fechaFormateada?.split(' de')[1]?.substring(0,3) ?? '' }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex-1 p-3 flex flex-col justify-between">
            <div class="flex flex-col lg:flex-row justify-between gap-4">
              <div class="space-y-1">
                <h3 class="text-2xl font-playfair text-brand-negro">{{ entry.event.nombre }}</h3>
                <div class="flex items-center gap-2 text-gray-500 text-sm font-sans">
                  <MapPinIcon class="w-4 h-4 text-brand-camel" />
                  {{ entry.event.lugar || 'Lugar por confirmar' }}
                </div>
              </div>

              <div class="lg:text-right shrink-0">
                <span class="flex items-center gap-1 text-[10px] uppercase tracking-widest text-gray-400 block font-bold">
                  <CurrencyDollarIcon class="w-3 h-3 text-brand-camel" />
                  <span>Total</span>
                </span>
                <span class="text-2xl font-bold text-brand-borgona">{{ formattedTotalFor(entry) }}</span>
              </div>
            </div>

            <div class="mt-2 flex flex-wrap items-end gap-3 border-t border-gray-50 pt-3">
              <div class="flex-1 min-w-[140px] space-y-1">
                <label class="flex items-center gap-1 text-[10px] uppercase font-bold text-gray-400 font-sans">
                  <TicketIcon class="w-3.5 h-3.5 text-brand-camel" />
                  Tipo de Entrada
                </label>
                <select v-model="stateFor(entry.event.id).ticketId"
                  class="w-full bg-gray-50 border border-brand-gris-claro rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-brand-camel outline-none transition-all cursor-pointer">
                  <option v-for="t in entry.tickets" :key="t.id" :value="t.id">
                    {{ t.label }} ({{ formatPrice(t.price_ars) }})
                  </option>
                </select>
              </div>

              <div class="w-24 space-y-1">
                <label class="flex items-center gap-1 text-[10px] uppercase font-bold text-gray-400 font-sans">
                  <UserGroupIcon class="w-3.5 h-3.5 text-brand-camel" />
                  Cant.
                </label>
                <select v-model.number="stateFor(entry.event.id).quantity"
                  class="w-full bg-gray-50 border border-brand-gris-claro rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-brand-camel outline-none transition-all cursor-pointer">
                  <option v-for="qty in quantityOptionsFor(entry.event.id, entry.tickets)" :key="qty" :value="qty">
                    {{ qty }}
                  </option>
                </select>
              </div>

              <button @click="handleCheckout(entry)" :disabled="submittingOrders[entry.event.id]"
                class="flex-1 md:flex-none px-8 py-2.5 bg-brand-borgona hover:opacity-90 text-white rounded-lg font-bold text-sm transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-wider">
                <span v-if="!submittingOrders[entry.event.id]">Comprar</span>
                <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </button>
            </div>

            <p v-if="checkoutErrors[entry.event.id]" class="mt-2 text-xs text-red-500 italic font-sans">
              {{ checkoutErrors[entry.event.id] }}
            </p>
          </div>
        </article>
      </div>

      <div v-if="!availableEntries.length && !isLoading"
        class="text-center py-8 bg-white rounded-2xl border border-dashed border-brand-gris-claro shadow-card">
        <TicketIcon class="h-6 w-6 text-brand-camel mx-auto mb-3" />
        <p class="text-gray-400 font-playfair text-lg italic">No hay entradas disponibles por el momento.</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
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
"@
