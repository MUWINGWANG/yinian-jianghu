# Phase 1 技术架构 + 脚手架 + 数据模型 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 搭建《一念江湖》SPA 项目骨架，定义全局类型系统、静态数据文件与核心 Pinia Store，让后续所有 Phase 都能在此基础上直接开发。

**Architecture:** Vite + Vue 3 (Composition API) + Pinia + TypeScript。类型系统与数据文件分离，Store 只持有运行时状态，静态数据（NPC 档案、门派、武学）以纯 TS 常量存储。所有核心逻辑有 Vitest 单测覆盖。

**Tech Stack:** Node 22+, Vite 5, Vue 3.4, Pinia 2, TypeScript 5, Vitest 1, `@vue/test-utils` 2

---

## 文件结构总览

```
yinian-jianghu/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── types/
│   │   ├── npc.ts          # NpcId, AffinityDimension, NpcProfile, AffinityState
│   │   ├── faction.ts      # FactionId, FactionProfile
│   │   ├── game.ts         # GameState, DayEvent, Choice, Outcome, Ending
│   │   └── combat.ts       # MartialArt, CombatState, Combatant
│   ├── data/
│   │   ├── npcs.ts         # 12 NPC 静态档案
│   │   ├── factions.ts     # 5 门派静态数据
│   │   └── martial-arts.ts # 5 门派 × 4 招 = 20 招武学（Phase 4 扩充至完整数据）
│   ├── stores/
│   │   ├── game.ts         # 主游戏状态：当前天数、秘密扩散指数、结局判断
│   │   └── affinity.ts     # 12 NPC × 4 维好感度运算
│   └── assets/
│       └── images/         # 已生成的 NPC 立绘和门派徽章
├── tests/
│   ├── stores/
│   │   ├── game.test.ts
│   │   └── affinity.test.ts
│   └── data/
│       └── static-data.test.ts
```

---

## Task 1: 初始化项目

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `index.html`
- Create: `src/main.ts`
- Create: `src/App.vue`

- [ ] **Step 1: 初始化 Vite + Vue + TypeScript 项目**

```bash
cd /Users/lifeiyang/Desktop/yinian-jianghu
npm create vite@latest . -- --template vue-ts
# 提示「当前目录不为空」时选 Ignore files and continue
npm install
```

- [ ] **Step 2: 安装 Pinia 和 Vitest**

```bash
npm install pinia
npm install -D vitest @vue/test-utils @vitejs/plugin-vue happy-dom
```

- [ ] **Step 3: 配置 Vitest**

编辑 `vite.config.ts`，替换为：

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
  },
})
```

- [ ] **Step 4: 在 tsconfig.json 加入 types**

确认 `tsconfig.json` 中 `compilerOptions` 包含：

```json
{
  "compilerOptions": {
    "strict": true,
    "moduleResolution": "bundler",
    "types": ["vitest/globals"]
  }
}
```

- [ ] **Step 5: 挂载 Pinia**

替换 `src/main.ts`：

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

- [ ] **Step 6: 验证项目启动**

```bash
npm run dev
```

浏览器打开 http://localhost:5173，能看到 Vite 默认页即成功。

- [ ] **Step 7: Commit**

```bash
git init
git add .
git commit -m "chore: init Vite + Vue 3 + Pinia + TypeScript + Vitest"
```

---

## Task 2: 定义核心类型系统

**Files:**
- Create: `src/types/npc.ts`
- Create: `src/types/faction.ts`
- Create: `src/types/game.ts`
- Create: `src/types/combat.ts`

- [ ] **Step 1: 写 NPC 与好感度类型测试**

创建 `tests/types/types.test.ts`：

```typescript
import type { NpcId, AffinityDimension, AffinityState, NpcProfile } from '../../src/types/npc'

