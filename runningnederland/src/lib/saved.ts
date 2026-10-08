import { ref, watch } from 'vue'

// "Mijn Runs": opgeslagen evenementen, bewaard in de browser van de bezoeker.
const KEY = 'rn-mijn-runs'
function read(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}
export const savedIds = ref<string[]>(read())
watch(
  savedIds,
  (v) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(v))
    } catch {
      /* opslag niet beschikbaar */
    }
  },
  { deep: true },
)
export const isSaved = (id: string) => savedIds.value.includes(id)
export function toggleSaved(id: string) {
  savedIds.value = isSaved(id) ? savedIds.value.filter((x) => x !== id) : [...savedIds.value, id]
}
