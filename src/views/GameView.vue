<template>
  <div class="game-layout">
    <!-- 江湖关系面板（固定侧边） -->
    <AffinityPanel />

    <!-- 状态栏 -->
    <header class="status-bar">
      <span class="status-item">
        <span class="status-icon">☀</span>
        第 {{ game.day }} / 30 天
      </span>
      <span
        class="status-item"
        :class="{ 'spread-warning': game.secretSpread >= 6 }"
      >
        <span class="status-icon">{{ game.secretSpread >= 6 ? '⚠' : '◈' }}</span>
        秘密扩散：{{ game.secretSpread }} / 10
      </span>
      <span v-if="game.day >= 30" class="ending-hint">⚑ 结局待触发</span>
    </header>

    <!-- 第 30 天：结局占位 -->
    <div v-if="game.day >= 30" class="ending-placeholder">
      <h2>终局之日</h2>
      <p>{{ cal.currentEvent.value.scene }}</p>
      <p class="ending-note">（结局系统将在 Phase 5 实现）</p>
      <p>累积标记：{{ Array.from(game.flags).join('、') || '无' }}</p>
    </div>

    <!-- 正常游戏日 -->
    <template v-else>
      <!-- 清晨：场景 -->
      <DayScene :event="cal.currentEvent.value" />

      <!-- 战斗（有战斗事件且未完成时显示） -->
      <CombatView
        v-if="cal.currentEvent.value.hasCombat && !combatDone"
        :enemy-name="combatEnemy.name"
        :enemy-hp="combatEnemy.hp"
        @win="onCombatWin"
        @lose="onCombatLose"
      />

      <!-- 日间：抉择（无战斗、或战斗已完成时显示） -->
      <template v-if="!cal.currentEvent.value.hasCombat || combatDone">
        <ChoicePanel
          :choices="cal.currentEvent.value.choices"
          :disabled="cal.choiceMade.value"
          :selected-id="cal.selectedChoice.value?.id"
          @choose="cal.makeChoice"
        />

        <!-- 傍晚：关系波动（抉择后显示） -->
        <EveningFeedback
          v-if="cal.choiceMade.value"
          :choice="cal.selectedChoice.value"
        />

        <!-- 夜间：可选夜访（抉择后显示） -->
        <NightVisitPanel
          v-if="cal.choiceMade.value"
          :used="cal.nightVisitUsed.value"
          :visited-npc="cal.nightVisitNpc.value"
          @visit="cal.useNightVisit"
        />

        <!-- 今夜已访提示 -->
        <Transition name="night-visited">
          <div
            v-if="cal.choiceMade.value && cal.nightVisitUsed.value && cal.nightVisitNpc.value"
            class="night-visited-tag"
          >
            <span class="night-visited-icon">🌙</span>
            今夜已访：{{ nightVisitedName }}
          </div>
        </Transition>

        <!-- 推进天数 -->
        <div v-if="cal.choiceMade.value" class="advance-bar">
          <button class="advance-btn" @click="onAdvanceDay">
            进入第 {{ game.day + 1 }} 天 →
          </button>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useGameStore } from '../stores/game'
import { useCalendar } from '../composables/useCalendar'
import DayScene from '../components/DayScene.vue'
import ChoicePanel from '../components/ChoicePanel.vue'
import EveningFeedback from '../components/EveningFeedback.vue'
import NightVisitPanel from '../components/NightVisitPanel.vue'
import CombatView from '../components/CombatView.vue'
import AffinityPanel from '../components/AffinityPanel.vue'
import { NPC_PROFILES } from '../data/npcs'

const game = useGameStore()
const cal = useCalendar()

// 今夜已访 NPC 名称
const nightVisitedName = computed(() => {
  const id = cal.nightVisitNpc.value
  if (!id) return ''
  return NPC_PROFILES.find(n => n.id === id)?.name ?? id
})

// 战斗状态
const combatDone = ref(false)

// 每天进入时重置 combatDone
watch(() => game.day, () => {
  combatDone.value = false
})

// 根据当前天数决定战斗敌人参数
const COMBAT_ENEMIES: Record<number, { name: string; hp: number }> = {
  5: { name: '荒原帮壮汉', hp: 60 },
  14: { name: '宴席刺客', hp: 80 },
  25: { name: '血煞堂杀手', hp: 100 },
}

const combatEnemy = {
  get name() { return COMBAT_ENEMIES[game.day]?.name ?? '敌人' },
  get hp() { return COMBAT_ENEMIES[game.day]?.hp ?? 60 },
}

function onCombatWin() {
  combatDone.value = true
}

function onCombatLose() {
  // 战败：秘密扩散 +1，仍可继续游戏
  game.applyOutcome({ secretSpreadDelta: 1 })
  combatDone.value = true
}

function onAdvanceDay() {
  cal.advanceToNextDay()
}
</script>

<style scoped>
.game-layout {
  max-width: 760px;
  margin: 0 auto;
  padding: 1rem;
  background: #1A1208;
  min-height: 100vh;
  color: #F5E6C8;
  font-family: 'Noto Serif SC', serif;
}

/* ── 状态栏 ── */
.status-bar {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  padding: 0.5rem 1rem;
  background: #2A1E0E;
  border: 1px solid #C9A84C;
  border-radius: 2px;
  margin-bottom: 1rem;
  font-size: 0.8rem;
  color: #E0CC98;
}
.status-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.status-icon { font-size: 0.85rem; }
.spread-warning {
  color: #C0392B;
  font-weight: bold;
  animation: pulse-warn 1.5s ease-in-out infinite;
}
@keyframes pulse-warn {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.6; }
}

.ending-hint { color: #C0392B; }
.ending-placeholder {
  padding: 2rem;
  text-align: center;
  border: 2px dashed #C0392B;
  border-radius: 4px;
}
.ending-placeholder h2 { color: #C0392B; margin-bottom: 1rem; }
.ending-note { font-size: 0.8rem; color: #8B1A1A; margin-top: 1rem; }

.advance-bar {
  padding: 1rem 1.5rem;
  border-top: 1px solid #2A1E0E;
  margin-top: 0.5rem;
  text-align: right;
}
.advance-btn {
  padding: 0.6rem 1.5rem;
  background: #C0392B;
  color: #F5E6C8;
  border: none;
  border-radius: 2px;
  font-family: 'Noto Serif SC', serif;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
}
.advance-btn:hover { background: #8B1A1A; }

/* ── 今夜已访 ── */
.night-visited-tag {
  margin: 0.4rem 1.5rem;
  padding: 0.35rem 0.8rem;
  background: rgba(42, 30, 14, 0.7);
  border: 1px solid #4A7C59;
  border-radius: 2px;
  font-size: 0.78rem;
  color: #A0C090;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.night-visited-icon { font-size: 0.85rem; }
.night-visited-enter-active,
.night-visited-leave-active { transition: opacity 0.3s, transform 0.3s; }
.night-visited-enter-from,
.night-visited-leave-to { opacity: 0; transform: translateX(-8px); }
</style>
