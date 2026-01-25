<template>
  <transition name="modal-fade">
    <div
      v-if="show"
      tabindex="-1"
      class="fixed inset-0 bg-brand-negro bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
    >
      <div
        class="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-3xl transform transition-all max-h-[90vh] overflow-y-auto"
      >
        <h2 class="text-2xl font-bold text-brand-negro mb-6">
          {{ isEditing ? 'Editar' : 'Crear' }} Sorteo
        </h2>
        <form @submit.prevent="handleSubmit">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-6">
              <fieldset class="border p-4 rounded-md shadow-sm">
                <legend class="text-lg font-semibold text-brand-negro px-2">Informacion general</legend>
                <div class="space-y-4 mt-2">
                  <div>
                    <label for="nombre" class="block text-sm font-medium text-gray-700">
                      Nombre <span class="text-red-500">*</span>
                    </label>
                    <input
                      id="nombre"
                      v-model="formData.nombre"
                      type="text"
                      required
                      placeholder="Nombre del sorteo"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel"
                    >
                  </div>
                  <div>
                    <label for="fecha_limite" class="block text-sm font-medium text-gray-700">
                      Fecha limite <span class="text-red-500">*</span>
                    </label>
                    <input
                      id="fecha_limite"
                      v-model="formData.fecha_limite"
                      type="datetime-local"
                      required
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel"
                    >
                  </div>
                  <div>
                    <label for="premio" class="block text-sm font-medium text-gray-700">
                      Premio <span class="text-red-500">*</span>
                    </label>
                    <input
                      id="premio"
                      v-model="formData.premio"
                      type="text"
                      required
                      placeholder="Premio principal"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel"
                    >
                  </div>
                  <div>
                    <label for="descripcion" class="block text-sm font-medium text-gray-700">Texto descriptivo</label>
                    <textarea
                      id="descripcion"
                      v-model="formData.descripcion"
                      rows="4"
                      placeholder="Descripcion del sorteo"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel"
                    ></textarea>
                  </div>
                </div>
              </fieldset>

              <fieldset class="border p-4 rounded-md shadow-sm">
                <legend class="text-lg font-semibold text-brand-negro px-2">Requisitos</legend>
                <div class="space-y-4 mt-2">
                  <div v-if="formData.requisitos.length === 0" class="text-sm text-gray-500">
                    Agrega requisitos para definir quien participa.
                  </div>
                  <div
                    v-for="req in formData.requisitos"
                    :key="req.id"
                    class="border border-gray-200 rounded-lg p-4 space-y-4"
                  >
                    <div class="flex flex-wrap items-center justify-between gap-2">
                      <label class="text-xs uppercase tracking-widest font-semibold text-gray-500">
                        Tipo de requisito
                      </label>
                      <button
                        type="button"
                        class="text-xs text-red-600 hover:text-red-900"
                        @click="removeRequirement(req.id)"
                      >
                        Quitar
                      </button>
                    </div>
                    <select
                      v-model="req.type"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel"
                      @change="handleRequirementTypeChange(req)"
                    >
                      <option v-for="type in requirementTypes" :key="type.value" :value="type.value">
                        {{ type.label }}
                      </option>
                    </select>

                    <div v-if="req.type === 'registration_schedule'" class="space-y-3">
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label class="block text-xs uppercase tracking-widest text-gray-500">Hora inicio</label>
                          <input
                            v-model="req.data.start_time"
                            type="time"
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel"
                          >
                        </div>
                        <div>
                          <label class="block text-xs uppercase tracking-widest text-gray-500">Hora fin</label>
                          <input
                            v-model="req.data.end_time"
                            type="time"
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel"
                          >
                        </div>
                      </div>
                      <div>
                        <label class="block text-xs uppercase tracking-widest text-gray-500 mb-2">Dias habilitados</label>
                        <div class="flex flex-wrap gap-2">
                          <label
                            v-for="day in weekDays"
                            :key="day.value"
                            class="flex items-center gap-2 text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full"
                          >
                            <input
                              type="checkbox"
                              :value="day.value"
                              v-model="req.data.days"
                              class="rounded border-gray-300 text-brand-camel focus:ring-brand-camel"
                            >
                            {{ day.label }}
                          </label>
                        </div>
                      </div>
                      <p class="text-xs text-gray-400">
                        Si no seleccionas dias, se considera valido cualquier dia.
                      </p>
                    </div>

                    <div v-else-if="req.type === 'ticket_purchase'" class="space-y-3">
                      <div>
                        <label class="block text-xs uppercase tracking-widest text-gray-500">Tipo de compra</label>
                        <select
                          v-model="req.data.mode"
                          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel"
                        >
                          <option value="any">Cualquier entrada</option>
                          <option value="event">Entrada de evento especifico</option>
                        </select>
                      </div>
                      <div v-if="req.data.mode === 'event'">
                        <label class="block text-xs uppercase tracking-widest text-gray-500">Evento</label>
                        <select
                          v-model="req.data.event_id"
                          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel"
                        >
                          <option :value="null">Seleccionar evento</option>
                          <option v-for="evento in eventos" :key="evento.id" :value="evento.id">
                            {{ evento.nombre }}
                          </option>
                        </select>
                      </div>
                    </div>

                    <div v-else-if="req.type === 'custom_text'" class="space-y-2">
                      <label class="block text-xs uppercase tracking-widest text-gray-500">Requisito</label>
                      <input
                        v-model="req.data.text"
                        type="text"
                        placeholder="Ej: Seguir en Instagram"
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel"
                      >
                    </div>
                  </div>

                  <button
                    type="button"
                    class="w-full border border-dashed border-brand-camel text-brand-camel py-2 rounded-md hover:bg-brand-camel hover:text-white transition-colors text-sm font-semibold"
                    @click="addRequirement"
                  >
                    Agregar requisito
                  </button>
                </div>
              </fieldset>
            </div>

            <div class="space-y-6">
              <ImageUploader
                label="Foto del premio"
                :initial-preview="formData.premio_imagen_url"
                @file-change="file => handleFileChange(file, 'premio_imagen_url')"
              />
              <div class="bg-brand-gris-claro/50 rounded-lg p-4 text-xs text-gray-600 space-y-2">
                <p class="font-semibold uppercase tracking-widest text-[10px] text-gray-500">Notas</p>
                <p>El sorteo se cierra manualmente y se define un ganador.</p>
                <p>Los requisitos se evaluan con la informacion del usuario y sus compras.</p>
              </div>
            </div>
          </div>

          <div v-if="errorMessage" class="mt-4 text-red-600 text-sm text-center p-2 bg-red-100 rounded-md">
            {{ errorMessage }}
          </div>

          <div class="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              class="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
              @click="close"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="bg-brand-camel text-white py-2 px-6 rounded-md hover:bg-opacity-90 transition-all duration-300 font-medium disabled:opacity-60 flex items-center justify-center shadow-md hover:shadow-lg"
            >
              <span v-if="isLoading">Guardando...</span>
              <span v-else>Guardar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import axios from 'axios';
