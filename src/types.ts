export type Scale = 'd' | 'w' | 'm' | 'y'

/** Career, Life & Vitality, Money */
export type Area = 0 | 1 | 2

export const AREAS: readonly Area[] = [0, 1, 2]

export const AREA_LABELS = ['Career', 'Life & Vitality', 'Money'] as const

export interface Win {
  id: string
  title: string
  area: Area
  /** win in the next larger scale */
  parentId?: string
  done: boolean
  /** "the one": the win that gives the most result */
  one: boolean
  /** completion progress, 0..100; 100 implies done */
  progress?: number
  /** active milestone note */
  note?: string
}
