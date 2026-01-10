<template>
  <div class="min-h-screen bg-brand-gris-claro py-section-md px-4">
    <div class="max-w-3xl mx-auto">
      <div class="bg-white rounded-2xl shadow-card border border-black/5 p-6 md:p-8">
        <h1 class="text-3xl font-bold text-brand-negro mb-2">Pago rechazado</h1>
        <p class="text-gray-600 mb-6">No se pudo completar el pago. Podes intentar nuevamente.</p>
        <div class="flex flex-wrap gap-3">
          <router-link to="/eventos" class="bg-brand-camel text-white py-2 px-4 rounded-md hover:bg-opacity-90">Volver a eventos</router-link>
          <router-link to="/perfil" class="border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50">Ver mis entradas</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
