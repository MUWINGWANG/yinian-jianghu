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
