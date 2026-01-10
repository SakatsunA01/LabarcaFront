<template>
  <transition name="modal-fade">
    <div
      v-if="show" tabindex="-1"
      class="fixed inset-0 bg-brand-negro bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      @click.self="close"
      >
      <div
        class="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all max-h-[90vh] overflow-y-auto">
        <h2 class="text-2xl font-bold text-brand-negro mb-6">{{ isEditing ? 'Editar' : 'Crear' }} Entrada</h2>
        <form @submit.prevent="handleSubmit">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-6">
              <fieldset class="border p-4 rounded-md shadow-sm">
                <legend class="text-lg font-semibold text-brand-negro px-2">Datos de la Entrada</legend>
                <div class="space-y-4 mt-2">
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700">Nombre <span class="text-red-500">*</span></label>
                    <input
                      id="name" v-model="formData.name" type="text" required
                      placeholder="Entrada General / Entrada VIP"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel">
                  </div>
                  <div>
                    <label for="description" class="block text-sm font-medium text-gray-700">Descripcion</label>
                    <textarea
                      id="description" v-model="formData.description" rows="3"
                      placeholder="Detalle breve de la entrada"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel"></textarea>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label for="price_ars" class="block text-sm font-medium text-gray-700">Precio (ARS) <span class="text-red-500">*</span></label>
                      <input
                        id="price_ars" v-model.number="formData.price_ars" type="number" min="0" step="0.01" required
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel">
                    </div>
                    <div>
                      <label for="stock" class="block text-sm font-medium text-gray-700">Stock <span class="text-red-500">*</span></label>
                      <input
                        id="stock" v-model.number="formData.stock" type="number" min="0" step="1" required
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel">
                    </div>
                  </div>
                  <div class="flex items-center space-x-3">
                    <input id="is_active" v-model="formData.is_active" type="checkbox" class="h-4 w-4 text-brand-camel border-gray-300 rounded">
                    <label for="is_active" class="text-sm text-gray-700">Entrada activa</label>
                  </div>
                </div>
              </fieldset>
            </div>

            <div class="space-y-6">
              <ImageUploader
                label="Imagen de la Entrada" :initial-preview="formData.image_url"
                @file-change="file => handleFileChange(file, 'image_url')" />
            </div>
          </div>

          <div v-if="errorMessage" class="mt-4 text-red-600 text-sm text-center p-2 bg-red-100 rounded-md">
            {{ errorMessage }}
          </div>

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

interface Product {
  id: number;
  name: string;
  description?: string | null;
  price_ars: number;
  stock: number;
  image_url?: string | null;
  is_active: boolean;
  [key: string]: any;
}

const props = defineProps<{
  show: boolean;
  product: Product | null;
}>();

const emit = defineEmits(['close', 'save']);

type ProductFormData = {
  name: string;
  description: string;
  price_ars: number;
  stock: number;
  image_url: string | null;
  is_active: boolean;
};

const defaultFormData: ProductFormData = {
  name: '',
  description: '',
  price_ars: 0,
  stock: 0,
  image_url: null,
  is_active: true,
};

const formData = ref<ProductFormData>({ ...defaultFormData });
const imageFiles = ref<{ [key: string]: File | null }>({
  image_url: null,
});

const isLoading = ref(false);
const errorMessage = ref('');

const isEditing = computed(() => !!props.product);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/api`;

watch(() => props.show, (newVal) => {
  if (newVal) {
    errorMessage.value = '';
    if (props.product) {
      formData.value = {
        ...defaultFormData,
        ...props.product,
        description: props.product.description ?? '',
        price_ars: Number(props.product.price_ars) || 0,
        stock: Number(props.product.stock) || 0,
        is_active: props.product.is_active ?? true,
      };
    } else {
      formData.value = { ...defaultFormData };
    }
    imageFiles.value = { image_url: null };
  }
});

const handleFileChange = (file: File | null, fieldName: string) => {
  imageFiles.value[fieldName] = file;
};

const handleSubmit = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  const submissionData = new FormData();
  Object.entries(formData.value).forEach(([key, value]) => {
    if (key === 'image_url') return;
    if (value !== null && value !== undefined) {
      if (key === 'is_active') {
        submissionData.append(key, value ? '1' : '0');
      } else {
        submissionData.append(key, String(value));
      }
    }
  });
  if (imageFiles.value.image_url) {
    submissionData.append('image_url', imageFiles.value.image_url);
  }

  try {
    if (isEditing.value && props.product) {
      submissionData.append('_method', 'PUT');
      await axios.post(`${API_URL}/products/${props.product.id}`, submissionData);
    } else {
      await axios.post(`${API_URL}/products`, submissionData);
    }
    emit('save');
  } catch (error: any) {
    console.error('Error al guardar producto:', error);
    errorMessage.value = error.response?.data?.message || 'Ocurrio un error al guardar.';
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
