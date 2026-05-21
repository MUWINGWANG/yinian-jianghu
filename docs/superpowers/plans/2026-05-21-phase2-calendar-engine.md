# Phase 2: 30天日历系统 + 抉择引擎 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现 30 天日历驱动叙事：玩家每天读取场景、做出 1-2 个抉择、触发好感度/秘密扩散变化，并可选择夜访一位 NPC，推进后进入下一天。

**Architecture:** 30 天事件以纯 TS 常量存储（`src/data/events.ts`）；`useCalendar` 组合式函数封装当天事件查找、抉择应用、夜访限制和天数推进逻辑；Vue 组件只负责展示和事件透传，不直接操作 Store；Day 30 无抉择，触发结局占位页面。

**Tech Stack:** Vue 3.4 (Composition API), Pinia 2, TypeScript 5, Vitest 1

---

## 文件结构

```
src/
  data/
    events.ts              # 30 个 DayEvent 对象（新建）
  composables/
    useCalendar.ts         # 日历 + 抉择引擎（新建）
  views/
    GameView.vue           # 主游戏视图，串联各组件（新建）
  components/
    DayScene.vue           # 清晨：场景标题 + 叙事文本（新建）
    ChoicePanel.vue        # 日间：抉择按钮列表（新建）
    EveningFeedback.vue    # 傍晚：好感度变化摘要（新建）
    NightVisitPanel.vue    # 夜间：选择拜访 NPC（新建）
  App.vue                  # 改为显示 GameView（修改）
tests/
  data/
    events.test.ts         # 事件数据完整性（新建）
  composables/
    calendar.test.ts       # useCalendar 逻辑（新建）
```

**已有文件（勿修改接口）：**
- `src/types/game.ts` — `DayEvent`, `Choice`, `Outcome`, `EndingId`
- `src/types/npc.ts` — `NpcId`, `AffinityDimension`
- `src/stores/game.ts` — `useGameStore` with `day`, `applyOutcome()`, `advanceDay()`
- `src/stores/affinity.ts` — `useAffinityStore` with `adjustAffinity()`
- `src/data/npcs.ts` — `NPC_PROFILES` (12 个 NPC)

---

## Task 1: 30天事件数据

**Files:**
- Create: `src/data/events.ts`
- Create: `tests/data/events.test.ts`

- [ ] **Step 1: 写事件数据完整性测试**

创建 `tests/data/events.test.ts`：

```typescript
import { DAY_EVENTS } from '../../src/data/events'

describe('DAY_EVENTS 完整性', () => {
  it('包含恰好 30 个事件', () => {
    expect(DAY_EVENTS).toHaveLength(30)
  })

  it('事件天数从 1 到 30，无重复无缺漏', () => {
    const days = DAY_EVENTS.map(e => e.day).sort((a, b) => a - b)
    expect(days).toEqual(Array.from({ length: 30 }, (_, i) => i + 1))
  })

  it('第 30 天无抉择（结局触发）', () => {
    const day30 = DAY_EVENTS.find(e => e.day === 30)!
    expect(day30.choices).toHaveLength(0)
    expect(day30.hasCombat).toBe(false)
  })

  it('第 1-29 天每天至少有 1 个抉择', () => {
    for (const event of DAY_EVENTS.filter(e => e.day < 30)) {
      expect(event.choices.length).toBeGreaterThanOrEqual(1)
    }
  })

  it('每个抉择有唯一 id 且至少包含 1 个 outcome', () => {
    const allChoiceIds = DAY_EVENTS.flatMap(e => e.choices.map(c => c.id))
    const uniqueIds = new Set(allChoiceIds)
    expect(uniqueIds.size).toBe(allChoiceIds.length) // no duplicates
    for (const event of DAY_EVENTS) {
      for (const choice of event.choices) {
        expect(choice.outcomes.length).toBeGreaterThanOrEqual(1)
      }
    }
  })

  it('有战斗的天数不超过 10 天', () => {
    const combatDays = DAY_EVENTS.filter(e => e.hasCombat)
    expect(combatDays.length).toBeLessThanOrEqual(10)
    expect(combatDays.length).toBeGreaterThanOrEqual(3)
  })
})
```

- [ ] **Step 2: 运行测试确认失败**

```bash
node node_modules/vitest/vitest.mjs run tests/data/events.test.ts 2>&1 | tail -10
```

预期：FAIL — Cannot find module

- [ ] **Step 3: 创建 `src/data/events.ts`**

