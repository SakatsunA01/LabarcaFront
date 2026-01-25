<template>
  <AnimatedSection>
    <section class="bg-transparent py-16 md:py-24 px-6 overflow-hidden font-sans">
      <div class="container mx-auto max-w-7xl">

        <header class="text-center mb-16 md:mb-20 space-y-4">
          <span class="text-brand-camel uppercase tracking-[0.5em] text-[10px] font-bold block">Nuestro Propósito</span>
          <h2 class="font-playfair text-4xl md:text-6xl text-brand-negro italic leading-tight">
            Somos un Eco de Su Voz
          </h2>
          <div class="w-20 h-[1px] bg-brand-camel/30 mx-auto mt-6"></div>
          <p class="mt-8 font-playfair text-xl md:text-2xl text-brand-camel italic max-w-3xl mx-auto leading-relaxed">
            "Porque donde están dos o tres congregados en mi nombre, allí estoy yo en medio de ellos."
            <span class="block text-[10px] uppercase tracking-widest mt-2 font-sans font-bold not-italic">— Mateo
              18:20</span>
          </p>
        </header>

        <div class="grid md:grid-cols-12 gap-12 lg:gap-20 items-center">

          <div class="md:col-span-7 space-y-8 text-gray-600 leading-relaxed text-base md:text-lg italic">
            <p>
              Creemos firmemente que la música es más que melodía y armonía; es un <span
                class="text-brand-negro font-semibold not-italic tracking-tight">vehículo divino para la
                transformación</span>, una herramienta poderosa para conectar corazones y proclamar la verdad del
              Evangelio.
            </p>
            <p>
              Nuestra visión es equipar a la iglesia local con recursos de excelencia que inspiren una adoración
              auténtica y profunda. Buscamos cultivar una comunidad de creativos que, con pasión y talento, sirvan a
              Dios y a su pueblo.
            </p>
            <p class="text-sm not-italic font-bold uppercase tracking-[0.2em] text-brand-camel pt-4">
              Excelencia · Integridad · Unción
            </p>
          </div>

          <div class="md:col-span-5">
            <div class="relative group">
              <div
                class="absolute -inset-4 border border-brand-camel/10 rounded-2xl translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700">
              </div>

              <img src="@/assets/fotohomeversiculo.png" alt="Comunidad en adoración"
                class="relative z-10 object-cover w-full h-[400px] md:h-[550px] rounded-2xl shadow-card grayscale-[30%] hover:grayscale-0 transition-all duration-1000 group-hover:shadow-card-hover">
            </div>
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
