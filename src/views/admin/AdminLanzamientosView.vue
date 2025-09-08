<template>
  <div class="admin-lanzamientos-view p-4">
    <h1 class="text-2xl font-bold mb-4">Gestión de Lanzamientos</h1>

    <div class="mb-4 flex justify-end">
      <button
class="bg-brand-camel text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors"
        @click="openCreateModal">
        Crear Nuevo Lanzamiento
      </button>
    </div>

    <div v-if="isLoading" class="text-center py-10">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-camel"></div>
      <p class="mt-4 text-brand-negro">Cargando lanzamientos...</p>
    </div>

    <div v-else-if="lanzamientos.length > 0" class="overflow-x-auto bg-white shadow-md rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
            <th
scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artista</th>
            <th
scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
            <th
scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Portada</th>
            <th scope="col" class="relative px-6 py-3">
              <span class="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="lanzamiento in lanzamientos" :key="lanzamiento.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ lanzamiento.titulo }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ lanzamiento.artista?.name || 'N/A' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(lanzamiento.fecha_lanzamiento) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <img
v-if="lanzamiento.cover_image_url" :src="`${API_BASE_URL}${lanzamiento.cover_image_url}`" alt="Portada"
                class="h-10 w-10 object-cover rounded-full">
              <span v-else>Sin portada</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button class="text-brand-camel hover:text-brand-borgona mr-3" @click="openEditModal(lanzamiento)">Editar</button>
              <button class="text-red-600 hover:text-red-900" @click="deleteLanzamiento(lanzamiento.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="text-center py-10 bg-white shadow-md rounded-lg">
      <p class="text-lg text-gray-600">No hay lanzamientos registrados.</p>
    </div>

    <LanzamientoFormModal :show="showModal" :lanzamiento="selectedLanzamiento" @close="closeModal" @save="handleSave" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import LanzamientoFormModal from '@/components/admin/LanzamientoFormModal.vue';

interface Track {
  titulo: string;
  duracion: string;
}

interface Lanzamiento {
  id: number;
  titulo: string;
  artista_id: number;
  fecha_lanzamiento: string;
  cover_image_url?: string | null;
  youtube_link?: string | null;
  spotify_link?: string | null;
  artista?: { // Make artista optional as it might not be loaded initially
    id: number;
    name: string;
  };
  tracks: Track[];
}

const lanzamientos = ref<Lanzamiento[]>([]);
const isLoading = ref(true);
const showModal = ref(false);
const selectedLanzamiento = ref<Lanzamiento | null>(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/api`;

const fetchLanzamientos = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(`${API_URL}/lanzamientos`);
    lanzamientos.value = response.data;
  } catch (error) {
    console.error('Error al cargar lanzamientos:', error);
  } finally {
    isLoading.value = false;
  }
};

const openCreateModal = () => {
  selectedLanzamiento.value = null;
  showModal.value = true;
};

const openEditModal = (lanzamiento: Lanzamiento) => {
  selectedLanzamiento.value = lanzamiento;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedLanzamiento.value = null; // Clear selected lanzamiento on close
};

const handleSave = () => {
  closeModal();
  fetchLanzamientos(); // Refresh the list after save
};

const deleteLanzamiento = async (id: number) => {
  if (confirm('¿Estás seguro de que quieres eliminar este lanzamiento?')) {
    try {
      await axios.delete(`${API_URL}/lanzamientos/${id}`);
      fetchLanzamientos(); // Refresh the list after delete
    } catch (error) {
      console.error('Error al eliminar lanzamiento:', error);
      alert('Hubo un error al eliminar el lanzamiento.');
    }
  }
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

onMounted(fetchLanzamientos);
</script>

<style scoped>
/* Add any specific styles here */
</style>