describe('NPC types', () => {
  it('AffinityState has all 4 dimensions', () => {
    const state: AffinityState = { trust: 0, intimacy: 0, awe: 0, dread: 0 }
    expect(state.trust).toBe(0)
    expect(state.intimacy).toBe(0)
    expect(state.awe).toBe(0)
    expect(state.dread).toBe(0)
  })

  it('NpcId union covers all 12 characters', () => {
    const ids: NpcId[] = [
      'jiang-henian', 'shen-ruyu',
      'liaoChen-dashi', 'huiming',
      'xuanji-zi', 'lingshuang',
      'lu-ming', 'suyi-gui',
      'yan-sandao', 'liu-qiniang',
      'gu-changfeng', 'ji-wantang',
    ]
    expect(ids).toHaveLength(12)
  })
})
```

- [ ] **Step 2: 运行测试确认失败**

```bash
npx vitest run tests/types/types.test.ts
```

预期：FAIL — Cannot find module `../../src/types/npc`

- [ ] **Step 3: 实现 `src/types/npc.ts`**

```typescript
export type NpcId =
  | 'jiang-henian' | 'shen-ruyu'
  | 'liaoChen-dashi' | 'huiming'
  | 'xuanji-zi' | 'lingshuang'
  | 'lu-ming' | 'suyi-gui'
  | 'yan-sandao' | 'liu-qiniang'
  | 'gu-changfeng' | 'ji-wantang'

export type AffinityDimension = 'trust' | 'intimacy' | 'awe' | 'dread'

export interface AffinityState {
  trust: number    // 0–100
  intimacy: number // 0–100
  awe: number      // 0–100
  dread: number    // 0–100
}

export interface NpcProfile {
  id: NpcId
  name: string
  age: string
  faction: import('./faction').FactionId | 'independent'
  role: string
  description: string
  narrativeFunction: string
  initialAffinity: AffinityState
  portrait: string // asset filename, e.g. 'jiang-henian.png'
}
```

- [ ] **Step 4: 实现 `src/types/faction.ts`**

```typescript
export type FactionId = 'qingyun' | 'lingyin' | 'taixu' | 'xueshao' | 'huangyuan'
export type FactionAlignment = 'orthodox' | 'unorthodox'

export interface FactionProfile {
  id: FactionId
  name: string
  alignment: FactionAlignment
  philosophy: string
  description: string
  signatureSkills: string[]
  badge: string // asset filename, e.g. 'badge-qingyun.png'
}
```

- [ ] **Step 5: 实现 `src/types/game.ts`**

```typescript
import type { NpcId } from './npc'

export type EndingId = 'e1' | 'e2' | 'e3' | 'e4' | 'e5' | 'e6' | 'e7'

export interface Choice {
  id: string
  text: string
  outcomes: Outcome[]
}

export interface Outcome {
  npcId?: NpcId
  affinityDelta?: Partial<Record<import('./npc').AffinityDimension, number>>
  secretSpreadDelta?: number  // 正数 = 扩散，负数 = 收敛
  flags?: string[]            // 剧情标记，用于结局判断
}

export interface DayEvent {
  day: number          // 1–30
  title: string
  scene: string        // 叙事文本
  choices: Choice[]
  hasCombat: boolean
}

export interface GameState {
  day: number           // 当前天数 1–30
  secretSpread: number  // 秘密扩散指数 0–10
  flags: Set<string>    // 剧情标记集合
  ending: EndingId | null
}
```

- [ ] **Step 6: 实现 `src/types/combat.ts`**

```typescript
import type { FactionId } from './faction'

export interface MartialArt {
  id: string
  name: string
  faction: FactionId
  damage: number       // 基础伤害
  cost: number         // 行动点消耗
  effect?: string      // 特殊效果描述
}

export interface Combatant {
  name: string
  hp: number
  maxHp: number
  actionPoints: number
  skills: MartialArt[]
}

export interface CombatState {
  player: Combatant
  enemy: Combatant
  turn: number
  log: string[]
  outcome: 'ongoing' | 'win' | 'lose'
}
```

- [ ] **Step 7: 运行测试确认通过**

```bash
npx vitest run tests/types/types.test.ts
```

预期：PASS

- [ ] **Step 8: Commit**

```bash
git add src/types/ tests/types/
git commit -m "feat: add core type system (NPC, Faction, Game, Combat)"
```

---

## Task 3: 填充静态数据

**Files:**
- Create: `src/data/npcs.ts`
- Create: `src/data/factions.ts`
- Create: `src/data/martial-arts.ts`

- [ ] **Step 1: 写静态数据完整性测试**

创建 `tests/data/static-data.test.ts`：

```typescript
import { NPC_PROFILES } from '../../src/data/npcs'
import { FACTION_PROFILES } from '../../src/data/factions'
import { MARTIAL_ARTS } from '../../src/data/martial-arts'

