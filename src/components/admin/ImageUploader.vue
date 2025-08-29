<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
    <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
      @dragover.prevent="onDragOver" @dragleave.prevent="onDragLeave" @drop.prevent="onDrop"
      :class="{ 'border-brand-camel bg-camel-50': isDragging }">
      <div class="space-y-1 text-center">
        <img v-if="previewUrl" :src="previewUrl" alt="Preview"
          class="mx-auto h-24 w-auto rounded-md object-contain mb-2" />
        <PhotoIcon v-else class="mx-auto h-12 w-12 text-gray-400" />
        <div class="flex text-sm text-gray-600">
          <label :for="inputId"
            class="relative cursor-pointer bg-white rounded-md font-medium text-brand-camel hover:text-brand-borgona focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-camel">
            <span>Sube un archivo</span>
            <input :id="inputId" :name="inputId" type="file" class="sr-only" @change="onFileSelect">
          </label>
          <p class="pl-1">o arrástralo aquí</p>
        </div>
        <p class="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { PhotoIcon } from '@heroicons/vue/24/outline'; // Corrected import
const props = defineProps<{ label: string, initialPreview?: string | null }>();
const emit = defineEmits(['file-change']);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const previewUrl = ref<string | null>(props.initialPreview || null);
const isDragging = ref(false);
const inputId = `file-upload-${Math.random().toString(36).substring(7)}`;

watch(() => props.initialPreview, (newVal) => {
  if (newVal && !newVal.startsWith('blob:')) {
    previewUrl.value = `${API_BASE_URL}${newVal}`;
  } else {
    previewUrl.value = newVal;
  }
});

const handleFile = (file: File | null) => {
  if (file && file.type.startsWith('image/')) {
    if (file.size > 10 * 1024 * 1024) { // 10MB
      alert('El archivo es demasiado grande. El tamaño máximo es de 10MB.');
      return;
    }
    previewUrl.value = URL.createObjectURL(file);
    emit('file-change', file);
  }
};

const onFileSelect = (e: Event) => handleFile((e.target as HTMLInputElement).files?.[0] || null);
const onDragOver = () => { isDragging.value = true; };
const onDragLeave = () => { isDragging.value = false; };
const onDrop = (e: DragEvent) => {
  isDragging.value = false;
  handleFile(e.dataTransfer?.files[0] || null);
};
</script>
