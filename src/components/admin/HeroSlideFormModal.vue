<template>
  <transition name="modal-fade">
    <div v-if="show" tabindex="-1"
      class="fixed inset-0 bg-brand-negro bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      @click.self="close">
      <div
        class="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all max-h-[90vh] overflow-y-auto">
        <h2 class="text-2xl font-bold text-brand-negro mb-6">{{ isEditing ? 'Editar' : 'Crear' }} Slide</h2>
        <form @submit.prevent="handleSubmit">
          <div class="grid grid-cols-1 gap-6">
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700">Título <span
                  class="text-red-500">*</span></label>
              <input type="text" id="title" v-model="formData.title" required
                placeholder="Título del slide"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel">
            </div>
            <div>
              <label for="button_text" class="block text-sm font-medium text-gray-700">Texto del Botón <span
                  class="text-red-500">*</span></label>
              <input type="text" id="button_text" v-model="formData.button_text" required
                placeholder="Ej: Ver Más"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel">
            </div>
            <div>
              <label for="button_url" class="block text-sm font-medium text-gray-700">URL del Botón <span
                  class="text-red-500">*</span></label>
              <input type="url" id="button_url" v-model="formData.button_url" required
                placeholder="Ej: https://tuweb.com/pagina"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel">
            </div>
            <div>
              <label for="order" class="block text-sm font-medium text-gray-700">Orden <span
                  class="text-red-500">*</span></label>
              <input type="number" id="order" v-model="formData.order" required
                placeholder="Orden de aparición"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel">
            </div>
            <div class="flex items-center">
              <input type="checkbox" id="is_active" v-model="formData.is_active"
                class="h-4 w-4 text-brand-camel focus:ring-brand-camel border-gray-300 rounded">
              <label for="is_active" class="ml-2 block text-sm text-gray-900">Activo</label>
            </div>

            <ImageUploader label="Video (MP4/MOV, max 50MB)" :initial-preview="formData.video_path"
              @file-change="file => handleFileChange(file, 'video_path')" file-type="video" />

            <div v-if="uploadProgress > 0 && uploadProgress < 100" class="mt-4">
              <div class="text-sm font-medium text-gray-700 mb-1">Subiendo video: {{ uploadProgress.toFixed(0) }}%</div>
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="bg-brand-camel h-2.5 rounded-full" :style="{ width: uploadProgress + '%' }"></div>
              </div>
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
import { ref, watch, computed, defineAsyncComponent } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const ImageUploader = defineAsyncComponent(() => import('./ImageUploader.vue'));

interface HeroSlide {
  id?: number;
  title: string;
  video_path: string;
  button_text: string;
  button_url: string;
  order: number;
  is_active: boolean;
}

const props = defineProps<{
  show: boolean;
  slide: HeroSlide | null;
}>();

const emit = defineEmits(['close', 'save']);

const defaultFormData = {
  title: '',
  video_path: '',
  button_text: '',
  button_url: '',
  order: 0,
  is_active: true,
};

const formData = ref({ ...defaultFormData });
const videoFile = ref<File | null>(null);

const isLoading = ref(false);
const errorMessage = ref('');
const authStore = useAuthStore();

const isEditing = computed(() => !!props.slide);
const API_URL = 'http://localhost:8000/api';

watch(() => props.show, (newVal) => {
  if (newVal) {
    errorMessage.value = '';
    if (props.slide) {
      formData.value = { ...defaultFormData, ...props.slide };
    } else {
      formData.value = { ...defaultFormData };
    }
    videoFile.value = null; // Clear selected file on modal open
  }
});

const handleFileChange = (file: File | null) => {
  videoFile.value = file;
};

const handleSubmit = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  const submissionData = new FormData();
  submissionData.append('title', formData.value.title);
  submissionData.append('button_text', formData.value.button_text);
  submissionData.append('button_url', formData.value.button_url);
  submissionData.append('order', formData.value.order.toString());
  submissionData.append('is_active', formData.value.is_active ? '1' : '0');

  if (videoFile.value) {
    submissionData.append('video', videoFile.value);
  } else if (isEditing.value && formData.value.video_path === null) {
    // If editing and video was cleared, send empty string to remove it
    submissionData.append('video_path', '');
  }

  try {
    if (isEditing.value && props.slide) {
      submissionData.append('_method', 'PUT');
      await axios.post(`${API_URL}/hero-slides/${props.slide.id}`, submissionData, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
    } else {
      await axios.post(`${API_URL}/hero-slides`, submissionData, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
    }
    emit('save');
  } catch (error: any) {
    console.error('Error al guardar slide:', error);
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
