<template>
  <section class="night-visit">
    <p class="section-label">夜 · 可选夜访</p>
    <p v-if="used" class="visit-done">
      今夜已拜访 <strong>{{ visitedName }}</strong>，亲密度 +3。
    </p>
    <template v-else>
      <p class="visit-hint">选择一位 NPC 深谈（每日限一次）：</p>
      <div class="npc-grid">
        <button
          v-for="npc in availableNpcs"
          :key="npc.id"
          class="npc-btn"
          @click="emit('visit', npc.id)"
        >
          {{ npc.name }}
          <span class="npc-role">{{ npc.role }}</span>
        </button>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { NpcId } from '../types/npc'
import { NPC_PROFILES } from '../data/npcs'

const props = defineProps<{
  used: boolean
  visitedNpc?: NpcId | null
}>()

const emit = defineEmits<{ visit: [npcId: NpcId] }>()

const availableNpcs = NPC_PROFILES

const visitedName = computed(() => {
  if (!props.visitedNpc) return ''
  return NPC_PROFILES.find(n => n.id === props.visitedNpc)?.name ?? props.visitedNpc
})
</script>

<style scoped>
.night-visit {
  padding: 1rem 1.5rem;
  border-top: 1px dashed #4A7C59;
  margin-top: 0.5rem;
  background: rgba(26, 18, 8, 0.6);
}
.section-label { font-size: 0.75rem; color: #4A7C59; letter-spacing: 3px; margin-bottom: 0.5rem; }
.visit-done, .visit-hint { font-size: 0.85rem; color: #E0CC98; margin: 0 0 0.5rem; }
.npc-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.4rem; }
.npc-btn {
  display: flex; flex-direction: column; align-items: center;
  padding: 0.4rem 0.3rem;
  background: transparent;
  border: 1px solid #4A7C59;
  border-radius: 2px;
  color: #E0CC98;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background 0.2s;
}
.npc-btn:hover { background: rgba(74, 124, 89, 0.2); }
.npc-role { font-size: 0.65rem; color: #8B1A1A; margin-top: 2px; }
</style>