```typescript
import type { DayEvent } from '../types/game'

export const DAY_EVENTS: DayEvent[] = [
  // ─── 初入江湖 Day 1–8 ───────────────────────────────────────────
  {
    day: 1,
    title: '驿站惊变',
    scene: '夜深人静，驿站后院突然传出两道压低的声音。侧耳细辨，竟是太虚观掌门与血煞堂执行者的秘密交易——这份足以颠覆正派联盟的内幕，就此落入你手中。',
    hasCombat: false,
    choices: [
      {
        id: 'c1-a',
        text: '伏身细听，将每字每句记牢',
        outcomes: [{ secretSpreadDelta: 2, flags: ['heard-deal-detail'] }],
      },
      {
        id: 'c1-b',
        text: '悄悄离开，此事知道得越少越安全',
        outcomes: [{ secretSpreadDelta: 0, flags: ['avoided-deal'] }],
      },
    ],
  },
  {
    day: 2,
    title: '青云门来访',
    scene: '翌日清晨，驿站外停了一队青云门旗号的车马。掌门姜鹤年亲自下马，目光精锐地向你望来，似乎察觉到了什么。',
    hasCombat: false,
    choices: [
      {
        id: 'c2-a',
        text: '以礼相见，表现得毫无异样',
        outcomes: [{ npcId: 'jiang-henian', affinityDelta: { trust: 10, awe: 5 } }],
      },
      {
        id: 'c2-b',
        text: '借口赶路，婉转推辞寒暄',
        outcomes: [{ npcId: 'jiang-henian', affinityDelta: { trust: -5, awe: 5 } }],
      },
    ],
  },
  {
    day: 3,
    title: '山路问路',
    scene: '官道旁，一个年轻的灵隐宗僧人坐在树根上，苦恼地翻看地图。见你路过，他抬头笑道："施主，前方去镇上可是向东走？"',
    hasCombat: false,
    choices: [
      {
        id: 'c3-a',
        text: '热心指路，与他攀谈片刻',
        outcomes: [{ npcId: 'huiming', affinityDelta: { trust: 10, intimacy: 8 } }],
      },
      {
        id: 'c3-b',
        text: '简短指路便离开，不多言',
        outcomes: [{ npcId: 'huiming', affinityDelta: { trust: 5 } }],
      },
    ],
  },
  {
    day: 4,
    title: '太虚弟子现身',
    scene: '暮色中，一名素衣女子出现在路口，步伐轻盈，回头望了你一眼，似有意又似无意。那是太虚观弟子凌霜——她的出现绝非偶然。',
    hasCombat: false,
    choices: [
      {
        id: 'c4-a',
        text: '主动上前搭话，试探她的来意',
        outcomes: [
          { npcId: 'lingshuang', affinityDelta: { trust: 5, intimacy: 10 } },
          { secretSpreadDelta: 1 },
        ],
      },
      {
        id: 'c4-b',
        text: '绕道而行，假作未见',
        outcomes: [{ npcId: 'lingshuang', affinityDelta: { dread: 5 } }],
      },
    ],
  },
  {
    day: 5,
    title: '荒路突袭',
    scene: '行至荒僻山道，前方几名持刀壮汉拦住去路，腰间荒原帮标记清晰可见。领头者冷笑："独行的女子，把路费交出来，大爷放你过去。"',
    hasCombat: true,
    choices: [
      {
        id: 'c5-a',
        text: '拔剑迎战，让他们见识一下内功',
        outcomes: [
          { npcId: 'yan-sandao', affinityDelta: { dread: 10 } },
          { flags: ['fought-huangyuan'] },
        ],
      },
      {
        id: 'c5-b',
        text: '扔出银两买路，多一事不如少一事',
        outcomes: [
          { npcId: 'yan-sandao', affinityDelta: { dread: 5 } },
          { flags: ['bribed-huangyuan'] },
        ],
      },
    ],
  },
  {
    day: 6,
    title: '市井情报',
    scene: '镇上的茶馆里，一个相貌普通的男子在你旁边坐下，轻声道："叶姑娘，我是顾长风。江湖上有些消息，不知你有没有兴趣？"',
    hasCombat: false,
    choices: [
      {
        id: 'c6-a',
        text: '花钱购买他手头的情报',
        outcomes: [
          { npcId: 'gu-changfeng', affinityDelta: { trust: 15, intimacy: 5 } },
          { flags: ['bought-intel-day6'] },
        ],
      },
      {
        id: 'c6-b',
        text: '反问他为何知晓你的名字',
        outcomes: [{ npcId: 'gu-changfeng', affinityDelta: { trust: 5, intimacy: 10 } }],
      },
    ],
  },
  {
    day: 7,
    title: '血影追踪',
    scene: '一连三日，你在不同地点都瞥见同一个身影——穿灰色劲装、刀茧厚重，正是陆铭。被血煞堂监视的滋味如芒刺在背。',
    hasCombat: false,
    choices: [
      {
        id: 'c7-a',
        text: '设下假路线，试图甩掉对方',
        outcomes: [
          { npcId: 'lu-ming', affinityDelta: { dread: -5 } },
          { flags: ['evaded-lu-ming'] },
        ],
      },
      {
        id: 'c7-b',
        text: '在僻静处停下等他靠近，当面对峙',
        outcomes: [
          { npcId: 'lu-ming', affinityDelta: { dread: 10, trust: 5 } },
          { secretSpreadDelta: 1 },
        ],
      },
    ],
  },
  {
    day: 8,
    title: '古刹借宿',
    scene: '灵隐宗山门前，了尘大师亲自迎出，一双悲悯的眼睛仿佛看穿了你七日来的辛苦。"施主面有惊色，但请入寺安歇。"',
    hasCombat: false,
    choices: [
      {
        id: 'c8-a',
        text: '借宿之机，将驿站所听之事如实相告',
        outcomes: [
          { npcId: 'liaoChen-dashi', affinityDelta: { trust: 20, awe: 5 } },
          { secretSpreadDelta: 2, flags: ['told-liaoChen'] },
        ],
      },
      {
        id: 'c8-b',
        text: '道谢借宿，对秘密一字不提',
        outcomes: [{ npcId: 'liaoChen-dashi', affinityDelta: { trust: 10, awe: 10 } }],
      },
    ],
  },
  // ─── 暗流涌动 Day 9–20 ──────────────────────────────────────────
  {
    day: 9,
    title: '玄机突访',
    scene: '了尘大师尚未给你答复，太虚观掌门玄机子便突然来访。他与了尘并排而坐，眼角余光却始终落在你身上，笑道："这位想必就是刑部叶侍郎的千金？"',
    hasCombat: false,
    choices: [
      {
        id: 'c9-a',
        text: '坦然应对，谈吐得体，不露破绽',
        outcomes: [{ npcId: 'xuanji-zi', affinityDelta: { awe: 10, dread: 5 } }],
      },
      {
        id: 'c9-b',
        text: '借口不适，尽快告退',
        outcomes: [
          { npcId: 'xuanji-zi', affinityDelta: { dread: 10 } },
          { secretSpreadDelta: 1 },
        ],
      },
    ],
  },
  {
    day: 10,
    title: '密探现身',
    scene: '寺中花园，一个"商人"模样的人走近你，压低声音道："在下纪晚棠，朝廷的人。叶姑娘，你知道的那些事，朝廷也需要知道。"',
    hasCombat: false,
    choices: [
      {
        id: 'c10-a',
        text: '试探性地承认知道一些事',
        outcomes: [
          { npcId: 'ji-wantang', affinityDelta: { trust: 10, dread: 5 } },
          { secretSpreadDelta: 1 },
        ],
      },
      {
        id: 'c10-b',
        text: '否认，并反问他凭什么这样说',
        outcomes: [{ npcId: 'ji-wantang', affinityDelta: { trust: -5, dread: 15, intimacy: 5 } }],
      },
    ],
  },
  {
    day: 11,
    title: '如玉来访',
    scene: '沈如玉只身来到灵隐宗，眼中燃着火光："师叔说你可能知道太虚观的秘密——那些'意外身亡'的侠士，是不是真的意外？"',
    hasCombat: false,
    choices: [
      {
        id: 'c11-a',
        text: '将所知的部分情况告诉她',
        outcomes: [
          { npcId: 'shen-ruyu', affinityDelta: { trust: 20, intimacy: 10 } },
          { secretSpreadDelta: 2 },
        ],
      },
      {
        id: 'c11-b',
        text: '告诉她这件事比她想象的更危险，劝她别查',
        outcomes: [{ npcId: 'shen-ruyu', affinityDelta: { trust: 5, intimacy: 15 } }],
      },
    ],
  },
  {
    day: 12,
    title: '无名警告',
    scene: '你的枕下压着一张字条："知秘者，速离。——友人"笔迹陌生，字条无署名，却透着一股不寒而栗的真诚。',
    hasCombat: false,
    choices: [
      {
        id: 'c12-a',
        text: '按字条指引，次日便动身离开此地',
        outcomes: [{ secretSpreadDelta: -1, flags: ['heeded-warning'] }],
      },
      {
        id: 'c12-b',
        text: '追查字条来源，等待幕后人现身',
        outcomes: [{ secretSpreadDelta: 1, flags: ['investigated-warning'] }],
      },
    ],
  },
  {
    day: 13,
    title: '凌霜求援',
    scene: '夜深，凌霜出现在你房门外，神色仓皇："我知道你知道了。玄机子命我监视你——但我不想这样下去了。你若能帮我找到离开太虚观的出路，我可以告诉你更多。"',
    hasCombat: false,
    choices: [
      {
        id: 'c13-a',
        text: '答应帮她，先听她说出更多内情',
        outcomes: [
          { npcId: 'lingshuang', affinityDelta: { trust: 25, intimacy: 20 } },
          { secretSpreadDelta: 1, flags: ['allied-lingshuang'] },
        ],
      },
      {
        id: 'c13-b',
        text: '拒绝，告诉她你无法保证任何人的安全',
        outcomes: [{ npcId: 'lingshuang', affinityDelta: { trust: 5, dread: 10 } }],
      },
    ],
  },
  {
    day: 14,
    title: '江湖宴席',
    scene: '各派人物汇聚镇上，表面是为贺寿，实则暗流汹涌。酒过三巡，有人趁乱拔刀——你被卷进一场混战。',
    hasCombat: true,
    choices: [
      {
        id: 'c14-a',
        text: '护住离你最近的沈如玉',
        outcomes: [{ npcId: 'shen-ruyu', affinityDelta: { trust: 15, awe: 10 } }],
      },
      {
        id: 'c14-b',
        text: '趁乱脱身，不卷入任何一方',
        outcomes: [{ secretSpreadDelta: -1 }],
      },
    ],
  },
  {
    day: 15,
    title: '草莽情义',
    scene: '燕三刀独自找上门来，将一块令牌推到你面前："持此令牌，荒原帮境内你随意走。不要钱，但日后我若有所托，你得答应一件事。"',
    hasCombat: false,
    choices: [
      {
        id: 'c15-a',
        text: '接受令牌，约定日后互助',
        outcomes: [
          { npcId: 'yan-sandao', affinityDelta: { trust: 20, awe: 15 } },
          { flags: ['huangyuan-pact'] },
        ],
      },
      {
        id: 'c15-b',
        text: '礼貌拒绝，不接受未知的承诺',
        outcomes: [{ npcId: 'yan-sandao', affinityDelta: { trust: 5, awe: 10 } }],
      },
    ],
  },
  {
    day: 16,
    title: '长辈盘问',
    scene: '姜鹤年借商议江湖事务之机，单独将你留下，长叹一声："年轻人，有些事知道了便无法置身事外——你现在是哪种处境？"',
    hasCombat: false,
    choices: [
      {
        id: 'c16-a',
        text: '承认自己知道了一些事，请他指点',
        outcomes: [
          { npcId: 'jiang-henian', affinityDelta: { trust: 15, awe: 5 } },
          { secretSpreadDelta: 1 },
        ],
      },
      {
        id: 'c16-b',
        text: '坚称自己只是回京待嫁的女子，别无他求',
        outcomes: [{ npcId: 'jiang-henian', affinityDelta: { trust: -5, awe: 10 } }],
      },
    ],
  },
  {
    day: 17,
    title: '血煞条件',
    scene: '陆铭拦路，语气平静如谈生意："姑娘，我家堂主说了，你若愿意将那夜所听如实告知我们，血煞堂保你平安回京、婚事顺利。"',
    hasCombat: false,
    choices: [
      {
        id: 'c17-a',
        text: '假意谈判，摸清血煞堂的真实意图',
        outcomes: [
          { npcId: 'lu-ming', affinityDelta: { trust: 10, dread: -5 } },
          { flags: ['negotiated-xueshao'] },
        ],
      },
      {
        id: 'c17-b',
        text: '断然拒绝，转身便走',
        outcomes: [
          { npcId: 'lu-ming', affinityDelta: { dread: 15 } },
          { flags: ['refused-xueshao'] },
        ],
      },
    ],
  },
  {
    day: 18,
    title: '密探棋局',
    scene: '纪晚棠摆出棋盘，笑道："不如下一局，输的人回答一个问题——如实回答。"棋局是假，试探是真。',
    hasCombat: false,
    choices: [
      {
        id: 'c18-a',
        text: '认真对弈，以棋局作掩护说出部分真相',
        outcomes: [
          { npcId: 'ji-wantang', affinityDelta: { trust: 15, intimacy: 15 } },
          { secretSpreadDelta: 1 },
        ],
      },
      {
        id: 'c18-b',
        text: '故意输掉，用一个无关紧要的秘密结束对局',
        outcomes: [{ npcId: 'ji-wantang', affinityDelta: { trust: 5, dread: 5, intimacy: 10 } }],
      },
    ],
  },
  {
    day: 19,
    title: '慧明抉择',
    scene: '慧明找到你，面色平静地说："我打算还俗。了尘师父知道比他表现的更多，却选择什么都不做——我不能接受这样的中立。"',
    hasCombat: false,
    choices: [
      {
        id: 'c19-a',
        text: '支持他，告诉他你理解这种选择',
        outcomes: [
          { npcId: 'huiming', affinityDelta: { trust: 15, intimacy: 20 } },
          { flags: ['huiming-left-sect'] },
        ],
      },
      {
        id: 'c19-b',
        text: '劝他再想想，中立未必是懦弱',
        outcomes: [{ npcId: 'huiming', affinityDelta: { trust: 10, intimacy: 5 } }],
      },
    ],
  },
  {
    day: 20,
    title: '顾长风急报',
    scene: '顾长风快马找来，面色难看："玄机子已经知道你知道了那夜的事——他在路上安排了人。你得今晚就动身。"',
    hasCombat: false,
    choices: [
      {
        id: 'c20-a',
        text: '立刻动身，趁夜离开此地',
        outcomes: [
          { npcId: 'gu-changfeng', affinityDelta: { trust: 10, intimacy: 5 } },
          { flags: ['fled-night'] },
        ],
      },
      {
        id: 'c20-b',
        text: '先布置疑阵，拖延一日再走',
        outcomes: [{ secretSpreadDelta: -1, flags: ['set-decoy'] }],
      },
    ],
  },
  // ─── 一念之间 Day 21–29 ─────────────────────────────────────────
  {
    day: 21,
    title: '玄机邀谈',
    scene: '玄机子差人送来一张帖子："邀叶姑娘月下茶叙，共商雍朝江湖之未来。"是赴约以观虚实，还是拒绝？',
    hasCombat: false,
    choices: [
      {
        id: 'c21-a',
        text: '赴约，以观其虚实',
        outcomes: [
          { npcId: 'xuanji-zi', affinityDelta: { awe: 15, dread: 15 } },
          { flags: ['met-xuanji-private'] },
        ],
      },
      {
        id: 'c21-b',
        text: '婉拒，另寻出路',
        outcomes: [
          { npcId: 'xuanji-zi', affinityDelta: { dread: 20 } },
          { secretSpreadDelta: 1 },
        ],
      },
    ],
  },
  {
    day: 22,
    title: '宗门内争',
    scene: '灵隐宗内，了尘大师与几名长老正在争吵——是否应当公开太虚观与血煞堂的关系。了尘持保留意见，你该如何？',
    hasCombat: false,
    choices: [
      {
        id: 'c22-a',
        text: '站出来支持公开真相',
        outcomes: [
          { npcId: 'liaoChen-dashi', affinityDelta: { trust: -5, awe: 5 } },
          { secretSpreadDelta: 2, flags: ['supported-disclosure'] },
        ],
      },
      {
        id: 'c22-b',
        text: '私下劝了尘，等待更好时机',
        outcomes: [{ npcId: 'liaoChen-dashi', affinityDelta: { trust: 10, intimacy: 5 } }],
      },
    ],
  },
  {
    day: 23,
    title: '七娘往事',
    scene: '柳七娘与你同坐营火旁，讲起她被正派驱逐的往事——她曾是青云门最有前途的弟子，只因揭发掌门私吞赏金，便被扣上"妖女"之名逐出。',
    hasCombat: false,
    choices: [
      {
        id: 'c23-a',
        text: '告诉她你处境相似，引为同道',
        outcomes: [
          { npcId: 'liu-qiniang', affinityDelta: { trust: 20, intimacy: 25 } },
          { flags: ['bonded-liu'] },
        ],
      },
      {
        id: 'c23-b',
        text: '听完保持沉默，不轻易表态',
        outcomes: [{ npcId: 'liu-qiniang', affinityDelta: { trust: 10, awe: 10 } }],
      },
    ],
  },
  {
    day: 24,
    title: '如玉崩溃',
    scene: '沈如玉得知师叔姜鹤年早就知道太虚观异动却沉默多年，当场崩溃，哭着质问你："你为什么之前不把全部告诉我？！"',
    hasCombat: false,
    choices: [
      {
        id: 'c24-a',
        text: '陪着她，如实说出你所知道的一切',
        outcomes: [
          { npcId: 'shen-ruyu', affinityDelta: { trust: 15, intimacy: 20 } },
          { secretSpreadDelta: 2 },
        ],
      },
      {
        id: 'c24-b',
        text: '先安抚她的情绪，让她冷静后再谈',
        outcomes: [{ npcId: 'shen-ruyu', affinityDelta: { intimacy: 10 } }],
      },
    ],
  },
  {
    day: 25,
    title: '血煞截杀',
    scene: '山路窄处，五名血煞堂杀手突然现身。为首者面无表情，手中摆着你的画像："堂主说了，死要见尸。"',
    hasCombat: true,
    choices: [
      {
        id: 'c25-a',
        text: '正面迎战，以内功强行突围',
        outcomes: [
          { npcId: 'lu-ming', affinityDelta: { dread: -10 } },
          { flags: ['survived-ambush'] },
        ],
      },
      {
        id: 'c25-b',
        text: '引入镇中人多处，借人证自保',
        outcomes: [
          { npcId: 'lu-ming', affinityDelta: { trust: 5, dread: -5 } },
          { secretSpreadDelta: 2, flags: ['exposed-xueshao'] },
        ],
      },
    ],
  },
  {
    day: 26,
    title: '三方对峙',
    scene: '玄机子、姜鹤年、陆铭三人同时出现在你下榻之处。三方交锋，却都盯着你——你是这个局里唯一一张不受控制的牌。',
    hasCombat: false,
    choices: [
      {
        id: 'c26-a',
        text: '公开宣读驿站所听内容，当场摊牌',
        outcomes: [
          { npcId: 'xuanji-zi', affinityDelta: { dread: 30 } },
          { secretSpreadDelta: 3, flags: ['public-revelation'] },
        ],
      },
      {
        id: 'c26-b',
        text: '保持沉默，等三方先自乱阵脚',
        outcomes: [{ secretSpreadDelta: -1 }],
      },
    ],
  },
  {
    day: 27,
    title: '凌霜出走',
    scene: '凌霜找到你，手里握着一封信："这是玄机子密约的原件，我偷出来了。我要离开太虚观——你帮我还是不帮我，现在必须告诉我。"',
    hasCombat: false,
    choices: [
      {
        id: 'c27-a',
        text: '帮她离开，接过信件保管',
        outcomes: [
          { npcId: 'lingshuang', affinityDelta: { trust: 30, intimacy: 30 } },
          { flags: ['has-original-doc', 'helped-lingshuang'] },
        ],
      },
      {
        id: 'c27-b',
        text: '劝她将信交给了尘大师处理',
        outcomes: [
          { npcId: 'lingshuang', affinityDelta: { trust: 10, awe: 15 } },
          { flags: ['doc-to-liaoChen'] },
        ],
      },
    ],
  },
  {
    day: 28,
    title: '掌门摊牌',
    scene: '姜鹤年独自来见你，开门见山："你知道得太多了，但我选择信任你。当年我选择沉默，是因为保全青云门的代价——现在是时候说清楚了。"',
    hasCombat: false,
    choices: [
      {
        id: 'c28-a',
        text: '接受他的解释，与他谈条件',
        outcomes: [
          { npcId: 'jiang-henian', affinityDelta: { trust: 20, awe: 10 } },
          { flags: ['alliance-qingyun'] },
        ],
      },
      {
        id: 'c28-b',
        text: '告诉他无论理由，沉默就是共谋',
        outcomes: [
          { npcId: 'jiang-henian', affinityDelta: { trust: -10, awe: 20, intimacy: 5 } },
          { flags: ['rejected-qingyun'] },
        ],
      },
    ],
  },
  {
    day: 29,
    title: '前夜选择',
    scene: '距离回京完婚还剩最后一日。秘密在你手中，有人想要它、有人要掩盖它、有人要毁掉它——而你，终于要做出最后的决定。',
    hasCombat: false,
    choices: [
      {
        id: 'c29-a',
        text: '决定公开一切，将证据交给可信之人',
        outcomes: [{ secretSpreadDelta: 2, flags: ['decided-reveal'] }],
      },
      {
        id: 'c29-b',
        text: '决定悄然销毁证据，平静回京完婚',
        outcomes: [{ secretSpreadDelta: -3, flags: ['decided-destroy'] }],
      },
    ],
  },
  // ─── 终局 Day 30 ────────────────────────────────────────────────
  {
    day: 30,
    title: '终局之日',
    scene: '第三十日，清晨的雾还没有散去。所有的抉择都已做出，所有的关系都已定型——结局，就在这最后的雾中等待。',
    hasCombat: false,
    choices: [], // 无抉择，结局由累积状态决定
  },
]
```

