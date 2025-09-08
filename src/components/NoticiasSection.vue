<template>
  <section ref="sectionRef" class="bg-gray-50 py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
    <div class="max-w-7xl mx-auto">
      <div
class="text-center mb-12 transition-all duration-1000 ease-out"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'">
        <h2 class="font-playfair text-3xl md:text-4xl font-bold text-brand-negro mb-6 md:mb-8">
          Historias de Nuestra Comunidad
        </h2>
        <p class="mt-4 font-inter text-lg text-brand-camel">
          Testimonios, procesos y noticias que nos unen.
        </p>
      </div>

      <!-- Filtros de Categoría -->
      <div
v-if="!isLoading && categories.length > 0"
        class="flex justify-center flex-wrap gap-2 md:gap-3 mb-12 transition-all duration-1000 ease-out"
        :class="isVisible ? 'opacity-100' : 'opacity-0'">
        <button
class="px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 shadow-sm bg-white text-brand-negro hover:bg-brand-camel/20"
          @click="goToCategory(null)">
          Todas
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
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          <!-- Post Destacado -->
          <router-link
v-if="featuredPost" :to="{ name: 'comunidad-detalle', params: { id: featuredPost.id } }"
            class="md:col-span-2 lg:col-span-2 rounded-lg overflow-hidden shadow-lg group transform hover:-translate-y-2 transition-transform duration-300 ease-in-out">
            <div class="relative w-full h-96">
              <img
:src="featuredPost.url_imagen" :alt="featuredPost.titulo"
                class="absolute inset-0 w-full h-full object-cover">
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div class="absolute bottom-0 left-0 p-6 text-white">
                <h3 class="text-2xl font-bold">{{ featuredPost.titulo }}</h3>
                <p class="mt-2 text-sm opacity-90">{{ featuredPost.contenido.substring(0, 120) }}...</p>
              </div>
            </div>
          </router-link>

          <!-- Posts Secundarios -->
          <div class="lg:col-span-1 flex flex-col space-y-8">
            <PostCard
v-for="(post, index) in secondaryPosts" :key="post.id" :post="post"
              :style="{ transitionDelay: `${index * 150}ms` }" />
          </div>
        </div>
        
        <div class="text-center mt-16">
          <router-link
to="/comunidad"
            class="bg-brand-camel text-white py-3 px-8 rounded-md hover:bg-opacity-80 transition-colors text-lg font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1">
            Ver Todas las Historias
          </router-link>
        </div>
      </div>

      <div v-else class="text-center py-10 bg-white/50 rounded-lg">
        <p class="text-xl text-brand-negro">Próximamente, más historias de nuestra comunidad.</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getLatestPosts, type Post } from '@/services/postService';
import { getCategories, type Category } from '@/services/categoryService';
import PostCard from '@/components/PostCard.vue';
import { useIntersectionObserver } from '@vueuse/core';

const sectionRef = ref(null);
const isVisible = ref(false);
const router = useRouter();

const posts = ref<Post[]>([]);
const categories = ref<Category[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

const featuredPost = computed(() => posts.value.length > 0 ? posts.value[0] : null);
const secondaryPosts = computed(() => posts.value.slice(1, 3));

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
  router.push({ name: 'Comunidad', query });
};

useIntersectionObserver(
  sectionRef,
  ([{ isIntersecting }]) => {
    if (isIntersecting) {
      isVisible.value = true;
    }
  },
  { threshold: 0.1 }
);
</script>