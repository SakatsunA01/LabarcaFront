<template>
  <transition name="modal-fade">
    <div
      v-if="show" tabindex="-1"
      class="fixed inset-0 bg-brand-negro bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      @click.self="close"
      >
      <div
        class="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all max-h-[90vh] overflow-y-auto">
        <h2 class="text-2xl font-bold text-brand-negro mb-6">{{ isEditing ? 'Editar' : 'Crear' }} Artista</h2>
        <form @submit.prevent="handleSubmit">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Columna 1: Información General -->
            <div class="space-y-6">
              <fieldset class="border p-4 rounded-md shadow-sm">
                <legend class="text-lg font-semibold text-brand-negro px-2">Información General</legend>
                <div class="space-y-4 mt-2">
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700">Nombre <span
                        class="text-red-500">*</span></label>
                    <input
                      id="name" v-model="formData.name" type="text" required
                      placeholder="Nombre completo del artista"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel">
                  </div>
                  <div>
                    <label for="description" class="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea
                      id="description" v-model="formData.description" rows="4"
                      placeholder="Una breve biografía o descripción del artista"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel"></textarea>
                  </div>
                  <div>
                    <label for="color" class="block text-sm font-medium text-gray-700">Color
                      Principal</label>
                    <input
                      id="color" v-model="formData.color" type="color"
                      title="Selecciona un color representativo para el artista"
                      class="mt-1 block w-full h-10 border border-gray-300 rounded-md shadow-sm">
                  </div>
                </div>
              </fieldset>

              <!-- Redes Sociales y Multimedia -->
              <fieldset class="border p-4 rounded-md shadow-sm">
                <legend class="text-lg font-semibold text-brand-negro px-2">Redes Sociales y Multimedia
                </legend>
                <div class="space-y-4 mt-2">
                  <div>
                    <label for="spotifyEmbedUrl" class="block text-sm font-medium text-gray-700">URL
                      Spotify Embed</label>
                    <input
                      id="spotifyEmbedUrl" v-model="formData.spotifyEmbedUrl" type="url"
                      placeholder="URL de un álbum o canción de Spotify para incrustar"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel">
                  </div>
                  <div>
                    <label for="youtubeVideoId" class="block text-sm font-medium text-gray-700">ID
                      Video YouTube</label>
                    <input
                      id="youtubeVideoId" v-model="formData.youtubeVideoId" type="text"
                      placeholder="Ej: dQw4w9WgXcQ (solo el ID del video)"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel">
                  </div>
                  <div>
                    <label for="social_instagram" class="block text-sm font-medium text-gray-700">URL
                      Instagram</label>
                    <input
                      id="social_instagram" v-model="formData.social_instagram" type="url"
                      placeholder="Perfil de Instagram del artista"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel">
                  </div>
                  <div>
                    <label for="social_facebook" class="block text-sm font-medium text-gray-700">URL
                      Facebook</label>
                    <input
                      id="social_facebook" v-model="formData.social_facebook" type="url"
                      placeholder="Página de Facebook del artista"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel">
                  </div>
                  <!-- Más campos de redes sociales si son necesarios -->
                </div>
              </fieldset>
            </div>

            <!-- Columna 2: Carga de Imágenes -->
            <div class="space-y-6">
              <ImageUploader
                label="Imagen Principal (Card)" :initial-preview="formData.imageUrl" file-type="image"
                @file-change="file => handleFileChange(file, 'imageUrl')" />
              <ImageUploader
                label="Imagen Hero (Detalle)" :initial-preview="formData.heroImageUrl" file-type="image"
                @file-change="file => handleFileChange(file, 'heroImageUrl')" />
              <ImageUploader
                label="Imagen Secundaria (Detalle)" :initial-preview="formData.secondaryImageUrl" file-type="image"
                @file-change="file => handleFileChange(file, 'secondaryImageUrl')" />
            </div>
          </div>

          <div v-if="errorMessage" class="mt-4 text-red-600 text-sm text-center p-2 bg-red-100 rounded-md">
            {{ errorMessage }}
          </div>

          <!-- Botones de Acción -->
          <div class="mt-8 flex justify-end space-x-4">
            <button
              type="button" class="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
              @click="close">
              Cancelar
            </button>
            <button
              type="submit" :disabled="isLoading"
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
import { ref, watch, computed, defineAsyncComponent } from 'vue';
import axios from 'axios';

