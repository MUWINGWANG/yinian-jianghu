import type { MartialArt } from '../types/combat'

export const MARTIAL_ARTS: MartialArt[] = [
  // 青云门
  { id: 'qy-01', name: '横扫千军', faction: 'qingyun', damage: 20, cost: 2 },
  { id: 'qy-02', name: '悬河之势', faction: 'qingyun', damage: 15, cost: 1 },
  { id: 'qy-03', name: '文剑破空', faction: 'qingyun', damage: 30, cost: 3 },
  { id: 'qy-04', name: '金刚护身', faction: 'qingyun', damage: 0, cost: 1, effect: '防御+20' },
  // 灵隐宗
  { id: 'ly-01', name: '慈悲一击', faction: 'lingyin', damage: 18, cost: 2 },
  { id: 'ly-02', name: '降龙伏虎', faction: 'lingyin', damage: 25, cost: 3 },
  { id: 'ly-03', name: '千手如来', faction: 'lingyin', damage: 12, cost: 1, effect: '连击x3' },
  { id: 'ly-04', name: '净世明光', faction: 'lingyin', damage: 0, cost: 2, effect: '回血15' },
  // 太虚观
  { id: 'tx-01', name: '无极剑气', faction: 'taixu', damage: 22, cost: 2 },
  { id: 'tx-02', name: '太虚幻境', faction: 'taixu', damage: 10, cost: 1, effect: '眩晕1回合' },
  { id: 'tx-03', name: '归元一气', faction: 'taixu', damage: 35, cost: 4 },
  { id: 'tx-04', name: '无形气壁', faction: 'taixu', damage: 0, cost: 2, effect: '反弹伤害50%' },
  // 血煞堂
  { id: 'xs-01', name: '鬼手夺命', faction: 'xueshao', damage: 28, cost: 2 },
  { id: 'xs-02', name: '百步穿心', faction: 'xueshao', damage: 20, cost: 1, effect: '无视防御' },
  { id: 'xs-03', name: '剧毒封穴', faction: 'xueshao', damage: 8, cost: 1, effect: '中毒3回合' },
  { id: 'xs-04', name: '七煞连环', faction: 'xueshao', damage: 40, cost: 5 },
  // 荒原帮
  { id: 'hy-01', name: '荒刀破甲', faction: 'huangyuan', damage: 25, cost: 2 },
  { id: 'hy-02', name: '铁牛奔野', faction: 'huangyuan', damage: 18, cost: 1, effect: '击退' },
  { id: 'hy-03', name: '驼背摔打', faction: 'huangyuan', damage: 15, cost: 1, effect: '眩晕1回合' },
  { id: 'hy-04', name: '三刀乱世', faction: 'huangyuan', damage: 45, cost: 5 },
]
