<template>
  <div class="evento-detalle-view bg-brand-gris-claro min-h-screen font-sans">
    <div v-if="isLoading" class="flex justify-center items-center min-h-[calc(100vh-120px)] py-10">
      <div class="w-16 h-16 border-4 border-brand-camel border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else-if="error" class="text-center py-24 px-6">
      <h2 class="text-3xl font-playfair text-brand-negro mb-4">Error al cargar el evento</h2>
      <p class="text-gray-600 leading-relaxed max-w-md mx-auto">{{ error }}</p>
      <router-link to="/eventos"
        class="mt-8 inline-block bg-brand-camel text-white py-2 px-8 rounded-lg hover:bg-opacity-90 transition-all shadow-md">
        Volver a Eventos
      </router-link>
    </div>

    <AnimatedSection v-else-if="evento">
      <div class="evento-content">
        <section class="relative h-[45vh] md:h-[55vh] bg-brand-negro overflow-hidden">
          <img :src="evento.imagenUrl
            ? `${API_BASE_URL}${evento.imagenUrl}`
            : `https://placehold.co/1920x800/171C1E/E2E2E2?text=${encodeURIComponent(evento.nombre)}`"
            :alt="evento.nombre"
            class="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 hover:scale-105" />
          <div class="absolute inset-0 bg-gradient-to-t from-brand-negro/80 via-transparent to-transparent"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <h1 class="font-playfair text-4xl md:text-6xl text-white text-center px-6 drop-shadow-xl tracking-tight">
              {{ evento.nombre }}
            </h1>
          </div>
        </section>

        <div class="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
          <div class="grid gap-8 lg:grid-cols-[1fr_360px]">

            <section
              class="order-2 lg:order-1 bg-white rounded-2xl shadow-card border border-gray-100 p-6 md:p-10 space-y-8">
              <div
                class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-50 pb-6">
                <div class="space-y-1">
                  <p class="text-[10px] uppercase tracking-[0.2em] text-brand-camel font-bold">Fecha y Hora</p>
                  <p class="text-brand-negro font-medium">{{ evento.fechaFormateada }} — {{ evento.horaFormateada }}</p>
                </div>
                <div v-if="evento.lugar" class="space-y-1">
                  <p class="text-[10px] uppercase tracking-[0.2em] text-brand-camel font-bold text-right">Ubicación</p>
                  <p class="flex items-center gap-2 text-brand-negro font-medium">
                    <MapPinIcon class="w-4 h-4 text-brand-camel" /> {{ evento.lugar }}
                  </p>
                </div>
              </div>

              <div class="space-y-6">
                <h2 class="font-playfair text-3xl text-brand-negro border-l-4 border-brand-camel pl-4">Descripción del
                  Evento</h2>
                <div v-if="evento.descripcion"
                  class="prose prose-slate max-w-none text-gray-700 leading-relaxed font-sans text-base"
                  v-html="evento.descripcion"></div>
                <p v-else class="text-gray-500 italic">No hay descripción disponible para este evento.</p>
              </div>

              <div v-if="evento.link_compra" class="pt-4">
                <a :href="evento.link_compra" target="_blank" rel="noopener noreferrer"
                  class="text-sm font-bold text-brand-borgona hover:underline flex items-center gap-2">
                  Sitio oficial del evento
                  <ArrowRightIcon class="w-4 h-4" />
                </a>
              </div>
            </section>

            <aside class="order-1 lg:order-2">
              <div
                class="bg-white rounded-2xl shadow-card border border-gray-100 p-6 md:p-8 space-y-6 lg:sticky lg:top-24 h-fit">
                <div class="space-y-2">
                  <span class="text-[9px] uppercase tracking-[0.4em] text-gray-400 font-bold">Entradas</span>
                  <h3 class="text-2xl font-playfair text-brand-negro">Compra tu lugar</h3>
                  <p class="text-xs text-gray-500 leading-relaxed">
                    Asegura tu lugar mediante Mercado Pago. Se requiere inicio de sesión.
                  </p>
                </div>

                <div v-if="ticketOptions.length" class="space-y-5">
                  <div class="space-y-2">
                    <label class="text-[10px] uppercase font-bold text-gray-400 tracking-widest px-1">Tipo de
                      entrada</label>
                    <select v-model.number="selectedTicketId"
                      class="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-brand-camel focus:ring-1 focus:ring-brand-camel outline-none transition-all cursor-pointer">
                      <option v-for="ticket in ticketOptions" :key="ticket.id" :value="ticket.id">
                        {{ ticket.label }} · {{ formatPrice(ticket.price) }}
                      </option>
                    </select>
                  </div>

                  <div class="space-y-2">
                    <label class="text-[10px] uppercase font-bold text-gray-400 tracking-widest px-1">Cantidad</label>
                    <select v-model.number="ticketQuantity"
                      class="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-brand-camel focus:ring-1 focus:ring-brand-camel outline-none transition-all cursor-pointer">
                      <option v-for="qty in quantityOptions" :key="qty" :value="qty">{{ qty }} entradas</option>
                    </select>
                    <p class="text-[10px] text-brand-camel font-bold text-right px-1 tracking-tighter">
                      Disponibles: {{ selectedTicket?.stock ?? 0 }}
                    </p>
                  </div>

                  <div class="flex items-center justify-between border-t border-dashed border-gray-200 pt-4 px-1">
                    <p class="text-xs font-bold text-gray-400 uppercase">Total</p>
                    <p class="text-2xl font-bold text-brand-borgona">{{ totalPrice }}</p>
                  </div>

                  <button type="button"
                    class="w-full bg-brand-borgona text-white rounded-xl py-3.5 font-bold text-xs uppercase tracking-widest hover:bg-brand-negro transition-all shadow-md disabled:bg-gray-200 disabled:text-gray-400"
                    :disabled="isSubmittingOrder || !selectedTicket || !authStore.isAuthenticated"
                    @click="handleTicketCheckout">
                    <span v-if="isSubmittingOrder">Procesando...</span>
                    <span v-else>Ir a Mercado Pago</span>
                  </button>

                  <p v-if="!authStore.isAuthenticated"
                    class="text-center text-[10px] text-gray-400 font-bold uppercase tracking-tighter leading-relaxed">
                    Debes <button @click="uiStore.setShowLoginModal(true)" class="text-brand-camel underline">iniciar
                      sesión</button> para comprar.
                  </p>
                  <p v-if="checkoutError" class="text-center text-xs text-red-600 font-medium">{{ checkoutError }}</p>
                </div>

                <div v-else class="text-center py-6 bg-gray-50 rounded-xl">
                  <p class="text-xs text-gray-500 font-medium px-4 leading-relaxed italic">
                    No hay entradas activas para este evento en este momento.
                  </p>
                </div>
              </div>
            </aside>
          </div>

          <section class="mt-20">
            <div class="text-center mb-12 space-y-2">
              <h2 class="font-playfair text-4xl text-brand-negro">Testimonios</h2>
              <p class="text-xs text-gray-500 uppercase tracking-widest max-w-2xl mx-auto">
                Experiencias compartidas por nuestra comunidad.
              </p>
            </div>

            <div v-if="evento.testimonios && evento.testimonios.length > 0"
              class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="testimonio in evento.testimonios" :key="testimonio.id"
                class="bg-white p-6 rounded-2xl shadow-card border border-gray-50 flex flex-col justify-between transition-hover">
                <div class="space-y-4">
                  <div v-if="testimonio.foto_url" class="rounded-xl overflow-hidden h-40 mb-4">
                    <img :src="testimonio.foto_url" class="w-full h-full object-cover" />
                  </div>
                  <p class="text-gray-700 italic leading-relaxed font-sans">"{{ testimonio.comentario }}"</p>
                </div>
                <p class="text-xs text-brand-camel font-bold text-right mt-4 uppercase tracking-widest">
                  — {{ testimonio.nombre_usuario || 'Miembro de la comunidad' }}
                </p>
              </div>
            </div>
            <div v-else class="text-center py-10 bg-white/50 rounded-2xl border-2 border-dashed border-gray-200">
              <p class="text-gray-400 font-medium italic italic">Sé el primero en compartir tu testimonio sobre este
                evento.</p>
            </div>

            <div class="mt-12 bg-white rounded-2xl shadow-card border border-gray-100 p-6 md:p-10 max-w-3xl mx-auto">
              <div v-if="authStore.isAuthenticated">
                <h3 class="font-playfair text-2xl text-brand-negro mb-2">Deja tu Testimonio</h3>
                <p class="text-xs text-gray-500 mb-6 uppercase tracking-widest">Tu palabra edifica a otros.</p>
                <form @submit.prevent="handleTestimonioSubmit" class="space-y-6">
                  <textarea v-model="newTestimonioComentario" rows="4" placeholder="Escribe tu comentario aquí..."
                    class="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-camel outline-none transition-all text-sm font-sans"
                    :disabled="isSubmitting"></textarea>

                  <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div class="flex-1 space-y-2">
                      <label class="text-[10px] uppercase font-bold text-gray-400 tracking-widest block">Foto opcional
                        (Máx 4MB)</label>
                      <input ref="photoInput" type="file" accept="image/*"
                        class="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-brand-camel file:text-white file:uppercase file:tracking-widest cursor-pointer"
                        @change="handlePhotoChange" :disabled="isSubmitting" />
                    </div>
                    <button type="submit" :disabled="isSubmitting || !newTestimonioComentario.trim()"
                      class="bg-brand-camel text-white py-3 px-10 rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-all shadow-md">
                      {{ isSubmitting ? 'Enviando...' : 'Enviar Testimonio' }}
                    </button>
                  </div>

                  <div v-if="photoPreviewUrl" class="relative mt-4 inline-block group">
                    <img :src="photoPreviewUrl"
                      class="h-32 rounded-xl object-cover border border-brand-camel shadow-sm" />
                    <button type="button"
                      class="absolute -top-2 -right-2 bg-brand-borgona text-white w-6 h-6 rounded-full text-xs flex items-center justify-center shadow-lg"
                      @click="clearPhotoSelection">✕</button>
                  </div>
                </form>
              </div>
              <div v-else class="text-center py-4">
                <p class="text-gray-500 text-sm">
                  Debes <button @click="uiStore.setShowLoginModal(true)"
                    class="text-brand-camel font-bold underline">iniciar sesión</button> para participar.
                </p>
              </div>
            </div>
          </section>

          <section class="mt-20 pb-10">
            <h2 class="font-playfair text-4xl text-brand-negro text-center mb-10 italic">Galería del Evento</h2>
            <div v-if="evento.galeria && evento.galeria.length > 0"
              class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div v-for="(imagen, index) in evento.galeria" :key="imagen.id" :class="[
                'rounded-xl overflow-hidden group relative shadow-sm border border-white transition-all duration-500 hover:shadow-lg',
                index % 5 === 0 ? 'md:col-span-2 md:row-span-2' : ''
              ]">
                <img :src="`${API_BASE_URL}${imagen.url_imagen}`"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div v-if="imagen.descripcion"
                  class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p class="text-white text-[10px] uppercase font-bold tracking-widest">{{ imagen.descripcion }}</p>
                </div>
              </div>
            </div>
            <p v-else class="text-center text-gray-400 italic py-10 font-sans uppercase tracking-widest text-[10px]">No
              hay imágenes disponibles para mostrar.</p>
          </section>
        </div>
      </div>
    </AnimatedSection>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useUiStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { testimonioService } from '@/services/testimonioService';