- [ ] **Step 4: 运行测试确认通过**

```bash
node node_modules/vitest/vitest.mjs run tests/data/events.test.ts 2>&1 | tail -15
```

预期：PASS（6 个测试全绿）

- [ ] **Step 5: Commit**

```bash
node -e "const e=require('child_process').execSync; e('git add src/data/events.ts tests/data/events.test.ts', {stdio:'inherit'}); e('git commit -m \"feat: add 30-day event data with scenes, choices, and outcomes\"', {stdio:'inherit'})"
```

---

## Task 2: useCalendar 组合式函数

**Files:**
- Create: `src/composables/useCalendar.ts`
- Create: `tests/composables/calendar.test.ts`

- [ ] **Step 1: 写 useCalendar 测试**

创建 `tests/composables/calendar.test.ts`：

```typescript
import { setActivePinia, createPinia } from 'pinia'
import { useCalendar } from '../../src/composables/useCalendar'
import { useGameStore } from '../../src/stores/game'
import { useAffinityStore } from '../../src/stores/affinity'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('useCalendar', () => {
  it('currentEvent 返回当前天对应的事件', () => {
    const cal = useCalendar()
    expect(cal.currentEvent.value.day).toBe(1)
    expect(cal.currentEvent.value.title).toBe('驿站惊变')
  })

  it('makeChoice 应用抉择的 outcomes 到 gameStore', () => {
    const cal = useCalendar()
    const game = useGameStore()
    cal.makeChoice('c1-a') // secretSpreadDelta: 2, flags: ['heard-deal-detail']
    expect(game.secretSpread).toBe(2)
    expect(game.flags.has('heard-deal-detail')).toBe(true)
  })

  it('makeChoice 设置 choiceMade 为 true', () => {
    const cal = useCalendar()
    expect(cal.choiceMade.value).toBe(false)
    cal.makeChoice('c1-a')
    expect(cal.choiceMade.value).toBe(true)
  })

  it('makeChoice 同一天只能调用一次', () => {
    const cal = useCalendar()
    const game = useGameStore()
    cal.makeChoice('c1-a') // secretSpread: 2
    cal.makeChoice('c1-b') // 不应再次执行
    expect(game.secretSpread).toBe(2) // 仍是 2，而不是 0 或 4
  })

  it('selectedChoice 记录所选抉择', () => {
    const cal = useCalendar()
    cal.makeChoice('c1-b')
    expect(cal.selectedChoice.value?.id).toBe('c1-b')
  })

  it('useNightVisit 标记夜访已使用', () => {
    const cal = useCalendar()
    expect(cal.nightVisitUsed.value).toBe(false)
    cal.useNightVisit('shen-ruyu')
    expect(cal.nightVisitUsed.value).toBe(true)
    expect(cal.nightVisitNpc.value).toBe('shen-ruyu')
  })

  it('useNightVisit 同一天只能使用一次', () => {
    const cal = useCalendar()
    cal.useNightVisit('shen-ruyu')
    cal.useNightVisit('huiming') // 第二次不应生效
    expect(cal.nightVisitNpc.value).toBe('shen-ruyu')
  })

  it('useNightVisit 给被访 NPC 增加 3 点亲密度', () => {
    const cal = useCalendar()
    const affinity = useAffinityStore()
    const before = affinity.getAffinity('shen-ruyu').intimacy
    cal.useNightVisit('shen-ruyu')
    expect(affinity.getAffinity('shen-ruyu').intimacy).toBe(before + 3)
  })

  it('advanceToNextDay 需要 choiceMade 才能推进', () => {
    const cal = useCalendar()
    const game = useGameStore()
    cal.advanceToNextDay() // choiceMade 为 false，不推进
    expect(game.day).toBe(1)
  })

  it('advanceToNextDay 推进天数并重置当日状态', () => {
    const cal = useCalendar()
    const game = useGameStore()
    cal.makeChoice('c1-a')
    cal.useNightVisit('shen-ruyu')
    cal.advanceToNextDay()
    expect(game.day).toBe(2)
    expect(cal.choiceMade.value).toBe(false)
    expect(cal.nightVisitUsed.value).toBe(false)
    expect(cal.nightVisitNpc.value).toBeNull()
    expect(cal.selectedChoice.value).toBeNull()
    expect(cal.currentEvent.value.day).toBe(2)
  })
})
```

