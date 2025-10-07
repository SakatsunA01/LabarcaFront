<template>
  <AnimatedSection>
    <section class="bg-white py-section-md px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div class="max-w-7xl mx-auto">
        <div class="text-center">
          <h2 class="font-playfair text-3xl md:text-4xl font-bold text-brand-negro mb-10 md:mb-12 flex items-center justify-center gap-3">
            <SparklesIcon class="h-8 w-8 text-brand-camel" />
            <span>Somos un Eco de Su Voz</span>
            <SparklesIcon class="h-8 w-8 text-brand-camel" />
          </h2>
          <p class="mt-4 font-inter text-lg text-brand-camel italic">
            "Porque donde están dos o tres congregados en mi nombre, allí estoy yo en medio de ellos." - Mateo 18:20
          </p>
        </div>

        <div class="mt-16 grid md:grid-cols-2 gap-12 items-center">
          <div class="text-brand-negro font-inter text-base leading-relaxed">
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
          <div class="w-full h-full">
            <img
              src="@/assets/fotohomeversiculo.png"
              alt="Comunidad en adoración"
              class="object-cover w-full h-full max-h-[500px] rounded-lg shadow-card filter grayscale-20">
          </div>
        </div>
      </div>
    </section>
  </AnimatedSection>
</template>

<script setup lang="ts">
import { SparklesIcon } from '@heroicons/vue/24/outline';
import AnimatedSection from '@/components/AnimatedSection.vue';
</script>
