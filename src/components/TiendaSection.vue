<template>
  <section ref="sectionRef" class="py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16 transition-all duration-1000 ease-out"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'">
        <h2 class="font-playfair text-4xl md:text-5xl font-bold text-brand-negro">
          Viste la Misión
        </h2>
        <p class="mt-4 font-inter text-lg text-brand-camel max-w-2xl mx-auto">
          Cada compra es una semilla que nos ayuda a financiar nuevos proyectos musicales, eventos de adoración y
          recursos para la iglesia.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <router-link v-for="(product, index) in products" :key="product.id"
          :to="{ name: 'producto-detalle', params: { id: product.id } }"
          class="group text-center transition-all duration-700 ease-out"
          :style="{ transitionDelay: `${index * 150}ms` }"
          :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'">
          <div class="relative bg-brand-gris-claro rounded-lg overflow-hidden aspect-w-1 aspect-h-1">
            <img :src="product.image1" :alt="product.name"
              class="w-full h-full object-cover object-center transition-opacity duration-500 ease-in-out group-hover:opacity-0">
            <img :src="product.image2" :alt="product.name"
              class="w-full h-full object-cover object-center absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100">
          </div>
          <h3 class="font-inter font-semibold text-brand-negro mt-4">{{ product.name }}</h3>
          <p class="font-inter text-brand-negro mt-1">{{ product.price }}</p>
          <div class="btn-secondary mt-4">
            Ver Detalles
          </div>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const sectionRef = ref(null);
const isVisible = ref(false);

const products = ref([
  {
    id: 1,
    name: "Remera La Barca - 'Eco de Su Voz'",
    price: '$25.00',
    image1: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1980&auto=format&fit=crop',
    image2: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1974&auto=format&fit=crop',
  },
  {
    id: 2,
    name: "Tote Bag 'Gracia Sublime'",
    price: '$20.00',
    image1: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2070&auto=format&fit=crop',
    image2: 'https://images.unsplash.com/photo-1579432214992-3c6b2f986262?q=80&w=1974&auto=format&fit=crop',
  },
  {
    id: 3,
    name: "Gorra 'La Barca Producciones'",
    price: '$18.00',
    image1: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?q=80&w=1974&auto=format&fit=crop',
    image2: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?q=80&w=1974&auto=format&fit=crop',
  },
  {
    id: 4,
    name: "Taza 'Café y Adoración'",
    price: '$15.00',
    image1: 'https://images.unsplash.com/photo-1530968831187-a937ade474cb?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    image2: 'https://images.unsplash.com/photo-1555553123-35c4b9b2b33f?q=80&w=1964&auto=format&fit=crop',
  },
]);

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true;
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  if (sectionRef.value) {
    observer.observe(sectionRef.value);
  }
});
</script>

<style scoped>
.btn-secondary {
  @apply inline-block bg-transparent border-2 border-brand-camel text-brand-camel font-inter font-bold py-2 px-6 rounded-md transition-all duration-300 transform group-hover:scale-105 group-hover:bg-brand-camel group-hover:text-brand-negro;
}

/* For the aspect ratio, you might need the @tailwindcss/aspect-ratio plugin */
/* If not installed, you can use a padding-bottom trick for aspect ratio */
.aspect-w-1 {
  position: relative;
  padding-bottom: 100%;
  /* 1:1 Aspect Ratio */
}

.aspect-h-1>* {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