- [ ] **Step 2: 运行测试确认失败**

```bash
node node_modules/vitest/vitest.mjs run tests/composables/calendar.test.ts 2>&1 | tail -10
```

预期：FAIL — Cannot find module `../../src/composables/useCalendar`

- [ ] **Step 3: 实现 `src/composables/useCalendar.ts`**

```typescript
import { computed, ref, readonly } from 'vue'
import type { Choice } from '../types/game'
import type { NpcId } from '../types/npc'
import { DAY_EVENTS } from '../data/events'
import { useGameStore } from '../stores/game'
import { useAffinityStore } from '../stores/affinity'

export function useCalendar() {
  const gameStore = useGameStore()
  const affinityStore = useAffinityStore()

  const currentEvent = computed(
    () => DAY_EVENTS.find(e => e.day === gameStore.day) ?? DAY_EVENTS[0]
  )

  const choiceMade = ref(false)
  const selectedChoice = ref<Choice | null>(null)
  const nightVisitUsed = ref(false)
  const nightVisitNpc = ref<NpcId | null>(null)

  function makeChoice(choiceId: string): void {
    if (choiceMade.value) return
    const choice = currentEvent.value.choices.find(c => c.id === choiceId)
    if (!choice) return
    for (const outcome of choice.outcomes) {
      gameStore.applyOutcome(outcome)
    }
    selectedChoice.value = choice
    choiceMade.value = true
  }

  function useNightVisit(npcId: NpcId): void {
    if (nightVisitUsed.value) return
    nightVisitNpc.value = npcId
    nightVisitUsed.value = true
    affinityStore.adjustAffinity(npcId, { intimacy: 3 })
  }

  function advanceToNextDay(): void {
    if (!choiceMade.value) return
    gameStore.advanceDay()
    choiceMade.value = false
    selectedChoice.value = null
    nightVisitUsed.value = false
    nightVisitNpc.value = null
  }

  return {
    currentEvent,
    choiceMade: readonly(choiceMade),
    selectedChoice: readonly(selectedChoice),
    nightVisitUsed: readonly(nightVisitUsed),
    nightVisitNpc: readonly(nightVisitNpc),
    makeChoice,
    useNightVisit,
    advanceToNextDay,
  }
}
```

