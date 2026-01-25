<template>
  <AnimatedSection>
    <section :id="id" :style="sectionStyle" class="py-16 md:py-24 px-6 overflow-hidden animated-gradient-bg relative">
      <div
        class="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/p6.png')]">
      </div>

      <div class="container mx-auto max-w-7xl relative z-10">
        <header class="text-center mb-16 space-y-4">
          <span class="text-brand-camel uppercase tracking-[0.5em] text-[10px] font-bold block">Refugio
            Espiritual</span>
          <h2 class="font-playfair text-4xl md:text-6xl text-brand-negro italic leading-tight">Palabra de Ánimo</h2>
          <p class="text-gray-500 font-sans max-w-xl mx-auto italic">
            Selecciona cómo se siente tu corazón hoy para recibir una promesa de fortaleza.
          </p>
        </header>

        <section class="mb-12 relative group/carousel px-4">
          <button @click="scrollCarousel('left')"
            class="absolute -left-2 top-1/2 -translate-y-1/2 z-30 bg-white/90 p-2 rounded-full shadow-md hover:bg-white transition-all opacity-0 group-hover/carousel:opacity-100 hidden md:block border border-gray-100">
            <ChevronLeftIcon class="w-4 h-4 text-brand-negro" />
          </button>

          <div ref="moodScrollContainer"
            class="flex space-x-6 overflow-x-auto py-6 mask-fade-edges hide-scrollbar scroll-smooth">
            <div v-for="mood in moodOptions" :key="mood.key" class="flex-shrink-0 p-2">
              <button type="button" @click="handleMoodButtonClick(mood)" :disabled="isLoadingVerse"
                class="group flex flex-col items-center justify-center w-24 h-28 rounded-2xl transition-all duration-700 ease-out border border-white/20 shadow-card"
                :class="[
                  activeMoodKey === mood.key
                    ? 'bg-white shadow-xl scale-110 -translate-y-3 border-brand-camel/30'
                    : 'bg-white/40 backdrop-blur-md hover:bg-white/60'
                ]">
                <div
                  class="w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-colors duration-500 shadow-inner"
                  :class="activeMoodKey === mood.key ? mood.bgColor : 'bg-gray-100/50 text-gray-400 group-hover:text-brand-camel'">
                  <component :is="mood.iconComponent" class="w-15 h-15"
                    :class="activeMoodKey === mood.key ? 'text-white' : ''" />
                </div>
                <span class="text-[9px] uppercase tracking-widest font-bold"
                  :class="activeMoodKey === mood.key ? 'text-brand-negro' : 'text-gray-500'">
                  {{ mood.text }}
                </span>
              </button>
            </div>
          </div>

          <button @click="scrollCarousel('right')"
            class="absolute -right-2 top-1/2 -translate-y-1/2 z-30 bg-white/90 p-2 rounded-full shadow-md hover:bg-white transition-all opacity-0 group-hover/carousel:opacity-100 hidden md:block border border-gray-100">
            <ChevronRightIcon class="w-4 h-4 text-brand-negro" />
          </button>
        </section>

        <transition name="fade-slide" mode="out-in">
          <section :key="currentState"
            class="relative bg-white/60 backdrop-blur-xl p-8 md:p-16 rounded-[2.5rem] flex flex-col justify-center items-center text-center min-h-[450px] border border-white/40 shadow-card-hover">
            <div v-if="currentState === 'initial'" class="space-y-6">
              <div
                class="w-20 h-20 bg-brand-camel/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <SparklesIcon class="w-10 h-10 text-brand-camel" />
              </div>
              <p class="font-playfair text-2xl text-gray-400 italic">Desliza y elige un estado de ánimo para
                comenzar...</p>
            </div>

            <div v-if="currentState === 'loadingVerse'" class="flex flex-col items-center">
              <div class="w-12 h-12 border-2 border-brand-camel border-t-transparent rounded-full animate-spin"></div>
              <p class="text-[10px] uppercase tracking-[0.4em] text-brand-camel font-bold mt-8">Buscando en las
                Escrituras</p>
            </div>

            <div v-if="currentState === 'verseContentLoaded' && verseData" class="w-full space-y-8">
              <div class="flex flex-col items-center space-y-6">
                <div class="h-[1px] w-12 bg-brand-camel/30"></div>
                <blockquote class="font-playfair text-3xl md:text-5xl text-brand-negro leading-tight italic">
                  "{{ verseData.verseText }}"
                </blockquote>
                <p class="text-brand-camel font-bold uppercase tracking-[0.3em] text-[11px]">
                  {{ verseData.verseCitation }} <span class="opacity-50 font-light ml-2">RVR1960</span>
                </p>
              </div>

              <div class="max-w-5xl mx-auto pt-8 border-t border-black/5">
                <p class="text-gray-600 leading-relaxed text-lg font-sans italic text-center"
                  v-html="formatText(verseData.initialReflection)"></p>
              </div>

              <div class="flex flex-wrap justify-center gap-4 pt-8">
                <button @click="generateContext" :disabled="isLoadingContext"
                  class="btn-editorial bg-brand-negro text-white">
                  <span v-if="!isLoadingContext">Profundizar Contexto</span>
                  <ArrowPathIcon v-else class="animate-spin h-4 w-4" />
                </button>
                <button @click="generatePrayer" :disabled="isLoadingPrayer"
                  class="btn-editorial border border-brand-camel text-brand-camel hover:bg-brand-camel hover:text-white">
                  <span v-if="!isLoadingPrayer">Generar Oración</span>
                  <ArrowPathIcon v-else class="animate-spin h-4 w-4" />
                </button>
              </div>
            </div>

            <div v-if="currentState === 'errorVerse'" class="text-center space-y-4">
              <ExclamationCircleIcon class="w-12 h-12 text-red-300 mx-auto" />
              <p class="font-playfair text-xl text-red-900">No pudimos conectar con la Palabra</p>
              <p class="text-xs text-red-400 uppercase tracking-widest">{{ errorVerseMessage }}</p>
            </div>
          </section>
        </transition>

        <transition-group name="fade-slide">
          <div v-if="contextData" key="context"
            class="mt-8 p-10 rounded-3xl bg-white shadow-card border border-gray-50 text-left space-y-6">
            <div class="flex items-center gap-4 border-b border-gray-50 pb-4">
              <BookOpenIcon class="w-5 h-5 text-brand-camel" />
              <h3 class="font-playfair text-2xl text-brand-negro italic">Contexto Histórico</h3>
            </div>
            <div class="grid md:grid-cols-3 gap-8 text-sm">
              <div v-for="(val, key) in contextData" :key="key" class="space-y-2">
                <h4 class="font-bold text-brand-camel uppercase tracking-widest text-[9px]">
                  {{ key === 'authorAndDate' ? 'Origen' : key === 'locationAndSociety' ? 'Sociedad' : 'Significado' }}
                </h4>
                <p class="text-gray-600 leading-relaxed italic">{{ val }}</p>
              </div>
            </div>
          </div>

          <div v-if="prayerData" key="prayer"
            class="mt-8 p-10 rounded-3xl bg-brand-negro text-white shadow-2xl relative overflow-hidden">
            <div class="absolute top-0 right-0 p-8 opacity-10">
              <HandRaisedIcon class="w-32 h-32" />
            </div>
            <div class="relative z-10 space-y-6">
              <div class="flex items-center gap-4 border-b border-white/10 pb-4">
                <SparklesIcon class="w-5 h-5 text-brand-camel" />
                <h3 class="font-playfair text-2xl italic">Una Oración para Ti</h3>
              </div>
              <p class="text-white/80 leading-relaxed text-lg font-sans italic" v-html="formatText(prayerData)"></p>
            </div>
          </div>
        </transition-group>
      </div>
    </section>
  </AnimatedSection>
