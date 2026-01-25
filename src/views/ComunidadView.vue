<template>
  <div class="comunidad-view bg-brand-gris-claro min-h-screen py-12 md:py-16 font-sans">
    <div class="container mx-auto px-6 max-w-6xl">

      <header class="mb-16 text-center space-y-3">
        <span class="text-brand-camel uppercase tracking-[0.5em] text-[10px] font-bold block">Voces & Vivencias</span>
        <h1 class="text-5xl md:text-7xl font-playfair text-brand-negro italic">Comunidad</h1>
      </header>

      <transition name="fade" mode="out-in">
        <div v-if="filteredPosts.length > 0" class="space-y-12 md:space-y-20">

          <div class="group">
            <PostCard :post="filteredPosts[0]" layout="hero" class="h-[500px] md:h-[600px]" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">

            <div v-if="filteredPosts[1]" class="md:col-span-7">
              <PostCard :post="filteredPosts[1]" layout="featured" />
            </div>

            <div v-if="filteredPosts[2]" class="md:col-span-5 flex flex-col justify-center">
              <PostCard :post="filteredPosts[2]" layout="compact" />
            </div>

            <div v-if="filteredPosts[3]" class="md:col-span-5 flex flex-col justify-center">
              <PostCard :post="filteredPosts[3]" layout="compact" />
            </div>

            <div v-if="filteredPosts[4]" class="md:col-span-7">
              <PostCard :post="filteredPosts[4]" layout="featured" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-12 border-t border-black/5">
            <PostCard v-for="post in filteredPosts.slice(5)" :key="post.id" :post="post" layout="standard" />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPosts, type Post } from '@/services/postService';
import { getCategories, type Category } from '@/services/categoryService';
import PostCard from '@/components/PostCard.vue';

const posts = ref<Post[]>([]);
const categories = ref<Category[]>([]);
const selectedCategory = ref<number | null>(null);

const isLoading = ref(true);
const error = ref<string | null>(null);

const route = useRoute();
const router = useRouter();

// Cargar posts y categorías al montar el componente
onMounted(async () => {
  try {
    isLoading.value = true;
    const [postsData, categoriesData] = await Promise.all([
      getPosts(),
      getCategories()
    ]);
    posts.value = postsData;
    categories.value = categoriesData;

    // Establecer categoría inicial desde la URL
    const categoryIdFromUrl = route.query.category;
    if (categoryIdFromUrl) {
      selectedCategory.value = Number(categoryIdFromUrl);
    }

  } catch (err) {
    console.error('Error al cargar datos de la comunidad:', err);
    error.value = 'No se pudieron cargar las historias. Inténtalo de nuevo más tarde.';
  } finally {
    isLoading.value = false;
  }
});

// Posts filtrados basados en la categoría seleccionada
const filteredPosts = computed(() => {
  if (selectedCategory.value === null) {
    return posts.value;
  }
  return posts.value.filter(post =>
    post.categories?.some(cat => cat.id === selectedCategory.value)
  );
});

// Función para cambiar la categoría seleccionada y actualizar la URL
const selectCategory = (categoryId: number | null) => {
  selectedCategory.value = categoryId;
  router.push({ query: categoryId ? { category: categoryId } : {} });
};

// Observar cambios en la URL para actualizar el filtro
watch(() => route.query.category, (newCategoryId) => {
  selectedCategory.value = newCategoryId ? Number(newCategoryId) : null;
});

</script>
<style scoped>
.shadow-card {
  box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.05);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