- [ ] **Step 4: 运行测试确认通过**

```bash
node node_modules/vitest/vitest.mjs run tests/composables/calendar.test.ts 2>&1 | tail -15
```

预期：PASS（11 个测试全绿）

- [ ] **Step 5: 全量测试**

```bash
node node_modules/vitest/vitest.mjs run 2>&1 | tail -15
```

预期：全部 PASS（现有 17 + 新增 6 + 11 = 34 个测试）

- [ ] **Step 6: Commit**

```bash
node -e "const e=require('child_process').execSync; e('git add src/composables/ tests/composables/', {stdio:'inherit'}); e('git commit -m \"feat: add useCalendar composable — choice engine, night visit, day advancement\"', {stdio:'inherit'})"
```

---

## Task 3: DayScene + ChoicePanel 组件

**Files:**
- Create: `src/components/DayScene.vue`
- Create: `src/components/ChoicePanel.vue`

- [ ] **Step 1: 创建 `src/components/DayScene.vue`**

```vue
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
.day-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}
.day-badge {
  font-size: 0.8rem;
  color: #8B1A1A;
  border: 1px solid #8B1A1A;
  padding: 2px 8px;
  border-radius: 2px;
}
.day-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 1.2rem;
  color: #1A1208;
  margin: 0;
}
.scene-text {
  font-family: 'Noto Serif SC', serif;
  color: #2A1E0E;
  line-height: 2;
  margin: 0;
}
.combat-badge {
  display: inline-block;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #C0392B;
  border: 1px dashed #C0392B;
  padding: 2px 6px;
}
</style>
```

