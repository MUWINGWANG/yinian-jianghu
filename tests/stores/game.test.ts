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
