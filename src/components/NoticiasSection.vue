<template>
  <AnimatedSection>
    <section class="py-12 md:py-16 px-6 bg-transparent overflow-hidden font-sans">
      <div class="container mx-auto max-w-7xl">

        <div class="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b border-black/5 pb-6">
          <div class="space-y-1">
            <span class="text-brand-camel uppercase tracking-[0.4em] text-[9px] font-bold block">Voces &
              Vivencias</span>
            <h2 class="font-playfair text-4xl md:text-5xl text-brand-negro italic">
              Historias de Nuestra Comunidad
            </h2>
          </div>

          <router-link to="/comunidad"
            class="group mt-6 md:mt-0 flex items-center gap-2 text-brand-camel font-bold uppercase text-[9px] tracking-widest hover:text-brand-negro transition-colors">
            Explorar todas las historias
            <ArrowRightIcon class="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </router-link>
        </div>

        <nav v-if="!isLoading && categories.length > 0" class="flex justify-center flex-wrap gap-3 mb-12">
          <button
            class="px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all duration-500 shadow-card border border-gray-50 bg-white text-gray-400 hover:text-brand-negro"
            @click="goToCategory(null)">
            Todas
          </button>
          <button v-for="category in categories" :key="category.id"
            class="px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all duration-500 shadow-card border border-gray-100 bg-white text-gray-400 hover:text-brand-negro"
            @click="goToCategory(category.id)">
            {{ category.name }}
          </button>
        </nav>

        <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
          <div class="w-10 h-10 border-2 border-brand-camel border-t-transparent rounded-full animate-spin"></div>
        </div>

        <div v-else-if="posts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="(post, index) in topThreePosts" :key="post.id"
            class="group bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-1 overflow-hidden border border-gray-50">
            <PostCard :post="post" :compact="true" />
          </div>
        </div>

        <div v-else
          class="text-center py-20 bg-white rounded-3xl shadow-card border border-gray-50 max-w-2xl mx-auto font-playfair italic text-gray-400">
          <NewspaperIcon class="h-10 w-10 mx-auto text-gray-200 mb-4" />
          Próximamente, más historias de nuestra comunidad.
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
import { ArrowRightIcon, NewspaperIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const posts = ref<Post[]>([]);
const categories = ref<Category[]>([]);
const isLoading = ref(true);

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
    console.error('Error:', err);
  } finally {
    isLoading.value = false;
  }
});

const goToCategory = (categoryId: number | null) => {
  const query = categoryId ? { category: categoryId } : {};
  router.push({ name: 'comunidad', query });
};
</script>

<style scoped>
.shadow-card {
  box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.05);
}

.shadow-card-hover {
  box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.07);
}
</style>
