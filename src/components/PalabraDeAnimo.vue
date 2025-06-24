<template>
  <section :id="id" class="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
    <div class="container mx-auto max-w-7xl"> <!-- Ajustado a max-w-7xl -->
      <div class="bg-white p-6 md:p-10 rounded-xl shadow-xl">
        <div class="max-w-2xl mx-auto"> <!-- Contenedor interno para centrar el contenido -->
          <header class="text-center mb-8 md:mb-10">
            <h2 class="text-3xl md:text-4xl font-bold text-brand-negro">Palabra de Ánimo</h2>
            <p class="text-lg text-gray-600 mt-2">
              Encuentra consuelo y fortaleza en la Palabra.
            </p>
          </header>

          <section class="mb-8">
            <h3 class="text-xl font-semibold text-brand-negro mb-5 text-center">
              ¿Cómo te sientes hoy?
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <button v-for="mood in moodOptions" :key="mood.key" type="button"
                class="w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ease-in-out flex items-center text-sm md:text-base border"
                :class="[
                  activeMoodKey === mood.key
                    ? 'bg-brand-camel text-white shadow-md scale-105 border-brand-camel'
                    : 'bg-white hover:bg-gray-50 border-gray-300 text-brand-negro',
                  isLoadingVerse ? 'opacity-50 cursor-not-allowed' : ''
                ]" @click="handleMoodButtonClick(mood.key, mood.text)" :aria-pressed="activeMoodKey === mood.key"
                :disabled="isLoadingVerse">
                <component :is="mood.iconComponent" class="w-5 h-5 mr-2 inline-block" />
                {{ mood.text }}
              </button>
            </div>
          </section>

          <section
            class="verse-display-area bg-brand-verde-oscuro bg-opacity-10 p-6 rounded-xl flex flex-col justify-center items-center text-center min-h-[320px] border border-brand-verde-oscuro border-opacity-20">
            <!-- Initial State -->
            <div v-if="currentState === 'initial'" class="fade-in text-brand-verde-oscuro">
              <LightBulbIcon class="w-16 h-16 mx-auto mb-3 opacity-70" />
              <p class="italic text-xl">
                Selecciona un estado de ánimo para comenzar.
              </p>
            </div>

            <!-- Loading Verse State -->
            <div v-if="currentState === 'loadingVerse'" class="w-full fade-in text-brand-camel">
              <div class="flex justify-center items-center mb-2">
                <ArrowPathIcon class="animate-spin h-10 w-10 text-brand-camel" />
              </div>
              <p class="italic mt-2 text-lg">
                Buscando un versículo inspirador para ti...
              </p>
            </div>

            <!-- Verse Content State -->
            <div v-if="currentState === 'verseContentLoaded' && verseData" class="fade-in w-full">
              <BookOpenIcon class="w-12 h-12 mx-auto mb-4 text-brand-verde-oscuro opacity-80" />
              <blockquote class="text-xl italic text-brand-negro mb-4 leading-relaxed">
                "{{ verseData.verseText }}"
              </blockquote>
              <p class="font-semibold text-brand-verde-oscuro text-md mb-5">
                {{ verseData.verseCitation }} (RVR1960)
              </p>
              <hr class="w-3/4 border-brand-camel border-opacity-50 my-5 mx-auto" />
              <h4 class="text-md font-semibold text-brand-negro mb-2">
                Reflexión Inicial:
              </h4>
              <p class="text-gray-700 leading-relaxed text-base text-justify"
                v-html="formatText(verseData.initialReflection)"></p>
            </div>

            <!-- Error State for Verse -->
            <div v-if="currentState === 'errorVerse'"
              class="w-full fade-in bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative"
              role="alert">
              <strong class="font-bold">Error: </strong>
              <span class="block sm:inline">{{ errorVerseMessage }}</span>
              <span class="absolute top-0 bottom-0 right-0 px-4 py-3" @click="clearError('verse')">
                <XMarkIcon class="h-6 w-6 text-red-500" role="button" />
              </span>
            </div>
          </section>

          <!-- Additional Actions Section -->
          <div v-if="currentState === 'verseContentLoaded' && verseData" class="mt-8 space-y-6 text-center">
            <!-- Generate Reflection -->
            <div>
              <button type="button"
                class="bg-brand-borgona text-white py-3 px-6 rounded-lg hover:bg-opacity-80 transition-colors text-base font-medium shadow-md disabled:opacity-50"
                @click="generateAdditionalReflection" :disabled="isLoadingReflection">
                <SparklesIcon class="w-5 h-5 mr-2 inline-block" />
                Generar Reflexión Adicional
                <span v-if="isLoadingReflection"
                  class="ml-2 inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              </button>
              <div v-if="additionalReflection"
                class="mt-4 p-5 rounded-xl text-sm text-brand-negro leading-relaxed text-left fade-in bg-brand-borgona bg-opacity-10 border border-brand-borgona border-opacity-30 min-h-[100px]">
                <p v-html="formatText(additionalReflection)"></p>
              </div>
              <div v-if="errorReflectionMessage"
                class="mt-3 bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-md text-sm relative fade-in"
                role="alert">
                {{ errorReflectionMessage }}
                <button @click="clearError('reflection')"
                  class="absolute top-1 right-1 text-red-500 hover:text-red-700">
                  <XMarkIcon class="h-4 w-4" />
                </button>
              </div>
            </div>

            <hr class="my-6 border-gray-300">

            <!-- Explore Verse -->
            <div>
              <button type="button"
                class="bg-brand-verde-oscuro text-white py-3 px-6 rounded-lg hover:bg-opacity-80 transition-colors text-base font-medium shadow-md disabled:opacity-50"
                @click="exploreFurther" :disabled="isLoadingExploration">
                <MagnifyingGlassIcon class="w-5 h-5 mr-2 inline-block" />
                Profundizar en el Versículo
                <span v-if="isLoadingExploration"
                  class="ml-2 inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              </button>
              <div v-if="verseExploration"
                class="mt-4 p-5 rounded-xl text-sm text-brand-negro leading-relaxed text-left fade-in bg-brand-verde-oscuro bg-opacity-10 border border-brand-verde-oscuro border-opacity-30 min-h-[100px]">
                <h4 class="font-semibold text-brand-negro mb-1">
                  Contexto Histórico/Literario:
                </h4>
                <p class="mb-3" v-html="formatText(verseExploration.historicalContext)"></p>
                <h4 class="font-semibold text-brand-negro mb-1">
                  Tema Teológico Principal:
                </h4>
                <p class="mb-3" v-html="formatText(verseExploration.theologicalTheme)"></p>
                <h4 class="font-semibold text-brand-negro mb-1">
                  Referencias Cruzadas:
                </h4>
                <div>
                  <template v-if="verseExploration.crossReferences && verseExploration.crossReferences.length > 0">
                    <span v-for="(ref, i) in verseExploration.crossReferences" :key="i"
                      class="inline-block bg-brand-camel bg-opacity-20 text-brand-camel text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded-full">
                      {{ ref }}
                    </span>
                  </template>
                  <p v-else class="text-xs text-gray-500">
                    No se encontraron referencias cruzadas específicas.
                  </p>
                </div>
              </div>
              <div v-if="errorExplorationMessage"
                class="mt-3 bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-md text-sm relative fade-in"
                role="alert">
                {{ errorExplorationMessage }}
                <button @click="clearError('exploration')"
                  class="absolute top-1 right-1 text-red-500 hover:text-red-700">
                  <XMarkIcon class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, shallowRef, type Component } from 'vue'
