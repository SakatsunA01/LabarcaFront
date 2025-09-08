<template>
    <div class="p-6 md:p-8">
        <h1 class="text-3xl font-bold text-brand-negro mb-6">Gestión de Historias</h1>

        <div class="flex justify-end mb-6">
            <button class="bg-brand-camel text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors" @click="openModal(null)">
                Crear Nueva Historia
            </button>
        </div>

        <!-- Tabla de Posts -->
        <div class="bg-white rounded-lg shadow-md overflow-x-auto">
            <table class="w-full table-auto">
                <thead class="bg-gray-100 text-left text-sm font-semibold text-gray-600">
                    <tr>
                        <th class="p-4">Título</th>
                        <th class="p-4">Autor</th>
                        <th class="p-4">Fecha de Publicación</th>
                        <th class="p-4">Acciones</th>
                    </tr>
                </thead>
                <tbody v-if="!isLoading">
                    <tr v-for="post in posts" :key="post.id" class="border-b hover:bg-gray-50">
                        <td class="p-4">{{ post.titulo }}</td>
                        <td class="p-4">{{ post.autor || 'N/A' }}</td>
                        <td class="p-4">{{ post.fecha_publicacion ? formatDate(post.fecha_publicacion) : 'No publicada' }}</td>
                        <td class="p-4 flex items-center space-x-2">
                            <button class="text-blue-600 hover:text-blue-800" @click="openModal(post)">Editar</button>
                            <button class="text-red-600 hover:text-red-800" @click="confirmDelete(post)">Eliminar</button>
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
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { getPosts, deletePost, type Post } from '@/services/postService';
import { useAuthStore } from '@/stores/authStore';

const PostFormModal = defineAsyncComponent(() => import('@/components/admin/PostFormModal.vue'));

const posts = ref<Post[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const authStore = useAuthStore();

const isModalOpen = ref(false);
const selectedPost = ref<Post | null>(null);

const fetchPosts = async () => {
    try {
        isLoading.value = true;
        posts.value = await getPosts(); // Por ahora, trae todos
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
    fetchPosts(); // Recargar la lista de posts
};

const confirmDelete = async (post: Post) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la historia "${post.titulo}"?`)) {
        try {
            await deletePost(post.id, authStore.token!);
            fetchPosts(); // Recargar la lista
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
