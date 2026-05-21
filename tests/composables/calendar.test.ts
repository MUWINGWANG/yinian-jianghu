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
    expect(game.secretSpread).toBe(2)
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
    cal.useNightVisit('huiming')
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
    cal.advanceToNextDay()
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
