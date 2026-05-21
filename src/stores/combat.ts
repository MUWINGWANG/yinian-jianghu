import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { CombatState } from '../types/combat'
import { MARTIAL_ARTS } from '../data/martial-arts'

const PLAYER_BASE = { hp: 100, maxHp: 100, actionPoints: 3 }

// 玩家技能：青云门前3招
const PLAYER_SKILLS = MARTIAL_ARTS.filter(m => m.faction === 'qingyun').slice(0, 3)

export const useCombatStore = defineStore('combat', () => {
  const state = reactive<CombatState>({
    player: {
      name: '叶知微',
      hp: PLAYER_BASE.hp,
      maxHp: PLAYER_BASE.maxHp,
      actionPoints: PLAYER_BASE.actionPoints,
      skills: PLAYER_SKILLS,
    },
    enemy: {
      name: '',
      hp: 0,
      maxHp: 0,
      actionPoints: 2,
      skills: MARTIAL_ARTS.filter(m => m.faction === 'huangyuan').slice(0, 3),
    },
    turn: 1,
    log: [],
    outcome: 'ongoing',
  })

  function initCombat(enemyName: string, enemyHp: number): void {
    state.player.hp = PLAYER_BASE.hp
    state.player.maxHp = PLAYER_BASE.maxHp
    state.player.actionPoints = PLAYER_BASE.actionPoints
    state.player.skills = PLAYER_SKILLS
    state.enemy.name = enemyName
    state.enemy.hp = enemyHp
    state.enemy.maxHp = enemyHp
    state.enemy.actionPoints = 2
    state.enemy.skills = MARTIAL_ARTS.filter(m => m.faction === 'huangyuan').slice(0, 3)
    state.turn = 1
    state.log = []
    state.outcome = 'ongoing'
  }

  function useSkill(skillId: string): string[] {
    if (state.outcome !== 'ongoing') return []

    const skill = state.player.skills.find(s => s.id === skillId)
    if (!skill) return []
    if (state.player.actionPoints < skill.cost) return []

    const roundLog: string[] = []

    // 玩家出招
    state.player.actionPoints -= skill.cost
    let playerDmg = skill.damage
    state.enemy.hp = Math.max(0, state.enemy.hp - playerDmg)
    roundLog.push(`你使出「${skill.name}」，对敌造成 ${playerDmg} 点伤害！`)

    // 检查敌人是否已死
    if (state.enemy.hp <= 0) {
      state.outcome = 'win'
      roundLog.push(`${state.enemy.name} 已倒下，你获胜了！`)
      state.log.push(...roundLog)
      return roundLog
    }

    // 敌人随机还击
    const enemySkills = state.enemy.skills.filter(s => s.cost <= state.enemy.actionPoints)
    if (enemySkills.length > 0) {
      const enemySkill = enemySkills[Math.floor(Math.random() * enemySkills.length)]
      const enemyDmg = enemySkill.damage
      state.player.hp = Math.max(0, state.player.hp - enemyDmg)
      roundLog.push(`${state.enemy.name} 以「${enemySkill.name}」反击，你受到 ${enemyDmg} 点伤害！`)
    } else {
      roundLog.push(`${state.enemy.name} 喘息调整，暂未出手。`)
    }

    // 检查玩家是否已死
    if (state.player.hp <= 0) {
      state.outcome = 'lose'
      roundLog.push('你力竭倒地，战败了……')
    }

    // 回合结束，恢复行动点
    state.turn++
    state.player.actionPoints = PLAYER_BASE.actionPoints

    state.log.push(...roundLog)
    return roundLog
  }

  function isOver(): boolean {
    return state.player.hp <= 0 || state.enemy.hp <= 0
  }

  return { state, initCombat, useSkill, isOver }
})