</template>

<script setup lang="ts">
import { ref, shallowRef, computed, type Component } from 'vue'
import {
  FaceFrownIcon, ExclamationTriangleIcon, FaceSmileIcon, HeartIcon, UserMinusIcon, BoltIcon,
  LightBulbIcon, ArrowPathIcon, BookOpenIcon, StarIcon, UserGroupIcon, QuestionMarkCircleIcon,
  HandThumbDownIcon, FireIcon, ShieldExclamationIcon, ScaleIcon, SunIcon, MapIcon, SparklesIcon,
  HandRaisedIcon, TrophyIcon, MagnifyingGlassIcon, ArrowPathIcon as RenewIcon,
  ChevronLeftIcon, ChevronRightIcon
} from '@heroicons/vue/24/outline'
import AnimatedSection from '@/components/AnimatedSection.vue';

defineProps({ id: String })

const selectedColor = ref({
  a: '#f9fafb',
  b: '#f3f4f6'
})

const sectionStyle = computed(() => ({
  '--color-a': selectedColor.value.a,
  '--color-b': selectedColor.value.b,
}))

const moodOptions = ref([
  // Categoría 1: Estados de Ánimo Positivos y Edificantes
  { key: 'alegria', text: 'Alegría', iconComponent: shallowRef(FaceSmileIcon), bgColor: 'bg-yellow-500', colors: { a: '#fef9c3', b: '#fde68a' } },
  { key: 'agradecimiento', text: 'Agradecimiento', iconComponent: shallowRef(HeartIcon), bgColor: 'bg-pink-500', colors: { a: '#fce7f3', b: '#f9a8d4' } },
  { key: 'paz', text: 'Paz', iconComponent: shallowRef(SparklesIcon), bgColor: 'bg-teal-500', colors: { a: '#d1fae5', b: '#a7f3d0' } },
  { key: 'gozo', text: 'Gozo', iconComponent: shallowRef(SunIcon), bgColor: 'bg-orange-500', colors: { a: '#ffedd5', b: '#fed7aa' } },
  { key: 'esperanza', text: 'Esperanza', iconComponent: shallowRef(StarIcon), bgColor: 'bg-green-500', colors: { a: '#dcfce7', b: '#bbf7d0' } },
  { key: 'confianza', text: 'Confianza', iconComponent: shallowRef(BookOpenIcon), bgColor: 'bg-sky-500', colors: { a: '#e0f2fe', b: '#bae6fd' } },
  { key: 'inspiracion', text: 'Inspiración', iconComponent: shallowRef(LightBulbIcon), bgColor: 'bg-violet-500', colors: { a: '#ede9fe', b: '#ddd6fe' } },
  { key: 'fe', text: 'Fe', iconComponent: shallowRef(HandRaisedIcon), bgColor: 'bg-purple-500', colors: { a: '#f3e8ff', b: '#d8b4fe' } },
  { key: 'victoria', text: 'Victoria', iconComponent: shallowRef(TrophyIcon), bgColor: 'bg-amber-500', colors: { a: '#fffbeb', b: '#fcd34d' } },


  // Categoría 2: Estados de Ánimo Desafiantes (Emociones Negativas)
  { key: 'tristeza', text: 'Tristeza', iconComponent: shallowRef(FaceFrownIcon), bgColor: 'bg-blue-500', colors: { a: '#dbeafe', b: '#bfdbfe' } },
  { key: 'ansiedad', text: 'Ansiedad', iconComponent: shallowRef(ExclamationTriangleIcon), bgColor: 'bg-amber-500', colors: { a: '#fef3c7', b: '#fde68a' } },
  { key: 'miedo', text: 'Miedo', iconComponent: shallowRef(ShieldExclamationIcon), bgColor: 'bg-slate-500', colors: { a: '#f1f5f9', b: '#e2e8f0' } },
  { key: 'preocupacion', text: 'Preocupación', iconComponent: shallowRef(QuestionMarkCircleIcon), bgColor: 'bg-gray-500', colors: { a: '#f3f4f6', b: '#e5e7eb' } },
  { key: 'desanimo', text: 'Desánimo', iconComponent: shallowRef(HandThumbDownIcon), bgColor: 'bg-stone-500', colors: { a: '#f5f5f4', b: '#e7e5e4' } },
  { key: 'soledad', text: 'Soledad', iconComponent: shallowRef(UserMinusIcon), bgColor: 'bg-indigo-500', colors: { a: '#e0e7ff', b: '#c7d2fe' } },
  { key: 'ira', text: 'Ira', iconComponent: shallowRef(FireIcon), bgColor: 'bg-red-600', colors: { a: '#fee2e2', b: '#fecaca' } },
  { key: 'culpa', text: 'Culpa', iconComponent: shallowRef(ScaleIcon), bgColor: 'bg-rose-700', colors: { a: '#ffe4e6', b: '#fecdd3' } },
  { key: 'duda', text: 'Duda', iconComponent: shallowRef(QuestionMarkCircleIcon), bgColor: 'bg-gray-600', colors: { a: '#f3f4f6', b: '#d1d5db' } },
  { key: 'tentacion', text: 'Tentación', iconComponent: shallowRef(BoltIcon), bgColor: 'bg-red-400', colors: { a: '#fee2e2', b: '#fca5a5' } },

  // Categoría 3: Necesidades y Búsquedas Espirituales Profundas
  { key: 'fortaleza', text: 'Fortaleza', iconComponent: shallowRef(BoltIcon), bgColor: 'bg-lime-600', colors: { a: '#f7fee7', b: '#d9f99d' } },
  { key: 'guia', text: 'Guía y Dirección', iconComponent: shallowRef(MapIcon), bgColor: 'bg-cyan-600', colors: { a: '#cffafe', b: '#a5f3fc' } },
  { key: 'perdon', text: 'Perdón', iconComponent: shallowRef(UserGroupIcon), bgColor: 'bg-fuchsia-600', colors: { a: '#fae8ff', b: '#f5d0fe' } },
  { key: 'proposito', text: 'Propósito', iconComponent: shallowRef(BoltIcon), bgColor: 'bg-emerald-600', colors: { a: '#ecfdf5', b: '#a7f3d0' } },
  { key: 'sabiduria', text: 'Sabiduría', iconComponent: shallowRef(BookOpenIcon), bgColor: 'bg-orange-600', colors: { a: '#fff7ed', b: '#fed7aa' } },
  { key: 'renovacion', text: 'Renovación', iconComponent: shallowRef(RenewIcon), bgColor: 'bg-indigo-600', colors: { a: '#e0e7ff', b: '#a5b4fc' } },
  { key: 'busqueda', text: 'Búsqueda de Dios', iconComponent: shallowRef(MagnifyingGlassIcon), bgColor: 'bg-zinc-600', colors: { a: '#f4f4f5', b: '#d4d4d8' } },
])

