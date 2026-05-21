<template>
  <!-- 固定触发按钮 -->
  <button class="affinity-toggle-btn" :class="{ open: isOpen }" @click="isOpen = !isOpen">
    <span class="toggle-icon">{{ isOpen ? '✕' : '⚔' }}</span>
    <span class="toggle-label">江湖关系</span>
  </button>

  <!-- 侧边面板遮罩 -->
  <Transition name="affinity-overlay">
    <div v-show="isOpen" class="affinity-overlay" @click="isOpen = false" />
  </Transition>

  <!-- 侧边面板主体 -->
  <Transition name="affinity-panel">
    <aside v-show="isOpen" class="affinity-panel">
      <header class="panel-header">
        <h3 class="panel-title">江湖关系录</h3>
        <button class="panel-close" @click="isOpen = false">✕</button>
      </header>

      <div class="npc-grid">
        <div
          v-for="npc in npcList"
          :key="npc.id"
          class="npc-card"
        >
          <div class="npc-card-header">
            <span class="npc-name">{{ npc.name }}</span>
            <span class="npc-role-badge">{{ npc.role }}</span>
          </div>
          <span class="npc-faction">{{ factionLabel(npc.faction) }}</span>

          <div class="affinity-bars">
            <div class="affinity-row">
              <span class="dim-label">信</span>
              <div class="bar-track">
                <div
                  class="bar-fill trust"
                  :style="{ width: affinityOf(npc.id).trust + '%' }"
                />
              </div>
              <span class="dim-val">{{ affinityOf(npc.id).trust }}</span>
            </div>
            <div class="affinity-row">
              <span class="dim-label">亲</span>
              <div class="bar-track">
                <div
                  class="bar-fill intimacy"
                  :style="{ width: affinityOf(npc.id).intimacy + '%' }"
                />
              </div>
              <span class="dim-val">{{ affinityOf(npc.id).intimacy }}</span>
            </div>
            <div class="affinity-row">
              <span class="dim-label">敬</span>
              <div class="bar-track">
                <div
                  class="bar-fill awe"
                  :style="{ width: affinityOf(npc.id).awe + '%' }"
                />
              </div>
              <span class="dim-val">{{ affinityOf(npc.id).awe }}</span>
            </div>
            <div class="affinity-row">
              <span class="dim-label">忌</span>
              <div class="bar-track">
                <div
                  class="bar-fill dread"
                  :style="{ width: affinityOf(npc.id).dread + '%' }"
                />
              </div>
              <span class="dim-val">{{ affinityOf(npc.id).dread }}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAffinityStore } from '../stores/affinity'
import { NPC_PROFILES } from '../data/npcs'
import type { NpcId } from '../types/npc'

const isOpen = ref(false)
const affinity = useAffinityStore()
const npcList = NPC_PROFILES

function affinityOf(id: NpcId) {
  return affinity.affinityMap[id]
}

function factionLabel(faction: string): string {
  const map: Record<string, string> = {
    qingyun: '青云门',
    lingyin: '灵隐宗',
    taixu: '太虚观',
    xueshao: '血煞堂',
    huangyuan: '荒原帮',
    independent: '散修',
  }
  return map[faction] ?? faction
}
</script>

<style scoped>
/* ── 触发按钮 ── */
.affinity-toggle-btn {
  position: fixed;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 0.6rem 0.45rem;
  background: #2A1E0E;
  border: 1px solid #C9A84C;
  border-right: none;
  border-radius: 4px 0 0 4px;
  color: #C9A84C;
  cursor: pointer;
  font-family: 'Noto Serif SC', serif;
  font-size: 0.7rem;
  writing-mode: vertical-rl;
  letter-spacing: 2px;
  transition: background 0.2s, color 0.2s;
  box-shadow: -2px 0 8px rgba(201, 168, 76, 0.15);
}
.affinity-toggle-btn:hover,
.affinity-toggle-btn.open {
  background: #3A2E1E;
  color: #F5E6C8;
}
.toggle-icon {
  font-size: 0.85rem;
  writing-mode: horizontal-tb;
  margin-bottom: 2px;
}
.toggle-label {
  writing-mode: vertical-rl;
  letter-spacing: 3px;
}

/* ── 遮罩 ── */
.affinity-overlay {
  position: fixed;
  inset: 0;
  z-index: 210;
  background: rgba(10, 6, 2, 0.5);
}
.affinity-overlay-enter-active,
.affinity-overlay-leave-active { transition: opacity 0.25s; }
.affinity-overlay-enter-from,
.affinity-overlay-leave-to { opacity: 0; }

/* ── 面板主体 ── */
.affinity-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 480px;
  max-width: 95vw;
  z-index: 220;
  background: #1A1208;
  border-left: 2px solid #C9A84C;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.6);
}
.affinity-panel-enter-active,
.affinity-panel-leave-active { transition: transform 0.3s ease; }
.affinity-panel-enter-from,
.affinity-panel-leave-to { transform: translateX(100%); }

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1.2rem;
  background: #2A1E0E;
  border-bottom: 1px solid #C9A84C;
  flex-shrink: 0;
}
.panel-title {
  margin: 0;
  font-family: 'Noto Serif SC', serif;
  font-size: 1rem;
  color: #C9A84C;
  letter-spacing: 2px;
}
.panel-close {
  background: none;
  border: 1px solid #8B4A2A;
  color: #C9A84C;
  border-radius: 2px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.panel-close:hover { background: rgba(139, 26, 26, 0.3); }

/* ── NPC 卡片网格 ── */
.npc-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
  padding: 0.8rem;
  overflow-y: auto;
  flex: 1;
}
.npc-grid::-webkit-scrollbar { width: 4px; }
.npc-grid::-webkit-scrollbar-track { background: #1A1208; }
.npc-grid::-webkit-scrollbar-thumb { background: #C9A84C40; border-radius: 2px; }

.npc-card {
  background: #22190A;
  border: 1px solid #3A2E1E;
  border-radius: 3px;
  padding: 0.55rem 0.65rem;
  display: flex;
  flex-direction: column;
  gap: 3px;
  transition: border-color 0.2s;
}
.npc-card:hover { border-color: #C9A84C60; }

.npc-card-header {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  flex-wrap: wrap;
}
.npc-name {
  font-family: 'Noto Serif SC', serif;
  font-size: 0.88rem;
  color: #F5E6C8;
  font-weight: bold;
}
.npc-role-badge {
  font-size: 0.6rem;
  color: #8B6A3A;
  border: 1px solid #3A2E1E;
  border-radius: 2px;
  padding: 1px 4px;
  white-space: nowrap;
}
.npc-faction {
  font-size: 0.62rem;
  color: #6A5A3A;
  margin-bottom: 2px;
}

/* ── 好感度进度条 ── */
.affinity-bars {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-top: 2px;
}
.affinity-row {
  display: flex;
  align-items: center;
  gap: 4px;
}
.dim-label {
  font-size: 0.6rem;
  color: #6A5A3A;
  width: 10px;
  flex-shrink: 0;
  text-align: center;
}
.bar-track {
  flex: 1;
  height: 5px;
  background: #2A1E0E;
  border-radius: 3px;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.4s ease;
}
.bar-fill.trust   { background: #C9A84C; }
.bar-fill.intimacy { background: #B56070; }
.bar-fill.awe     { background: #4A8C8C; }
.bar-fill.dread   { background: #8B1A1A; }

.dim-val {
  font-size: 0.58rem;
  color: #8B6A3A;
  width: 18px;
  text-align: right;
  flex-shrink: 0;
}
</style>
