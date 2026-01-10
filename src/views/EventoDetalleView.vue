<template>
  <div class="evento-detalle-view bg-brand-gris-claro min-h-screen">
    <div v-if="isLoading" class="flex justify-center items-center min-h-[calc(100vh-120px)] py-10">
      <div class="w-20 h-20 border-4 border-brand-camel border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else-if="error" class="text-center py-16 md:py-24 px-6">
      <h2 class="text-3xl text-brand-negro mb-4 font-semibold">Error al cargar el evento</h2>
      <p class="text-gray-700 leading-relaxed max-w-md mx-auto">{{ error }}</p>
      <router-link
to="/eventos"
        class="mt-6 inline-block bg-brand-camel text-white py-2 px-6 rounded-md hover:bg-opacity-80">
        Volver a Eventos
      </router-link>
    </div>
    <AnimatedSection v-else-if="evento">
      <div class="evento-content">
        <!-- Hero Section -->
        <section class="relative h-[45vh] md:h-[60vh] bg-brand-negro group">
          <img
  :src="evento.imagenUrl
            ? `${API_BASE_URL}${evento.imagenUrl}`
            : `https://placehold.co/1920x800/171C1E/E2E2E2?text=${encodeURIComponent(evento.nombre)}`"
            :alt="`Imagen de ${evento.nombre}`"
            class="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-60 transition-opacity duration-300" />
          <div class="absolute inset-0 flex items-center justify-center">
            <h1 class="text-4xl md:text-6xl font-bold text-brand-gris-claro text-center px-4 drop-shadow-lg">
              {{ evento.nombre }}
            </h1>
          </div>
        </section>

        <div class="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          <!-- Detalles y Descripción -->
          <section class="mb-12 md:mb-16 p-6 md:p-8 bg-white rounded-xl shadow-md border border-gray-200">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 text-sm text-gray-600">
              <p><span class="font-semibold text-brand-camel">{{ evento.fechaFormateada }}</span> - {{
                evento.horaFormateada }}</p>
              <p v-if="evento.lugar" class="mt-1 sm:mt-0 flex items-center">
                <MapPinIcon class="w-4 h-4 mr-1 text-brand-camel" /> {{ evento.lugar }}
              </p>
            </div>
            <h2 class="text-2xl font-semibold text-brand-negro mb-4">Descripción del Evento</h2>
            <div
  v-if="evento.descripcion" class="prose max-w-none text-gray-700 leading-loose"
              v-html="evento.descripcion"></div>
            <p v-else class="text-gray-500 italic">No hay descripción disponible para este evento.</p>
            <a
  v-if="evento.link_compra" :href="evento.link_compra" target="_blank" rel="noopener noreferrer"
              class="mt-8 inline-block bg-brand-camel text-white py-3 px-8 rounded-lg hover:bg-brand-negro hover:-translate-y-1 transition-all duration-300 text-lg font-medium shadow-sm hover:shadow-md">
              Comprar Entradas
            </a>
          </section>

          <!-- Testimonios -->
          <section class="mb-10 md:mb-16">
            <h2 class="text-3xl font-bold text-brand-negro mb-4 text-center">Testimonios</h2>
            <p class="text-center text-sm text-gray-500 max-w-3xl mx-auto mb-6">
              Los testimonios se muestran a la comunidad después de ser aprobados. Si adjuntas una foto, la publicaremos
              cuando un moderador valide su contenido.
            </p>
            <div v-if="evento.testimonios && evento.testimonios.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
  v-for="testimonio in evento.testimonios" :key="testimonio.id"
                class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div v-if="testimonio.foto_url" class="mb-4">
                  <img
                    :src="testimonio.foto_url"
                    alt="Foto del testimonio"
                    class="w-full h-40 object-cover rounded-md border border-gray-200"
                  />
                </div>
                <p class="text-gray-800 italic mb-3 leading-relaxed">"{{ testimonio.comentario }}"</p>
                <p class="text-sm text-brand-camel text-right font-medium">
                  - {{ testimonio.nombre_usuario || 'Ánimo' }}
                </p>
              </div>
            </div>
            <p v-else class="text-center text-gray-600 italic py-6">
              Aún no hay testimonios para este evento. ¡Sé el primero!
            </p>

            <!-- Formulario Nuevo Testimonio -->
            <div v-if="authStore.isAuthenticated" class="mt-10 p-6 md:p-8 bg-gray-50 rounded-xl border border-gray-200">
              <h3 class="text-xl font-semibold text-brand-negro mb-2">Deja tu Testimonio</h3>
              <p class="text-sm text-gray-500 mb-5">
                Puedes adjuntar una foto (máximo {{ MAX_PHOTO_SIZE_MB }} MB). En celulares también puedes tomarla en el momento.
              </p>
              <form @submit.prevent="handleTestimonioSubmit">
                <textarea
                  v-model="newTestimonioComentario"
                  rows="4"
                  placeholder="Escribe tu comentario aquí..."
                  class="w-full p-3 border border-gray-300 rounded-md focus:ring-brand-camel focus:border-brand-camel transition-colors"
                  :disabled="isSubmitting"></textarea>
                <div class="mt-4 flex flex-col gap-2">
                  <label class="text-sm font-semibold text-brand-negro">Foto opcional</label>
                  <input
                    ref="photoInput"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-camel file:text-white"
                    @change="handlePhotoChange"
                    :disabled="isSubmitting"
                  />
                  <p class="text-xs text-gray-500">
                    Máximo {{ MAX_PHOTO_SIZE_MB }} MB por foto y puedes abrir la cámara del celular para capturarla al instante.
                  </p>
                  <div v-if="photoPreviewUrl" class="relative">
                    <img :src="photoPreviewUrl" alt="Vista previa" class="h-32 w-full object-cover rounded-md border border-dashed border-brand-gris-claro" />
                    <button
                      type="button"
                      class="absolute top-1 right-1 rounded-full bg-black/70 text-xs text-white px-3 py-1 hover:bg-black/80"
                      @click="clearPhotoSelection"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  :disabled="isSubmitting || !newTestimonioComentario.trim()"
                  class="mt-4 bg-brand-camel text-white py-2 px-6 rounded-md hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                  <span v-if="isSubmitting">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  <span v-else>Enviar Testimonio</span>
                </button>
              </form>
            </div>
            <div v-else class="mt-10 text-center">
              <p class="text-gray-600">
                Debes
                <button @click="uiStore.setShowLoginModal(true)" class="text-brand-camel hover:underline font-semibold">
                  iniciar sesión
                </button>
                para dejar un testimonio.
              </p>
            </div>
          </section>

          <!-- Galería -->
          <section>
            <h2 class="text-3xl font-bold text-brand-negro mb-10 text-center">Galería del Evento</h2>
            <div v-if="evento.galeria && evento.galeria.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4 [grid-auto-flow:dense]">
              <div
  v-for="(imagen, index) in evento.galeria" :key="imagen.id"
                :class="[
                  'bg-gray-300 rounded-lg overflow-hidden group relative shadow-sm border border-brand-gris-claro/30',
                  index % 4 === 0 ? 'md:row-span-2' : ''
                ]">
                <img
  :src="`${API_BASE_URL}${imagen.url_imagen}`" :alt="imagen.descripcion || 'Imagen de la galería'"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div
  v-if="imagen.descripcion"
                  class="absolute bottom-0 left-0 right-0 bg-brand-negro bg-opacity-0 group-hover:bg-opacity-70 p-2 transition-all duration-300 opacity-0 group-hover:opacity-100">
                  <p class="text-brand-gris-claro text-xs truncate">{{ imagen.descripcion }}</p>
                </div>
              </div>
            </div>
            <p v-else class="text-center text-gray-600 italic py-6">No hay imágenes en la galería para este evento.</p>
          </section>
        </div>
      </div>
    </AnimatedSection>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
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

interface EventoDetallado {
  id: string | number;
  nombre: string;
  fecha: string; // 'YYYY-MM-DD HH:mm:ss'
  link_compra?: string | null;
  descripcion?: string | null;
  lugar?: string | null;
  imagenUrl?: string | null;
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
    const datosEvento = response.data;
    const fechaEvento = new Date(datosEvento.fecha.replace(/-/g, '/'));
    evento.value = {
      ...datosEvento,
      fechaFormateada: fechaEvento.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      horaFormateada: fechaEvento.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true })
    };
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
