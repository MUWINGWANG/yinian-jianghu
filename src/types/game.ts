import type { NpcId, AffinityDimension } from './npc'

export type EndingId = 'e1' | 'e2' | 'e3' | 'e4' | 'e5' | 'e6' | 'e7'

export interface Choice {
  id: string
  text: string
  outcomes: Outcome[]
}

export interface Outcome {
  npcId?: NpcId
  affinityDelta?: Partial<Record<AffinityDimension, number>>
  secretSpreadDelta?: number
  flags?: string[]
}

export interface DayEvent {
  day: number
  title: string
  scene: string
  choices: Choice[]
  hasCombat: boolean
}

export interface GameState {
  day: number
  secretSpread: number
  flags: Set<string>
  ending: EndingId | null
}
