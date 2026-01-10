<template>
    <div class="bg-white rounded-lg shadow-card hover:shadow-card-hover overflow-hidden transform hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
        <router-link :to="{ name: 'comunidad-detalle', params: { id: post.id } }">
            <img v-if="post.url_imagen" :src="fullImageUrl" alt="Imagen del post" :class="['w-full object-cover', compact ? 'h-32' : 'h-48']">
            <div v-else :class="['w-full bg-gray-200 flex items-center justify-center', compact ? 'h-32' : 'h-48']">
                <span class="text-gray-500">Sin imagen</span>
            </div>
        </router-link>
        <div :class="['flex-grow flex flex-col', compact ? 'p-3' : 'p-6']">
            <div class="mb-2">
                <span
                    v-for="category in post.categories" :key="category.id" 
                    class="inline-block bg-brand-borgona text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                    {{ category.name }}
                </span>
            </div>
            <h3 :class="[compact ? 'text-base' : 'text-xl', 'font-bold text-brand-negro mb-1 font-display leading-tight']">{{ post.titulo }}</h3>
            <p v-if="post.autor || post.fecha_publicacion" :class="[compact ? 'text-xs mb-2' : 'text-sm mb-4', 'text-gray-500']">
                <span v-if="post.autor">Por {{ post.autor }}</span>
                <span v-if="post.autor && post.fecha_publicacion"> &bull; </span>
                <span v-if="post.fecha_publicacion">{{ formatDate(post.fecha_publicacion) }}</span>
            </p>
            <div :class="['text-gray-700 flex-grow', compact ? 'line-clamp-2' : 'line-clamp-4']" v-html="truncatedContent"></div>
            <div :class="[compact ? 'mt-3' : 'mt-6', 'flex justify-between items-center']">
                <router-link
                    :to="{ name: 'comunidad-detalle', params: { id: post.id } }"
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
    compact?: boolean;
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
    return undefined;
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



