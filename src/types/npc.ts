export type NpcId =
  | 'jiang-henian' | 'shen-ruyu'
  | 'liaoChen-dashi' | 'huiming'
  | 'xuanji-zi' | 'lingshuang'
  | 'lu-ming' | 'suyi-gui'
  | 'yan-sandao' | 'liu-qiniang'
  | 'gu-changfeng' | 'ji-wantang'

export type AffinityDimension = 'trust' | 'intimacy' | 'awe' | 'dread'

export interface AffinityState {
  trust: number
  intimacy: number
  awe: number
  dread: number
}

export interface NpcProfile {
  id: NpcId
  name: string
  age: string
  faction: import('./faction').FactionId | 'independent'
  role: string
  description: string
  narrativeFunction: string
  initialAffinity: AffinityState
  portrait: string
}
