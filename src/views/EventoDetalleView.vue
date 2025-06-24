<template>
  <div class="evento-detalle-view bg-brand-gris-claro min-h-screen">
    <div v-if="isLoading" class="flex justify-center items-center min-h-[calc(100vh-120px)] py-10">
      <div class="w-20 h-20 border-4 border-brand-camel border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else-if="error" class="text-center py-16 md:py-24 px-6">
      <h2 class="text-3xl text-brand-negro mb-4 font-semibold">Error al cargar el evento</h2>
      <p class="text-gray-700 leading-relaxed max-w-md mx-auto">{{ error }}</p>
      <router-link to="/eventos"
        class="mt-6 inline-block bg-brand-camel text-white py-2 px-6 rounded-md hover:bg-opacity-80">
        Volver a Eventos
      </router-link>
    </div>

    <div v-else-if="evento" class="evento-content">
      <!-- Hero Section -->
      <section class="relative h-[45vh] md:h-[60vh] bg-brand-negro group">
        <img :src="evento.imagenUrl
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
          <div v-if="evento.descripcion" class="prose max-w-none text-gray-700 leading-loose"
            v-html="evento.descripcion"></div>
          <p v-else class="text-gray-500 italic">No hay descripción disponible para este evento.</p>
          <a v-if="evento.link_compra" :href="evento.link_compra" target="_blank" rel="noopener noreferrer"
            class="mt-8 inline-block bg-brand-camel text-white py-3 px-8 rounded-lg hover:bg-brand-negro hover:-translate-y-1 transition-all duration-300 text-lg font-medium shadow-sm hover:shadow-md">
            Comprar Entradas
          </a>
        </section>

        <!-- Testimonios -->
        <section class="mb-10 md:mb-16">
          <h2 class="text-3xl font-bold text-brand-negro mb-8 text-center">Testimonios</h2>
          <div v-if="evento.testimonios && evento.testimonios.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="testimonio in evento.testimonios" :key="testimonio.id"
              class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p class="text-gray-800 italic mb-3 leading-relaxed">"{{ testimonio.comentario }}"</p>
              <p class="text-sm text-brand-camel text-right font-medium">- {{ testimonio.nombre_usuario || 'Anónimo' }}
              </p>
            </div>
          </div>
          <p v-else class="text-center text-gray-600 italic py-6">Aún no hay testimonios para este evento. ¡Sé el
            primero!</p>

          <!-- Formulario Nuevo Testimonio (Deshabilitado) -->
          <div class="mt-10 p-6 md:p-8 bg-gray-50 rounded-xl border border-gray-200">
            <h3 class="text-xl font-semibold text-brand-negro mb-4">Deja tu Testimonio</h3>
            <form @submit.prevent>
              <textarea rows="4" placeholder="Escribe tu comentario aquí..."
                class="w-full p-3 border border-gray-300 rounded-md focus:ring-brand-camel focus:border-brand-camel transition-colors"
                disabled></textarea>
              <button type="submit"
                class="mt-4 bg-brand-camel text-white py-2 px-6 rounded-md opacity-50 cursor-not-allowed" disabled>
                Enviar Testimonio (Próximamente)
              </button>
            </form>
          </div>
        </section>

        <!-- Galería -->
        <section>
          <h2 class="text-3xl font-bold text-brand-negro mb-10 text-center">Galería del Evento</h2>
          <div v-if="evento.galeria && evento.galeria.length > 0" class="grid grid-cols-6 gap-3 md:gap-4">
            <div v-for="(imagen, index) in evento.galeria" :key="imagen.id"
              class="bg-gray-300 rounded-lg overflow-hidden group relative shadow-sm border border-brand-gris-claro/30"
              :class="[
                (index % 6 === 0 && evento.galeria.length > 1) ? 'col-span-3 row-span-2 aspect-video' :         // Imagen grande horizontal
                  (index % 6 === 1 && evento.galeria.length > 3) ? 'col-span-3 row-span-1 aspect-video' :         // Imagen mediana horizontal
                    (index % 6 === 2 && evento.galeria.length > 4) ? 'col-span-2 row-span-2 aspect-[3/4]' :        // Imagen alta
                      (index % 6 === 3 && evento.galeria.length > 5) ? 'col-span-2 row-span-1 aspect-square' :       // Cuadrada
                        (index % 6 === 4 && evento.galeria.length > 2) ? 'col-span-2 row-span-1 aspect-square' :       // Cuadrada
                          'col-span-3 sm:col-span-2 aspect-square' // Default
              ]">
              <img :src="`${API_BASE_URL}${imagen.url_imagen}`" :alt="imagen.descripcion || 'Imagen de la galería'"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <div v-if="imagen.descripcion"
                class="absolute bottom-0 left-0 right-0 bg-brand-negro bg-opacity-0 group-hover:bg-opacity-70 p-2 transition-all duration-300 opacity-0 group-hover:opacity-100">
                <p class="text-brand-gris-claro text-xs truncate">{{ imagen.descripcion }}</p>
              </div>
            </div>
          </div>
          <p v-else class="text-center text-gray-600 italic py-6">No hay imágenes en la galería para este evento.</p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useUiStore } from '@/stores/uiStore';
import { MapPinIcon } from '@heroicons/vue/24/outline';

interface Testimonio {
  id: number | string;
  comentario: string;
  nombre_usuario?: string;
  // usuario_id?: number;
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
const evento = ref<EventoDetallado | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  const eventoId = route.params.id;
  if (!eventoId) {
    error.value = "ID de evento no proporcionado.";
    isLoading.value = false;
    uiStore.setRouteLoading(false);
    return;
  }

  try {
    const response = await axios.get(`http://localhost:8000/api/eventos/${eventoId}`);
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
    uiStore.setRouteLoading(false);
  }
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
