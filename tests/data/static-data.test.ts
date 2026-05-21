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
