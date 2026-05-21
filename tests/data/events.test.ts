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
    expect(uniqueIds.size).toBe(allChoiceIds.length)
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
