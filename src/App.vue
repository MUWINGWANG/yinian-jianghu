<template>
  <Transition name="scene-switch">
    <TitleScreen v-if="!gameStarted" key="title" @start="gameStarted = true" />
    <GameView v-else key="game" />
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TitleScreen from './views/TitleScreen.vue'
import GameView from './views/GameView.vue'

const gameStarted = ref(false)
</script>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #1A1208; overflow-x: hidden; }

.scene-switch-enter-active { transition: opacity 0.6s ease 0.2s; }
.scene-switch-leave-active { transition: opacity 0.2s ease; }
.scene-switch-enter-from,
.scene-switch-leave-to { opacity: 0; }
</style>
