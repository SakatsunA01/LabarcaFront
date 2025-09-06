<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
    <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
      @dragover.prevent="onDragOver" @dragleave.prevent="onDragLeave" @drop.prevent="onDrop"
      :class="{ 'border-brand-camel bg-camel-50': isDragging }">
      <div class="space-y-1 text-center">
        <div v-if="previewUrl" class="mx-auto mb-2">
          <img v-if="fileType === 'image'" :src="previewUrl" alt="Preview"
            class="h-24 w-auto rounded-md object-contain" />
          <video v-else-if="fileType === 'video'" :src="previewUrl" controls
            class="h-24 w-auto rounded-md object-contain"></video>
        </div>
        <div v-else>
          <PhotoIcon v-if="fileType === 'image'" class="mx-auto h-12 w-12 text-gray-400" />
          <VideoCameraIcon v-else-if="fileType === 'video'" class="mx-auto h-12 w-12 text-gray-400" />
          <DocumentIcon v-else class="mx-auto h-12 w-12 text-gray-400" />
        </div>

        <div class="flex text-sm text-gray-600">
          <label :for="inputId"
            class="relative cursor-pointer bg-white rounded-md font-medium text-brand-camel hover:text-brand-borgona focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-camel">
            <span>Sube un archivo</span>
            <input :id="inputId" :name="inputId" type="file" class="sr-only" @change="onFileSelect"
              :accept="acceptTypes">
          </label>
          <p class="pl-1">o arrástralo aquí</p>
        </div>
        <p class="text-xs text-gray-500">{{ helpText }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { PhotoIcon, VideoCameraIcon, DocumentIcon } from '@heroicons/vue/24/outline';

const props = defineProps<{
  label: string;
  initialPreview?: string | null;
  fileType?: 'image' | 'video' | 'any'; // 'any' for other file types
}>();
const emit = defineEmits(['file-change']);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const previewUrl = ref<string | null>(props.initialPreview || null);
const isDragging = ref(false);
const inputId = `file-upload-${Math.random().toString(36).substring(7)}`;

const acceptTypes = computed(() => {
  if (props.fileType === 'image') return 'image/*';
  if (props.fileType === 'video') return 'video/mp4,video/quicktime';
  return '*/*';
});

const helpText = computed(() => {
  if (props.fileType === 'image') return 'PNG, JPG, GIF hasta 10MB';
  if (props.fileType === 'video') return 'MP4, MOV hasta 50MB';
  return 'Archivos de cualquier tipo';
});

watch(() => props.initialPreview, (newVal) => {
  if (newVal && !newVal.startsWith('blob:')) {
    previewUrl.value = `${API_BASE_URL}${newVal}`;
  } else {
    previewUrl.value = newVal;
  }
});

const handleFile = (file: File | null) => {
  if (!file) {
    previewUrl.value = null;
    emit('file-change', null);
    return;
  }

  let isValidType = false;
  let maxSize = 0;
  let errorMessage = '';

  if (props.fileType === 'image') {
    isValidType = file.type.startsWith('image/');
    maxSize = 10 * 1024 * 1024; // 10MB
    errorMessage = 'Solo se permiten imágenes (PNG, JPG, GIF) hasta 10MB.';
  } else if (props.fileType === 'video') {
    isValidType = file.type.startsWith('video/') && (file.type === 'video/mp4' || file.type === 'video/quicktime');
    maxSize = 50 * 1024 * 1024; // 50MB
    errorMessage = 'Solo se permiten videos MP4 o MOV hasta 50MB.';
  } else { // 'any' or unspecified
    isValidType = true;
    maxSize = 50 * 1024 * 1024; // Default max size for 'any' type
    errorMessage = 'El archivo es demasiado grande.';
  }

  if (!isValidType) {
    alert(errorMessage);
    return;
  }

  if (file.size > maxSize) {
    alert(`El archivo es demasiado grande. El tamaño máximo es de ${maxSize / (1024 * 1024)}MB.`);
    return;
  }

  previewUrl.value = URL.createObjectURL(file);
  emit('file-change', file);
};

const onFileSelect = (e: Event) => handleFile((e.target as HTMLInputElement).files?.[0] || null);
const onDragOver = () => { isDragging.value = true; };
const onDragLeave = () => { isDragging.value = false; };
const onDrop = (e: DragEvent) => {
  isDragging.value = false;
  handleFile(e.dataTransfer?.files[0] || null);
};
</script>