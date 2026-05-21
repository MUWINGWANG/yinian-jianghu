export type FactionId = 'qingyun' | 'lingyin' | 'taixu' | 'xueshao' | 'huangyuan'
export type FactionAlignment = 'orthodox' | 'unorthodox'

export interface FactionProfile {
  id: FactionId
  name: string
  alignment: FactionAlignment
  philosophy: string
  description: string
  signatureSkills: string[]
  badge: string
}
