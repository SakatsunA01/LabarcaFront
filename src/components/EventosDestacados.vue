<template>
  <section class="py-16 lg:py-20 px-2 sm:px-4 lg:px-6 bg-white">
    <div class="container mx-auto max-w-7xl">
      <h2 class="text-3xl md:text-4xl font-bold text-brand-negro text-center mb-6 md:mb-8 relative">
        Nuestros Próximos Eventos
      </h2>
      <div v-if="isLoading" class="text-center py-10">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-camel"></div>
        <p class="mt-4 text-brand-negro">Cargando eventos...</p>
      </div>
      <div v-else-if="error" class="text-center py-10 text-red-500">
        <p>{{ error }}</p>
      </div>
      <div v-else-if="proximosEventos.length > 0" class="flex flex-col lg:flex-row gap-8 items-stretch">
        <!-- Evento Principal -->
        <div
          class="lg:w-7/12 bg-white shadow-xl rounded-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl">
          <img
            :src="proximosEventos[0].imagenUrl ? `${API_BASE_URL}${proximosEventos[0].imagenUrl}` : 'https://placehold.co/800x450/3498DB/FFFFFF?text=Evento'"
            :alt="proximosEventos[0].nombre" class="w-full h-64 md:h-80 lg:h-96 object-cover" />
          <div class="p-4 md:p-6 flex flex-col flex-grow">
            <h3 class="text-2xl xl:text-3xl font-semibold text-brand-negro mb-2">
              {{ proximosEventos[0].nombre }}
            </h3>
            <p class="text-brand-camel text-sm md:text-base mb-3">{{ proximosEventos[0].fechaFormateada }}</p>
            <p class="text-gray-700 text-base md:text-lg mb-6 flex-grow">
              {{ proximosEventos[0].descripcion?.substring(0, 150) + (proximosEventos[0].descripcion &&
                proximosEventos[0].descripcion.length > 150 ? '...' : '') }}
            </p>
            <router-link
:to="`/eventos/${proximosEventos[0].id}`"
              class="mt-auto self-start bg-brand-borgona text-white py-2.5 px-7 rounded-md hover:bg-opacity-80 transition-colors text-base md:text-lg font-medium">
              Más Información
            </router-link>
          </div>
        </div>

        <!-- Evento Secundario y Botón Todos los Eventos -->
        <div class="lg:w-5/12 flex flex-col gap-8">
          <div
v-if="proximosEventos.length > 1"
            class="bg-white shadow-xl rounded-lg overflow-hidden flex flex-col flex-grow transition-all duration-300 hover:shadow-2xl">
            <img
              :src="proximosEventos[1].imagenUrl ? `${API_BASE_URL}${proximosEventos[1].imagenUrl}` : 'https://placehold.co/800x450/E91E63/FFFFFF?text=Evento'"
              :alt="proximosEventos[1].nombre" class="w-full h-40 md:h-48 object-cover" />
            <div class="p-4 md:p-5 flex flex-col flex-grow">
              <h4 class="text-xl font-semibold text-brand-negro mb-1">
                {{ proximosEventos[1].nombre }}
              </h4>
              <p class="text-brand-camel text-sm mb-3">{{ proximosEventos[1].fechaFormateada }}</p>
              <p class="text-gray-600 text-sm mb-4 flex-grow">
                {{ proximosEventos[1].descripcion?.substring(0, 80) + (proximosEventos[1].descripcion &&
                  proximosEventos[1].descripcion.length > 80 ? '...' : '') }}
              </p>
              <router-link
:to="`/eventos/${proximosEventos[1].id}`"
                class="mt-auto self-start text-brand-verde-oscuro hover:text-brand-borgona font-medium transition-colors">
                Ver Detalles
              </router-link>
            </div>
          </div>
          <router-link
to="/eventos"
            class="w-full bg-brand-camel text-center text-white py-3 px-6 rounded-md hover:bg-opacity-80 transition-colors text-lg font-medium shadow-lg hover:shadow-xl mt-auto block">
            Ver Todos los Eventos
          </router-link>
        </div>
      </div>
      <div v-else class="text-center text-brand-negro py-10">
        <p class="text-xl">Próximamente anunciaremos nuevos eventos. ¡Mantente atento!</p>
        <!-- Icono de calendario o similar podría ir aquí -->
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { useRouter } from 'vue-router';
import { useUiStore } from '@/stores/uiStore';
import { defineComponent, ref, onMounted, computed } from 'vue';
import axios from 'axios';

interface Evento {
  id: number;
  nombre: string;
  fecha: string;
  descripcion?: string | null;
  imagenUrl?: string | null;
  lugar?: string;
  link_compra?: string;
  fechaFormateada?: string;
}

export default defineComponent({
  name: 'EventosDestacados',
  setup() {
    const router = useRouter();
    const uiStore = useUiStore();
    const todosLosEventos = ref<Evento[]>([]);
    const isLoading = ref(true);
    const error = ref<string | null>(null);
    const API_URL = 'https://api.labarcaministerio.com';
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    onMounted(async () => {
      isLoading.value = true;
      error.value = null;
      try {
        const response = await axios.get(`${API_URL}/eventos`);
        todosLosEventos.value = response.data;
      } catch (err) {
        console.error("Error al cargar eventos destacados:", err);
        error.value = "No se pudieron cargar los eventos.";
      } finally {
        isLoading.value = false;
      }
    });

    const formatearFecha = (fechaStr: string): string => {
      const fechaObj = new Date(fechaStr.replace(/-/g, '/'));
      return fechaObj.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) +
        ' - ' + fechaObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const proximosEventos = computed(() => {
      const ahora = new Date();
      return todosLosEventos.value
        .filter(evento => new Date(evento.fecha.replace(/-/g, '/')) >= ahora)
        .sort((a, b) => new Date(a.fecha.replace(/-/g, '/')).getTime() - new Date(b.fecha.replace(/-/g, '/')).getTime())
        .map(evento => ({ ...evento, fechaFormateada: formatearFecha(evento.fecha) }))
        .slice(0, 2);
    });

    return {
      proximosEventos,
      isLoading,
      error,
      API_BASE_URL,
    };
  },
});
</script>
