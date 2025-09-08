<template>
    <transition name="modal-fade">
        <div
v-if="show" tabindex="-1"
            class="fixed inset-0 bg-brand-negro bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            @click.self="close">
            <div
                class="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-3xl transform transition-all max-h-[90vh] overflow-y-auto">
                <h2 class="text-2xl font-bold text-brand-negro mb-6">{{ isEditing ? 'Editar' : 'Crear' }} Historia</h2>
                <form @submit.prevent="handleSubmit">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <!-- Columna Izquierda (2/3) -->
                        <div class="md:col-span-2 space-y-6">
                            <div>
                                <label for="titulo" class="block text-sm font-medium text-gray-700">Título</label>
                                <input
id="titulo" v-model="formData.titulo" type="text"
                                    class="mt-1 block w-full input-class" required>
                            </div>
                            <div class="mt-6">
                                <label class="block text-sm font-medium text-gray-700">Contenido</label>
                                <textarea
id="contenido" v-model="formData.contenido" rows="12"
                                    class="mt-1 block w-full input-class" required></textarea>
                            </div>
                        </div>

                        <!-- Columna Derecha (1/3) -->
                        <div class="space-y-6">
                             <ImageUploader
label="Imagen de Portada" :initial-preview="formData.url_imagen"
                                @file-change="handleFileChange" />
                            <div>
                                <label for="autor" class="block text-sm font-medium text-gray-700">Autor</label>
                                <input
id="autor" v-model="formData.autor" type="text"
                                    class="mt-1 block w-full input-class">
                            </div>
                            <div>
                                <label for="fecha_publicacion" class="block text-sm font-medium text-gray-700">Fecha de Publicación</label>
                                <input
id="fecha_publicacion" v-model="formData.fecha_publicacion" type="datetime-local"
                                    class="mt-1 block w-full input-class">
                                <p class="text-xs text-gray-500 mt-1">Dejar en blanco para no publicar aún.</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Categorías</label>
                                <div class="mt-2 p-3 border border-gray-300 rounded-md max-h-40 overflow-y-auto">
                                    <div v-for="category in allCategories" :key="category.id" class="flex items-center">
                                        <input
:id="`cat-${category.id}`" v-model="selectedCategories" type="checkbox" :value="category.id"
                                            class="h-4 w-4 rounded border-gray-300 text-brand-camel focus:ring-brand-camel">
                                        <label :for="`cat-${category.id}`" class="ml-2 block text-sm text-gray-900">{{ category.name }}</label>
                                    </div>
                                    <p v-if="allCategories.length === 0" class="text-xs text-gray-500">No hay categorías. Créalas en la sección de Categorías.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="errorMessage" class="mt-4 text-red-600 text-sm">{{ errorMessage }}</div>

                    <!-- Botones -->
                    <div class="mt-8 flex justify-end space-x-4">
                        <button type="button" class="btn-secondary" @click="close">Cancelar</button>
                        <button type="submit" :disabled="isLoading" class="btn-primary">
                            {{ isLoading ? 'Guardando...' : 'Guardar' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { ref, watch, computed, defineAsyncComponent } from 'vue';
import { createPost, updatePost, type Post, type PostData } from '@/services/postService';
import { getCategories, type Category } from '@/services/categoryService';
import { useAuthStore } from '@/stores/authStore';

const ImageUploader = defineAsyncComponent(() => import('./ImageUploader.vue'));

const props = defineProps<{
    show: boolean;
    post: Post & { categories?: Category[] } | null; // Post puede tener categorías
}>();

const emit = defineEmits(['close', 'save']);

const authStore = useAuthStore();

const defaultFormData = (): PostData & { url_imagen?: string | null } => ({
    titulo: '',
    contenido: '',
    autor: '',
    fecha_publicacion: null,
    imagen_file: null,
    url_imagen: null,
    categories: [],
});

const formData = ref(defaultFormData());
const allCategories = ref<Category[]>([]);
const selectedCategories = ref<number[]>([]);
const isLoading = ref(false);
const errorMessage = ref('');

const isEditing = computed(() => !!props.post);

watch(() => props.show, async (newVal) => {
    if (newVal) {
        errorMessage.value = '';
        // Cargar categorías
        try {
            allCategories.value = await getCategories();
        } catch (e) {
            errorMessage.value = 'No se pudieron cargar las categorías.';
        }

        if (props.post) {
            // Editando
            const { categories, ...postData } = props.post;
            formData.value = {
                ...defaultFormData(),
                ...postData,
                fecha_publicacion: props.post.fecha_publicacion ? props.post.fecha_publicacion.slice(0, 16) : null,
            };
            selectedCategories.value = props.post.categories?.map(cat => cat.id) || [];
        } else {
            // Creando
            formData.value = defaultFormData();
            selectedCategories.value = [];
        }
    }
});

const handleFileChange = (file: File | null) => {
    formData.value.imagen_file = file;
};

const handleSubmit = async () => {
    if (!authStore.token) {
        errorMessage.value = 'No estás autenticado.';
        return;
    }

    isLoading.value = true;
    errorMessage.value = '';

    const submissionData: PostData = {
        ...formData.value,
        categories: selectedCategories.value,
    };

    try {
        if (isEditing.value && props.post) {
            await updatePost(props.post.id, submissionData, authStore.token);
        } else {
            await createPost(submissionData, authStore.token);
        }
        emit('save');
        close();
    } catch (error: any) {
        console.error("Error al guardar el post:", error);
        errorMessage.value = error.response?.data?.message || 'Ocurrió un error al guardar la historia.';
    } finally {
        isLoading.value = false;
    }
};

const close = () => {
    emit('close');
};
</script>

<style scoped>
.input-class {
    @apply mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel;
}
.btn-primary {
    @apply bg-brand-camel text-white py-2 px-6 rounded-md hover:bg-opacity-90 transition-all duration-300 font-medium disabled:opacity-60;
}
.btn-secondary {
     @apply bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors;
}
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.3s ease-out;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}
</style>