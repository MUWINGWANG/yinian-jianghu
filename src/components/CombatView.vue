<template>
  <div class="combat-view">
    <!-- HP 条区域 -->
    <div class="hp-bars">
      <div class="combatant player-side">
        <div class="combatant-name">{{ combat.state.player.name }}</div>
        <div class="hp-bar-wrap">
          <div
            class="hp-bar player-bar"
            :style="{ width: playerHpPercent + '%' }"
          ></div>
        </div>
        <div class="hp-text">{{ combat.state.player.hp }} / {{ combat.state.player.maxHp }}</div>
      </div>

      <div class="vs-label">VS</div>

      <div class="combatant enemy-side">
        <div class="combatant-name">{{ combat.state.enemy.name }}</div>
        <div class="hp-bar-wrap">
          <div
            class="hp-bar enemy-bar"
            :style="{ width: enemyHpPercent + '%' }"
          ></div>
        </div>
        <div class="hp-text">{{ combat.state.enemy.hp }} / {{ combat.state.enemy.maxHp }}</div>
      </div>
    </div>

    <!-- 战斗日志 -->
    <div class="combat-log">
      <div
        v-for="(line, idx) in recentLog"
        :key="idx"
        class="log-line"
      >{{ line }}</div>
      <div v-if="combat.state.log.length === 0" class="log-line log-hint">战斗开始，选择技能出击！</div>
    </div>

    <!-- 结果提示 -->
    <div v-if="combat.state.outcome === 'win'" class="outcome-banner outcome-win">
      胜！刀锋已收，敌手伏诛。
    </div>
    <div v-else-if="combat.state.outcome === 'lose'" class="outcome-banner outcome-lose">
      败……力竭倒地，身受重伤。
    </div>

    <!-- 技能按钮 -->
    <div v-if="combat.state.outcome === 'ongoing'" class="skill-buttons">
      <button
        v-for="skill in combat.state.player.skills"
        :key="skill.id"
        class="skill-btn"
        :disabled="combat.state.player.actionPoints < skill.cost"
        @click="handleSkill(skill.id)"
      >
        <span class="skill-name">{{ skill.name }}</span>
        <span class="skill-meta">伤害 {{ skill.damage }} · 消耗 {{ skill.cost }}点</span>
        <span v-if="skill.effect" class="skill-effect">{{ skill.effect }}</span>
      </button>
    </div>

    <!-- 战斗结束后的操作按钮 -->
    <div v-if="combat.state.outcome !== 'ongoing'" class="outcome-actions">
      <button class="outcome-btn" @click="handleOutcome">继续</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useCombatStore } from '../stores/combat'

const props = defineProps<{
  enemyName: string
  enemyHp: number
}>()

const emit = defineEmits<{
  win: []
  lose: []
}>()

const combat = useCombatStore()

onMounted(() => {
  combat.initCombat(props.enemyName, props.enemyHp)
})

const playerHpPercent = computed(() =>
  Math.max(0, Math.round((combat.state.player.hp / combat.state.player.maxHp) * 100))
)

const enemyHpPercent = computed(() =>
  Math.max(0, Math.round((combat.state.enemy.hp / combat.state.enemy.maxHp) * 100))
)

const recentLog = computed(() => combat.state.log.slice(-5))

function handleSkill(skillId: string) {
  combat.useSkill(skillId)
}

function handleOutcome() {
  if (combat.state.outcome === 'win') {
    emit('win')
  } else {
    emit('lose')
  }
}
</script>

<style scoped>
.combat-view {
  background: #1A1208;
  border: 2px solid #8B1A1A;
  border-radius: 4px;
  padding: 1.2rem 1.5rem;
  margin: 1rem 0;
  font-family: 'Noto Serif SC', serif;
}

/* HP 条区域 */
.hp-bars {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.combatant {
  flex: 1;
}

.combatant-name {
  font-size: 0.9rem;
  color: #C9A84C;
  margin-bottom: 0.3rem;
  font-weight: bold;
}

.hp-bar-wrap {
  width: 100%;
  height: 10px;
  background: #2A1E0E;
  border: 1px solid #4A3828;
  border-radius: 2px;
  overflow: hidden;
}

.hp-bar {
  height: 100%;
  transition: width 0.3s ease;
  border-radius: 2px;
}

.player-bar {
  background: #4CAF50;
}

.enemy-bar {
  background: #C0392B;
}

.hp-text {
  font-size: 0.75rem;
  color: #E0CC98;
  margin-top: 0.2rem;
  text-align: center;
}

.vs-label {
  color: #8B1A1A;
  font-size: 1.1rem;
  font-weight: bold;
  flex-shrink: 0;
}

/* 战斗日志 */
.combat-log {
  background: #0F0A04;
  border: 1px solid #3A2A18;
  border-radius: 2px;
  padding: 0.7rem 1rem;
  min-height: 80px;
  margin-bottom: 1rem;
}

.log-line {
  font-size: 0.82rem;
  color: #F5E6C8;
  line-height: 1.7;
}

.log-hint {
  color: #8B7355;
  font-style: italic;
}

/* 结果横幅 */
.outcome-banner {
  text-align: center;
  font-size: 1.1rem;
  font-weight: bold;
  padding: 0.7rem;
  border-radius: 2px;
  margin-bottom: 0.8rem;
  letter-spacing: 0.05em;
}

.outcome-win {
  background: #1A3A1A;
  color: #4CAF50;
  border: 1px solid #4CAF50;
}

.outcome-lose {
  background: #3A0A0A;
  color: #C0392B;
  border: 1px solid #8B1A1A;
}

/* 技能按钮 */
.skill-buttons {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.skill-btn {
  flex: 1;
  min-width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.6rem 0.8rem;
  background: #2A1E0E;
  border: 1px solid #8B1A1A;
  border-radius: 2px;
  color: #F5E6C8;
  font-family: 'Noto Serif SC', serif;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
  gap: 0.2rem;
}

.skill-btn:hover:not(:disabled) {
  background: #3A2A18;
  border-color: #C9A84C;
}

.skill-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.skill-name {
  font-size: 0.9rem;
  color: #C9A84C;
  font-weight: bold;
}

.skill-meta {
  font-size: 0.72rem;
  color: #E0CC98;
}

.skill-effect {
  font-size: 0.68rem;
  color: #8B1A1A;
}

/* 战斗结束操作 */
.outcome-actions {
  text-align: center;
}

.outcome-btn {
  padding: 0.5rem 2rem;
  background: #8B1A1A;
  color: #F5E6C8;
  border: none;
  border-radius: 2px;
  font-family: 'Noto Serif SC', serif;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
}

.outcome-btn:hover {
  background: #C0392B;
}
</style>