describe('静态数据完整性', () => {
  it('包含 12 位 NPC', () => {
    expect(NPC_PROFILES).toHaveLength(12)
  })

  it('每位 NPC 初始好感度各维度在 0–100 范围内', () => {
    for (const npc of NPC_PROFILES) {
      const { trust, intimacy, awe, dread } = npc.initialAffinity
      expect(trust).toBeGreaterThanOrEqual(0)
      expect(intimacy).toBeGreaterThanOrEqual(0)
      expect(awe).toBeGreaterThanOrEqual(0)
      expect(dread).toBeGreaterThanOrEqual(0)
      expect(trust + intimacy + awe + dread).toBeLessThanOrEqual(400)
    }
  })

  it('包含 5 个门派', () => {
    expect(FACTION_PROFILES).toHaveLength(5)
    const ids = FACTION_PROFILES.map(f => f.id)
    expect(ids).toContain('qingyun')
    expect(ids).toContain('lingyin')
    expect(ids).toContain('taixu')
    expect(ids).toContain('xueshao')
    expect(ids).toContain('huangyuan')
  })

  it('武学数据包含 5 个门派各至少 4 招', () => {
    const byFaction = new Map<string, number>()
    for (const art of MARTIAL_ARTS) {
      byFaction.set(art.faction, (byFaction.get(art.faction) ?? 0) + 1)
    }
    for (const [, count] of byFaction) {
      expect(count).toBeGreaterThanOrEqual(4)
    }
  })
})
```

- [ ] **Step 2: 运行测试确认失败**

```bash
npx vitest run tests/data/static-data.test.ts
```

预期：FAIL — Cannot find module

- [ ] **Step 3: 实现 `src/data/npcs.ts`**

```typescript
import type { NpcProfile } from '../types/npc'

