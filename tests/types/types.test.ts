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
