<template>
  <div class="admin-artistas-view">
    <h1 class="text-3xl font-bold text-brand-negro mb-6">Gestión de Artistas</h1>

    <!-- Controles Superiores: Búsqueda y Botón de Crear -->
    <div class="flex justify-between items-center mb-6">
      <div class="w-1/3">
        <input type="text" v-model="searchTerm" placeholder="Buscar por nombre..."
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-camel focus:border-brand-camel transition-shadow" />
      </div>
      <button @click="openCreateModal"
        class="bg-brand-verde-oscuro text-white py-2 px-5 rounded-md hover:bg-opacity-80 transition-colors font-medium flex items-center">
        <PlusIcon class="h-5 w-5 mr-2" />
        Crear Artista
      </button>
    </div>

    <!-- Tabla de Artistas -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <div v-if="isLoading" class="p-8 text-center text-gray-500">Cargando artistas...</div>
      <div v-else-if="error" class="p-8 text-center text-red-500">{{ error }}</div>
      <table v-else-if="filteredArtistas.length" class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Imagen
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th scope="col" class="relative px-6 py-3">
              <span class="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="artista in filteredArtistas" :key="artista.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <img :src="artista.imageUrl ? `${API_BASE_URL}${artista.imageUrl}` : 'https://placehold.co/40x40'"
                alt="Avatar" class="h-10 w-10 rounded-full object-cover">
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ artista.name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="openEditModal(artista)"
                class="text-brand-camel hover:text-brand-borgona mr-4">Editar</button>
              <button @click="deleteArtista(artista.id)" class="text-red-600 hover:text-red-900">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="p-8 text-center text-gray-500">No se encontraron artistas.</div>
    </div>

    <!-- Modal para Crear/Editar Artista -->
    <ArtistaFormModal :show="isModalOpen" :artista="artistaSeleccionado" @close="closeModal" @save="handleSave" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { PlusIcon } from '@heroicons/vue/24/outline';
import ArtistaFormModal from '@/components/admin/ArtistaFormModal.vue';

interface Artista {
  id: number;
  name: string;
  imageUrl?: string;
  [key: string]: any; // Para el resto de propiedades
}

const artistas = ref<Artista[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const searchTerm = ref('');

const isModalOpen = ref(false);
const artistaSeleccionado = ref<Artista | null>(null);

const API_URL = 'http://localhost:8000/api';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fetchArtistas = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`${API_URL}/artistas`);
    artistas.value = response.data;
  } catch (err) {
    console.error("Error al cargar artistas:", err);
    error.value = "No se pudieron cargar los artistas.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchArtistas);

const filteredArtistas = computed(() => {
  if (!searchTerm.value) {
    return artistas.value;
  }
  return artistas.value.filter(artista =>
    artista.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const openCreateModal = () => {
  artistaSeleccionado.value = null;
  isModalOpen.value = true;
};

const openEditModal = (artista: Artista) => {
  artistaSeleccionado.value = artista;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleSave = () => {
  fetchArtistas(); // Recargar la lista después de guardar
  closeModal();
};

const deleteArtista = async (id: number) => {
  if (confirm('¿Estás seguro de que quieres eliminar este artista?')) {
    try {
      await axios.delete(`${API_URL}/artistas/${id}`);
      fetchArtistas(); // Recargar la lista
    } catch (err) {
      console.error("Error al eliminar artista:", err);
      alert('No se pudo eliminar el artista.');
    }
  }
};
</script>
