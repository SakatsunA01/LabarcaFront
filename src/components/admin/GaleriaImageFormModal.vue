<template>
    <transition name="modal-fade">
        <div v-if="show" tabindex="-1"
            class="fixed inset-0 bg-brand-negro bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            @click.self="close">
            <div
                class="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all max-h-[90vh] overflow-y-auto">
                <h2 class="text-2xl font-bold text-brand-negro mb-6">{{ isEditing ? 'Editar' : 'Añadir' }} Imagen de
                    Galería</h2>
                <form @submit.prevent="handleSubmit">
                    <div class="space-y-6">
                        <div>
                            <label for="descripcion" class="block text-sm font-medium text-gray-700">Descripción</label>
                            <input type="text" id="descripcion" v-model="formData.descripcion"
                                placeholder="Breve descripción de la imagen"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel">
                        </div>
                        <ImageUploader label="Archivo de Imagen" :initial-preview="formData.url_imagen"
                            @file-change="file => handleFileChange(file, 'imagen_file')" />
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

const ImageUploader = defineAsyncComponent(() => import('./ImageUploader.vue'));

interface GaleriaImage {
    id: number;
    id_evento: number;
    url_imagen: string;
    descripcion?: string;
}

const props = defineProps<{
    show: boolean;
    eventoId: number | null;
    image: GaleriaImage | null;
}>();

const emit = defineEmits(['close', 'save']);

const defaultFormData = {
    descripcion: '',
    url_imagen: null, // This will hold the URL for existing images
};

const formData = ref({ ...defaultFormData });
const imageFile = ref<File | null>(null); // This will hold the actual File object

const isLoading = ref(false);
const errorMessage = ref('');

const isEditing = computed(() => !!props.image);
const API_URL = 'http://localhost:8000/api';

watch(() => props.show, (newVal) => {
    if (newVal) {
        errorMessage.value = '';
        if (props.image) {
            formData.value = { ...defaultFormData, ...props.image };
        } else {
            formData.value = { ...defaultFormData };
        }
        imageFile.value = null; // Reset file input
    }
});

const handleFileChange = (file: File | null) => {
    imageFile.value = file;
};

const handleSubmit = async () => {
    isLoading.value = true;
    errorMessage.value = '';

    const submissionData = new FormData();
    submissionData.append('id_evento', props.eventoId!.toString()); // Aseguramos que eventoId no sea null
    if (formData.value.descripcion) {
        submissionData.append('descripcion', formData.value.descripcion);
    }

    if (imageFile.value) {
        submissionData.append('imagen_file', imageFile.value);
    } else if (isEditing.value && formData.value.url_imagen === null) {
        // Si estamos editando y la imagen fue explícitamente borrada (url_imagen = null)
        submissionData.append('url_imagen', ''); // Enviamos cadena vacía para indicar que se debe borrar
    }

    try {
        if (isEditing.value && props.image) {
            submissionData.append('_method', 'PUT'); // Laravel espera POST para FormData con _method para PUT/PATCH
            await axios.post(`${API_URL}/galerias-eventos/${props.image.id}`, submissionData);
        } else {
            await axios.post(`${API_URL}/galerias-eventos`, submissionData);
        }
        emit('save');
    } catch (error: any) {
        console.error("Error al guardar imagen de galería:", error);
        errorMessage.value = error.response?.data?.message || 'Ocurrió un error al guardar la imagen.';
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
