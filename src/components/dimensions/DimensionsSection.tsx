import { useEffect, useRef, useState } from 'react'
import { periodStats } from '../../lib/categories'
import { parentKey, parentScaleName, periodKey } from '../../lib/keys'
import { SCALE_ADJ } from '../../lib/format'
import { useWinsStore } from '../../store/useWinsStore'
import type { Scale, Win } from '../../types'
import { Icon } from '../Icon'
import { Toast } from '../Toast'
import { SlotCard } from './SlotCard'
import { AdjustDialog, type AdjustPatch } from '../dialogs/AdjustDialog'
import { InspectDialog } from '../dialogs/InspectDialog'

interface DimensionsSectionProps {
  scale: Scale
  now: Date
}

interface Removed {
  win: Win
  index: number
}

const UNDO_WINDOW_MS = 6000

/** The three slots: one goal each, every goal in a different category. */
export function DimensionsSection({ scale, now }: DimensionsSectionProps) {
  const key = periodKey(scale, now)
  const pk = parentKey(scale, now)
  const list = useWinsStore((s) => s.byPeriod[key]) ?? []
  const parents = useWinsStore((s) => s.byPeriod[pk ?? '']) ?? []
  const remove = useWinsStore((s) => s.remove)
  const insert = useWinsStore((s) => s.insert)
  const update = useWinsStore((s) => s.update)
  const toggleDone = useWinsStore((s) => s.toggleDone)
  const setOne = useWinsStore((s) => s.setOne)

  const [inspectSlot, setInspectSlot] = useState<number | null>(null)
  const [adjustId, setAdjustId] = useState<string | null>(null)
  const [removed, setRemoved] = useState<Removed | null>(null)
  const undoTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(undoTimer.current), [])

  // removals are destructive, so they come with an undo window
  const handleRemove = (id: string) => {
    const index = list.findIndex((w) => w.id === id)
    if (index === -1) return
    const win = list[index]
    remove(key, id)
    setRemoved({ win, index })
    window.clearTimeout(undoTimer.current)
    undoTimer.current = window.setTimeout(() => setRemoved(null), UNDO_WINDOW_MS)
    setAdjustId(null)
    setInspectSlot(null)
  }

  const undo = () => {
    if (!removed) return
    insert(key, removed.index, removed.win)
    setRemoved(null)
    window.clearTimeout(undoTimer.current)
  }

  const handleSaveAdjust = (id: string, patch: AdjustPatch, one: boolean) => {
    update(key, id, patch)
    const current = list.find((w) => w.id === id)
    if (current && one !== current.one) setOne(key, id)
  }

  const stats = periodStats(list)
  const parentById = new Map(parents.map((w) => [w.id, w]))
  const parentName = parentScaleName(scale)
  const variant = scale === 'd' ? 'tank' : 'flat'

  const adjustWin = adjustId ? list.find((w) => w.id === adjustId) : undefined
  const adjustSlot = adjustWin
    ? Math.min(list.findIndex((w) => w.id === adjustWin.id) + 1, 3)
    : 0
  const usedElsewhere = (c: Win['category']) =>
    list.some((w) => w.id !== adjustWin?.id && w.category === c)

  return (
    <section aria-label="Your three" className="flex flex-col gap-3">
      <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
        <div>
          <h2 className="text-headline-sm font-medium text-fg-primary">Your three</h2>
          <p className="text-caption text-fg-muted">
            {SCALE_ADJ[scale]} · one goal per category · Rule of Three
          </p>
        </div>
        <span className="hidden text-caption text-fg-muted sm:inline">
          Tap any slot to inspect
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {stats.slots.map((win, i) => (
          <SlotCard
            key={i}
            slot={i + 1}
            win={win}
            variant={variant}
            pct={stats.pct}
            doneCount={stats.done}
            parentName={parentName}
            linkedTitle={
              win?.parentId ? parentById.get(win.parentId)?.title : undefined
            }
            onInspect={() => setInspectSlot(i)}
          />
        ))}
      </div>

      {stats.overflow.length > 0 && (
        <div className="flex items-start gap-2.5 rounded-lg border border-border-line bg-bg-canvas p-3">
          <Icon name="info" size={18} className="mt-0.5 shrink-0 text-fg-muted" />
          <div className="flex-1 space-y-1.5">
            <p className="text-caption text-fg-muted">
              {stats.overflow.length} goal{stats.overflow.length > 1 ? 's' : ''} beyond the
              three-slot limit (kept from earlier data). Remove to tidy up:
            </p>
            {stats.overflow.map((w) => (
              <div key={w.id} className="flex items-center justify-between gap-2">
                <span className="min-w-0 flex-1 truncate text-caption text-fg-primary">
                  {w.title}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(w.id)}
                  aria-label={`Remove “${w.title}”`}
                  className="shrink-0 rounded border border-border-line px-2 py-0.5 text-caption text-fg-muted transition-colors hover:border-fg-primary hover:text-fg-primary"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {removed && (
        <Toast
          message={`Removed “${removed.win.title}”.`}
          action={
            <button
              type="button"
              onClick={undo}
              className="shrink-0 font-medium underline underline-offset-2 hover:opacity-80"
            >
              Undo
            </button>
          }
        />
      )}

      {inspectSlot !== null && !adjustWin && (
        <InspectDialog
          slot={inspectSlot + 1}
          scale={scale}
          now={now}
          win={stats.slots[inspectSlot]}
          allWins={list}
          pct={stats.pct}
          doneCount={stats.done}
          parents={parents}
          onClose={() => setInspectSlot(null)}
          onAdjust={(win) => setAdjustId(win.id)}
          onToggleDone={(id) => toggleDone(key, id)}
        />
      )}

      {adjustWin && (
        <AdjustDialog
          win={adjustWin}
          slot={adjustSlot}
          scale={scale}
          now={now}
          parents={parents}
          usedElsewhere={usedElsewhere}
          onSave={(patch, one) => handleSaveAdjust(adjustWin.id, patch, one)}
          onDelete={() => handleRemove(adjustWin.id)}
          onClose={() => setAdjustId(null)}
        />
      )}
    </section>
  )
}
