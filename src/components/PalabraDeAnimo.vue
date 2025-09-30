<template>
  <AnimatedSection>
    <section :id="id" :style="sectionStyle" class="py-section-md px-4 sm:px-6 lg:px-8 animated-gradient-bg">
      <div class="container mx-auto max-w-4xl">
        <header class="text-center mb-10 md:mb-12">
          <h2 class="font-playfair text-3xl md:text-4xl font-bold text-brand-negro mb-4">Palabra de Ánimo</h2>
          <p class="text-lg text-gray-700">
            Selecciona cómo te sientes para recibir un versículo de fortaleza.
          </p>
        </header>

        <div class="max-w-3xl mx-auto">
          <!-- Mood Carousel -->
          <section class="mb-10">
            <div class="relative">
              <div class="flex space-x-4 overflow-x-auto pb-4 scroll-snap-x-mandatory">
                <div v-for="mood in moodOptions" :key="mood.key"
                  class="flex-shrink-0 scroll-snap-align-center">
                  <button type="button"
                    class="flex flex-col items-center justify-center w-24 h-24 rounded-2xl transition-all duration-300 ease-in-out transform focus:outline-none"
                    :class="[
                      activeMoodKey === mood.key
                        ? `${mood.bgColor} text-white shadow-lg scale-110`
                        : 'bg-white/70 hover:bg-white text-brand-negro shadow-md hover:scale-105',
                      isLoadingVerse ? 'opacity-50 cursor-not-allowed' : ''
                    ]" :aria-pressed="activeMoodKey === mood.key" :disabled="isLoadingVerse"
                    @click="handleMoodButtonClick(mood)">

                    <component :is="mood.iconComponent" class="w-8 h-8 mb-1" />
                    <span class="text-xs font-medium">{{ mood.text }}</span>

                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- Verse Display Area -->
          <transition name="fade-slide" mode="out-in">
            <section :key="currentState"
              class="verse-display-area bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl flex flex-col justify-center items-center text-center min-h-[350px] border border-white/30 shadow-lg">
              <div v-if="currentState === 'initial'" class="text-gray-500">

                <LightBulbIcon class="w-16 h-16 mx-auto mb-3 opacity-50" />
                <p class="italic text-xl">Desliza y elige un estado de ánimo.</p>

              </div>

              <div v-if="currentState === 'loadingVerse'" class="w-full text-brand-camel">

                <ArrowPathIcon class="animate-spin h-12 w-12 mx-auto text-brand-camel" />
                <p class="italic mt-3 text-lg">Buscando un versículo para ti...</p>

              </div>

              <div v-if="currentState === 'verseContentLoaded' && verseData" class="w-full">

                <BookOpenIcon class="w-12 h-12 mx-auto mb-4 text-brand-verde-oscuro opacity-80" />
                <blockquote class="text-xl md:text-2xl italic text-brand-negro mb-4 leading-relaxed">
                  "{{ verseData.verseText }}"
                </blockquote>
                <p class="font-semibold text-brand-verde-oscuro text-lg mb-5">
                  {{ verseData.verseCitation }} (RVR1960)
                </p>

                <hr class="w-3/4 border-brand-camel/50 my-5 mx-auto" />
                <p class="text-gray-700 leading-relaxed text-base text-justify"
                  v-html="formatText(verseData.initialReflection)"></p>

              </div>

              <div v-if="currentState === 'errorVerse'" class="w-full text-red-700">

                <ExclamationTriangleIcon class="w-12 h-12 mx-auto mb-3 opacity-80" />
                <p class="font-semibold">Error al buscar versículo</p>
                <p class="text-sm mt-2">{{ errorVerseMessage }}</p>

              </div>
            </section>
          </transition>

          <!-- Exploration Buttons -->
          <transition name="fade-slide">
            <div v-if="currentState === 'verseContentLoaded' && verseData" class="mt-8 text-center">
              <div class="flex justify-center items-center space-x-4">
                <button @click="generateContext" :disabled="isLoadingContext"
                  class="exploration-button bg-brand-verde-oscuro">
                  <span v-if="!isLoadingContext">Profundizar en el Contexto</span>

                  <ArrowPathIcon v-else class="animate-spin h-5 w-5" />

                </button>
                <button @click="generatePrayer" :disabled="isLoadingPrayer"
                  class="exploration-button bg-brand-camel">
                  <span v-if="!isLoadingPrayer">Generar una Oración</span>

                  <ArrowPathIcon v-else class="animate-spin h-5 w-5" />

                </button>
              </div>

              <!-- Context Display -->
              <transition name="fade-slide">
                <div v-if="contextData"
                  class="mt-6 p-5 rounded-2xl text-base text-brand-negro leading-relaxed text-left bg-white/50 backdrop-blur-sm border border-white/30 shadow-lg">
                  <h3 class="font-playfair font-bold text-lg mb-2 text-brand-negro">Contexto del
                    Versículo</h3>
                  <div class="space-y-3">
                    <div>
                      <h4 class="font-semibold">Autoría y Fecha:</h4>
                      <p>{{ contextData.authorAndDate }}</p>
                    </div>
                    <div>
                      <h4 class="font-semibold">Contexto de la Época:</h4>
                      <p>{{ contextData.locationAndSociety }}</p>
                    </div>
                    <div>
                      <h4 class="font-semibold">Significado Original:</h4>
                      <p>{{ contextData.originalMeaning }}</p>
                    </div>
                  </div>
                </div>
              </transition>

              <!-- Prayer Display -->
              <transition name="fade-slide">
                <div v-if="prayerData"
                  class="mt-6 p-5 rounded-2xl text-base text-brand-negro leading-relaxed text-left bg-white/50 backdrop-blur-sm border border-white/30 shadow-lg">
                  <h3 class="font-playfair font-bold text-lg mb-2 text-brand-negro">Una Oración para
                    Ti</h3>
                  <p v-html="formatText(prayerData)"></p>
                </div>
              </transition>

            </div>
          </transition>
        </div>
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
  HandRaisedIcon, TrophyIcon, MagnifyingGlassIcon, ArrowPathIcon as RenewIcon
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
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.4);
}

.scroll-snap-x-mandatory {
  scroll-snap-type: x mandatory;
}

.scroll-snap-align-center {
  scroll-snap-align: center;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(15px);
}

.exploration-button {
  @apply text-white py-2 px-5 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md flex items-center justify-center font-medium;
}

.animated-gradient-bg {
  background: radial-gradient(circle, var(--color-a), var(--color-b));
  background-size: 200% 200%;
  transition: background 2s ease-in-out;
  animation: gradient-flow 10s ease infinite;
}

@keyframes gradient-flow {
  0% {
    background-position: 50% 0%;
  }

  50% {
    background-position: 50% 100%;
  }

  100% {
    background-position: 50% 0%;
  }
}
</style>