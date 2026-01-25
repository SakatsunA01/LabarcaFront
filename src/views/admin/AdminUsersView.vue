<template>
  <div class="admin-users-view">
    <h1 class="text-3xl font-bold text-brand-negro mb-6">Gestión de Usuarios</h1>

    <!-- Controles Superiores: Búsqueda y Orden -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div class="w-full md:w-1/3">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Buscar por nombre o email..."
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-camel focus:border-brand-camel transition-shadow"
        />
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="px-3 py-1.5 text-xs font-semibold uppercase tracking-widest rounded-full border transition-colors"
          :class="sortOption === 'date-desc'
            ? 'bg-brand-negro text-white border-brand-negro'
            : 'bg-white text-gray-600 border-gray-200 hover:text-brand-negro'"
          @click="sortOption = 'date-desc'"
        >
          Registro reciente
        </button>
        <button
          type="button"
          class="px-3 py-1.5 text-xs font-semibold uppercase tracking-widest rounded-full border transition-colors"
          :class="sortOption === 'date-asc'
            ? 'bg-brand-negro text-white border-brand-negro'
            : 'bg-white text-gray-600 border-gray-200 hover:text-brand-negro'"
          @click="sortOption = 'date-asc'"
        >
          Registro antiguo
        </button>
        <button
          type="button"
          class="px-3 py-1.5 text-xs font-semibold uppercase tracking-widest rounded-full border transition-colors"
          :class="sortOption === 'name-asc'
            ? 'bg-brand-camel text-white border-brand-camel'
            : 'bg-white text-gray-600 border-gray-200 hover:text-brand-negro'"
          @click="sortOption = 'name-asc'"
        >
          Nombre A-Z
        </button>
        <button
          type="button"
          class="px-3 py-1.5 text-xs font-semibold uppercase tracking-widest rounded-full border transition-colors"
          :class="sortOption === 'name-desc'
            ? 'bg-brand-camel text-white border-brand-camel'
            : 'bg-white text-gray-600 border-gray-200 hover:text-brand-negro'"
          @click="sortOption = 'name-desc'"
        >
          Nombre Z-A
        </button>
      </div>
    </div>

    <!-- Tabla de Usuarios -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <div v-if="loading" class="p-8 text-center text-gray-500">Cargando usuarios...</div>
      <div v-else-if="error" class="p-8 text-center text-red-500">{{ error }}</div>
      <div v-else-if="sortedUsers.length" class="divide-y divide-gray-200">
        <div class="px-6 py-4 bg-gray-50 text-sm font-semibold text-gray-700">
          Administradores ({{ adminUsers.length }})
        </div>
        <div v-if="adminUsers.length" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 min-w-[860px]">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Iglesia</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in adminUsers" :key="user.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ user.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span v-if="user.belongs_to_church">{{ user.church_name || 'Sin nombre' }}</span>
                  <span v-else>No</span>
                </td>
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
        </div>
        <div v-else class="px-6 py-4 text-sm text-gray-500">No hay administradores con este filtro.</div>

        <div class="px-6 py-4 bg-gray-50 text-sm font-semibold text-gray-700">
          Usuarios ({{ regularUsers.length }})
        </div>
        <div v-if="regularUsers.length" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 min-w-[860px]">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Iglesia</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in regularUsers" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ user.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span v-if="user.belongs_to_church">{{ user.church_name || 'Sin nombre' }}</span>
                <span v-else>No</span>
              </td>
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
        </div>
        <div v-else class="px-6 py-4 text-sm text-gray-500">No hay usuarios con este filtro.</div>
      </div>
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

const sortOption = ref<'date-desc' | 'date-asc' | 'name-asc' | 'name-desc'>('date-desc');

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

const sortedUsers = computed(() => {
  const list = [...filteredUsers.value];
  switch (sortOption.value) {
    case 'name-asc':
      return list.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    case 'name-desc':
      return list.sort((a, b) => b.name.localeCompare(a.name, 'es'));
    case 'date-asc':
      return list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    case 'date-desc':
    default:
      return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
});

const adminUsers = computed(() => sortedUsers.value.filter((user) => user.admin_sn === 1));
const regularUsers = computed(() => sortedUsers.value.filter((user) => user.admin_sn !== 1));

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
