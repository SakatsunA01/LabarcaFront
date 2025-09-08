<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center text-gray-900">Crear una cuenta</h2>
      <form class="space-y-6" @submit.prevent="handleSubmit">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Nombre</label>
          <input
id="name" v-model="name" name="name" type="text" required
                 class="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
id="email" v-model="email" name="email" type="email" autocomplete="email" required
                 class="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
id="password" v-model="password" name="password" type="password" required
                 class="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        </div>
        <div>
          <label for="password_confirmation" class="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
          <input
id="password_confirmation" v-model="password_confirmation" name="password_confirmation" type="password" required
                 class="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        </div>

        <div v-if="authStore.error" class="p-3 text-sm text-red-700 bg-red-100 rounded-md">
          <p>Error: {{ authStore.error }}</p>
          <!-- Optional: Display validation errors -->
        </div>

        <div>
          <button
type="submit" :disabled="authStore.isLoading"
                  class="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
            <span v-if="authStore.isLoading">Registrando...</span>
            <span v-else>Registrarse</span>
          </button>
        </div>
      </form>
      <p class="text-sm text-center text-gray-600">
        ¿Ya tienes una cuenta? 
        <router-link to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">Inicia sesión</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const name = ref('');
const email = ref('');
const password = ref('');
const password_confirmation = ref('');

const handleSubmit = async () => {
  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: password_confirmation.value,
    });
    // Si el registro es exitoso, redirige al login
    router.push('/login');
  } catch (error) {
    // El error ya se maneja y se muestra desde el store
    console.error('Fallo en el handleSubmit de registro:', error);
  }
};
</script>
