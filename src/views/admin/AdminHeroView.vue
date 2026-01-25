<template>
  <div class="admin-hero-view p-4">
    <h1 class="text-2xl font-bold mb-4">Gestión de Hero Carousel</h1>

    <div class="mb-4 flex flex-col sm:flex-row sm:justify-end gap-3">
      <button
class="w-full sm:w-auto bg-brand-camel text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors"
        @click="openCreateModal">
        Crear Nuevo Slide
      </button>
    </div>

    <div v-if="isLoading" class="text-center py-10">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-camel"></div>
      <p class="mt-4 text-brand-negro">Cargando slides...</p>
    </div>

    <div v-else-if="slides.length > 0" class="overflow-x-auto bg-white shadow-md rounded-lg">
      <table class="min-w-full divide-y divide-gray-200 min-w-[720px]">
        <thead class="bg-gray-50">
          <tr>
            <th
scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orden</th>
            <th
scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
            <th
scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Video</th>
            <th
scope="col"
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
              <div class="flex items-center gap-3">
                <video :src="`${API_BASE_URL}${slide.video_path}`" class="h-24 w-40 object-cover rounded-md shadow" muted playsinline></video>
                <button class="text-brand-camel hover:text-brand-borgona underline" @click="openPreview(slide)">
                  Ver grande
                </button>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span
:class="slide.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ slide.is_active ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
              <button class="text-brand-camel hover:text-brand-borgona" @click="openEditModal(slide)" title="Editar">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.862 4.487z"/><path stroke-linecap="round" stroke-linejoin="round" d="M18 2l4 4"/></svg>
              </button>
              <button class="text-red-600 hover:text-red-900" @click="confirmDelete(slide.id)" title="Eliminar">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.036-1.005 12.062A3.75 3.75 0 0115.166 22H8.834a3.75 3.75 0 01-3.742-3.279L4.087 6.66l-.209.036a.75.75 0 01-.256-1.478A48.9 48.9 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.368 0C15.287 1.805 16.5 3.141 16.5 4.705zm-6.136-1.45a51.192 51.192 0 013.272 0C14.41 3.08 15 3.69 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.787.591-1.398 1.364-1.45z" clip-rule="evenodd"/></svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="text-center py-10 bg-white shadow-md rounded-lg">
      <p class="text-lg text-gray-600">No hay slides registrados.</p>
    </div>

    <HeroSlideFormModal :show="showModal" :slide="selectedSlide" @close="closeModal" @save="handleSave" />
    <ConfirmDialog :show="showConfirm" title="Eliminar slide" message="Esta acción no se puede deshacer." confirm-text="Eliminar" cancel-text="Cancelar" @update:show="(val: boolean) => showConfirm = val" @confirm="performDelete" />

    <!-- Modal de previsualización de video -->
    <div v-if="previewUrl" class="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" @click.self="closePreview">
      <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden">
        <div class="flex justify-between items-center px-4 py-3 border-b">
          <h3 class="text-lg font-semibold">Previsualización</h3>
          <button class="text-gray-500 hover:text-brand-negro" @click="closePreview">Cerrar</button>
        </div>
        <div class="p-4">
          <div class="relative w-full" style="padding-top: 56.25%">
            <video :src="previewUrl" class="absolute inset-0 w-full h-full rounded-lg" controls autoplay playsinline></video>
          </div>
        </div>
      </div>
    </div>
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
const previewUrl = ref<string | null>(null);
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

const openPreview = (slide: HeroSlide) => {
  previewUrl.value = `${API_BASE_URL}${slide.video_path}`;
};

const closePreview = () => {
  previewUrl.value = null;
};

const showConfirm = ref(false);
const toDeleteId = ref<number | null>(null);
const confirmDelete = (id: number) => { toDeleteId.value = id; showConfirm.value = true; };
const performDelete = async () => {
  if (!toDeleteId.value) return;
  try {
    await axios.delete(`${API_URL}/hero-slides/${toDeleteId.value}`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    fetchSlides();
  } catch (error) {
    console.error('Error al eliminar slide:', error);
  } finally {
    showConfirm.value = false;
    toDeleteId.value = null;
  }
};

onMounted(fetchSlides);
</script>

