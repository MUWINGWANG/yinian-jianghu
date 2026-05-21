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
    expect(store.affinityMap['shen-ruyu'].trust).toBe(50)   // 40+10
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