import ImageUploader from './ImageUploader.vue';

interface Requirement {
  id: string;
  type: 'registration_schedule' | 'ticket_purchase' | 'custom_text';
  data: Record<string, any>;
}

interface Sorteo {
  id: number;
  nombre: string;
  fecha_limite: string;
  premio: string;
  premio_imagen_url?: string | null;
  descripcion?: string | null;
  requisitos?: Requirement[] | string | null;
}

const props = defineProps<{
  show: boolean;
  sorteo: Sorteo | null;
}>();

const emit = defineEmits(['close', 'save']);

interface SorteoFormData {
  nombre: string;
  fecha_limite: string;
  premio: string;
  premio_imagen_url: string | null;
  descripcion: string | null;
  requisitos: Requirement[];
}

const defaultFormData: SorteoFormData = {
  nombre: '',
  fecha_limite: '',
  premio: '',
  premio_imagen_url: null,
  descripcion: null,
  requisitos: [],
};

const formData = ref<SorteoFormData>({ ...defaultFormData });
const imageFiles = ref<{ [key: string]: File | null }>({
  premio_imagen_url: null,
});
const isLoading = ref(false);
const errorMessage = ref('');
const eventos = ref<{ id: number; nombre: string }[]>([]);

const isEditing = computed(() => !!props.sorteo);
const API_URL = 'https://api.labarcaministerio.com/api';