const moodScrollContainer = ref<HTMLElement | null>(null);

// Función para mover el scroll manualmente con los botones
const scrollCarousel = (direction: 'left' | 'right') => {
  const container = moodScrollContainer.value;
  if (!container) return;

  const scrollAmount = 300;
  const maxScrollLeft = container.scrollWidth - container.clientWidth;
  const atStart = container.scrollLeft <= 1;
  const atEnd = container.scrollLeft >= maxScrollLeft - 1;

  if (direction === 'right' && atEnd) {
    container.scrollTo({ left: 0, behavior: 'smooth' });
    return;
  }

  if (direction === 'left' && atStart) {
    container.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
    return;
  }

  container.scrollBy({
    left: direction === 'left' ? -scrollAmount : scrollAmount,
    behavior: 'smooth',
  });
};

const currentState = ref('initial')
const activeMoodKey = ref<string | null>(null)

interface VerseData { verseCitation: string; verseText: string; initialReflection: string; }
interface ContextData { authorAndDate: string; locationAndSociety: string; originalMeaning: string; }

const verseData = ref<VerseData | null>(null)
const contextData = ref<ContextData | null>(null)
const prayerData = ref('')

const isLoadingVerse = ref(false)
const isLoadingContext = ref(false)
const isLoadingPrayer = ref(false)

