<template>
  <div class="game-layout">
    <!-- 状态栏 -->
    <header class="status-bar">
      <span>第 {{ game.day }} / 30 天</span>
      <span>秘密扩散：{{ game.secretSpread }} / 10</span>
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

      <!-- 日间：抉择 -->
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

      <!-- 推进天数 -->
      <div v-if="cal.choiceMade.value" class="advance-bar">
        <button class="advance-btn" @click="cal.advanceToNextDay()">
          进入第 {{ game.day + 1 }} 天 →
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '../stores/game'
import { useCalendar } from '../composables/useCalendar'
import DayScene from '../components/DayScene.vue'
import ChoicePanel from '../components/ChoicePanel.vue'
import EveningFeedback from '../components/EveningFeedback.vue'
import NightVisitPanel from '../components/NightVisitPanel.vue'

const game = useGameStore()
const cal = useCalendar()
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
.status-bar {
  display: flex;
  gap: 1.5rem;
  padding: 0.5rem 1rem;
  background: #2A1E0E;
  border: 1px solid #C9A84C;
  border-radius: 2px;
  margin-bottom: 1rem;
  font-size: 0.8rem;
  color: #E0CC98;
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
</style>
