import { useState } from 'react'
import { useWinsStore } from '../../store/useWinsStore'
import { periodKey, parentScaleName } from '../../lib/keys'
import type { Area, Scale, Win } from '../../types'

interface WinAddProps {
  scale: Scale
  now: Date
  /** wins of the next larger scale, linkable as parents */
  parents: Win[]
  /** area is fixed when the form lives inside a reservoir card */
  defaultArea: Area
  /** 1-based slot within the area, for the "Win N of 3" label */
  index: number
}

/** Inline add form for one win inside a reservoir card. */
export function WinAdd({ scale, now, parents, defaultArea, index }: WinAddProps) {
  const key = periodKey(scale, now)
  const add = useWinsStore((s) => s.add)
  const [title, setTitle] = useState('')
  const [parentId, setParentId] = useState('')
  const parentName = parentScaleName(scale)

  const submit = () => {
    const ok = add(key, {
      title,
      area: defaultArea,
      ...(parentId ? { parentId } : {}),
    })
    if (ok) {
      setTitle('')
      setParentId('')
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
      <div className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={`e.g. ${defaultArea === 0 ? 'Draft the launch plan' : defaultArea === 1 ? 'Walk 30 minutes' : 'Send the invoice'}…`}
          aria-label={`Win ${index} of 3`}
          name="title"
          autoComplete="off"
          className="h-10 min-w-0 flex-1 rounded-lg border border-border-line bg-bg-canvas px-3 text-input-base"
        />
        <button
          type="submit"
          className="h-10 shrink-0 rounded-lg border border-border-line px-4 text-label-sm font-medium text-fg-primary transition-colors hover:border-fg-primary"
        >
          Add
        </button>
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
    </form>
  )
}
