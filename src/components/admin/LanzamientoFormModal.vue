<template>
  <transition name="modal-fade">
    <div v-if="show" tabindex="-1"
      class="fixed inset-0 bg-brand-negro bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      @click.self="close">
      <div
        class="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all max-h-[90vh] overflow-y-auto">
        <h2 class="text-2xl font-bold text-brand-negro mb-6">{{ isEditing ? 'Editar' : 'Crear' }} Lanzamiento</h2>
        <form @submit.prevent="handleSubmit">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Columna 1: Información General -->
            <div class="space-y-6">
              <fieldset class="border p-4 rounded-md shadow-sm">
                <legend class="text-lg font-semibold text-brand-negro px-2">Información del Lanzamiento</legend>
                <div class="space-y-4 mt-2">
                  <div>
                    <label for="titulo" class="block text-sm font-medium text-gray-700">Título <span
                        class="text-red-500">*</span></label>
                    <input type="text" id="titulo" v-model="formData.titulo" required
                      placeholder="Título del lanzamiento"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel">
                  </div>
                  <div>
                    <label for="artista" class="block text-sm font-medium text-gray-700">Artista <span
                        class="text-red-500">*</span></label>
                    <select id="artista" v-model="formData.artista_id" required
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel">
                      <option value="" disabled>Selecciona un artista</option>
                      <option v-for="artista in artistas" :key="artista.id" :value="artista.id">{{ artista.name }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label for="fecha_lanzamiento" class="block text-sm font-medium text-gray-700">Fecha de
                      Lanzamiento <span class="text-red-500">*</span></label>
                    <input type="date" id="fecha_lanzamiento" v-model="formData.fecha_lanzamiento" required
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel">
                  </div>
                  <div>
                    <label for="youtube_link" class="block text-sm font-medium text-gray-700">Enlace de YouTube</label>
                    <input type="url" id="youtube_link" v-model="formData.youtube_link"
                      placeholder="URL de YouTube"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel">
                  </div>
                  <div>
                    <label for="spotify_link" class="block text-sm font-medium text-gray-700">Enlace de Spotify</label>
                    <input type="url" id="spotify_link" v-model="formData.spotify_link"
                      placeholder="URL de Spotify"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel">
                  </div>
                </div>
              </fieldset>

              <fieldset class="border p-4 rounded-md shadow-sm">
                <legend class="text-lg font-semibold text-brand-negro px-2">Pistas</legend>
                <div class="space-y-4 mt-2">
                  <div v-for="(track, index) in formData.tracks" :key="index"
                    class="flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                    <input type="text" v-model="track.titulo" placeholder="Título de la pista"
                      class="flex-grow px-3 py-2 border border-gray-300 rounded-md" required>
                    <input type="text" v-model="track.duracion" placeholder="Duración (ej: 3:45)"
                      class="w-24 px-3 py-2 border border-gray-300 rounded-md" required>
                    <button type="button" @click="removeTrack(index)"
                      class="text-red-500 hover:text-red-700 p-1 rounded-full">
                      <XMarkIcon class="h-5 w-5" />
                    </button>
                  </div>
                  <button type="button" @click="addTrack"
                    class="w-full bg-brand-verde-oscuro text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors flex items-center justify-center space-x-2">
                    <PlusIcon class="h-5 w-5" />
                    <span>Añadir Pista</span>
                  </button>
                </div>
              </fieldset>
            </div>

            <!-- Columna 2: Carga de Imagen -->
            <div class="space-y-6">
              <ImageUploader label="Imagen de Portada" :initial-preview="formData.cover_image_url"
                @file-change="file => handleFileChange(file, 'cover_image_url')" />
            </div>
          </div>

          <div v-if="errorMessage" class="mt-4 text-red-600 text-sm text-center p-2 bg-red-100 rounded-md">
            {{ errorMessage }}
          </div>

          <!-- Botones de Acción -->
          <div class="mt-8 flex justify-end space-x-4">
            <button type="button" @click="close"
              class="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors">
              Cancelar
            </button>
            <button type="submit" :disabled="isLoading"
              class="bg-brand-camel text-white py-2 px-6 rounded-md hover:bg-opacity-90 transition-all duration-300 font-medium disabled:opacity-60 flex items-center justify-center shadow-md hover:shadow-lg">
              <span v-if="isLoading">Guardando...</span>
              <span v-else>Guardar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch, computed, defineAsyncComponent, onMounted } from 'vue';