const errorVerseMessage = ref('')

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_MODEL_NAME = 'gemini-2.5-flash'

const formatText = (text: string | undefined): string => text ? text.replace(/\n/g, '<br>') : ''

async function fetchFromGemini(prompt: string, jsonSchema: any = null) {
  if (!GEMINI_API_KEY) throw new Error('API Key para Gemini no configurada.')
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`
  const payload: any = { contents: [{ role: 'user', parts: [{ text: prompt }] }] }
  if (jsonSchema) {
    payload.generationConfig = { responseMimeType: 'application/json', responseSchema: jsonSchema }
  }
  const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: { message: 'Error desconocido' } }))
    throw new Error(`Error ${response.status}: ${errorData.error?.message || response.statusText}`)
  }
  const result = await response.json()
  const text = result.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Respuesta inesperada de la API.')
  return jsonSchema ? JSON.parse(text) : text
}

const handleMoodButtonClick = async (mood: typeof moodOptions.value[0]) => {
  activeMoodKey.value = mood.key
  selectedColor.value = mood.colors
  currentState.value = 'loadingVerse'
  isLoadingVerse.value = true
  verseData.value = null
  contextData.value = null
  prayerData.value = ''
  errorVerseMessage.value = ''

  const verseRequestSchema = {
    type: 'OBJECT',
    properties: { verseCitation: { type: 'STRING' }, verseText: { type: 'STRING' }, initialReflection: { type: 'STRING' } },
    required: ['verseCitation', 'verseText', 'initialReflection'],
  }
  const prompt = `**Instrucciones:** Eres un erudito bíblico y pastor que busca dar consuelo. Un usuario se siente **${mood.text}**. Tu tarea es doble:
  1.  Encuentra en la Biblia (versión Reina Valera 1960) un versículo que sea profundamente alentador y relevante para este estado de ánimo.
  2.  Escribe una reflexión personal y pastoral sobre ese versículo, actuando como una conversación con un amigo sabio. La reflexión debe:
      *   Reconocer el estado de ánimo del usuario (ej. "Entiendo que hoy sientes ${mood.text}...").
      *   Explicar cómo el versículo ofrece consuelo o esperanza.
      *   Ofrecer un consejo práctico y alentador.
      *   Tener un tono cálido, personal y esperanzador.

  **Formato de Salida:** Devuelve la respuesta estrictamente en formato JSON usando las claves: "verseCitation" (cita del versículo), "verseText" (texto del versículo), y "initialReflection" (la reflexión pastoral).`

  try {
    verseData.value = await fetchFromGemini(prompt, verseRequestSchema)
    currentState.value = 'verseContentLoaded'
  } catch (error: any) {
    errorVerseMessage.value = error.message
    currentState.value = 'errorVerse'
  } finally {
    isLoadingVerse.value = false
  }
}

const generateContext = async () => {
  if (!verseData.value) return
  isLoadingContext.value = true
  prayerData.value = '' // Ocultar oración si estaba visible
  contextData.value = null // Limpiar contexto anterior

  const schema = {
    type: 'OBJECT',
    properties: {
      authorAndDate: { type: 'STRING' },
      locationAndSociety: { type: 'STRING' },
      originalMeaning: { type: 'STRING' },
    },
    required: ['authorAndDate', 'locationAndSociety', 'originalMeaning'],
  }
  const prompt = `**Título:** Proporciona un contexto histórico y teológico con convicción.
  **Instrucciones:** Eres un pastor y erudito bíblico. Para el versículo **${verseData.value.verseCitation}**, presenta un análisis histórico y cultural. La explicación debe ser directa, sin dudas, y desde una perspectiva de fe que reconoce la Biblia como la Palabra de Dios.
  **Puntos Clave a Cubrir:**
  * **Autor y Fecha:** Identifica el autor y el período en el que fue escrito el libro.
  * **Contexto Original:** Describe el contexto social y cultural de la audiencia original.
  * **Mensaje Central:** Explica claramente el significado del versículo para su público en esa época.
  **Formato de Salida:** Devuelve la respuesta en formato de texto plano (no JSON), estructurada con subtítulos para cada punto.`

  try {
    contextData.value = await fetchFromGemini(prompt, schema)
  } catch (e) { console.error(e) } finally { isLoadingContext.value = false }
}

const generatePrayer = async () => {
  if (!verseData.value) return
  isLoadingPrayer.value = true
  contextData.value = null // Ocultar contexto si estaba visible
  prayerData.value = '' // Limpiar oración anterior

  const prompt = `**Título:** Genera una oración personal basada en el versículo.
**Instrucciones:** Basado en el versículo **${verseData.value.verseCitation}: "${verseData.value.verseText}"** y el estado de ánimo del usuario de **${activeMoodKey.value}**, crea una oración modelo.
**Puntos Clave de la Oración:**
*   **Reconocimiento:** Inicia reconociendo a Dios, haciendo referencia al versículo.
*   **Petición:** Presenta una petición relacionada con el estado de ánimo del usuario.
*   **Confianza y Fe:** Concluye con una declaración de fe.

**Tono:** El lenguaje debe ser devocional, humilde y honesto.`

  try {
    prayerData.value = await fetchFromGemini(prompt)
  } catch (e) { console.error(e) } finally { isLoadingPrayer.value = false }
}

</script>

<style scoped>
/* Estilos de botones editoriales */
.btn-editorial {
  @apply px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center;
}

/* Ocultar scrollbar pero mantener funcionalidad */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.mask-fade-edges {
  mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
}

.animated-gradient-bg {
  background: radial-gradient(circle at center, var(--color-a) 0%, var(--color-b) 100%);
  background-size: 150% 150%;
  transition: all 2s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ocean-flow 15s ease infinite;
}

@keyframes ocean-flow {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

/* Transiciones de contenido */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.98);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(0.98);
}

.shadow-card {
  box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.05);
}

.shadow-card-hover {
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.1);
}
</style>
