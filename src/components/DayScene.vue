<template>
  <section class="day-scene">
    <div class="day-header">
      <span class="day-badge">第 {{ event.day }} 天</span>
      <h2 class="day-title">{{ event.title }}</h2>
    </div>
    <p class="scene-text">{{ event.scene }}</p>
    <span v-if="event.hasCombat" class="combat-badge">⚔ 今日有战斗</span>
  </section>
</template>

<script setup lang="ts">
import type { DayEvent } from '../types/game'
defineProps<{ event: DayEvent }>()
</script>

<style scoped>
.day-scene {
  padding: 1.5rem;
  background: #F5E6C8;
  border: 2px solid #C0392B;
  border-radius: 4px;
  margin-bottom: 1rem;
}
.day-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
.day-badge { font-size: 0.8rem; color: #8B1A1A; border: 1px solid #8B1A1A; padding: 2px 8px; border-radius: 2px; }
.day-title { font-family: 'Noto Serif SC', serif; font-size: 1.2rem; color: #1A1208; margin: 0; }
.scene-text { font-family: 'Noto Serif SC', serif; color: #2A1E0E; line-height: 2; margin: 0; }
.combat-badge { display: inline-block; margin-top: 0.5rem; font-size: 0.75rem; color: #C0392B; border: 1px dashed #C0392B; padding: 2px 6px; }
</style>
