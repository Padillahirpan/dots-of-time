import { useEffect, useRef, useState } from 'react'
import { areaStats, AREA_CAP } from '../../lib/areas'
import { parentKey, parentScaleName, periodKey } from '../../lib/keys'
import { useWinsStore } from '../../store/useWinsStore'
import { AREAS, type Area, type Scale, type Win } from '../../types'
import { Toast } from '../Toast'
import { AddDimensionButton } from './AddDimensionButton'
import { ReservoirCard } from './ReservoirCard'
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

const DIM_TITLE: Record<Scale, string> = {
  d: 'Daily',
  w: 'Weekly',
  m: 'Monthly',
  y: 'Annual',
}

const UNDO_WINDOW_MS = 6000

/** The three liquid reservoirs with inspect / adjust dialog flow. */
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

  const [inspectArea, setInspectArea] = useState<Area | null>(null)
  const [adjustId, setAdjustId] = useState<string | null>(null)
  const [batch, setBatch] = useState<Removed[] | null>(null)
  const [noticeKey, setNoticeKey] = useState(0)
  const undoTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(undoTimer.current), [])

  // removals are destructive, so they come with an undo window
  const startUndoWindow = (entries: Removed[]) => {
    setBatch(entries)
    window.clearTimeout(undoTimer.current)
    undoTimer.current = window.setTimeout(() => setBatch(null), UNDO_WINDOW_MS)
  }

  const handleRemove = (id: string) => {
    const index = list.findIndex((w) => w.id === id)
    if (index === -1) return
    const win = list[index]
    remove(key, id)
    startUndoWindow([{ win, index }])
    setAdjustId(null)
  }

  const archiveDone = (area: Area) => {
    const entries = list
      .map((win, index) => ({ win, index }))
      .filter((e) => e.win.area === area && e.win.done)
    if (entries.length === 0) return
    entries.forEach((e) => remove(key, e.win.id))
    startUndoWindow(entries)
  }

  const undo = () => {
    if (!batch) return
    batch.forEach(({ index, win }) => insert(key, index, win))
    setBatch(null)
    window.clearTimeout(undoTimer.current)
  }

  useEffect(() => {
    if (!noticeKey) return
    const t = window.setTimeout(() => setNoticeKey(0), 3000)
    return () => window.clearTimeout(t)
  }, [noticeKey])

  const handleSaveAdjust = (id: string, patch: AdjustPatch, one: boolean) => {
    update(key, id, patch)
    const current = list.find((w) => w.id === id)
    if (current && one !== current.one) setOne(key, id)
  }

  const stats = areaStats(list)
  const parentById = new Map(parents.map((w) => [w.id, w]))
  const parentName = parentScaleName(scale)
  const variant = scale === 'd' ? 'tank' : 'flat'
  const isAreaFull = (a: Area) => list.filter((w) => w.area === a).length >= AREA_CAP

  const adjustWin = adjustId ? list.find((w) => w.id === adjustId) : undefined
  const adjustSlot = adjustWin
    ? list.filter((w) => w.area === adjustWin.area).findIndex((w) => w.id === adjustWin.id) + 1
    : 0

  return (
    <section aria-label="Dimensions" className="flex flex-col gap-3">
      <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
        <div>
          <h2 className="text-headline-sm font-medium text-fg-primary">
            {DIM_TITLE[scale]} Dimensions
          </h2>
          <p className="text-caption text-fg-muted">
            Liquid capacity &amp; fulfillment pacing · Rule of Three (Cap 3 goals)
          </p>
        </div>
        <span className="hidden text-caption text-fg-muted sm:inline">
          Tap any reservoir to inspect
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {AREAS.map((area) => {
          const stat = stats[area]
          const linkedTitle = stat.primary?.parentId
            ? parentById.get(stat.primary.parentId)?.title
            : undefined
          return (
            <ReservoirCard
              key={area}
              area={area}
              stat={stat}
              variant={variant}
              parentName={parentName}
              linkedTitle={linkedTitle}
              onInspect={() => setInspectArea(area)}
            />
          )
        })}
      </div>

      <AddDimensionButton onClick={() => setNoticeKey((k) => k + 1)} />

      {noticeKey > 0 && (
        <Toast key={noticeKey} message="Custom dimensions arrive in a future update." />
      )}

      {batch && (
        <Toast
          message={
            batch.length === 1
              ? `Removed “${batch[0].win.title}”.`
              : `Archived ${batch.length} completed goals.`
          }
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

      {inspectArea !== null && !adjustWin && (
        <InspectDialog
          area={inspectArea}
          scale={scale}
          now={now}
          wins={stats[inspectArea].wins}
          parents={parents}
          onClose={() => setInspectArea(null)}
          onAdjust={(win) => setAdjustId(win.id)}
          onToggleDone={(id) => toggleDone(key, id)}
          onArchiveDone={() => archiveDone(inspectArea)}
        />
      )}

      {adjustWin && (
        <AdjustDialog
          win={adjustWin}
          slot={adjustSlot}
          scale={scale}
          now={now}
          parents={parents}
          isAreaFull={isAreaFull}
          onSave={(patch, one) => handleSaveAdjust(adjustWin.id, patch, one)}
          onDelete={() => handleRemove(adjustWin.id)}
          onClose={() => setAdjustId(null)}
        />
      )}
    </section>
  )
}