- [ ] **Step 2: 创建 `src/components/ChoicePanel.vue`**

```vue
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
    <p v-if="choices.length === 0" class="no-choices">
      三十日已至，一切尘埃落定。
    </p>
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
.choice-prompt {
  font-size: 0.85rem;
  color: #8B1A1A;
  letter-spacing: 2px;
  margin-bottom: 0.75rem;
}
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
```

- [ ] **Step 3: 确认组件无 TypeScript 错误**

```bash
node node_modules/typescript/bin/tsc --noEmit 2>&1 | head -20
```

预期：无错误输出（或只有与 Vue 组件无关的警告）

- [ ] **Step 4: Commit**

```bash
node -e "const e=require('child_process').execSync; e('git add src/components/DayScene.vue src/components/ChoicePanel.vue', {stdio:'inherit'}); e('git commit -m \"feat: add DayScene and ChoicePanel components\"', {stdio:'inherit'})"
```

---

## Task 4: EveningFeedback + NightVisitPanel 组件

**Files:**
- Create: `src/components/EveningFeedback.vue`
- Create: `src/components/NightVisitPanel.vue`

- [ ] **Step 1: 创建 `src/components/EveningFeedback.vue`**

```vue
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
.section-label {
  font-size: 0.75rem;
  color: #C9A84C;
  letter-spacing: 3px;
  margin-bottom: 0.5rem;
}
.outcome-list { list-style: none; padding: 0; margin: 0; }
.outcome-item {
  font-size: 0.85rem;
  color: #E0CC98;
  padding: 2px 0;
}
</style>
```

