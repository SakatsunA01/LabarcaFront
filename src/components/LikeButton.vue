<template>
    <button
class="flex items-center space-x-2 text-gray-600 hover:text-brand-borgona transition-colors duration-300 disabled:opacity-50" 
            @click.prevent.stop="toggleLike">
        <HeartIcon class="h-6 w-6" :class="{ 'fill-current text-brand-borgona': localIsLiked }" />
        <span class="font-semibold">{{ localLikeCount }}</span>
    </button>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { HeartIcon } from '@heroicons/vue/24/outline';
import { useAuthStore } from '@/stores/authStore';
import { likePost, unlikePost } from '@/services/postService';
import type { Post } from '@/services/postService';

const props = defineProps<{
    post: Post;
}>();

const authStore = useAuthStore();

const localIsLiked = ref(props.post.is_liked || false);
const localLikeCount = ref(props.post.likes_count || 0);

watch(() => props.post, (newPost) => {
    localIsLiked.value = newPost.is_liked || false;
    localLikeCount.value = newPost.likes_count || 0;
});

const toggleLike = async () => {
    if (!authStore.isAuthenticated) {
        // Or emit an event to open the login modal
        alert('Debes iniciar sesión para dar me gusta.');
        return;
    }

    const originalLiked = localIsLiked.value;
    const originalCount = localLikeCount.value;

    // Optimistic update
    localIsLiked.value = !localIsLiked.value;
    localLikeCount.value += localIsLiked.value ? 1 : -1;

    try {
        if (localIsLiked.value) {
            await likePost(props.post.id, authStore.token!);
        } else {
            await unlikePost(props.post.id, authStore.token!);
        }
    } catch (error) {
        console.error('Error toggling like:', error);
        // Revert on error
        localIsLiked.value = originalLiked;
        localLikeCount.value = originalCount;
        alert('Ocurrió un error al procesar tu solicitud.');
    }
};
</script>
