<template>
    <div class="p-6 md:p-8">
        <h1 class="text-3xl font-bold text-brand-negro mb-6">Gestion de Hitosrias</h1>

        <div class="flex flex-col sm:flex-row sm:justify-end gap-3 mb-6">
            <button class="w-full sm:w-auto bg-brand-camel text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors" @click="openModal(null)">
                Crear Nueva Historia
            </button>
        </div>

        <!-- Tabla de Posts -->
        <div class="bg-white rounded-lg shadow-md overflow-x-auto">
            <table class="w-full table-auto min-w-[640px]">
                <thead class="bg-gray-100 text-left text-sm font-semibold text-gray-600">
                    <tr>
                        <th class="p-4">TÃ­tulo</th>
                        <th class="p-4">Autor</th>
                        <th class="p-4">Fecha de PublicaciÃ³n</th>
                        <th class="p-4">Acciones</th>
                    </tr>
                </thead>
                <tbody v-if="!isLoading">
                    <tr v-for="post in posts" :key="post.id" class="border-b hover:bg-gray-50">
                        <td class="p-4">{{ post.titulo }}</td>
                        <td class="p-4">{{ post.autor || 'N/A' }}</td>
                        <td class="p-4">{{ post.fecha_publicacion ? formatDate(post.fecha_publicacion) : 'No publicada' }}</td>
                        <td class="p-4">
                            <div class="flex flex-wrap items-center gap-2">
                                <button class="bg-blue-600 text-white py-1 px-2 rounded-md hover:bg-blue-700 transition-colors" @click="openModal(post)">Editar</button>
                                <button class="bg-red-600 text-white py-1 px-2 rounded-md hover:bg-red-700 transition-colors" @click="confirmDelete(post)">Eliminar</button>
                                <button class="bg-brand-camel text-white py-1 px-2 rounded-md hover:bg-opacity-90 transition-colors" @click="openPreview(post)">Vista previa</button>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="posts.length === 0">
                        <td colspan="4" class="p-4 text-center text-gray-500">No hay historias para mostrar.</td>
                    </tr>
                </tbody>
            </table>
             <div v-if="isLoading" class="p-4 text-center">Cargando...</div>
             <div v-if="error" class="p-4 text-center text-red-500">{{ error }}</div>
        </div>

        <!-- Modal para Crear/Editar -->
        <PostFormModal 
            :show="isModalOpen"
            :post="selectedPost"
            @close="closeModal"
            @save="handleSave"
        />

        <!-- Vista previa -->
        <transition name="modal-fade">
            <div
                v-if="previewPost"
                class="fixed inset-0 bg-brand-negro bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
                @click.self="closePreview">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
                    <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                        <h2 class="text-xl font-bold text-brand-negro">Vista previa historia</h2>
                        <button class="text-gray-500 hover:text-brand-negro" @click="closePreview">Cerrar</button>
                    </div>
                    <div class="p-6 md:p-8 bg-brand-gris-claro">
                        <div class="bg-white rounded-2xl shadow-card border border-black/5 overflow-hidden">
                            <div class="p-4 overflow-auto">
                                <StoryGenerator :post="previewPost" :preview="true" />
                            </div>
                        </div>
                        <p class="text-xs text-gray-500 mt-4">Vista de ejemplo para Instagram.</p>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { getPosts, deletePost, type Post } from '@/services/postService';
import { useAuthStore } from '@/stores/authStore';

const PostFormModal = defineAsyncComponent(() => import('@/components/admin/PostFormModal.vue'));
const StoryGenerator = defineAsyncComponent(() => import('@/components/admin/StoryGenerator.vue'));

const posts = ref<Post[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const authStore = useAuthStore();

const isModalOpen = ref(false);
const selectedPost = ref<Post | null>(null);
const previewPost = ref<Post | null>(null);


const fetchPosts = async () => {
    try {
        isLoading.value = true;
        posts.value = await getPosts();
    } catch (err) {
        console.error('Error al cargar posts:', err);
        error.value = 'No se pudieron cargar las historias.';
    } finally {
        isLoading.value = false;
    }
};

const openModal = (post: Post | null) => {
    selectedPost.value = post;
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    selectedPost.value = null;
};

const handleSave = () => {
    closeModal();
    fetchPosts();
};

const openPreview = (post: Post) => {
    previewPost.value = post;
};

const closePreview = () => {
    previewPost.value = null;
};

const confirmDelete = async (post: Post) => {
    if (window.confirm(`Â¿EstÃ¡s seguro de que quieres eliminar la historia "${post.titulo}"?`)) {
        try {
            await deletePost(post.id, authStore.token!);
            fetchPosts();
        } catch (err) {
            console.error('Error al eliminar el post:', err);
            alert('No se pudo eliminar la historia.');
        }
    }
};

const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
};

onMounted(() => {
    fetchPosts();
});
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.25s ease-out;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}
</style>