import { MapPinIcon } from '@heroicons/vue/24/outline';
import AnimatedSection from '@/components/AnimatedSection.vue';

interface Testimonio {
  id: number | string;
  comentario: string;
  nombre_usuario?: string;
  usuario?: { name: string };
  foto_url?: string | null;
  approved?: boolean;
}

interface GaleriaImagen {
  id: number | string;
  url_imagen: string;
  descripcion?: string;
}

interface TicketProductData {
  id: number;
  price?: number | string;
  price_ars?: number | string;
  stock?: number;
  is_active?: boolean;
}

interface TicketOption {
  id: number;
  label: string;
  price: number;
  stock: number;
}

interface EventoDetallado {
  id: string | number;
  nombre: string;
  fecha: string; // 'YYYY-MM-DD HH:mm:ss'
  link_compra?: string | null;
  descripcion?: string | null;
  lugar?: string | null;
  imagenUrl?: string | null;
  general_product?: TicketProductData | null;
  vip_product?: TicketProductData | null;
  general_product_id?: number | null;
  vip_product_id?: number | null;
  testimonios?: Testimonio[];
  galeria?: GaleriaImagen[];
  // Para la UI
  fechaFormateada?: string;
  horaFormateada?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const route = useRoute();
const uiStore = useUiStore();
const authStore = useAuthStore();

const evento = ref<EventoDetallado | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

const newTestimonioComentario = ref('');
const isSubmitting = ref(false);
const MAX_PHOTO_SIZE_MB = 4;
const MAX_PHOTO_SIZE_BYTES = MAX_PHOTO_SIZE_MB * 1024 * 1024;
const selectedPhoto = ref<File | null>(null);
const photoPreviewUrl = ref<string | null>(null);
const photoInputRef = ref<HTMLInputElement | null>(null);

const API_URL = `${API_BASE_URL}/api`;
const MAX_TICKETS_PER_ORDER = 5;
const selectedTicketId = ref<number | null>(null);
const ticketQuantity = ref(1);
const checkoutError = ref<string | null>(null);
const isSubmittingOrder = ref(false);
const ticketProductsCache = ref<Record<number, TicketProductData>>({});
const formatPrice = (value: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);

const registerProduct = (product?: TicketProductData | null) => {
  if (!product?.id) return;
  ticketProductsCache.value = {
    ...ticketProductsCache.value,
    [product.id]: product,
  };
};

const ensureProductLoaded = async (productId?: number | null) => {
  if (!productId) return;
  if (ticketProductsCache.value[productId]) return;
  try {
    const response = await axios.get(`${API_URL}/products/${productId}`);
    registerProduct(response.data);
  } catch (err) {
    console.error('Error al cargar el producto de entrada:', err);
  }
};

const buildTicketOption = (
  label: string,
  productData?: TicketProductData | null,
  fallbackId?: number | null
): TicketOption | null => {
  const candidate =
    productData?.id
      ? productData
      : fallbackId
        ? ticketProductsCache.value[fallbackId]
        : undefined;
  if (!candidate) return null;
  if (candidate.is_active === false) return null;
  const stock = Number(candidate.stock ?? 0);
  if (stock <= 0) return null;
  const price = Number(candidate.price ?? candidate.price_ars ?? 0);
  if (!price || Number.isNaN(price)) return null;
  return {
    id: candidate.id,
    label,
    price,
    stock,
  };
};

const prepareTicketProducts = async (eventData: EventoDetallado) => {
  registerProduct(eventData.general_product);
  registerProduct(eventData.vip_product);
  const pending: Promise<void>[] = [];
  if (eventData.general_product_id && !ticketProductsCache.value[eventData.general_product_id]) {
    pending.push(ensureProductLoaded(eventData.general_product_id));
  }
  if (eventData.vip_product_id && !ticketProductsCache.value[eventData.vip_product_id]) {
    pending.push(ensureProductLoaded(eventData.vip_product_id));
  }
  if (pending.length) {
    await Promise.all(pending);
  }
};

const ticketOptions = computed<TicketOption[]>(() => {
  if (!evento.value) return [];
  const options: TicketOption[] = [];
  const generalOption = buildTicketOption(
    'Entrada General',
    evento.value.general_product,
    evento.value.general_product_id
  );
  const vipOption = buildTicketOption(
    'Entrada VIP',
    evento.value.vip_product,
    evento.value.vip_product_id
  );
  if (generalOption) options.push(generalOption);
  if (vipOption) options.push(vipOption);
  return options;
});

const selectedTicket = computed(() =>
  ticketOptions.value.find((ticket) => ticket.id === selectedTicketId.value) ?? ticketOptions.value[0] ?? null
);

const quantityOptions = computed(() => {
  const ticket = selectedTicket.value;
  if (!ticket) return [1];
  const maxAllowed = Math.min(MAX_TICKETS_PER_ORDER, ticket.stock);
  return Array.from({ length: maxAllowed }, (_, idx) => idx + 1);
});

watch(
  ticketOptions,
  (options) => {
    if (!selectedTicketId.value && options.length) {
      selectedTicketId.value = options[0].id;
    }
    if (selectedTicket.value && ticketQuantity.value > selectedTicket.value.stock) {
      ticketQuantity.value = Math.min(selectedTicket.value.stock, MAX_TICKETS_PER_ORDER);
    }
  },
  { immediate: true }
);

const totalPrice = computed(() => {
  if (!selectedTicket.value) return formatPrice(0);
  return formatPrice(selectedTicket.value.price * ticketQuantity.value);
});

const resetPhotoPreview = () => {
  if (photoPreviewUrl.value) {
    URL.revokeObjectURL(photoPreviewUrl.value);
    photoPreviewUrl.value = null;
  }
};

const clearPhotoSelection = () => {
  selectedPhoto.value = null;
  resetPhotoPreview();
  if (photoInputRef.value) {
    photoInputRef.value.value = '';
  }
};

const handlePhotoChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0] ?? null;
  if (!file) {
    clearPhotoSelection();
    return;
  }

  if (file.size > MAX_PHOTO_SIZE_BYTES) {
    uiStore.showSnackbar(`La foto supera los ${MAX_PHOTO_SIZE_MB} MB permitidos.`, 'error');
    input.value = '';
    clearPhotoSelection();
    return;
  }

  selectedPhoto.value = file;
  resetPhotoPreview();
  photoPreviewUrl.value = URL.createObjectURL(file);
};