const requirementTypes = [
  { value: 'registration_schedule', label: 'Registro en horario y dias' },
  { value: 'ticket_purchase', label: 'Compra de entrada' },
  { value: 'custom_text', label: 'Requisito personalizado' },
];

const weekDays = [
  { value: 'monday', label: 'Lunes' },
  { value: 'tuesday', label: 'Martes' },
  { value: 'wednesday', label: 'Miercoles' },
  { value: 'thursday', label: 'Jueves' },
  { value: 'friday', label: 'Viernes' },
  { value: 'saturday', label: 'Sabado' },
  { value: 'sunday', label: 'Domingo' },
];

const fetchEventos = async () => {
  try {
    const response = await axios.get(`${API_URL}/eventos`);
    eventos.value = response.data;
  } catch (error) {
    console.error('Error al cargar eventos:', error);
  }
};

const createRequirement = (type: Requirement['type']): Requirement => {
  const base = { id: `${Date.now()}-${Math.random()}` };
  if (type === 'registration_schedule') {
    return { ...base, type, data: { start_time: '', end_time: '', days: [] } };
  }
  if (type === 'ticket_purchase') {
    return { ...base, type, data: { mode: 'any', event_id: null } };
  }
  return { ...base, type, data: { text: '' } };
};

const addRequirement = () => {
  formData.value.requisitos.push(createRequirement('registration_schedule'));
};

const removeRequirement = (id: string) => {
  formData.value.requisitos = formData.value.requisitos.filter((req) => req.id !== id);
};

const handleRequirementTypeChange = (req: Requirement) => {
  const updated = createRequirement(req.type);
  req.data = updated.data;
};

const normalizeRequirements = (value: Sorteo['requisitos']): Requirement[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const toLocalDateTimeInput = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (num: number) => String(num).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

watch(() => props.show, (newVal) => {
  if (newVal) {
    errorMessage.value = '';
    if (props.sorteo) {
      const formattedDate = toLocalDateTimeInput(props.sorteo.fecha_limite);
      formData.value = {
        ...defaultFormData,
        ...props.sorteo,
        fecha_limite: formattedDate,
        requisitos: normalizeRequirements(props.sorteo.requisitos),
      };
    } else {
      formData.value = { ...defaultFormData };
    }
    imageFiles.value = { premio_imagen_url: null };
    fetchEventos();
  }
});

const handleFileChange = (file: File | null, fieldName: string) => {
  imageFiles.value[fieldName] = file;
};

const handleSubmit = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  const submissionData = new FormData();
  Object.entries(formData.value).forEach(([key, value]) => {
    if (key === 'premio_imagen_url' && typeof value === 'string') {
      return;
    }
    if (key === 'requisitos') {
      submissionData.append('requisitos', JSON.stringify(value));
      return;
    }
    if (value === null) {
      submissionData.append(key, '');
      return;
    }
    if (value !== undefined) {
      submissionData.append(key, String(value));
    }
  });
  if (imageFiles.value.premio_imagen_url) {
    submissionData.append('premio_imagen_url', imageFiles.value.premio_imagen_url);
  } else if (isEditing.value && formData.value.premio_imagen_url === null) {
    submissionData.append('premio_imagen_url', '');
  }

  try {
    if (isEditing.value && props.sorteo) {
      submissionData.append('_method', 'PUT');
      await axios.post(`${API_URL}/admin/sorteos/${props.sorteo.id}`, submissionData);
    } else {
      await axios.post(`${API_URL}/admin/sorteos`, submissionData);
    }
    emit('save');
  } catch (error: any) {
    console.error('Error al guardar sorteo:', error);
    errorMessage.value = error.response?.data?.message || 'Ocurrio un error al guardar.';
  } finally {
    isLoading.value = false;
  }
};

const close = () => {
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
