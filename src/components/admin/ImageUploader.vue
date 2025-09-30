<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
    <div
      class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
      :class="{ 'border-brand-camel bg-camel-50': isDragging }"
      @click="triggerFileInput"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
    >
      <div class="space-y-1 text-center">
        <div v-if="previewUrl" class="mx-auto mb-2">
          <img
            v-if="fileType === 'image'"
            :src="previewUrl"
            alt="Preview"
            class="h-24 w-auto rounded-md object-contain"
          />
          <video
            v-else-if="fileType === 'video'"
            :src="previewUrl"
            controls
            class="h-24 w-auto rounded-md object-contain"
          ></video>
        </div>
        <div v-else>
          <PhotoIcon v-if="fileType === 'image'" class="mx-auto h-12 w-12 text-gray-400" />
          <VideoCameraIcon v-else-if="fileType === 'video'" class="mx-auto h-12 w-12 text-gray-400" />
          <DocumentIcon v-else class="mx-auto h-12 w-12 text-gray-400" />
        </div>

        <div class="flex text-sm text-gray-600">
          <p class="relative rounded-md font-medium text-brand-camel hover:text-brand-borgona">
            <span>Sube un archivo</span>
          </p>
          <p class="pl-1">o arrástralo aquí</p>
        </div>
        <p class="text-xs text-gray-500">{{ helpText }}</p>
      </div>
    </div>
    <input
      ref="fileInput"
      :id="inputId"
      :name="inputId"
      type="file"
      class="sr-only"
      :accept="acceptTypes"
      @change="onFileSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { PhotoIcon, VideoCameraIcon, DocumentIcon } from '@heroicons/vue/24/outline';

const props = defineProps<{
  label: string;
  initialPreview?: string | null;
  fileType?: 'image' | 'video' | 'any';
}>();
const emit = defineEmits(['file-change']);

const fileInput = ref<HTMLInputElement | null>(null);

const getFullUrl = (path: string | null | undefined): string | null => {
  if (path && !path.startsWith('blob:')) {
    const baseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace('/api', '');
    return `${baseUrl}${path}`;
  }
  return path || null;
};

const previewUrl = ref<string | null>(getFullUrl(props.initialPreview));
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
  previewUrl.value = getFullUrl(newVal);
});

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFile = (file: File | null) => {
  if (!file) {
    previewUrl.value = getFullUrl(props.initialPreview); // Revert to initial if selection is cancelled
    emit('file-change', null);
    return;
  }

  // Validation logic...
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
