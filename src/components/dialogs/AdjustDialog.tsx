import { useState } from 'react'
import { CATEGORY_META, CATEGORY_THEME, CATEGORY_VAR } from '../../lib/categories'
import { parentScaleName } from '../../lib/keys'
import { monthShort } from '../../lib/format'
import { weekOfYear } from '../../lib/time'
import { CATEGORIES, type Category, type Scale, type Win } from '../../types'
import { Icon } from '../Icon'
import { Modal } from './Modal'

/** patch applied to the store; "one" is handled separately for exclusivity */
export type AdjustPatch = Partial<Pick<Win, 'title' | 'category' | 'progress' | 'note' | 'done'>>

interface AdjustDialogProps {
  win: Win
  /** 1-based position of the win within the period */
  slot: number
  scale: Scale
  now: Date
  /** wins of the next larger scale, for the cascade card */
  parents: Win[]
  /** true when another goal in this period already uses the category */
  usedElsewhere: (c: Category) => boolean
  onSave: (patch: AdjustPatch, one: boolean) => void
  onDelete: () => void
  onClose: () => void
}

/** Edit a single goal: category, title, progress, note, The One. */
export function AdjustDialog({
  win,
  slot,
  scale,
  now,
  parents,
  usedElsewhere,
  onSave,
  onDelete,
  onClose,
}: AdjustDialogProps) {
  const [title, setTitle] = useState(win.title)
  const [category, setCategory] = useState<Category>(win.category)
  const [progress, setProgress] = useState(win.done ? 100 : win.progress ?? 0)
  const [note, setNote] = useState(win.note ?? '')
  const [one, setOne] = useState(win.one)

  const t = CATEGORY_THEME[category]
  const parentName = parentScaleName(scale)
  const parent = win.parentId ? parents.find((w) => w.id === win.parentId) : undefined
  const moveBlocked = category !== win.category && usedElsewhere(category)
  const canSave = title.trim().length > 0 && !moveBlocked

  const target =
    scale === 'd'
      ? `Week ${weekOfYear(now)}`
      : scale === 'w'
        ? `${monthShort(now)} ${now.getFullYear()}`
        : `${now.getFullYear()}`

  const save = () => {
    if (!canSave) return
    onSave(
      { title: title.trim(), category, progress, note, done: progress >= 100 },
      one,
    )
    onClose()
  }

  const bump = (n: number) => setProgress((p) => Math.min(100, p + n))

  return (
    <Modal label={`Adjust goal ${win.title}`} onClose={onClose} className="max-w-[600px]">
      {/* header */}
      <div className="flex items-start justify-between border-b border-border-line bg-surface-container-low px-6 pt-5 pb-4">
        <div>
          <span
            className={`mb-1.5 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-caption font-medium ${CATEGORY_THEME[win.category].chipBg} ${CATEGORY_THEME[win.category].chipBorder} ${CATEGORY_THEME[win.category].text}`}
          >
            <Icon name={CATEGORY_META[win.category].icon} size={13} />
            {CATEGORY_META[win.category].label} · Slot {slot} of 3
          </span>
          <h2 className="text-headline-sm font-medium tracking-tight text-fg-primary">
            Adjust Goal
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-container-high hover:text-fg-primary"
        >
          <Icon name="close" size={20} />
        </button>
      </div>

      {/* body */}
      <div className="max-h-[calc(85vh-160px)] space-y-5 overflow-y-auto px-6 py-5">
        {/* category */}
        <div>
          <span className="mb-1.5 block text-title-section font-medium text-fg-primary">
            Category
          </span>
          <div className="grid grid-cols-3 gap-2" role="group" aria-label="Category">
            {CATEGORIES.map((c) => {
              const ct = CATEGORY_THEME[c]
              const selected = category === c
              const inUse = c !== win.category && usedElsewhere(c)
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={selected}
                  disabled={inUse}
                  title={inUse ? 'Already used by another goal' : undefined}
                  onClick={() => setCategory(c)}
                  className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-label-sm transition-colors ${
                    selected
                      ? `border-2 ${ct.strongBorder} ${ct.chipBg} text-fg-primary`
                      : 'border border-border-line bg-surface-container-low text-fg-muted hover:border-fg-primary/40 hover:text-fg-primary'
                  } ${inUse ? 'cursor-not-allowed opacity-40' : ''}`}
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${ct.dot}`} />
                  {CATEGORY_META[c].label}
                </button>
              )
            })}
          </div>
          <p className="mt-1.5 flex items-center gap-1 text-caption text-fg-muted">
            <Icon name="info" size={14} />
            {moveBlocked
              ? `${CATEGORY_META[category].label} is already used. Pick a free category.`
              : 'One goal per category keeps your three balanced.'}
          </p>
        </div>

        {/* title */}
        <div>
          <label
            htmlFor="goal-title-input"
            className="mb-1.5 block text-title-section font-medium text-fg-primary"
          >
            Goal Title &amp; Scope
          </label>
          <input
            id="goal-title-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            name="title"
            autoComplete="off"
            className="w-full rounded-lg border border-border-line bg-surface-panel px-3.5 py-2.5 text-input-base text-fg-primary placeholder:text-fg-muted focus:border-cat-career focus:ring-2 focus:ring-cat-career/20 focus:outline-none"
          />
        </div>

        {/* horizon alignment */}
        <div className="flex items-start gap-3 rounded-lg border border-border-line bg-surface-container-low p-3.5">
          <div
            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-container ${t.text}`}
          >
            <Icon name="account_tree" size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-0.5 flex flex-wrap items-center justify-between gap-2">
              <span className="text-caption text-fg-muted">
                Horizon Alignment (Cascaded from {parentName ?? 'larger'} Three)
              </span>
              <span className="rounded border border-border-line bg-surface-container px-2 py-0.5 text-caption text-fg-muted">
                Target: {target}
              </span>
            </div>
            <div className="truncate text-body-md font-medium text-fg-primary">
              {parent ? parent.title : `Not linked to a ${parentName?.toLowerCase() ?? 'parent'} goal`}
            </div>
          </div>
        </div>

        {/* progress */}
        <div className="space-y-4 rounded-xl border border-border-line bg-surface-container-low p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-title-section font-medium text-fg-primary">Current Progress</span>
            <div className="flex items-baseline gap-1">
              <span className={`text-display-percent font-medium tabular-nums ${t.text}`}>
                {progress}%
              </span>
              <span className="text-caption text-fg-muted">completed</span>
            </div>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            aria-label="Progress percent"
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full cursor-pointer"
            style={{ accentColor: CATEGORY_VAR[category] }}
          />

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="mr-1 text-caption text-fg-muted">Quick adjust:</span>
            {[5, 10, 25].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => bump(n)}
                className="rounded-md border border-border-line bg-surface-panel px-2.5 py-1 text-label-sm text-fg-primary transition-colors hover:border-fg-primary"
              >
                +{n}%
              </button>
            ))}
            <button
              type="button"
              onClick={() => setProgress(100)}
              className={`ml-auto inline-flex items-center gap-1 rounded-md border px-3 py-1 text-label-sm font-medium transition-colors hover:brightness-105 ${t.chipBorder} ${t.chipBg} ${t.text}`}
            >
              <Icon name="check_circle" size={15} />
              Mark 100% (Done)
            </button>
          </div>

          <div className="border-t border-border-line/60 pt-2">
            <label
              htmlFor="milestone-status-input"
              className="mb-1 block text-caption text-fg-muted"
            >
              Active Milestone &amp; Notes
            </label>
            <input
              id="milestone-status-input"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Drafting section 2…"
              name="note"
              autoComplete="off"
              className="w-full rounded-lg border border-border-line bg-surface-panel px-3 py-1.5 text-body-md text-fg-primary placeholder:text-fg-muted focus:border-cat-career focus:ring-1 focus:ring-cat-career/30 focus:outline-none"
            />
          </div>
        </div>

        {/* the one */}
        <label className="flex cursor-pointer items-start gap-3.5 rounded-xl border border-border-line bg-surface-container-low p-3.5 transition-colors hover:border-fg-primary/30">
          <input
            type="checkbox"
            checked={one}
            onChange={(e) => setOne(e.target.checked)}
            className="mt-0.5 h-4 w-4"
            style={{ accentColor: CATEGORY_VAR[category] }}
          />
          <span className="min-w-0 flex-1">
            <span className="mb-0.5 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-caption font-medium ${t.chipBg} ${t.chipBorder} ${t.text}`}
              >
                ★ The One · Pareto Filter
              </span>
              <span className="text-title-section font-medium text-fg-primary">Set as The One</span>
            </span>
            <span className="block text-caption leading-relaxed text-fg-muted">
              Directs maximal leverage for {CATEGORY_META[category].label}. Only one goal holds
              the star to preserve singular focus.
            </span>
          </span>
        </label>
      </div>

      {/* footer */}
      <div className="flex items-center justify-between border-t border-border-line bg-surface-container-low px-6 py-4">
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center gap-1.5 py-1 text-label-sm text-fg-muted transition-colors hover:text-error"
        >
          <Icon name="delete_outline" size={17} />
          Delete / Archive Goal
        </button>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border-line px-4 py-2 text-label-sm text-fg-primary transition-colors hover:border-fg-primary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!canSave}
            className="rounded-lg bg-fg-primary px-4 py-2 text-label-sm font-medium text-bg-canvas transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save Adjustments
          </button>
        </div>
      </div>
    </Modal>
  )
}
