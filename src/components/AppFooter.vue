<template>
  <footer class="bg-brand-negro text-white pt-10 pb-6 font-sans">
    <div class="container mx-auto max-w-7xl px-6">

      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-white/5 pb-8 items-start">

        <div class="md:col-span-4 space-y-3">
          <div class="flex items-center gap-2">
            <div class="w-6 h-[1px] bg-brand-camel"></div>
            <span class="text-brand-camel uppercase tracking-[0.4em] text-[8px] font-bold">La Barca</span>
          </div>
          <h3 class="font-playfair text-2xl italic leading-tight text-white/90">
            Música que <span class="text-brand-camel">trasciende</span>.
          </h3>
          <p class="text-gray-500 text-[11px] leading-relaxed max-w-xs">
            Comunidad dedicada a equipar a la iglesia y potenciar el talento artístico con excelencia.
          </p>
        </div>

        <div class="md:col-span-4 grid grid-cols-2 gap-4">
          <div class="space-y-3">
            <h4 class="text-[9px] uppercase tracking-[0.3em] font-bold text-brand-camel">Explorar</h4>
            <ul class="space-y-2 text-[12px] text-gray-400">
              <li><router-link to="/artistas" class="hover:text-white transition-colors">Artistas</router-link></li>
              <li><router-link to="/lanzamientos" class="hover:text-white transition-colors">Música</router-link></li>
            </ul>
          </div>
          <div class="space-y-3">
            <h4 class="text-[9px] uppercase tracking-[0.3em] font-bold text-brand-camel">Info</h4>
            <ul class="space-y-2 text-[12px] text-gray-400">
              <li><router-link to="/eventos" class="hover:text-white transition-colors">Eventos</router-link></li>
              <li><router-link to="/comunidad" class="hover:text-white transition-colors">Comunidad</router-link></li>
            </ul>
          </div>
        </div>

        <div class="md:col-span-4 md:text-right space-y-4">
          <h4 class="text-[9px] uppercase tracking-[0.3em] font-bold text-brand-camel">Conecta</h4>
          <a href="mailto:info@labarcamusic.com"
            class="block text-lg font-playfair italic hover:text-brand-camel transition-colors">
            info@labarcamusic.com
          </a>
          <div class="flex md:justify-end gap-4">
            <a href="#"
              class="text-[9px] font-bold uppercase tracking-widest text-gray-500 hover:text-white">Instagram</a>
            <a href="#"
              class="text-[9px] font-bold uppercase tracking-widest text-gray-500 hover:text-white">YouTube</a>
          </div>
        </div>
      </div>

      <div
        class="pt-6 flex flex-col md:flex-row justify-between items-center gap-2 text-[8px] uppercase tracking-[0.2em] font-bold text-gray-600">
        <p>&copy; {{ new Date().getFullYear() }} La Barca Music.</p>
        <div class="flex gap-4">
          <router-link to="/privacidad" class="hover:text-white">Privacidad</router-link>
          <router-link to="/terminos" class="hover:text-white">Términos</router-link>
        </div>
      </div>

    </div>
  </footer>
</template>