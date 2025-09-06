<template>
    <div class="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 h-full flex flex-col">
        <router-link :to="{ name: 'comunidad-detalle', params: { id: post.id } }">
            <img v-if="post.url_imagen" :src="fullImageUrl" alt="Imagen del post" class="w-full h-48 object-cover">
            <div v-else class="w-full h-48 bg-gray-200 flex items-center justify-center">
                <span class="text-gray-500">Sin imagen</span>
            </div>
        </router-link>
        <div class="p-6 flex-grow flex flex-col">
            <div class="mb-2">
                <span v-for="category in post.categories" :key="category.id" 
                      class="inline-block bg-brand-borgona text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                    {{ category.name }}
                </span>
            </div>
            <h3 class="text-xl font-bold text-brand-negro mb-2 font-display">{{ post.titulo }}</h3>
            <p v-if="post.autor || post.fecha_publicacion" class="text-sm text-gray-500 mb-4">
                <span v-if="post.autor">Por {{ post.autor }}</span>
                <span v-if="post.autor && post.fecha_publicacion"> &bull; </span>
                <span v-if="post.fecha_publicacion">{{ formatDate(post.fecha_publicacion) }}</span>
            </p>
            <div class="text-gray-700 flex-grow" v-html="truncatedContent"></div>
            <div class="mt-6 flex justify-between items-center">
                <router-link :to="{ name: 'comunidad-detalle', params: { id: post.id } }"
                    class="font-semibold text-brand-camel hover:text-brand-negro transition-colors duration-300">
                    Leer más &rarr;
                </router-link>
                <LikeButton :post="post" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Post } from '@/services/postService';
import LikeButton from './LikeButton.vue';

const props = defineProps<{
    post: Post;
}>();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fullImageUrl = computed(() => {
    if (props.post.url_imagen) {
        // Si la URL ya es absoluta, no la modificamos
        if (props.post.url_imagen.startsWith('http')) {
            return props.post.url_imagen;
        }
        // Si no, le añadimos la base de la API
        return `${API_BASE_URL}${props.post.url_imagen}`;
    }
    return null;
});

const truncatedContent = computed(() => {
    // Limita el contenido a 150 caracteres y añade puntos suspensivos
    const strippedContent = props.post.contenido.replace(/<[^>]+>/g, ''); // Quita HTML para el conteo
    if (strippedContent.length > 150) {
        return `${strippedContent.substring(0, 150)}...`;
    }
    return strippedContent;
});

const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
};
</script>