export const NPC_PROFILES: NpcProfile[] = [
  {
    id: 'jiang-henian',
    name: '姜鹤年',
    age: '五十五岁',
    faction: 'qingyun',
    role: '青云门掌门',
    description: '表面刚正，实则早知太虚观异动却选择沉默。政治实用主义者。',
    narrativeFunction: '知情不报者',
    initialAffinity: { trust: 55, intimacy: 10, awe: 60, dread: 10 },
    portrait: 'jiang-henian.png',
  },
  {
    id: 'shen-ruyu',
    name: '沈如玉',
    age: '二十三岁',
    faction: 'qingyun',
    role: '青云门弟子',
    description: '对正义近乎偏执，理想主义者，真相揭露后最容易崩溃。',
    narrativeFunction: '理想主义炸弹',
    initialAffinity: { trust: 40, intimacy: 30, awe: 20, dread: 5 },
    portrait: 'shen-ruyu.png',
  },
  {
    id: 'liaoChen-dashi',
    name: '了尘大师',
    age: '六十五岁',
    faction: 'lingyin',
    role: '灵隐宗方丈',
    description: '最接近安全港的角色，知道的远比表现出来的多。',
    narrativeFunction: '信息守门人',
    initialAffinity: { trust: 40, intimacy: 20, awe: 70, dread: 5 },
    portrait: 'liaoChen-dashi.png',
  },
  {
    id: 'huiming',
    name: '慧明',
    age: '二十岁',
    faction: 'lingyin',
    role: '灵隐宗僧人',
    description: '开始质疑中立是否是逃避，与主角同是夹缝中人。',
    narrativeFunction: '觉醒弧线角色',
    initialAffinity: { trust: 30, intimacy: 35, awe: 15, dread: 5 },
    portrait: 'huiming.png',
  },
  {
    id: 'xuanji-zi',
    name: '玄机子',
    age: '四十五岁',
    faction: 'taixu',
    role: '太虚观掌门',
    description: '全江湖最受尊敬的人，也是最危险的人。核心秘密持有者。',
    narrativeFunction: '核心秘密拥有者',
    initialAffinity: { trust: 50, intimacy: 15, awe: 80, dread: 30 },
    portrait: 'xuanji-zi.png',
  },
  {
    id: 'lingshuang',
    name: '凌霜',
    age: '二十六岁',
    faction: 'taixu',
    role: '太虚观弟子',
    description: '也知道那个秘密，被玄机子掌控，是主角的潜在内线。',
    narrativeFunction: '主角的镜像困境',
    initialAffinity: { trust: 25, intimacy: 20, awe: 30, dread: 10 },
    portrait: 'lingshuang.png',
  },
  {
    id: 'lu-ming',
    name: '陆铭',
    age: '三十五岁',
    faction: 'xueshao',
    role: '血煞堂执行者',
    description: '主角偷听到的交易当事人。有「不杀无辜」的底线。',
    narrativeFunction: '故事起点目击者',
    initialAffinity: { trust: 5, intimacy: 5, awe: 30, dread: 70 },
    portrait: 'lu-ming.png',
  },
  {
    id: 'suyi-gui',
    name: '素衣鬼',
    age: '不明',
    faction: 'xueshao',
    role: '血煞堂暗桩',
    description: '身份成谜，出现在所有不该出现的地方。',
    narrativeFunction: '悬念锚点',
    initialAffinity: { trust: 5, intimacy: 5, awe: 40, dread: 75 },
    portrait: 'suyi-gui.png',
  },
  {
    id: 'yan-sandao',
    name: '燕三刀',
    age: '四十岁',
    faction: 'huangyuan',
    role: '荒原帮帮主',
    description: '信任壁垒最高，认可后是最可靠的保护者。',
    narrativeFunction: '信任壁垒最高',
    initialAffinity: { trust: 10, intimacy: 10, awe: 40, dread: 30 },
    portrait: 'yan-sandao.png',
  },
  {
    id: 'liu-qiniang',
    name: '柳七娘',
    age: '二十八岁',
    faction: 'huangyuan',
    role: '荒原帮女将',
    description: '曾是正派弟子，被驱逐后，是主角命运的镜像。',
    narrativeFunction: '主角命运预示',
    initialAffinity: { trust: 15, intimacy: 20, awe: 25, dread: 25 },
    portrait: 'liu-qiniang.png',
  },
  {
    id: 'gu-changfeng',
    name: '顾长风',
    age: '三十二岁',
    faction: 'independent',
    role: '游侠·情报经纪人',
    description: '前青云门弟子，靠传递情报为生，有底线有价码。',
    narrativeFunction: '情报经纪人',
    initialAffinity: { trust: 25, intimacy: 15, awe: 20, dread: 10 },
    portrait: 'gu-changfeng.png',
  },
  {
    id: 'ji-wantang',
    name: '纪晚棠',
    age: '二十九岁',
    faction: 'independent',
    role: '朝廷密探·伪装商人',
    description: '揭穿身份的威胁与潜在盟友并存，关系最矛盾。',
    narrativeFunction: '最高张力关系',
    initialAffinity: { trust: 20, intimacy: 10, awe: 15, dread: 45 },
    portrait: 'ji-wantang.png',
  },
]
```

- [ ] **Step 4: 实现 `src/data/factions.ts`**

```typescript
import type { FactionProfile } from '../types/faction'

