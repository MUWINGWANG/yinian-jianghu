import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import type { EndingId, Outcome } from '../types/game'
import { useAffinityStore } from './affinity'

export const useGameStore = defineStore('game', () => {
  const day = ref(1)
  const secretSpread = ref(0)
  const flags = reactive(new Set<string>())
  const ending = ref<EndingId | null>(null)

  function advanceDay() {
    if (day.value < 30) day.value++
  }

  function applyOutcome(outcome: Outcome) {
    if (outcome.secretSpreadDelta) {
      secretSpread.value = Math.min(10, Math.max(0, secretSpread.value + outcome.secretSpreadDelta))
    }
    if (outcome.flags) {
      outcome.flags.forEach(f => flags.add(f))
    }
    if (outcome.npcId && outcome.affinityDelta) {
      const affinityStore = useAffinityStore()
      affinityStore.adjustAffinity(outcome.npcId, outcome.affinityDelta)
    }
  }

  function setEnding(id: EndingId) {
    ending.value = id
  }

  return { day, secretSpread, flags, ending, advanceDay, applyOutcome, setEnding }
})