const handleTicketCheckout = async () => {
  if (!selectedTicket.value || !evento.value) return;
  if (!authStore.isAuthenticated) {
    uiStore.setShowLoginModal(true);
    return;
  }
  isSubmittingOrder.value = true;
  checkoutError.value = null;
  try {
    const response = await axios.post(`${API_URL}/ticket-checkout`, {
      event_id: evento.value.id,
      product_id: selectedTicket.value.id,
      quantity: ticketQuantity.value,
    });
    if (response.data?.init_point) {
      window.location.href = response.data.init_point;
    } else {
      checkoutError.value = 'No se pudo iniciar el pago. Intenta nuevamente.';
    }
  } catch (err: any) {
    checkoutError.value = err.response?.data?.message || 'Error al iniciar el checkout.';
  } finally {
    isSubmittingOrder.value = false;
  }
};

const fetchEvento = async () => {
  const eventoId = route.params.id;
  if (!eventoId) {
    error.value = "ID de evento no proporcionado.";
    isLoading.value = false;
    return;
  }

  try {
    isLoading.value = true;
    const response = await axios.get(`https://api.labarcaministerio.com/api/eventos/${eventoId}`);
    const datosEvento = response.data as EventoDetallado;
    const fechaEvento = new Date(datosEvento.fecha.replace(/-/g, '/'));
    evento.value = {
      ...datosEvento,
      fechaFormateada: fechaEvento.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      horaFormateada: fechaEvento.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true })
    };
    prepareTicketProducts(datosEvento).catch((err) => {
      console.error('Error al preparar los datos de entradas:', err);
    });
  } catch (err: any) {
    console.error("Error al cargar detalle del evento:", err);
    error.value = err.response?.data?.message || err.message || "No se pudo cargar la información del evento.";
  } finally {
    isLoading.value = false;
  }
};

