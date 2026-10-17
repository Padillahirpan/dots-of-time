import { AREA_CAP, AREA_ICON, AREA_THEME, AREA_VAR } from '../../lib/areas'
import { parentScaleName } from '../../lib/keys'
import { SCALE_ADJ } from '../../lib/format'
import { AREA_LABELS, type Area, type Scale, type Win } from '../../types'
import { Icon } from '../Icon'
import { WinAdd } from '../Wins/WinAdd'
import { Modal } from './Modal'

interface InspectDialogProps {
  area: Area
  scale: Scale
  now: Date
  /** wins of this area in the current period */
  wins: Win[]
  /** wins of the next larger scale, for cascade labels */
  parents: Win[]
  onClose: () => void
  onAdjust: (win: Win) => void
  onToggleDone: (id: string) => void
  onArchiveDone: () => void
}

/** Per-area goal inspection: list, quick done toggle, adjust entry, add form. */
export function InspectDialog({
  area,
  scale,
  now,
  wins,
  parents,
  onClose,
  onAdjust,
  onToggleDone,
  onArchiveDone,
}: InspectDialogProps) {
  const t = AREA_THEME[area]
  const label = AREA_LABELS[area]
  const done = wins.filter((w) => w.done).length
  const pct = Math.round((done / AREA_CAP) * 100)
  const parentName = parentScaleName(scale)
  const parentById = new Map(parents.map((w) => [w.id, w]))

  return (
    <Modal label={`${label} goals inspection`} onClose={onClose}>
      {/* liquid mini progress bar */}
      <div className="relative h-1 w-full bg-border-line/30">
        <div
          className={`h-full transition-all duration-500 ${t.bar}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* header */}
      <div className="flex items-start justify-between border-b border-border-line/80 px-6 pt-5 pb-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border-line bg-surface-container-low ${t.text}`}
          >
            <Icon name={AREA_ICON[area]} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-headline-sm font-medium tracking-tight text-fg-primary">
                {label} {SCALE_ADJ[scale]} Goals &amp; Status
              </h2>
              <span className="rounded-full border border-border-line bg-surface-container px-2 py-0.5 text-caption text-fg-muted">
                Slot {wins.length} of {AREA_CAP}
              </span>
            </div>
            <p className="mt-0.5 text-label-sm text-fg-muted">
              {done} of {AREA_CAP} completed · {pct}% fluid volume fulfilled
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-transparent text-fg-muted transition-colors hover:border-border-line hover:bg-bg-canvas hover:text-fg-primary"
        >
          <Icon name="close" size={18} />
        </button>
      </div>

      {/* body */}
      <div className="max-h-[calc(85vh-190px)] space-y-4 overflow-y-auto p-6">
        <div className="flex items-center justify-between pb-1">
          <span className="text-caption font-medium tracking-wider text-fg-muted uppercase">
            Active Commitments (Rule of Three)
          </span>
          <span className={`text-caption font-medium ${t.text}`}>
            Capacity {wins.length}/{AREA_CAP}
          </span>
        </div>

        <div className="space-y-3">
          {wins.length === 0 && (
            <p className="rounded-lg border border-border-line bg-bg-canvas p-3.5 text-caption text-fg-muted">
              No goals in this dimension yet. Add up to three below.
            </p>
          )}
          {wins.map((w) => (
            <GoalRow
              key={w.id}
              win={w}
              area={area}
              parentName={parentName}
              parentTitle={w.parentId ? parentById.get(w.parentId)?.title : undefined}
              onToggleDone={() => onToggleDone(w.id)}
              onAdjust={() => onAdjust(w)}
            />
          ))}
        </div>

        {wins.length >= AREA_CAP ? (
          <div className="flex items-start gap-2.5 rounded-lg border border-border-line bg-bg-canvas p-3">
            <Icon name="info" size={18} className={`mt-0.5 shrink-0 ${t.text}`} />
            <p className="text-caption leading-relaxed text-fg-muted">
              <strong className="font-medium text-fg-primary">
                Capacity limit reached ({wins.length} of {AREA_CAP} active goals).
              </strong>{' '}
              The Rule of Three enforces singular focus. Complete or archive an existing
              item to add another.
            </p>
          </div>
        ) : (
          <WinAdd
            scale={scale}
            now={now}
            parents={parents}
            defaultArea={area}
            index={wins.length + 1}
          />
        )}
      </div>

      {/* footer */}
      <div className="flex items-center justify-between gap-3 border-t border-border-line bg-bg-canvas/50 px-6 py-4">
        <button
          type="button"
          onClick={onArchiveDone}
          disabled={done === 0}
          className="flex items-center gap-1.5 py-1 text-caption text-fg-muted transition-colors hover:text-fg-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon name="archive" size={16} />
          Archive Completed
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 rounded-lg bg-fg-primary px-4 py-2 text-label-sm font-medium text-bg-canvas transition-colors hover:opacity-90"
        >
          <Icon name="check" size={16} />
          Done
        </button>
      </div>
    </Modal>
  )
}