const ImageUploader = defineAsyncComponent(() => import('./ImageUploader.vue'));

interface Artista {
  id: number;
  name: string;
  [key: string]: any;
}

const props = defineProps<{
  show: boolean;
  artista: Artista | null;
}>();

const emit = defineEmits(['close', 'save']);

const defaultFormData = {
  name: '',
  description: '',
  color: '#E2E2E2',
  imageUrl: null,
  heroImageUrl: null,
  secondaryImageUrl: null,
  spotifyEmbedUrl: '',
  youtubeVideoId: '',
  social_instagram: '',
  social_facebook: '',
  social_youtubeChannel: '',
  social_tiktok: '',
  social_spotifyProfile: '',
};

const formData = ref({ ...defaultFormData });
const imageFiles = ref<{ [key: string]: File | null }>({
  imageUrl: null,
  heroImageUrl: null,
  secondaryImageUrl: null,
});

const isLoading = ref(false);
const errorMessage = ref('');

const isEditing = computed(() => !!props.artista);
const API_URL = 'https://api.labarcaministerio.com/api';

watch(() => props.show, (newVal) => {
  if (newVal) {
    errorMessage.value = '';
    if (props.artista) {
      formData.value = {
        ...defaultFormData,
        ...props.artista,
        name: props.artista.name || '',
        description: props.artista.description || '',
        color: props.artista.color || '#E2E2E2',
        spotifyEmbedUrl: props.artista.spotifyEmbedUrl || '',
        youtubeVideoId: props.artista.youtubeVideoId || '',
        social_instagram: props.artista.social_instagram || '',
        social_facebook: props.artista.social_facebook || '',
        social_youtubeChannel: props.artista.social_youtubeChannel || '',
        social_tiktok: props.artista.social_tiktok || '',
        social_spotifyProfile: props.artista.social_spotifyProfile || '',
      };
      console.log('Artista data on modal open:', props.artista);
      console.log('formData after init:', formData.value);
    } else {
      formData.value = { ...defaultFormData };
    }
    // Reset files
    imageFiles.value = { imageUrl: null, heroImageUrl: null, secondaryImageUrl: null };
  }
});

const handleFileChange = (file: File | null, fieldName: string) => {
  imageFiles.value[fieldName] = file;
};

const handleSubmit = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  const submissionData = new FormData();
  const imageFields = ['imageUrl', 'heroImageUrl', 'secondaryImageUrl'];
  // En edición, no enviar campos de imagen si no se reemplazaron, para no borrar la existente.
  Object.entries(formData.value).forEach(([key, value]) => {
    if (imageFields.includes(key)) return; // se manejan aparte
    if (value !== null && value !== undefined) {
      submissionData.append(key, String(value));
    }
  });
  Object.entries(imageFiles.value).forEach(([key, file]) => {
    if (file) {
      submissionData.append(key, file);
    }
  });

  try {
    if (isEditing.value && props.artista) {
      submissionData.append('_method', 'PUT'); // Para que Laravel lo trate como PUT
      await axios.post(`${API_URL}/artistas/${props.artista.id}`, submissionData);
    } else {
      await axios.post(`${API_URL}/artistas`, submissionData);
    }
    emit('save');
  } catch (error: any) {
    console.error("Error al guardar artista:", error);
    errorMessage.value = error.response?.data?.message || 'Ocurrió un error al guardar.';
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