- [ ] **Step 2: 创建 `src/components/NightVisitPanel.vue`**

```vue
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
.section-label {
  font-size: 0.75rem;
  color: #4A7C59;
  letter-spacing: 3px;
  margin-bottom: 0.5rem;
}
.visit-done, .visit-hint { font-size: 0.85rem; color: #E0CC98; margin: 0 0 0.5rem; }
.npc-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.4rem;
}
.npc-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
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
```

- [ ] **Step 3: Commit**

```bash
node -e "const e=require('child_process').execSync; e('git add src/components/EveningFeedback.vue src/components/NightVisitPanel.vue', {stdio:'inherit'}); e('git commit -m \"feat: add EveningFeedback and NightVisitPanel components\"', {stdio:'inherit'})"
```

---

## Task 5: GameView.vue + App.vue 集成

**Files:**
- Create: `src/views/GameView.vue`
- Modify: `src/App.vue`

- [ ] **Step 1: 创建 `src/views/GameView.vue`**

```vue
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
```

- [ ] **Step 2: 修改 `src/App.vue`，替换为直接渲染 GameView**

```vue
<template>
  <GameView />
</template>

<script setup lang="ts">
import GameView from './views/GameView.vue'
</script>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #1A1208; }
</style>
```

- [ ] **Step 3: 运行全量测试**

