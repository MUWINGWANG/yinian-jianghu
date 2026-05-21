import type { EndingId } from '../types/game'
import { useGameStore } from '../stores/game'
import { useAffinityStore } from '../stores/affinity'

export function determineEnding(): EndingId {
  const game = useGameStore()
  const affinity = useAffinityStore()

  // e1 镇压结局 — secretSpread >= 8
  if (game.secretSpread >= 8) {
    return 'e1'
  }

  // e2 正道结局 — secretSpread <= 2 AND 姜鹤年 trust >= 70
  if (game.secretSpread <= 2 && affinity.getAffinity('jiang-henian').trust >= 70) {
    return 'e2'
  }

  // e3 太虚结局 — flag 'xuanji-invited' AND 玄机子 awe >= 60
  if (game.flags.has('xuanji-invited') && affinity.getAffinity('xuanji-zi').awe >= 60) {
    return 'e3'
  }

  // e4 血煞结局 — flag 'lu-ming-deal' AND 陆铭 trust >= 50
  if (game.flags.has('lu-ming-deal') && affinity.getAffinity('lu-ming').trust >= 50) {
    return 'e4'
  }

  // e5 江湖浪人 — 沈如玉 intimacy >= 60
  if (affinity.getAffinity('shen-ruyu').intimacy >= 60) {
    return 'e5'
  }

  // e6 朝廷暗探 — flag 'ji-wantang-contact' AND 纪晚棠 trust >= 50
  if (game.flags.has('ji-wantang-contact') && affinity.getAffinity('ji-wantang').trust >= 50) {
    return 'e6'
  }

  // e7 孤身隐世（默认）
  return 'e7'
}
