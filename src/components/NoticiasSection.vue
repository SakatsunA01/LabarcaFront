<template>
  <AnimatedSection>
    <section class="py-section-md px-2 sm:px-4 lg:px-6 bg-white dark:bg-brand-negro">
      <div class="container mx-auto max-w-7xl">
        <div class="flex justify-between items-center mb-10 md:mb-12 border-b border-black/5 dark:border-white/10 pb-4">
          <h2 class="font-playfair text-3xl md:text-4xl font-bold text-brand-negro dark:text-white">
            Historias de Nuestra Comunidad
          </h2>
          <router-link
            to="/comunidad"
            class="bg-brand-camel text-white py-2 px-6 rounded-md hover:bg-opacity-80 transition-all duration-300 text-md font-medium flex items-center gap-2 shadow-md hover:shadow-lg">
            <span>Ver Todas</span>
            <ArrowRightIcon class="h-4 w-4" />
          </router-link>
        </div>

        <!-- Filtros de Categoría -->
        <div
          v-if="!isLoading && categories.length > 0"
          class="flex justify-center flex-wrap gap-2 md:gap-3 mb-16">
          <button
            class="px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 shadow-sm bg-white text-brand-negro hover:bg-brand-camel/20 flex items-center gap-2"
            @click="goToCategory(null)">
            <TagIcon class="h-4 w-4" />
            <span>Todas</span>
          </button>
          <button
            v-for="category in categories" :key="category.id" class="px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 shadow-sm bg-white text-brand-negro hover:bg-brand-camel/20"
            @click="goToCategory(category.id)">
            {{ category.name }}
          </button>
        </div>

        <div v-if="isLoading" class="text-center py-10">
          <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-camel mb-4"></div>
          <p class="text-xl">Cargando historias...</p>
        </div>
        <div v-else-if="error" class="text-center text-red-500 bg-red-100 p-4 rounded-lg">
          <p>{{ error }}</p>
        </div>

        <div v-else-if="posts.length > 0" class="transition-opacity duration-500">
          <!-- Tres cards compactas, todas iguales -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="(post, index) in topThreePosts"
              :key="post.id"
              class="rounded-lg overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 relative group h-full w-full min-h-[260px]">
              <PostCard :post="post" :compact="true" :style="{ transitionDelay: `${index * 150}ms` }" />
            </div>
          </div>
        </div>

        <div v-else class="text-center py-10 bg-white/50 rounded-lg">
          <NewspaperIcon class="h-12 w-12 mx-auto text-brand-camel mb-4" />
          <p class="text-xl font-playfair">Próximamente, más historias de nuestra comunidad.</p>
        </div>
      </div>
    </section>
  </AnimatedSection>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getLatestPosts, type Post } from '@/services/postService';
import { getCategories, type Category } from '@/services/categoryService';
import PostCard from '@/components/PostCard.vue';
import AnimatedSection from '@/components/AnimatedSection.vue';
import { ArrowRightIcon, NewspaperIcon, TagIcon } from '@heroicons/vue/24/outline';

const router = useRouter();

const posts = ref<Post[]>([]);
const categories = ref<Category[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

const topThreePosts = computed(() => posts.value.slice(0, 3));

onMounted(async () => {
  try {
    isLoading.value = true;
    const [postsData, categoriesData] = await Promise.all([
      getLatestPosts(),
      getCategories()
    ]);
    posts.value = postsData;
    categories.value = categoriesData;
  } catch (err) {
    console.error('Error fetching section data:', err);
    error.value = 'No se pudieron cargar los datos de la comunidad.';
  } finally {
    isLoading.value = false;
  }
});

const goToCategory = (categoryId: number | null) => {
  const query = categoryId ? { category: categoryId } : {};
  router.push({ name: 'comunidad', query });
};
</script>