```bash
node node_modules/vitest/vitest.mjs run 2>&1 | tail -15
```

预期：全部 PASS

- [ ] **Step 4: 启动开发服务器验证**

```bash
node node_modules/vite/bin/vite.js --port 5173 &
sleep 3
curl -s http://localhost:5173 | grep -o '<title>.*</title>'
kill %1 2>/dev/null || true
```

预期：返回 `<title>一念江湖</title>`

在浏览器中手动验证：
- 打开 http://localhost:5173
- 看到第 1 天场景文本
- 点击抉择后出现傍晚反馈 + 夜访面板
- 点击夜访 NPC 后按钮变为"已拜访"
- 点击"进入第 2 天"，天数递增
- 重复至第 30 天，出现结局占位页面

- [ ] **Step 5: Commit**

```bash
node -e "const e=require('child_process').execSync; e('git add src/views/GameView.vue src/App.vue', {stdio:'inherit'}); e('git commit -m \"feat: Phase 2 complete — 30-day calendar, choice engine, and game view\"', {stdio:'inherit'})"
```

---

## 自审

**Spec 覆盖检查：**
- ✅ 30 天日历（Day 1–30 事件数据完整）
- ✅ 每日结构：晨（DayScene）→ 日间抉择（ChoicePanel）→ 傍晚反馈（EveningFeedback）→ 夜访（NightVisitPanel）
- ✅ 抉择影响好感度 / 秘密扩散指数
- ✅ 夜访消耗当日名额（useNightVisit 限一次）
- ✅ 1/3 天有战斗标记（3 天：Day 5/14/25），Phase 4 扩充实际战斗逻辑
- ✅ Day 30 无抉择，结局占位（Phase 5 实现完整结局）

**类型一致性：**
- `makeChoice(choiceId: string)` ✅ Choice.id 为 string
- `useNightVisit(npcId: NpcId)` ✅ NpcId 来自 types/npc.ts
- `EveningFeedback` 接收 `Choice | null` ✅
- `NightVisitPanel` 接收 `used: boolean` + `visitedNpc: NpcId | null` ✅
