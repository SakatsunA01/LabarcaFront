<template>
  <div class="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div v-if="product" class="max-w-7xl mx-auto">

      <router-link to="/" class="inline-flex items-center text-brand-camel hover:text-brand-borgona mb-8 font-inter font-semibold group">
        <svg class="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Volver a Inicio
      </router-link>

      <div class="grid md:grid-cols-2 gap-8 md:gap-12">
        <!-- Columna de Imágenes -->
        <div class="md:col-span-1">
          <div class="aspect-w-1 aspect-h-1 bg-brand-gris-claro rounded-lg overflow-hidden shadow-lg">
            <img :src="activeImage" :alt="product.name" class="w-full h-full object-cover object-center transition-opacity duration-300">
          </div>
          <div class="grid grid-cols-4 gap-2 mt-2">
            <div 
              v-for="(image, index) in product.images" 
              :key="index" 
              @click="activeImage = image"
              class="aspect-w-1 aspect-h-1 bg-brand-gris-claro rounded-md overflow-hidden cursor-pointer border-2 transition-colors"
              :class="activeImage === image ? 'border-brand-camel' : 'border-transparent'"
            >
              <img :src="image" :alt="`${product.name} - vista ${index + 1}`" class="w-full h-full object-cover object-center">
            </div>
          </div>
        </div>

        <!-- Columna de Información -->
        <div class="md:col-span-1 flex flex-col">
          <div>
            <h1 class="text-4xl font-bold font-playfair text-brand-negro">{{ product.name }}</h1>
            <p class="text-3xl font-inter text-brand-negro mt-4">{{ product.price }}</p>
            
            <div class="mt-6 prose prose-lg font-inter text-brand-negro leading-relaxed">
              <p>{{ product.description }}</p>
            </div>
          </div>

          <div class="mt-auto pt-8">
            <button class="w-full bg-brand-borgona text-white font-bold font-inter py-4 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Añadir al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-20">
      <p class="text-brand-negro font-inter">Producto no encontrado.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

// Mock data para los productos
const products = ref([
  {
    id: 1,
    name: "Remera La Barca - 'Eco de Su Voz'",
    price: '$25.00',
    description: 'Viste la misión con esta remera de algodón premium, suave al tacto y con un diseño que inspira. Perfecta para el día a día y para compartir el mensaje.',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1980&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1974&auto=format&fit=crop'
    ]
  },
  {
    id: 2,
    name: "Tote Bag 'Gracia Sublime'",
    price: '$20.00',
    description: 'Lleva todo lo que necesites con estilo y propósito. Este tote bag de lona resistente es ideal para tus libros, compras o para ir a la iglesia.',
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1579432214992-3c6b2f986262?q=80&w=1974&auto=format&fit=crop'
    ]
  },
  {
    id: 3,
    name: "Gorra 'La Barca Producciones'",
    price: '$18.00',
    description: 'Protección y estilo con el logo de La Barca bordado. Un accesorio de alta calidad para representar a la comunidad.',
    images: [
      'https://images.unsplash.com/photo-1529958030536-3a2cddc35361?q=80&w=1976&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?q=80&w=1974&auto=format&fit=crop'
    ]
  },
  {
    id: 4,
    name: "Taza 'Café y Adoración'",
    price: '$15.00',
    description: 'Empieza tus mañanas recordando lo esencial. Taza de cerámica de alta calidad, perfecta para tu café, té o bebida favorita.',
    images: [
      'https://images.unsplash.com/photo-1608799429595-88949d3c1c1f?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555553123-35c4b9b2b33f?q=80&w=1964&auto=format&fit=crop'
    ]
  },
]);

const route = useRoute();
const product = computed(() => {
  return products.value.find(p => p.id === Number(route.params.id));
});

const activeImage = ref('');

// Inicializa la imagen activa cuando el producto se carga
watch(product, (newProduct) => {
  if (newProduct && newProduct.images.length > 0) {
    activeImage.value = newProduct.images[0];
  }
}, { immediate: true });

onMounted(() => {
  window.scrollTo(0, 0);
});
</script>

<style scoped>
.aspect-w-1 {
  position: relative;
  padding-bottom: 100%;
}
.aspect-h-1 > *,
.aspect-w-1 > * {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
