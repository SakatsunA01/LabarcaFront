<template>
  <section ref="sectionRef" class="bg-white py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
    <div class="max-w-7xl mx-auto">
      <div
class="text-center transition-all duration-1000 ease-out"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'">
        <h2 class="text-3xl md:text-4xl font-bold text-brand-negro mb-6 md:mb-8">
          Somos un Eco de Su Voz
        </h2>
        <p class="mt-4 font-inter text-lg text-brand-camel italic">
          "Porque donde están dos o tres congregados en mi nombre, allí estoy yo en medio de ellos." - Mateo 18:20
        </p>
      </div>

      <div class="mt-16 grid md:grid-cols-2 gap-12 items-center">
        <div
          class="text-brand-negro font-inter text-base leading-relaxed transition-all duration-1000 ease-out delay-300"
          :class="isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'">
          <p>
            Creemos firmemente que la música es más que melodía y armonía; es un vehículo divino para la transformación,
            una herramienta poderosa para conectar corazones y proclamar la verdad del Evangelio. En La Barca, nuestra
            misión es ser un eco de la voz de Dios en la tierra, creando producciones que no solo deleiten el oído, sino
            que alimenten el espíritu.
          </p>
          <p class="mt-6">
            Nuestra visión es equipar a la iglesia local con recursos de excelencia que inspiren una adoración auténtica
            y profunda. Buscamos cultivar una comunidad de artistas, músicos y creativos que, con pasión y talento,
            sirvan a Dios y a su pueblo, creando espacios para un encuentro genuino con Su presencia.
          </p>
          <p class="mt-6">
            Valoramos la excelencia, la integridad y la unción en todo lo que hacemos. Cada canción, cada evento, cada
            recurso es una ofrenda de adoración, diseñada para glorificar a Aquel que nos llamó de las tinieblas a su
            luz admirable.
          </p>
        </div>
        <div
class="w-full h-full transition-all duration-1000 ease-out delay-300"
          :class="isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'">
          <img
src="https://images.unsplash.com/photo-1528716321680-815a8cdb8cbe?q=80&w=1974&auto=format&fit=crop"
            alt="Comunidad en adoración"
            class="object-cover w-full h-full max-h-[500px] rounded-lg shadow-lg filter grayscale-20">
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const sectionRef = ref(null);
const isVisible = ref(false);

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
      threshold: 0.2, // Trigger when 20% of the element is visible
    }
  );

  if (sectionRef.value) {
    observer.observe(sectionRef.value);
  }
});
</script>

<style scoped>
/*
  Asegúrate de tener las fuentes 'Playfair Display' e 'Inter' importadas en tu proyecto,
  por ejemplo, en tu archivo CSS principal (main.css).
*/
.filter.grayscale-20 {
  filter: grayscale(20%);
}
</style>