export const FACTION_PROFILES: FactionProfile[] = [
  {
    id: 'qingyun',
    name: '青云门',
    alignment: 'orthodox',
    philosophy: '儒家·义字当先',
    description: '江湖执法者，与朝廷关系暧昧，门规严苛。早知太虚观异动却选择沉默。',
    signatureSkills: ['文剑十三式'],
    badge: 'badge-qingyun.png',
  },
  {
    id: 'lingyin',
    name: '灵隐宗',
    alignment: 'orthodox',
    philosophy: '佛家·慈悲为怀',
    description: '山中古刹，以医术和调解著称，是各方谈判的中间人。',
    signatureSkills: ['金刚护体功', '慈悲杖法'],
    badge: 'badge-lingyin.png',
  },
  {
    id: 'taixu',
    name: '太虚观',
    alignment: 'orthodox',
    philosophy: '道家·无为而治（表象）',
    description: '表面超然，暗中经营已久。与血煞堂有十年密约，核心秘密持有者。',
    signatureSkills: ['太虚剑意', '无形气劲'],
    badge: 'badge-taixu.png',
  },
  {
    id: 'xueshao',
    name: '血煞堂',
    alignment: 'unorthodox',
    philosophy: '利益至上·一诺千金',
    description: '江湖最恐惧的名字。接受任何委托，与太虚观互为保护伞。',
    signatureSkills: ['鬼手七绝', '百步穿心针'],
    badge: 'badge-xueshao.png',
  },
  {
    id: 'huangyuan',
    name: '荒原帮',
    alignment: 'unorthodox',
    philosophy: '义气·反建制',
    description: '流民与逃兵的聚集地，「魔道」标签是正派强加的。道德最灰色的一派。',
    signatureSkills: ['荒刀三十六路', '驼背擒拿手'],
    badge: 'badge-huangyuan.png',
  },
]
```

- [ ] **Step 5: 实现 `src/data/martial-arts.ts`（每派 4 招骨架，Phase 4 扩充至 20 招）**

```typescript
import type { MartialArt } from '../types/combat'

