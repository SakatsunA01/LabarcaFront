<template>
  <section ref="sectionRef" class="bg-brand-gris-claro py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
    <div class="max-w-7xl mx-auto">
      <div 
        class="text-center mb-16 transition-all duration-1000 ease-out"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'"
      >
        <h2 class="font-playfair text-4xl md:text-5xl font-bold text-brand-negro">
          Historias de Nuestra Comunidad
        </h2>
        <p class="mt-4 font-inter text-lg text-brand-camel">
          Testimonios, procesos y noticias que nos unen.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
        <!-- Post Destacado -->
        <router-link 
          :to="{ name: 'noticia-detalle', params: { slug: articles[0].slug } }"
          class="lg:col-span-2 mb-8 lg:mb-0 transition-all duration-1000 ease-out block group"
          :class="isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'"
        >
          <div class="relative w-full h-full min-h-[400px] rounded-lg overflow-hidden shadow-lg">
            <img :src="articles[0].imageUrl" :alt="articles[0].title" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
            <div class="absolute bottom-0 left-0 p-8 text-white">
              <span class="inline-block bg-brand-borgona text-white text-sm font-semibold px-3 py-1 rounded-md mb-2">{{ articles[0].category }}</span>
              <h3 class="font-playfair text-3xl font-bold">{{ articles[0].title }}</h3>
              <p class="font-inter mt-2 opacity-90">{{ articles[0].excerpt }}</p>
              <div class="font-inter font-bold text-brand-camel mt-4 inline-block relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bottom-0 after:left-0 after:bg-brand-camel after:transform after:scale-x-0 after:origin-bottom-right after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-hover:after:origin-bottom-left">
                Leer Historia Completa
              </div>
            </div>
          </div>
        </router-link>

        <!-- Posts Secundarios -->
        <div class="flex flex-col space-y-8">
          <router-link 
            v-for="(article, index) in articles.slice(1)"
            :key="article.slug"
            :to="{ name: 'noticia-detalle', params: { slug: article.slug } }"
            class="group relative block w-full rounded-lg overflow-hidden shadow-lg transition-all duration-1000 ease-out"
            :style="{ transitionDelay: `${(index + 1) * 200}ms` }"
            :class="isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'"
          >
            <img :src="article.imageUrl" :alt="article.title" class="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110">
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div class="absolute bottom-0 left-0 p-6 text-white">
               <span class="inline-block bg-brand-borgona text-white text-sm font-semibold px-3 py-1 rounded-md mb-2">{{ article.category }}</span>
              <h3 class="font-playfair text-xl font-bold">{{ article.title }}</h3>
              <div class="font-inter font-bold text-brand-camel mt-2 inline-block text-sm relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bottom-0 after:left-0 after:bg-brand-camel after:transform after:scale-x-0 after:origin-bottom-right after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-hover:after:origin-bottom-left">
                Leer Historia
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const sectionRef = ref(null);
const isVisible = ref(false);

const articles = ref([
  {
    slug: 'la-historia-detras-de-tu-paz',
    title: "La historia detrás de nuestra nueva canción: 'Tu Paz'",
    category: 'Detrás de Escena',
    excerpt: "Un viaje de composición y fe en medio de la tormenta. Descubre cómo nació esta adoración desde la vulnerabilidad y la esperanza.",
    imageUrl: 'https://images.unsplash.com/photo-1524230659267-39921e6a5d2d?q=80&w=2070&auto=format&fit=crop',
  },
  {
    slug: 'entrevista-salmistas-unidos',
    title: "Entrevista a Salmistas Unidos: Adoración en tiempos difíciles",
    category: 'Testimonio',
    imageUrl: 'https://images.unsplash.com/photo-1517230878791-4d28214057c2?q=80&w=2070&auto=format&fit=crop',
  },
  {
    slug: 'resumen-ultimo-evento',
    title: "Resumen de nuestro último evento: una noche inolvidable",
    category: 'Eventos',
    imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1974&auto=format&fit=crop',
  }
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
</style>