import axios from 'axios';
import { XMarkIcon, PlusIcon } from '@heroicons/vue/24/outline';

const ImageUploader = defineAsyncComponent(() => import('./ImageUploader.vue'));

interface Lanzamiento {
  id: number;
  titulo: string;
  artista_id: number;
  fecha_lanzamiento: string; // YYYY-MM-DD
  cover_image_url?: string | null;
  youtube_link?: string | null; // Add this
  spotify_link?: string | null; // Add this
  tracks: Track;
}

interface Track {
  titulo: string;
  duracion: string;
}

interface Artista {
  id: number;
  name: string;
}

const props = defineProps<{
  show: boolean;
  lanzamiento: Lanzamiento | null;
}>();

const emit = defineEmits(['close', 'save']);

const defaultFormData = {
  titulo: '',
  artista_id: null as number | null,
  fecha_lanzamiento: '',
  cover_image_url: null,
  youtube_link: null as string | null,
  spotify_link: null as string | null,
  tracks: [] as Track[],
};

const formData = ref({ ...defaultFormData });
const imageFiles = ref<{ [key: string]: File | null }> ({
  cover_image_url: null,
});

const artistas = ref<Artista[]>([]);
const isLoading = ref(false);
const errorMessage = ref('');

const isEditing = computed(() => !!props.lanzamiento);
const API_URL = 'http://localhost:8000/api';

onMounted(async () => {
  try {
    const response = await axios.get(`${API_URL}/artistas`);
    artistas.value = response.data;
  } catch (error) {
    console.error('Error al cargar artistas:', error);
    errorMessage.value = 'Error al cargar la lista de artistas.';
  }
});

watch(() => props.show, (newVal) => {
  if (newVal) {
    errorMessage.value = '';
    if (props.lanzamiento) {
      formData.value = { ...defaultFormData, ...props.lanzamiento };
      // Ensure tracks are copied correctly
      formData.value.tracks = props.lanzamiento.tracks ? JSON.parse(JSON.stringify(props.lanzamiento.tracks)) : [];
    } else {
      formData.value = { ...defaultFormData };
    }
    imageFiles.value = { cover_image_url: null };
  }
});

const handleFileChange = (file: File | null, fieldName: string) => {
  imageFiles.value[fieldName] = file;
};

const addTrack = () => {
  formData.value.tracks.push({ titulo: '', duracion: '' });
};

const removeTrack = (index: number) => {
  formData.value.tracks.splice(index, 1);
};

const handleSubmit = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  const submissionData = new FormData();
  Object.entries(formData.value).forEach(([key, value]) => {
    if (key === 'tracks') {
      // Convert tracks array to JSON string
      submissionData.append(key, JSON.stringify(value));
    } else if (value !== null && value !== undefined) {
      submissionData.append(key, value);
    }
  });

  if (imageFiles.value.cover_image_url) {
    submissionData.append('cover_image_url', imageFiles.value.cover_image_url);
  } else if (isEditing.value && formData.value.cover_image_url === null) {
    submissionData.append('cover_image_url', '');
  }

  try {
    if (isEditing.value && props.lanzamiento) {
      submissionData.append('_method', 'PUT');
      await axios.post(`${API_URL}/lanzamientos/${props.lanzamiento.id}`, submissionData);
    } else {
      await axios.post(`${API_URL}/lanzamientos`, submissionData);
    }
    emit('save');
  } catch (error: any) {
    console.error('Error al guardar lanzamiento:', error);
    if (error.response && error.response.data) {
      const errors = error.response.data.errors || error.response.data;
      if (typeof errors === 'object' && errors !== null) {
        const firstErrorKey = Object.keys(errors)[0];
        errorMessage.value = errors[firstErrorKey]?.[0] || 'Error de validación desconocido.';
      } else {
        errorMessage.value = error.response.data.message || 'Ocurrió un error al guardar.';
      }
    } else {
      errorMessage.value = 'Ocurrió un error de red o del servidor.';
    }
  } finally {
    isLoading.value = false;
  }
};

const close = () => {
  emit('close');
};
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease-out;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
