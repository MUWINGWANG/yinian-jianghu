import type { FactionId } from './faction'

export interface MartialArt {
  id: string
  name: string
  faction: FactionId
  damage: number
  cost: number
  effect?: string
}

export interface Combatant {
  name: string
  hp: number
  maxHp: number
  actionPoints: number
  skills: MartialArt[]
}

export interface CombatState {
  player: Combatant
  enemy: Combatant
  turn: number
  log: string[]
  outcome: 'ongoing' | 'win' | 'lose'
}
