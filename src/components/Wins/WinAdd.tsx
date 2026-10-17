import { useState } from 'react'
import { useWinsStore } from '../../store/useWinsStore'
import { periodKey, parentScaleName } from '../../lib/keys'
import { CATEGORY_META, CATEGORY_THEME } from '../../lib/categories'
import type { Category, Scale, Win } from '../../types'

interface WinAddProps {
  scale: Scale
  now: Date
  /** wins of the next larger scale, linkable as parents */
  parents: Win[]
  /** categories not yet used in this period */
  available: Category[]
  /** 1-based slot number, for the "Win N of 3" label */
  index: number
  onAdded?: () => void
}

const EXAMPLES: Record<Category, string> = {
  health: 'e.g. 30 min gym session…',
  family: 'e.g. Call Mom…',
  career: 'e.g. Draft the launch plan…',
  money: 'e.g. Save $2 for coffee…',
  growth: 'e.g. Read 10 pages…',
  play: 'e.g. Evening guitar…',
}

/** Create form: title + one-of-six category picker (unused only). */
export function WinAdd({ scale, now, parents, available, index, onAdded }: WinAddProps) {
  const key = periodKey(scale, now)
  const add = useWinsStore((s) => s.add)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<Category>(available[0] ?? 'health')
  const [parentId, setParentId] = useState('')
  const parentName = parentScaleName(scale)

  const submit = () => {
    const ok = add(key, { title, category, ...(parentId ? { parentId } : {}) })
    if (ok) {
      setTitle('')
      setParentId('')
      onAdded?.()
    }
  }

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={EXAMPLES[category]}
        aria-label={`Win ${index} of 3`}
        name="title"
        autoComplete="off"
        className="h-10 w-full min-w-0 rounded-lg border border-border-line bg-bg-canvas px-3 text-input-base"
      />

      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Category">
        {available.map((c) => {
          const t = CATEGORY_THEME[c]
          const selected = category === c
          return (
            <button
              key={c}
              type="button"
              aria-pressed={selected}
              onClick={() => setCategory(c)}
              className={`flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs transition-colors ${
                selected ? 'border-fg-primary text-fg-primary' : 'border-border-line text-fg-muted hover:text-fg-primary'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${t.dot}`} />
              {CATEGORY_META[c].label}
            </button>
          )
        })}
      </div>

      {parents.length > 0 && parentName && (
        <select
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          aria-label={`Link to a win in this ${parentName.toLowerCase()}`}
          className="w-fit rounded-lg border border-border-line bg-bg-canvas px-2 py-1 text-caption text-fg-primary"
        >
          <option value="">No link</option>
          {parents.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      )}

      <button
        type="submit"
        className="h-10 w-full shrink-0 rounded-lg border border-border-line px-4 text-label-sm font-medium text-fg-primary transition-colors hover:border-fg-primary"
      >
        Add goal
      </button>
    </form>
  )
}
