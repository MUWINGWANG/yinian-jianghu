<template>
  <section class="evening-feedback" v-if="choice">
    <p class="section-label">傍晚 · 关系波动</p>
    <ul class="outcome-list">
      <li v-for="(line, i) in outcomeLines" :key="i" class="outcome-item">
        {{ line }}
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Choice } from '../types/game'
import { NPC_PROFILES } from '../data/npcs'

const props = defineProps<{ choice: Choice | null }>()

const NPC_NAME_MAP = Object.fromEntries(NPC_PROFILES.map(n => [n.id, n.name]))

const DIM_LABEL: Record<string, string> = {
  trust: '信任', intimacy: '亲密', awe: '敬畏', dread: '忌惮',
}

const outcomeLines = computed((): string[] => {
  if (!props.choice) return []
  const lines: string[] = []
  for (const outcome of props.choice.outcomes) {
    if (outcome.npcId && outcome.affinityDelta) {
      const name = NPC_NAME_MAP[outcome.npcId] ?? outcome.npcId
      for (const [dim, val] of Object.entries(outcome.affinityDelta)) {
        if (val === undefined || val === 0) continue
        const label = DIM_LABEL[dim] ?? dim
        const sign = val > 0 ? '+' : ''
        lines.push(`${name} · ${label} ${sign}${val}`)
      }
    }
    if (outcome.secretSpreadDelta && outcome.secretSpreadDelta !== 0) {
      const sign = outcome.secretSpreadDelta > 0 ? '+' : ''
      lines.push(`秘密扩散 ${sign}${outcome.secretSpreadDelta}`)
    }
  }
  return lines.length ? lines : ['此次抉择未引起明显波动。']
})
</script>

<style scoped>
.evening-feedback {
  padding: 1rem 1.5rem;
  border-top: 1px dashed #C9A84C;
  margin-top: 0.5rem;
}
.section-label { font-size: 0.75rem; color: #C9A84C; letter-spacing: 3px; margin-bottom: 0.5rem; }
.outcome-list { list-style: none; padding: 0; margin: 0; }
.outcome-item { font-size: 0.85rem; color: #E0CC98; padding: 2px 0; }
</style>
