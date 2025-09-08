<template>
  <div class="bg-brand-cream text-brand-negro min-h-screen">
    <div class="container mx-auto px-4 py-16 md:py-24 max-w-7xl">
      <h1 class="text-4xl md:text-6xl font-bold text-center mb-4 font-display">
        Historias de Nuestra Comunidad
      </h1>
      <p class="text-center text-lg text-brand-camel mb-12 max-w-2xl mx-auto">
        Descubre testimonios, procesos creativos y noticias que nos unen como comunidad artística.
      </p>

      <!-- Filtros de Categoría -->
      <div v-if="categories.length > 0" class="flex justify-center flex-wrap gap-2 md:gap-4 mb-12">
        <button
:class="[selectedCategory === null ? 'bg-brand-camel text-white' : 'bg-white text-brand-negro hover:bg-brand-camel/20']"
          class="px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 shadow-sm"
          @click="selectCategory(null)">
          Todas
        </button>
        <button
v-for="category in categories" :key="category.id" :class="[selectedCategory === category.id ? 'bg-brand-camel text-white' : 'bg-white text-brand-negro hover:bg-brand-camel/20']"
          class="px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 shadow-sm"
          @click="selectCategory(category.id)">
          {{ category.name }}
        </button>
      </div>

      <div v-if="isLoading" class="text-center py-10">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-camel mb-4"></div>
        <p class="text-xl">Cargando historias...</p>
      </div>

      <div v-if="error" class="text-center text-red-500 bg-red-100 p-4 rounded-lg">
        <p>{{ error }}</p>
      </div>

      <div v-if="!isLoading && !error">
        <div v-if="filteredPosts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PostCard v-for="post in filteredPosts" :key="post.id" :post="post" />
        </div>
        <div v-else class="text-center py-10">
            <p class="text-xl text-brand-negro">No hay historias en esta categoría aún.</p>
        </div>
      </div>
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
