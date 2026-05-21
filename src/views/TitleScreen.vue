<template>
  <div class="title-screen" @click.self="handleStart">
    <div class="title-bg" :style="{ backgroundImage: 'url(/images/title-bg.jpg)' }" />
    <div class="title-overlay" />

    <div class="title-content">
      <div class="title-subtitle-top">一念之差，江湖已变</div>
      <h1 class="title-main">一念江湖</h1>
      <div class="title-tagline">三十日，十二人，七种命途</div>

      <button class="start-btn" :class="{ pulsing: !started }" @click="handleStart">
        <span class="start-inner">开始游戏</span>
      </button>

      <div class="title-hint">※ 你的每一个选择，都将改变这个江湖</div>
    </div>

    <!-- 入场过渡遮罩 -->
    <Transition name="fade-out">
      <div v-if="fading" class="fade-mask" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{ start: [] }>()
const started = ref(false)
const fading = ref(false)

function handleStart() {
  if (started.value) return
  started.value = true
  fading.value = true
  setTimeout(() => emit('start'), 800)
}
</script>

<style scoped>
.title-screen {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  font-family: 'Noto Serif SC', 'Songti SC', serif;
}

.title-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transform: scale(1.04);
  animation: slow-zoom 30s ease-in-out infinite alternate;
}

@keyframes slow-zoom {
  from { transform: scale(1.04); }
  to   { transform: scale(1.10); }
}

.title-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(10, 6, 2, 0.35) 0%,
    rgba(10, 6, 2, 0.15) 35%,
    rgba(10, 6, 2, 0.25) 60%,
    rgba(10, 6, 2, 0.75) 100%
  );
}

.title-content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.1rem;
  text-align: center;
  padding: 2rem;
}

.title-subtitle-top {
  font-size: 0.95rem;
  letter-spacing: 0.5em;
  color: #C9A84C;
  text-shadow: 0 0 20px rgba(201, 168, 76, 0.6);
  opacity: 0.9;
}

.title-main {
  font-size: clamp(3.5rem, 8vw, 6rem);
  font-weight: 700;
  letter-spacing: 0.25em;
  color: #F5E6C8;
  text-shadow:
    0 0 40px rgba(201, 168, 76, 0.5),
    0 0 80px rgba(139, 26, 26, 0.4),
    2px 2px 0 rgba(0,0,0,0.8);
  margin: 0;
  line-height: 1.1;
}

.title-tagline {
  font-size: 1rem;
  letter-spacing: 0.4em;
  color: #D4C4A8;
  opacity: 0.8;
  text-shadow: 0 1px 6px rgba(0,0,0,0.8);
}

.start-btn {
  margin-top: 1.5rem;
  padding: 0 0;
  background: transparent;
  border: none;
  cursor: pointer;
  outline: none;
}

.start-inner {
  display: block;
  padding: 0.8rem 3.5rem;
  border: 1.5px solid rgba(201, 168, 76, 0.7);
  color: #F5E6C8;
  font-family: inherit;
  font-size: 1.1rem;
  letter-spacing: 0.5em;
  background: rgba(26, 18, 8, 0.5);
  backdrop-filter: blur(4px);
  transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;
  text-shadow: 0 1px 4px rgba(0,0,0,0.8);
}

.start-btn:hover .start-inner {
  background: rgba(139, 26, 26, 0.6);
  border-color: #C9A84C;
  box-shadow: 0 0 24px rgba(201, 168, 76, 0.3), inset 0 0 20px rgba(139, 26, 26, 0.2);
}

.start-btn.pulsing .start-inner {
  animation: btn-pulse 3s ease-in-out infinite;
}

@keyframes btn-pulse {
  0%, 100% { box-shadow: 0 0 8px rgba(201, 168, 76, 0.2); }
  50%       { box-shadow: 0 0 24px rgba(201, 168, 76, 0.5), 0 0 48px rgba(139, 26, 26, 0.2); }
}

.title-hint {
  margin-top: 0.5rem;
  font-size: 0.72rem;
  color: rgba(213, 196, 168, 0.45);
  letter-spacing: 0.2em;
}

/* 淡出遮罩 */
.fade-mask {
  position: fixed;
  inset: 0;
  background: #1A1208;
  z-index: 100;
}
.fade-out-enter-active { transition: opacity 0.8s ease; }
.fade-out-enter-from   { opacity: 0; }
.fade-out-enter-to     { opacity: 1; }
</style>
