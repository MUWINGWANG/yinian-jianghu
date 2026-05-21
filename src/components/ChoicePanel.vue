<template>
  <section class="choice-panel">
    <p class="choice-prompt">如何抉择？</p>
    <div class="choices">
      <button
        v-for="choice in choices"
        :key="choice.id"
        :disabled="disabled"
        class="choice-btn"
        :class="{ selected: selectedId === choice.id, disabled }"
        @click="emit('choose', choice.id)"
      >
        {{ choice.text }}
      </button>
    </div>
    <p v-if="choices.length === 0" class="no-choices">三十日已至，一切尘埃落定。</p>
  </section>
</template>

<script setup lang="ts">
import type { Choice } from '../types/game'

defineProps<{
  choices: Choice[]
  disabled: boolean
  selectedId?: string | null
}>()

const emit = defineEmits<{ choose: [choiceId: string] }>()
</script>

<style scoped>
.choice-panel { padding: 1rem 1.5rem; }
.choice-prompt { font-size: 0.85rem; color: #8B1A1A; letter-spacing: 2px; margin-bottom: 0.75rem; }
.choices { display: flex; flex-direction: column; gap: 0.5rem; }
.choice-btn {
  padding: 0.7rem 1rem;
  background: #2A1E0E;
  color: #F5E6C8;
  border: 1px solid #C9A84C;
  border-radius: 2px;
  font-family: 'Noto Serif SC', serif;
  font-size: 0.9rem;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s;
}
.choice-btn:hover:not(.disabled) { background: #3A2E1E; }
.choice-btn.selected { border-color: #C0392B; color: #C0392B; }
.choice-btn.disabled { opacity: 0.5; cursor: not-allowed; }
.no-choices { color: #8B1A1A; font-style: italic; text-align: center; padding: 1rem; }
</style>
