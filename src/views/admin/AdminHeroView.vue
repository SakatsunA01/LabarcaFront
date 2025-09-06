<template>
  <div class="admin-hero-view p-4">
    <h1 class="text-2xl font-bold mb-4">Gestión de Hero Carousel</h1>

    <div class="mb-4 flex justify-end">
      <button @click="openCreateModal"
        class="bg-brand-camel text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors">
        Crear Nuevo Slide
      </button>
    </div>

    <div v-if="isLoading" class="text-center py-10">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-camel"></div>
      <p class="mt-4 text-brand-negro">Cargando slides...</p>
    </div>

    <div v-else-if="slides.length > 0" class="overflow-x-auto bg-white shadow-md rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orden</th>
            <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
            <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Video</th>
            <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th scope="col" class="relative px-6 py-3">
              <span class="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="slide in slides" :key="slide.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ slide.order }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ slide.title }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <video :src="`${API_BASE_URL}${slide.video_path}`" class="h-10 w-20 object-cover rounded-md" controls></video>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span :class="slide.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ slide.is_active ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="openEditModal(slide)" class="text-brand-camel hover:text-brand-borgona mr-3">Editar</button>
              <button @click="deleteSlide(slide.id)" class="text-red-600 hover:text-red-900">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="text-center py-10 bg-white shadow-md rounded-lg">
      <p class="text-lg text-gray-600">No hay slides registrados.</p>
    </div>

    <HeroSlideFormModal :show="showModal" :slide="selectedSlide" @close="closeModal" @save="handleSave" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

import HeroSlideFormModal from '@/components/admin/HeroSlideFormModal.vue';

interface HeroSlide {
  id: number;
  title: string;
  video_path: string;
  button_text: string;
  button_url: string;
  order: number;
  is_active: boolean;
}

const slides = ref<HeroSlide[]>([]);
const isLoading = ref(true);
const showModal = ref(false);
const selectedSlide = ref<HeroSlide | null>(null);
const authStore = useAuthStore();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/api`;

const fetchSlides = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(`${API_URL}/hero-slides`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    slides.value = response.data;
  } catch (error) {
    console.error('Error al cargar slides:', error);
  } finally {
    isLoading.value = false;
  }
};

const openCreateModal = () => {
  selectedSlide.value = null;
  showModal.value = true;
};

const openEditModal = (slide: HeroSlide) => {
  selectedSlide.value = slide;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedSlide.value = null;
};

const handleSave = () => {
  closeModal();
  fetchSlides();
};

const deleteSlide = async (id: number) => {
  if (confirm('¿Estás seguro de que quieres eliminar este slide?')) {
    try {
      await axios.delete(`${API_URL}/hero-slides/${id}`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
      fetchSlides();
    } catch (error) {
      console.error('Error al eliminar slide:', error);
      alert('Hubo un error al eliminar el slide.');
    }
  }
};

onMounted(fetchSlides);
</script>