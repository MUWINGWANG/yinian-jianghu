<template>
  <div class="game-debug">
    <h1>《一念江湖》</h1>
    <p>当前天数：第 {{ game.day }} 天</p>
    <p>秘密扩散：{{ game.secretSpread }} / 10</p>
    <p>NPC 数量：{{ Object.keys(affinity.affinityMap).length }} 位</p>
    <p>姜鹤年信任度：{{ affinity.getAffinity('jiang-henian').trust }}</p>
    <button @click="game.advanceDay()">推进一天</button>
    <button @click="game.applyOutcome({ secretSpreadDelta: 1, flags: ['test'] })">
      触发事件
    </button>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from './stores/game'
import { useAffinityStore } from './stores/affinity'

const game = useGameStore()
const affinity = useAffinityStore()
</script>

<style scoped>
.game-debug { font-family: serif; padding: 2rem; }
button { margin: 0.5rem; padding: 0.5rem 1rem; cursor: pointer; }
</style>
