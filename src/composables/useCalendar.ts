import { computed, ref, readonly } from 'vue'
import type { Choice } from '../types/game'
import type { NpcId } from '../types/npc'
import { DAY_EVENTS } from '../data/events'
import { useGameStore } from '../stores/game'
import { useAffinityStore } from '../stores/affinity'

export function useCalendar() {
  const gameStore = useGameStore()
  const affinityStore = useAffinityStore()

  const currentEvent = computed(
    () => DAY_EVENTS.find(e => e.day === gameStore.day) ?? DAY_EVENTS[0]
  )

  const choiceMade = ref(false)
  const selectedChoice = ref<Choice | null>(null)
  const nightVisitUsed = ref(false)
  const nightVisitNpc = ref<NpcId | null>(null)

  function makeChoice(choiceId: string): void {
    if (choiceMade.value) return
    const choice = currentEvent.value.choices.find(c => c.id === choiceId)
    if (!choice) return
    for (const outcome of choice.outcomes) {
      gameStore.applyOutcome(outcome)
    }
    selectedChoice.value = choice
    choiceMade.value = true
  }

  function useNightVisit(npcId: NpcId): void {
    if (nightVisitUsed.value) return
    nightVisitNpc.value = npcId
    nightVisitUsed.value = true
    affinityStore.adjustAffinity(npcId, { intimacy: 3 })
  }

  function advanceToNextDay(): void {
    if (!choiceMade.value) return
    gameStore.advanceDay()
    choiceMade.value = false
    selectedChoice.value = null
    nightVisitUsed.value = false
    nightVisitNpc.value = null
  }

  return {
    currentEvent,
    choiceMade: readonly(choiceMade),
    selectedChoice: readonly(selectedChoice),
    nightVisitUsed: readonly(nightVisitUsed),
    nightVisitNpc: readonly(nightVisitNpc),
    makeChoice,
    useNightVisit,
    advanceToNextDay,
  }
}