export const MARTIAL_ARTS: MartialArt[] = [
  // 青云门
  { id: 'qy-01', name: '横扫千军', faction: 'qingyun', damage: 20, cost: 2 },
  { id: 'qy-02', name: '悬河之势', faction: 'qingyun', damage: 15, cost: 1 },
  { id: 'qy-03', name: '文剑破空', faction: 'qingyun', damage: 30, cost: 3 },
  { id: 'qy-04', name: '金刚护身', faction: 'qingyun', damage: 0,  cost: 1, effect: '防御+20' },
  // 灵隐宗
  { id: 'ly-01', name: '慈悲一击', faction: 'lingyin', damage: 18, cost: 2 },
  { id: 'ly-02', name: '降龙伏虎', faction: 'lingyin', damage: 25, cost: 3 },
  { id: 'ly-03', name: '千手如来', faction: 'lingyin', damage: 12, cost: 1, effect: '连击x3' },
  { id: 'ly-04', name: '净世明光', faction: 'lingyin', damage: 0,  cost: 2, effect: '回血15' },
  // 太虚观
  { id: 'tx-01', name: '无极剑气', faction: 'taixu', damage: 22, cost: 2 },
  { id: 'tx-02', name: '太虚幻境', faction: 'taixu', damage: 10, cost: 1, effect: '眩晕1回合' },
  { id: 'tx-03', name: '归元一气', faction: 'taixu', damage: 35, cost: 4 },
  { id: 'tx-04', name: '无形气壁', faction: 'taixu', damage: 0,  cost: 2, effect: '反弹伤害50%' },
  // 血煞堂
  { id: 'xs-01', name: '鬼手夺命', faction: 'xueshao', damage: 28, cost: 2 },
  { id: 'xs-02', name: '百步穿心', faction: 'xueshao', damage: 20, cost: 1, effect: '无视防御' },
  { id: 'xs-03', name: '剧毒封穴', faction: 'xueshao', damage: 8,  cost: 1, effect: '中毒3回合' },
  { id: 'xs-04', name: '七煞连环', faction: 'xueshao', damage: 40, cost: 5 },
  // 荒原帮
  { id: 'hy-01', name: '荒刀破甲', faction: 'huangyuan', damage: 25, cost: 2 },
  { id: 'hy-02', name: '铁牛奔野', faction: 'huangyuan', damage: 18, cost: 1, effect: '击退' },
  { id: 'hy-03', name: '驼背摔打', faction: 'huangyuan', damage: 15, cost: 1, effect: '眩晕1回合' },
  { id: 'hy-04', name: '三刀乱世', faction: 'huangyuan', damage: 45, cost: 5 },
]
```

- [ ] **Step 6: 运行测试确认通过**

```bash
npx vitest run tests/data/static-data.test.ts
```

预期：PASS（4 个测试全绿）

- [ ] **Step 7: Commit**

```bash
git add src/data/ tests/data/
git commit -m "feat: add static data for 12 NPCs, 5 factions, 20 martial arts"
```

---

## Task 4: 实现好感度 Store

**Files:**
- Create: `src/stores/affinity.ts`
- Create: `tests/stores/affinity.test.ts`

- [ ] **Step 1: 写好感度 Store 测试**

创建 `tests/stores/affinity.test.ts`：

```typescript
import { setActivePinia, createPinia } from 'pinia'
import { useAffinityStore } from '../../src/stores/affinity'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('useAffinityStore', () => {
  it('初始化时加载 12 位 NPC 的初始好感度', () => {
    const store = useAffinityStore()
    expect(Object.keys(store.affinityMap)).toHaveLength(12)
    expect(store.affinityMap['jiang-henian'].trust).toBe(55)
    expect(store.affinityMap['lu-ming'].dread).toBe(70)
  })

  it('adjustAffinity 正确累加数值', () => {
    const store = useAffinityStore()
    store.adjustAffinity('shen-ruyu', { trust: 10, intimacy: 5 })
    expect(store.affinityMap['shen-ruyu'].trust).toBe(50)  // 40+10
    expect(store.affinityMap['shen-ruyu'].intimacy).toBe(35) // 30+5
  })

  it('adjustAffinity 不超过 100 上限', () => {
    const store = useAffinityStore()
    store.adjustAffinity('jiang-henian', { trust: 100 })
    expect(store.affinityMap['jiang-henian'].trust).toBe(100)
  })

  it('adjustAffinity 不低于 0 下限', () => {
    const store = useAffinityStore()
    store.adjustAffinity('shen-ruyu', { trust: -100 })
    expect(store.affinityMap['shen-ruyu'].trust).toBe(0)
  })

  it('getAffinity 返回指定 NPC 的好感度', () => {
    const store = useAffinityStore()
    const affinity = store.getAffinity('huiming')
    expect(affinity.trust).toBe(30)
    expect(affinity.intimacy).toBe(35)
  })
})
```

- [ ] **Step 2: 运行测试确认失败**

```bash
npx vitest run tests/stores/affinity.test.ts
```

预期：FAIL — Cannot find module `../../src/stores/affinity`

- [ ] **Step 3: 实现 `src/stores/affinity.ts`**

```typescript
import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { NpcId, AffinityDimension, AffinityState } from '../types/npc'
import { NPC_PROFILES } from '../data/npcs'

type AffinityMap = Record<NpcId, AffinityState>

