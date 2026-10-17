export type Scale = 'd' | 'w' | 'm' | 'y'

/** Fixed palette of life categories (wheel-of-life domains). */
export const CATEGORIES = ['health', 'family', 'career', 'money', 'growth', 'play'] as const

export type Category = (typeof CATEGORIES)[number]

export interface Win {
  id: string
  title: string
  category: Category
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
