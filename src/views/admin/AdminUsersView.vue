<template>
  <div class="admin-users-view">
    <h1 class="text-3xl font-bold text-brand-negro mb-6">Gestión de Usuarios</h1>

    <!-- Controles Superiores: Búsqueda -->
    <div class="flex justify-between items-center mb-6">
      <div class="w-1/3">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Buscar por nombre o email..."
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-camel focus:border-brand-camel transition-shadow"
        />
      </div>
    </div>

    <!-- Tabla de Usuarios -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <div v-if="loading" class="p-8 text-center text-gray-500">Cargando usuarios...</div>
      <div v-else-if="error" class="p-8 text-center text-red-500">{{ error }}</div>
      <table v-else-if="filteredUsers.length" class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ user.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="user.admin_sn ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'"
              >
                {{ user.admin_sn ? 'Admin' : 'Usuario' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button @click="openUserDetailsModal(user)" class="text-gray-600 hover:text-gray-900 mr-4">
                    <EyeIcon class="h-5 w-5" />
                </button>
              <button
                class="text-brand-camel hover:text-brand-borgona mr-4"
                :disabled="isCurrentUser(user.id)"
                :class="{ 'opacity-50 cursor-not-allowed': isCurrentUser(user.id) }"
                @click="toggleAdmin(user)"
              >
                {{ user.admin_sn ? 'Quitar Admin' : 'Hacer Admin' }}
              </button>
              <button
                class="text-red-600 hover:text-red-900"
                :disabled="isCurrentUser(user.id)"
                :class="{ 'opacity-50 cursor-not-allowed': isCurrentUser(user.id) }"
                @click="deleteUser(user.id)"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="p-8 text-center text-gray-500">No se encontraron usuarios.</div>
    </div>

    <UserDetailsModal :show="isModalOpen" :user="selectedUser" @close="isModalOpen = false" />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';
import UserDetailsModal from '@/components/admin/UserDetailsModal.vue';
import { EyeIcon } from '@heroicons/vue/24/outline';

interface User {
  id: number;
  name: string;
  email: string;
  admin_sn: 0 | 1;
  phone?: string;
  belongs_to_church: boolean;
  church_name?: string;
  pastor_name?: string;
  created_at: string;
}

const users = ref<User[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const searchTerm = ref('');
const authStore = useAuthStore();

const isModalOpen = ref(false);
const selectedUser = ref<User | null>(null);

const currentUserId = computed(() => authStore.currentUser?.id);

const isCurrentUser = (id: number) => {
  return id === currentUserId.value;
};

const openUserDetailsModal = (user: User) => {
  selectedUser.value = user;
  isModalOpen.value = true;
};

const fetchUsers = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get('/api/admin/users');
    users.value = response.data;
  } catch (err) {
    error.value = 'Failed to fetch users.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const filteredUsers = computed(() => {
  if (!searchTerm.value) {
    return users.value;
  }
  return users.value.filter(user => {
    const name = user.name.toLowerCase();
    const email = user.email.toLowerCase();
    const term = searchTerm.value.toLowerCase();
    return name.includes(term) || email.includes(term);
  });
});

const toggleAdmin = async (user: User) => {
  if (isCurrentUser(user.id)) {
    alert('No puedes cambiar tu propio rol.');
    return;
  }
  try {
    const newAdminStatus = user.admin_sn === 1 ? 0 : 1;
    const response = await axios.put(`/api/admin/users/${user.id}`, {
      admin_sn: newAdminStatus,
    });
    const index = users.value.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      users.value[index] = response.data;
    }
  } catch (err: any) {
    console.error('Failed to update user', err);
    alert(err.response?.data?.message || 'Failed to update user.');
  }
};

const deleteUser = async (id: number) => {
  if (isCurrentUser(id)) {
    alert('No puedes eliminar tu propia cuenta.');
    return;
  }
  if (!confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.')) {
    return;
  }
  try {
    await axios.delete(`/api/admin/users/${id}`);
    users.value = users.value.filter((u) => u.id !== id);
  } catch (err: any) {
    console.error('Failed to delete user', err);
    alert(err.response?.data?.message || 'Failed to delete user.');
  }
};

onMounted(fetchUsers);
</script>