export const useAffinityStore = defineStore('affinity', () => {
  const affinityMap = reactive<AffinityMap>(
    Object.fromEntries(
      NPC_PROFILES.map(npc => [npc.id, { ...npc.initialAffinity }])
    ) as AffinityMap
  )

  function adjustAffinity(
    npcId: NpcId,
    delta: Partial<Record<AffinityDimension, number>>
  ) {
    const current = affinityMap[npcId]
    for (const dim of Object.keys(delta) as AffinityDimension[]) {
      current[dim] = Math.min(100, Math.max(0, current[dim] + (delta[dim] ?? 0)))
    }
  }

  function getAffinity(npcId: NpcId): AffinityState {
    return affinityMap[npcId]
  }

  return { affinityMap, adjustAffinity, getAffinity }
})
```

- [ ] **Step 4: 运行测试确认通过**

```bash
npx vitest run tests/stores/affinity.test.ts
```

预期：PASS（5 个测试全绿）

- [ ] **Step 5: Commit**

```bash
git add src/stores/affinity.ts tests/stores/affinity.test.ts
git commit -m "feat: add affinity store with 12 NPC × 4-dimension affinity system"
```

---

## Task 5: 实现主游戏 Store

**Files:**
- Create: `src/stores/game.ts`
- Create: `tests/stores/game.test.ts`

- [ ] **Step 1: 写主游戏 Store 测试**

创建 `tests/stores/game.test.ts`：

```typescript
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '../../src/stores/game'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('useGameStore', () => {
  it('初始状态：第 1 天，秘密扩散为 0，无结局', () => {
    const store = useGameStore()
    expect(store.day).toBe(1)
    expect(store.secretSpread).toBe(0)
    expect(store.ending).toBeNull()
    expect(store.flags.size).toBe(0)
  })

  it('advanceDay 推进天数', () => {
    const store = useGameStore()
    store.advanceDay()
    expect(store.day).toBe(2)
  })

  it('advanceDay 超过 30 天后停止', () => {
    const store = useGameStore()
    for (let i = 0; i < 35; i++) store.advanceDay()
    expect(store.day).toBe(30)
  })

  it('applyOutcome 正确调整秘密扩散指数', () => {
    const store = useGameStore()
    store.applyOutcome({ secretSpreadDelta: 3 })
    expect(store.secretSpread).toBe(3)
  })

  it('applyOutcome 秘密扩散不超过 10', () => {
    const store = useGameStore()
    store.applyOutcome({ secretSpreadDelta: 15 })
    expect(store.secretSpread).toBe(10)
  })

  it('applyOutcome 设置剧情标记', () => {
    const store = useGameStore()
    store.applyOutcome({ flags: ['heard-deal', 'met-lu-ming'] })
    expect(store.flags.has('heard-deal')).toBe(true)
    expect(store.flags.has('met-lu-ming')).toBe(true)
  })
})
```

- [ ] **Step 2: 运行测试确认失败**

```bash
npx vitest run tests/stores/game.test.ts
```

预期：FAIL — Cannot find module `../../src/stores/game`

- [ ] **Step 3: 实现 `src/stores/game.ts`**

```typescript
import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import type { EndingId, Outcome } from '../types/game'
import { useAffinityStore } from './affinity'

export const useGameStore = defineStore('game', () => {
  const day = ref(1)
  const secretSpread = ref(0)
  const flags = reactive(new Set<string>())
  const ending = ref<EndingId | null>(null)

  function advanceDay() {
    if (day.value < 30) day.value++
  }

  function applyOutcome(outcome: Outcome) {
    if (outcome.secretSpreadDelta) {
      secretSpread.value = Math.min(10, Math.max(0, secretSpread.value + outcome.secretSpreadDelta))
    }
    if (outcome.flags) {
      outcome.flags.forEach(f => flags.add(f))
    }
    if (outcome.npcId && outcome.affinityDelta) {
      const affinityStore = useAffinityStore()
      affinityStore.adjustAffinity(outcome.npcId, outcome.affinityDelta)
    }
  }

  function setEnding(id: EndingId) {
    ending.value = id
  }

  return { day, secretSpread, flags, ending, advanceDay, applyOutcome, setEnding }
})
```

- [ ] **Step 4: 运行测试确认通过**

```bash
npx vitest run tests/stores/game.test.ts
```

预期：PASS（6 个测试全绿）

- [ ] **Step 5: 全量测试**

```bash
npx vitest run
```

预期：全部 PASS（types + data + affinity + game）

- [ ] **Step 6: Commit**

```bash
git add src/stores/game.ts tests/stores/game.test.ts
git commit -m "feat: add game store with day progression, secret spread, and outcome system"
```

---

## Task 6: 更新 App.vue 验证集成

**Files:**
- Modify: `src/App.vue`

- [ ] **Step 1: 更新 App.vue 显示游戏状态**

替换 `src/App.vue` 内容：

```vue
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
```

- [ ] **Step 2: 启动开发服务器验证**

```bash
npm run dev
```

打开 http://localhost:5173，点击两个按钮，确认：
- 天数递增
- 秘密扩散递增
- 好感度数字正确显示

- [ ] **Step 3: 最终全量测试**

```bash
npx vitest run
```

预期：全部 PASS

- [ ] **Step 4: 最终 Commit**

```bash
git add src/App.vue
git commit -m "feat: Phase 1 complete — architecture, types, data, stores all wired up"
```
