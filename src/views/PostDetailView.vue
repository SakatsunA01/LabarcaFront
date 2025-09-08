<template>
  <div class="post-detail-view bg-brand-gris-claro min-h-screen">
    <div v-if="isLoading" class="flex justify-center items-center min-h-[calc(100vh-120px)] py-10">
      <div class="w-20 h-20 border-4 border-brand-camel border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else-if="error" class="text-center py-16 md:py-24 px-6">
      <h2 class="text-3xl text-brand-negro mb-4 font-semibold">Error al cargar la historia</h2>
      <p class="text-gray-700 leading-relaxed max-w-md mx-auto">{{ error }}</p>
      <router-link
to="/comunidad"
        class="mt-6 inline-block bg-brand-camel text-white py-2 px-6 rounded-md hover:bg-opacity-80">
        Volver a la Comunidad
      </router-link>
    </div>

    <div v-else-if="post" class="post-content">
      <!-- Hero Section -->
      <section class="relative h-[45vh] md:h-[60vh] bg-brand-negro group">
        <img
:src="fullImageUrl"
          :alt="`Imagen de ${post.titulo}`"
          class="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-60 transition-opacity duration-300" />
        <div class="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/50 to-transparent">
          <h1 class="text-4xl md:text-6xl font-bold text-white text-center px-4 drop-shadow-lg font-display">
            {{ post.titulo }}
          </h1>
        </div>
      </section>

      <div class="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <!-- Contenido del Post -->
        <article class="bg-white rounded-xl shadow-xl p-6 md:p-10">
            <div class="flex flex-wrap justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <div class="text-sm text-gray-500 mb-2 md:mb-0">
                    <span v-if="post.autor">Por <strong>{{ post.autor }}</strong></span>
                    <span v-if="post.autor && post.fecha_publicacion"> &bull; </span>
                    <span v-if="post.fecha_publicacion">{{ formatDate(post.fecha_publicacion) }}</span>
                </div>
                <div class="flex gap-2">
                    <span
v-for="category in post.categories" :key="category.id" 
                        class="inline-block bg-brand-borgona text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {{ category.name }}
                    </span>
                </div>
            </div>

            <div class="prose max-w-none text-gray-800 leading-relaxed" v-html="post.contenido"></div>

            <div class="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
                <router-link :to="{ name: 'comunidad' }" class="text-brand-camel hover:underline">
                    &larr; Volver a todas las historias
                </router-link>
                <LikeButton :post="post" />
            </div>
        </article>

        <!-- Sección de Comentarios -->
        <section class="mt-12">
            <h2 class="text-2xl font-bold text-brand-negro mb-6">Comentarios</h2>
            <CommentList v-if="post" :comments="post.comments || []" @delete-comment="handleDeleteComment" />
            <CommentForm v-if="post" :post-id="post.id" @comment-added="handleCommentAdded" />
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getPost, deleteComment, type Post } from '@/services/postService';
import LikeButton from '@/components/LikeButton.vue';
import CommentForm from '@/components/CommentForm.vue';
import CommentList from '@/components/CommentList.vue';
import { useAuthStore } from '@/stores/authStore';

const route = useRoute();
const post = ref<Post | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);
const authStore = useAuthStore();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fullImageUrl = computed(() => {
    if (post.value?.url_imagen) {
        if (post.value.url_imagen.startsWith('http')) {
            return post.value.url_imagen;
        }
        return `${API_BASE_URL}${post.value.url_imagen}`;
    }
    // Fallback image
    return `https://placehold.co/1920x800/171C1E/E2E2E2?text=${encodeURIComponent(post.value?.titulo || 'Historia')}`;
});

const fetchPost = async (id: string | number) => {
    try {
        isLoading.value = true;
        error.value = null;
        post.value = await getPost(id);
    } catch (err) {
        console.error(`Error al cargar el post ${id}:`, err);
        error.value = 'No se pudo cargar la historia. Es posible que no exista o haya un problema de conexión.';
    } finally {
        isLoading.value = false;
    }
};

const handleCommentAdded = () => {
    fetchPost(route.params.id as string);
};

const handleDeleteComment = async (commentId: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
        try {
            await deleteComment(commentId, authStore.token!); 
            fetchPost(route.params.id as string);
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('No se pudo eliminar el comentario.');
        }
    }
};

const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
};

onMounted(() => {
    fetchPost(route.params.id as string);
});

watch(() => route.params.id, (newId) => {
    if (newId) {
        fetchPost(newId as string);
    }
});
</script>

<style>
.prose h1, .prose h2, .prose h3 {
    color: #171C1E; /* brand-negro */
    font-family: 'Playfair Display', serif; /* font-display */
}

.prose p {
    margin-bottom: 1em;
    line-height: 1.7;
}

.prose a {
    color: #A67B5B; /* brand-camel */
    text-decoration: none;
    font-weight: 600;
}

.prose a:hover {
    text-decoration: underline;
}

.prose ul, .prose ol {
    margin-left: 1.5em;
}

.prose strong {
    color: #171C1E;
}
</style>