interface GoalRowProps {
  win: Win
  area: Area
  parentName: string | null
  parentTitle?: string
  onToggleDone: () => void
  onAdjust: () => void
}

function GoalRow({ win, area, parentName, parentTitle, onToggleDone, onAdjust }: GoalRowProps) {
  const t = AREA_THEME[area]
  const progress = win.done ? 100 : win.progress ?? 0
  const cascade =
    parentTitle && parentName ? (
      <span className="truncate">
        Cascaded to {parentName}: <span className="text-fg-primary/80">{parentTitle}</span>
      </span>
    ) : null

  return (
    <div
      className={`rounded-lg border p-3.5 transition-colors ${
        win.done
          ? 'border-border-line bg-bg-canvas/50'
          : `border-border-line bg-surface-panel ring-1 ${t.ring}`
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          aria-pressed={win.done}
          aria-label={
            win.done ? `Mark “${win.title}” as not done` : `Mark “${win.title}” as done`
          }
          onClick={onToggleDone}
          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-transform active:scale-90"
          style={
            win.done
              ? { background: AREA_VAR[area] }
              : { border: `2px solid ${AREA_VAR[area]}`, background: 'transparent' }
          }
        >
          {win.done ? (
            <Icon name="check" size={14} className="text-on-primary font-bold" />
          ) : (
            <span
              className={`h-1.5 w-1.5 rounded-full opacity-40 ${t.dot}`}
              aria-hidden="true"
            />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-body-md font-medium break-words ${
                win.done ? 'text-fg-muted line-through decoration-fg-muted/60' : 'text-fg-primary'
              }`}
            >
              {win.title}
            </span>
            {win.one && (
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${t.chipBg} ${t.chipBorder} ${t.text}`}
              >
                <Icon name="star" size={12} fill />
                The One
              </span>
            )}
          </div>

          {!win.done && progress > 0 && (
            <>
              <span
                className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${t.chipBg} ${t.chipBorder} ${t.text}`}
              >
                <span className={`h-1.5 w-1.5 animate-pulse rounded-full ${t.dot}`} />
                In progress · {progress}%
              </span>
              <div className="my-2 h-1.5 w-full overflow-hidden rounded-full bg-border-line/40">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${t.bar}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          )}

          {(win.note || cascade) && (
            <p className="mt-1 flex flex-wrap items-center gap-1.5 text-caption text-fg-muted">
              {win.note && <span className="truncate">{win.note}</span>}
              {win.note && cascade && <span aria-hidden="true">·</span>}
              {cascade}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onAdjust}
          className="shrink-0 rounded border border-border-line bg-surface-panel px-2.5 py-1 text-caption text-fg-muted transition-colors hover:border-fg-primary hover:text-fg-primary"
        >
          Adjust
        </button>
      </div>
    </div>
  )
}
