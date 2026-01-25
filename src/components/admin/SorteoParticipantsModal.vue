<template>
  <transition name="modal-fade">
    <div
      v-if="show"
      tabindex="-1"
      class="fixed inset-0 bg-brand-negro bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 class="text-xl font-bold text-brand-negro">Participantes</h2>
            <p class="text-xs text-gray-500">Sorteo: {{ sorteoName }}</p>
          </div>
          <button class="text-gray-500 hover:text-brand-negro" @click="closeModal">Cerrar</button>
        </div>

        <div class="p-6 space-y-6">
          <div class="bg-brand-gris-claro/50 rounded-lg p-4 text-xs text-gray-600">
            <p class="font-semibold uppercase tracking-widest text-[10px] text-gray-500">Ayuda</p>
            <p>Los usuarios elegibles se agregan automaticamente a la lista de participantes.</p>
            <p>Puedes sumar excepciones manualmente (por ejemplo ventas fisicas).</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              v-model="userSearch"
              type="text"
              placeholder="Buscar usuario..."
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel"
            >
            <button
              type="button"
              class="border border-brand-camel text-brand-camel py-2 px-4 rounded-md hover:bg-brand-camel hover:text-white transition-colors disabled:opacity-60"
              :disabled="pendingAddIds.length === 0 || isAddingParticipant"
              @click="savePendingParticipants"
            >
              {{ isAddingParticipant ? 'Guardando...' : 'Guardar participantes' }}
            </button>
            <button
              type="button"
              class="border border-gray-300 text-gray-600 py-2 px-4 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-60"
              :disabled="pendingAddIds.length === 0 || isAddingParticipant"
              @click="clearPending"
            >
              Limpiar seleccion
            </button>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-semibold uppercase tracking-widest text-gray-500">Participantes</h3>
                <span class="text-xs text-gray-500">{{ participants.length }}</span>
              </div>
              <div class="border border-gray-200 rounded-md max-h-[320px] overflow-y-auto">
                <div v-if="participants.length === 0" class="p-4 text-sm text-gray-500">
                  Todavia no hay participantes agregados.
                </div>
                <div v-else class="divide-y divide-gray-200">
                  <div v-for="user in participants" :key="user.id" class="flex items-center justify-between px-3 py-2">
                    <div>
                      <p class="text-sm font-medium text-gray-800">{{ user.name }}</p>
                      <p class="text-xs text-gray-500">{{ user.email }}</p>
                    </div>
                    <div class="flex items-center gap-2">
                      <span
                        class="px-2 py-1 text-xs font-semibold rounded-full"
                        :class="user.is_participant ? 'bg-brand-camel/10 text-brand-camel' : 'bg-green-100 text-green-800'"
                      >
                        {{ user.is_participant ? 'Manual' : 'Automatico' }}
                      </span>
                      <span v-if="!user.eligible" class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                        No elegible
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-semibold uppercase tracking-widest text-gray-500">Disponibles</h3>
                <span class="text-xs text-gray-500">{{ availableUsers.length }}</span>
              </div>
              <div class="border border-gray-200 rounded-md max-h-[320px] overflow-y-auto">
                <div v-if="availableUsers.length === 0" class="p-4 text-sm text-gray-500">
                  No hay usuarios disponibles con este filtro.
                </div>
                  <div v-else class="divide-y divide-gray-200">
                    <div v-for="user in filteredAvailableUsers" :key="user.id" class="flex items-center justify-between px-3 py-2">
                      <div>
                        <p class="text-sm font-medium text-gray-800">{{ user.name }}</p>
                        <p class="text-xs text-gray-500">{{ user.email }}</p>
                      </div>
                      <div class="flex items-center gap-3">
                        <span
                          class="px-2 py-1 text-xs font-semibold rounded-full"
                          :class="user.eligible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'"
                        >
                          {{ user.eligible ? 'Elegible' : 'No elegible' }}
                        </span>
                        <button
                          type="button"
                          class="text-xs font-semibold uppercase tracking-widest text-brand-camel hover:text-brand-borgona disabled:text-gray-300"
                          :disabled="pendingAddLookup[user.id]"
                          @click="queueParticipant(user.id)"
                        >
                          {{ pendingAddLookup[user.id] ? 'Seleccionado' : 'Agregar' }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>

        <div class="px-6 pb-6 flex justify-end">
          <button
            type="button"
            class="bg-brand-camel text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors"
            @click="closeModal"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import axios from 'axios';

interface SorteoUserOption {
  id: number;
  name: string;
  email: string;
  eligible: boolean;
  is_participant: boolean;
}

const props = defineProps<{
  show: boolean;
  sorteoId: number | null;
  sorteoName: string;
}>();

const emit = defineEmits(['close', 'updated']);

const API_URL = 'https://api.labarcaministerio.com/api';

const users = ref<SorteoUserOption[]>([]);
const userSearch = ref('');
const pendingAddIds = ref<number[]>([]);
const isAddingParticipant = ref(false);

const participants = computed(() => {
  return users.value.filter((user) => user.is_participant || user.eligible);
});
const availableUsers = computed(() => {
  return users.value.filter((user) => !user.is_participant && !user.eligible);
});
const filteredAvailableUsers = computed(() => {
  if (!userSearch.value) {
    return availableUsers.value;
  }
  const term = userSearch.value.toLowerCase();
  return availableUsers.value.filter((user) => {
    return user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term);
  });
});

const pendingAddLookup = computed(() => {
  return pendingAddIds.value.reduce((acc: Record<number, boolean>, id) => {
    acc[id] = true;
    return acc;
  }, {});
});

const fetchSorteoUsers = async () => {
  if (!props.sorteoId) return;
  try {
    const response = await axios.get(`${API_URL}/admin/sorteos/${props.sorteoId}/users`);
    users.value = response.data;
  } catch (error) {
    console.error('Error al cargar usuarios del sorteo:', error);
    users.value = [];
  }
};

watch(
  () => props.show,
  async (isOpen) => {
    if (isOpen) {
      userSearch.value = '';
      pendingAddIds.value = [];
      users.value = [];
      await fetchSorteoUsers();
    }
  }
);

const queueParticipant = (userId: number) => {
  if (!pendingAddLookup.value[userId]) {
    pendingAddIds.value = [...pendingAddIds.value, userId];
  }
};

const clearPending = () => {
  pendingAddIds.value = [];
};

const savePendingParticipants = async () => {
  if (!props.sorteoId || pendingAddIds.value.length === 0) return;
  isAddingParticipant.value = true;
  try {
    await axios.post(`${API_URL}/admin/sorteos/${props.sorteoId}/participants`, {
      user_ids: pendingAddIds.value,
    });
    const updatedSet = new Set(pendingAddIds.value);
    users.value = users.value.map((user) => {
      if (updatedSet.has(user.id)) {
        return { ...user, is_participant: true };
      }
      return user;
    });
    pendingAddIds.value = [];
    userSearch.value = '';
    emit('updated');
  } catch (error) {
    console.error('Error al agregar participantes:', error);
  } finally {
    isAddingParticipant.value = false;
  }
};

const closeModal = () => {
  emit('close');
};
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease-out;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