import {
  FaceFrownIcon,
  ExclamationTriangleIcon,
  FaceSmileIcon,
  HeartIcon,
  UserMinusIcon,
  BoltIcon,
  QuestionMarkCircleIcon,
  HandThumbDownIcon,
  StarIcon,
  SparklesIcon as PeaceIcon, // Usando Sparkles para Paz, considera otro si no encaja
  UserGroupIcon, // Usando UserGroup para Perdón, considera otro si no encaja
  LightBulbIcon,
  ArrowPathIcon,
  BookOpenIcon,
  XMarkIcon,
  SparklesIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'

defineProps({
  id: String,
})

const moodOptions = ref([
  { key: 'tristeza', text: 'Tristeza', iconComponent: shallowRef(FaceFrownIcon) },
  { key: 'ansiedad', text: 'Ansiedad', iconComponent: shallowRef(ExclamationTriangleIcon) },
  { key: 'alegria', text: 'Alegría', iconComponent: shallowRef(FaceSmileIcon) },
  { key: 'miedo', text: 'Miedo', iconComponent: shallowRef(ExclamationTriangleIcon) },
  { key: 'agradecimiento', text: 'Agradecimiento', iconComponent: shallowRef(HeartIcon) },
  { key: 'soledad', text: 'Soledad', iconComponent: shallowRef(UserMinusIcon) },
  { key: 'necesidad_fortaleza', text: 'Fortaleza', iconComponent: shallowRef(BoltIcon) },
  { key: 'preocupacion', text: 'Preocupación', iconComponent: shallowRef(QuestionMarkCircleIcon) },
  { key: 'desanimo', text: 'Desánimo', iconComponent: shallowRef(HandThumbDownIcon) },
  { key: 'esperanza', text: 'Esperanza', iconComponent: shallowRef(StarIcon) },
  { key: 'paz', text: 'Paz', iconComponent: shallowRef(PeaceIcon) },
  { key: 'perdon', text: 'Perdón', iconComponent: shallowRef(UserGroupIcon) },
])

const currentState = ref('initial') // 'initial', 'loadingVerse', 'verseContentLoaded', 'errorVerse'
const activeMoodKey = ref<string | null>(null)
const currentSelectedEmotionText = ref('')

interface VerseData {
  verseCitation: string;
  verseText: string;
  initialReflection: string;
}
interface VerseExploration {
  historicalContext: string;
  theologicalTheme: string;
  crossReferences: string[];
}

const verseData = ref<VerseData | null>(null)
const additionalReflection = ref('')
const verseExploration = ref<VerseExploration | null>(null)

const isLoadingVerse = ref(false)
const isLoadingReflection = ref(false)
const isLoadingExploration = ref(false)

const errorVerseMessage = ref('')
const errorReflectionMessage = ref('')
const errorExplorationMessage = ref('')

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_MODEL_NAME = 'gemini-1.5-flash-latest'

const formatText = (text: string | undefined): string => {
  return text ? text.replace(/\n/g, '<br>') : ''
}

const clearError = (type: 'verse' | 'reflection' | 'exploration') => {
  if (type === 'verse') {
    errorVerseMessage.value = ''
    if (currentState.value === 'errorVerse') currentState.value = 'initial'
  } else if (type === 'reflection') {
    errorReflectionMessage.value = ''
  } else if (type === 'exploration') {
    errorExplorationMessage.value = ''
  }
}

async function fetchFromGemini(prompt: string, jsonSchema: any = null) {
  if (!GEMINI_API_KEY) {
    throw new Error(
      'API Key para Gemini no está configurada. Por favor, añada VITE_GEMINI_API_KEY a su archivo .env',
    )
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`

  const payload: any = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  }

  if (jsonSchema) {
    payload.generationConfig = {
      responseMimeType: 'application/json',
      responseSchema: jsonSchema,
    }
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: { message: 'Error desconocido de la API.' } }))
    console.error('API Error Data:', errorData)
    throw new Error(`Error ${response.status}: ${errorData.error?.message || response.statusText}`)
  }

  const result = await response.json()

  if (
    !result.candidates ||
    !result.candidates[0].content ||
    !result.candidates[0].content.parts ||
    !result.candidates[0].content.parts[0].text
  ) {
    console.error('Unexpected API Response:', result)
    throw new Error('Respuesta inesperada o vacía de la API.')
  }

  return jsonSchema
    ? JSON.parse(result.candidates[0].content.parts[0].text)
    : result.candidates[0].content.parts[0].text
}

const handleMoodButtonClick = async (moodKey: string, moodText: string) => {
  activeMoodKey.value = moodKey
  currentSelectedEmotionText.value = moodText

  currentState.value = 'loadingVerse'
  isLoadingVerse.value = true
  verseData.value = null
  additionalReflection.value = ''
  verseExploration.value = null
  errorVerseMessage.value = ''
  errorReflectionMessage.value = ''
  errorExplorationMessage.value = ''

  const verseRequestSchema = {
    type: 'OBJECT',
    properties: {
      verseCitation: { type: 'STRING' },
      verseText: { type: 'STRING' },
      initialReflection: { type: 'STRING' },
    },
    required: ['verseCitation', 'verseText', 'initialReflection'],
  }
  const prompt = `Eres un erudito bíblico experto en la Biblia Reina Valera 1960. Un usuario se siente '${currentSelectedEmotionText.value}'.
  Busca en la Biblia Reina Valera 1960 un versículo (texto y cita exacta, por ejemplo, 'Juan 3:16') que sea profundamente alentador y directamente relevante para esta emoción.
  Además, proporciona una reflexión inicial concisa y significativa (2-4 frases) sobre cómo este versículo puede ofrecer consuelo o fortaleza.
  Es absolutamente crucial que el texto del versículo sea exacto y no se altere.
  Devuelve la respuesta en formato JSON adhiriéndote estrictamente al esquema proporcionado.
  Ejemplo: {"verseCitation": "Salmo 23:1", "verseText": "Jehová es mi pastor; nada me faltará.", "initialReflection": "Este pasaje nos asegura el cuidado constante de Dios..."}`

  try {
    const parsedResult = await fetchFromGemini(prompt, verseRequestSchema)
    verseData.value = parsedResult
    currentState.value = 'verseContentLoaded'
  } catch (error: any) {
    console.error('Error al buscar versículo:', error)
    errorVerseMessage.value = `No se pudo obtener un versículo: ${error.message}. Intenta con otra emoción o más tarde.`
    currentState.value = 'errorVerse'
  } finally {
    isLoadingVerse.value = false
  }
}

const generateAdditionalReflection = async () => {
  if (!verseData.value) return

  isLoadingReflection.value = true
  additionalReflection.value = ''
  errorReflectionMessage.value = ''

  const prompt = `Actúa como un consejero espiritual cálido y comprensivo. Un usuario se siente '${currentSelectedEmotionText.value}' y está meditando en el versículo: '${verseData.value.verseText}' (${verseData.value.verseCitation}) de la Reina Valera 1960.
  Escribe una breve reflexión adicional o una oración corta y personal (3-5 frases). Debe ser alentadora, relevante para la emoción y el versículo, y ofrecer una perspectiva fresca, sin repetir la reflexión inicial que ya se le dio.
  Enfócate en la aplicación práctica o en una palabra de esperanza.`

  try {
    const generatedText = await fetchFromGemini(prompt)
    additionalReflection.value = generatedText
  } catch (error: any) {
    console.error('Error al generar reflexión adicional:', error)
    errorReflectionMessage.value = `No se pudo generar la reflexión adicional: ${error.message}`
  } finally {
    isLoadingReflection.value = false
  }
}

const exploreFurther = async () => {
  if (!verseData.value) return

  isLoadingExploration.value = true
  verseExploration.value = null
  errorExplorationMessage.value = ''

  const explorationSchema = {
    type: 'OBJECT',
    properties: {
      historicalContext: { type: 'STRING' },
      theologicalTheme: { type: 'STRING' },
      crossReferences: { type: 'ARRAY', items: { type: 'STRING' } },
    },
    required: ['historicalContext', 'theologicalTheme', 'crossReferences'],
  }

  const prompt = `Eres un comentarista bíblico y erudito conciso, especializado en la Reina Valera 1960. Para el versículo '${verseData.value.verseCitation}: ${verseData.value.verseText}', proporciona la siguiente información:
  1.  Un breve contexto histórico o literario del libro/pasaje (1-2 frases).
  2.  Un tema teológico principal resaltado en este versículo (1 frase concisa).
  3.  Dos o tres referencias cruzadas a otros versículos bíblicos relevantes (solo las citas, por ejemplo, 'Salmo 46:1').
  Devuelve la respuesta estrictamente en formato JSON usando las claves: "historicalContext", "theologicalTheme", "crossReferences" (esta última debe ser un array de strings con las citas).`

  try {
    const explorationData = await fetchFromGemini(prompt, explorationSchema)
    verseExploration.value = explorationData
  } catch (error: any) {
    console.error('Error al profundizar en el versículo:', error)
    errorExplorationMessage.value = `No se pudo obtener información adicional: ${error.message}`
  } finally {
    isLoadingExploration.value = false
  }
}
</script>

<style scoped>
.fade-in {
  animation: fadeInAnimation 0.5s ease-in-out forwards;
}

@keyframes fadeInAnimation {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.leading-relaxed {
  line-height: 1.7;
}

.text-justify {
  text-align: justify;
}
</style>
