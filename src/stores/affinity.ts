import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { NpcId, AffinityDimension, AffinityState } from '../types/npc'
import { NPC_PROFILES } from '../data/npcs'

type AffinityMap = Record<NpcId, AffinityState>

export const useAffinityStore = defineStore('affinity', () => {
  const affinityMap = reactive<AffinityMap>(
    Object.fromEntries(
      NPC_PROFILES.map(npc => [npc.id, { ...npc.initialAffinity }])
    ) as AffinityMap
  )

  function adjustAffinity(
    npcId: NpcId,
    delta: Partial<Record<AffinityDimension, number>>
  ) {
    const current = affinityMap[npcId]
    for (const dim of Object.keys(delta) as AffinityDimension[]) {
      current[dim] = Math.min(100, Math.max(0, current[dim] + (delta[dim] ?? 0)))
    }
  }

  function getAffinity(npcId: NpcId): AffinityState {
    return affinityMap[npcId]
  }

  return { affinityMap, adjustAffinity, getAffinity }
})
