<template>
  <div class="nosotros-view bg-brand-gris-claro min-h-screen font-sans">

    <header class="relative h-[55vh] md:h-[65vh] bg-brand-negro overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-t from-brand-negro via-brand-negro/40 to-transparent z-10"></div>
      <img src="@/assets/about-header-placeholder.png" alt="Comunidad en adoración"
        class="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-1000 hover:scale-105">

      <div
        class="relative z-20 container mx-auto max-w-5xl h-full flex flex-col items-center justify-center text-center px-6">
        <AnimatedSection>
          <span
            class="text-brand-camel uppercase tracking-[0.5em] text-[10px] font-bold mb-4 block animate-fade-in">Identidad
            & Propósito</span>
          <h1 class="font-playfair text-5xl md:text-7xl text-white italic drop-shadow-2xl">Somos La Barca Music</h1>
          <p class="mt-6 max-w-2xl text-white/80 text-sm md:text-base font-light leading-relaxed tracking-wide">
            "Porque donde están dos o tres congregados en mi nombre, allí estoy yo en medio de ellos." <br>
            <span class="text-brand-camel font-semibold mt-2 block italic">— Mateo 18:20</span>
          </p>
        </AnimatedSection>
      </div>
    </header>

    <main class="py-16 md:py-24">
      <div class="container mx-auto max-w-5xl px-6">

        <AnimatedSection class="mb-24">
          <div class="max-w-3xl mx-auto text-center space-y-6">
            <h2 class="font-playfair text-4xl md:text-5xl text-brand-negro">Nuestra Historia <span
                class="text-brand-camel">&</span> Pasión</h2>
            <div class="w-16 h-1 bg-brand-camel/20 mx-auto rounded-full"></div>
            <p class="text-lg text-gray-600 leading-relaxed font-sans italic">
              En La Barca Music, creemos que la música es un vehículo divino para la transformación. Nacimos del deseo
              de ver a la iglesia local equipada con recursos que reflejen la excelencia del Reino.
            </p>
          </div>
        </AnimatedSection>

        <div class="grid md:grid-cols-2 gap-8 mb-24">
          <AnimatedSection
            class="bg-white p-8 md:p-12 rounded-2xl shadow-card border border-gray-100 flex flex-col gap-6">
            <div class="w-12 h-12 bg-brand-camel/10 rounded-xl flex items-center justify-center">
              <LightBulbIcon class="h-6 w-6 text-brand-camel" />
            </div>
            <div class="space-y-4">
              <h3 class="font-playfair text-3xl text-brand-negro">Misión</h3>
              <p class="text-gray-500 text-sm leading-relaxed">
                Nuestra misión es crear y proveer música y recursos que inspiren, sanen y conecten a las personas con la
                presencia de Dios, fomentando una atmósfera de adoración genuina y transformadora.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection
            class="bg-white p-8 md:p-12 rounded-2xl shadow-card border border-gray-100 flex flex-col gap-6">
            <div class="w-12 h-12 bg-brand-camel/10 rounded-xl flex items-center justify-center">
              <UsersIcon class="h-6 w-6 text-brand-camel" />
            </div>
            <div class="space-y-4">
              <h3 class="font-playfair text-3xl text-brand-negro">Visión</h3>
              <p class="text-gray-500 text-sm leading-relaxed">
                Soñamos con ser un referente de apoyo para ministerios de alabanza, artistas emergentes y
                congregaciones, proveyendo herramientas que les permitan manifestar el Reino de Dios a través del arte.
              </p>
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection class="mb-24">
          <div class="grid md:grid-cols-3 gap-12 text-center border-y border-black/5 py-12">
            <div class="space-y-4">
              <span class="text-brand-camel font-bold uppercase tracking-widest text-[10px]">Excelencia</span>
              <h4 class="font-playfair text-xl text-brand-negro italic">Ofrenda de Calidad</h4>
              <p class="text-gray-400 text-xs">Buscamos la más alta calidad en cada nota como una ofrenda digna.</p>
            </div>
            <div class="space-y-4 border-x border-black/5 px-4">
              <span class="text-brand-camel font-bold uppercase tracking-widest text-[10px]">Integridad</span>
              <h4 class="font-playfair text-xl text-brand-negro italic">Carácter de Cristo</h4>
              <p class="text-gray-400 text-xs">Actuamos con transparencia, reflejando el carácter de Cristo.</p>
            </div>
            <div class="space-y-4">
              <span class="text-brand-camel font-bold uppercase tracking-widest text-[10px]">Unción</span>
              <h4 class="font-playfair text-xl text-brand-negro italic">Presencia Divina</h4>
              <p class="text-gray-400 text-xs">Dependemos del Espíritu Santo para que Su presencia fluya.</p>
            </div>
          </div>
        </AnimatedSection>

        <section class="mb-24">
          <div class="text-center mb-12">
            <span class="text-brand-camel uppercase tracking-[0.4em] text-[9px] font-bold">Liderazgo</span>
            <h2 class="font-playfair text-4xl text-brand-negro mt-2 italic">Nuestros Líderes</h2>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div class="group text-center">
              <div
                class="relative overflow-hidden rounded-2xl mb-6 shadow-card group-hover:shadow-card-hover transition-all duration-500">
                <img src="https://via.placeholder.com/400x500" alt="Sergio Quinteros"
                  class="w-full h-80 object-cover grayscale group-hover:grayscale-0 transition-all duration-700">
              </div>
              <h4 class="font-playfair text-2xl text-brand-negro">Sergio Quinteros</h4>
              <p class="text-brand-camel text-[10px] uppercase tracking-widest font-bold mt-1">Fundador & Director</p>
            </div>
            <div class="group text-center">
              <div
                class="relative overflow-hidden rounded-2xl mb-6 shadow-card group-hover:shadow-card-hover transition-all duration-500">
                <img src="https://via.placeholder.com/400x500" alt="Maria Reynoso"
                  class="w-full h-80 object-cover grayscale group-hover:grayscale-0 transition-all duration-700">
              </div>
              <h4 class="font-playfair text-2xl text-brand-negro">Maria Reynoso</h4>
              <p class="text-brand-camel text-[10px] uppercase tracking-widest font-bold mt-1">Directora</p>
            </div>
          </div>
        </section>

        <section
          class="bg-white rounded-3xl p-10 md:p-16 shadow-card border border-gray-50 flex flex-col md:flex-row gap-12 items-center">
          <div class="flex-1 space-y-6">
            <h2 class="font-playfair text-4xl text-brand-negro leading-tight italic">Unidos por un <br>Mismo sentir</h2>
            <p class="text-gray-500 text-sm leading-relaxed">
              Más que una productora, somos una comunidad creciente de adoradores. Cada evento y canción es un
              testimonio del poder de Dios obrando a través de la unidad.
            </p>
            <div class="flex gap-10 pt-4">
              <div>
                <p class="font-playfair text-4xl font-bold text-brand-borgona">+15</p>
                <p class="text-[9px] uppercase tracking-widest font-bold text-gray-400">Años Sirviendo</p>
              </div>
              <div class="border-x border-gray-100 px-10">
                <p class="font-playfair text-4xl font-bold text-brand-borgona">+20</p>
                <p class="text-[9px] uppercase tracking-widest font-bold text-gray-400">Artistas</p>
              </div>
              <div>
                <p class="font-playfair text-4xl font-bold text-brand-borgona">+30</p>
                <p class="text-[9px] uppercase tracking-widest font-bold text-gray-400">Eventos</p>
              </div>
            </div>
          </div>
          <div class="flex-1">
            <img src="@/assets/community-placeholder.png" alt="Impacto" class="rounded-2xl shadow-xl">
          </div>
        </section>

      </div>
    </main>

    <section class="bg-brand-negro py-20 text-center">
      <AnimatedSection class="max-w-2xl mx-auto px-6 space-y-8">
        <h2 class="font-playfair text-4xl text-white italic">Conecta con la Comunidad</h2>
        <p class="text-gray-400 text-sm font-light leading-relaxed">
          Síguenos en nuestras redes para no perderte ninguna novedad, lanzamiento o evento. ¡Queremos escucharte!
        </p>
        <div class="pt-6">
          <router-link to="/contacto"
            class="inline-block bg-brand-camel text-white py-4 px-12 rounded-full font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-brand-negro transition-all duration-500 shadow-lg">
            Contáctanos
          </router-link>
        </div>
      </AnimatedSection>
    </section>
  </div>
</template>

<script setup lang="ts">
import AnimatedSection from '@/components/AnimatedSection.vue';
import {
  HeartIcon,
  LightBulbIcon,
  UsersIcon,
  HandRaisedIcon,
  ShareIcon
} from '@heroicons/vue/24/outline';
</script>

<style scoped>
.shadow-card {
  box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.05);
}

.shadow-card-hover {
  box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.07);
}
</style>