const handleTestimonioSubmit = async () => {
  if (!newTestimonioComentario.value.trim() || !evento.value) return;

  isSubmitting.value = true;
  try {
    const formData = new FormData();
    formData.append('id_evento', String(evento.value.id));
    formData.append('comentario', newTestimonioComentario.value.trim());
    if (selectedPhoto.value) {
      formData.append('foto', selectedPhoto.value);
    }

    await testimonioService.createTestimonio(formData);

    newTestimonioComentario.value = '';
    clearPhotoSelection();
    uiStore.showSnackbar('Gracias por tu testimonio. Será visible una vez aprobado.', 'success');
  } catch (err: any) {
    console.error('Error al enviar el testimonio:', err);
    uiStore.showSnackbar(err.response?.data?.message || 'Error al enviar el testimonio', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  uiStore.setRouteLoading(true);
  fetchEvento().finally(() => {
    uiStore.setRouteLoading(false);
  });
});

onBeforeUnmount(() => {
  resetPhotoPreview();
});

</script>

<style scoped>
.prose :where(p):not(:where([class~="not-prose"] *)) {
  margin-top: 0.8em;
  margin-bottom: 0.8em;
}

.neumorphic-shadow-soft {
  border-radius: 20px;
  /* Ajusta según tu preferencia */
  background: #E2E2E2;
  /* Tu brand-gris-claro */
  box-shadow: 8px 8px 16px #c5c5c5,
    /* Sombra más oscura */
    -8px -8px 16px #ffffff;
  /* Sombra más clara */
}
</style>
