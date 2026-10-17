import { CATEGORY_META, CATEGORY_THEME, CATEGORY_VAR, PERIOD_CAP } from '../../lib/categories'
import { parentScaleName } from '../../lib/keys'
import { SCALE_ADJ } from '../../lib/format'
import type { Scale, Win } from '../../types'
import { Icon } from '../Icon'
import { WinAdd } from '../Wins/WinAdd'
import { Modal } from './Modal'

interface InspectDialogProps {
  /** 1-based slot number */
  slot: number
  scale: Scale
  now: Date
  /** the goal in this slot, null = empty */
  win: Win | null
  /** all wins of the period, for category availability */
  allWins: Win[]
  /** completed goals over the three slots, 0..100 */
  pct: number
  doneCount: number
  /** wins of the next larger scale, for cascade labels */
  parents: Win[]
  onClose: () => void
  onAdjust: (win: Win) => void
  onToggleDone: (id: string) => void
}

/** Slot inspection: view one goal, or create one in an empty slot. */
export function InspectDialog({
  slot,
  scale,
  now,
  win,
  allWins,
  pct,
  doneCount,
  parents,
  onClose,
  onAdjust,
  onToggleDone,
}: InspectDialogProps) {
  const parentName = parentScaleName(scale)
  const parent = win?.parentId ? parents.find((w) => w.id === win.parentId) : undefined
  const used = new Set(allWins.map((w) => w.category))
  const available = (['health', 'family', 'career', 'money', 'growth', 'play'] as const).filter(
    (c) => !used.has(c),
  )

  const meta = win ? CATEGORY_META[win.category] : null
  const t = win ? CATEGORY_THEME[win.category] : null

  return (
    <Modal label={`Slot ${slot} inspection`} onClose={onClose}>
      {/* liquid mini progress bar */}
      <div className="relative h-1 w-full bg-border-line/30">
        <div
          className={`h-full transition-all duration-500 ${t ? t.bar : 'bg-fg-muted/40'}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* header */}
      <div className="flex items-start justify-between border-b border-border-line/80 px-6 pt-5 pb-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border-line bg-surface-container-low ${
              t ? t.text : 'text-fg-muted'
            }`}
          >
            <Icon name={meta ? meta.icon : 'add'} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-headline-sm font-medium tracking-tight text-fg-primary">
                {meta ? `${meta.label} ${SCALE_ADJ[scale]} Goal` : `Slot ${slot} · Add a Goal`}
              </h2>
              <span className="rounded-full border border-border-line bg-surface-container px-2 py-0.5 text-caption text-fg-muted">
                Slot {slot} of {PERIOD_CAP}
              </span>
            </div>
            <p className="mt-0.5 text-label-sm text-fg-muted">
              {doneCount} of {PERIOD_CAP} completed · {pct}% period fulfilled
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

      {/* body: single goal, or create form */}
      <div className="max-h-[calc(85vh-190px)] space-y-4 overflow-y-auto p-6">
        {win && t ? (
          <>
            <div
              className={`rounded-lg border p-3.5 transition-colors ${
                win.done
                  ? 'border-border-line bg-bg-canvas/50'
                  : `bg-surface-panel ring-1 ${t.ring} border-border-line`
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  aria-pressed={win.done}
                  aria-label={
                    win.done ? `Mark “${win.title}” as not done` : `Mark “${win.title}” as done`
                  }
                  onClick={() => onToggleDone(win.id)}
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-transform active:scale-90"
                  style={
                    win.done
                      ? { background: CATEGORY_VAR[win.category] }
                      : { border: `2px solid ${CATEGORY_VAR[win.category]}`, background: 'transparent' }
                  }
                >
                  {win.done ? (
                    <Icon name="check" size={14} className="text-on-primary font-bold" />
                  ) : (
                    <span className={`h-1.5 w-1.5 rounded-full opacity-40 ${t.dot}`} aria-hidden="true" />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-body-md font-medium break-words ${
                        win.done
                          ? 'text-fg-muted line-through decoration-fg-muted/60'
                          : 'text-fg-primary'
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

                  {!win.done && (win.progress ?? 0) > 0 && (
                    <>
                      <span
                        className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${t.chipBg} ${t.chipBorder} ${t.text}`}
                      >
                        <span className={`h-1.5 w-1.5 animate-pulse rounded-full ${t.dot}`} />
                        In progress · {win.progress}%
                      </span>
                      <div className="my-2 h-1.5 w-full overflow-hidden rounded-full bg-border-line/40">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${t.bar}`}
                          style={{ width: `${win.progress}%` }}
                        />
                      </div>
                    </>
                  )}

                  {(win.note || parent) && (
                    <p className="mt-1 flex flex-wrap items-center gap-1.5 text-caption text-fg-muted">
                      {win.note && <span className="truncate">{win.note}</span>}
                      {win.note && parentName && <span aria-hidden="true">·</span>}
                      {parent && parentName && (
                        <span className="truncate">
                          Cascaded to {parentName}:{' '}
                          <span className="text-fg-primary/80">{parent.title}</span>
                        </span>
                      )}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onAdjust(win)}
                  className="shrink-0 rounded border border-border-line bg-surface-panel px-2.5 py-1 text-caption text-fg-muted transition-colors hover:border-fg-primary hover:text-fg-primary"
                >
                  Adjust
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-border-line bg-bg-canvas p-3">
              <Icon name="info" size={18} className={`mt-0.5 shrink-0 ${t.text}`} />
              <p className="text-caption leading-relaxed text-fg-muted">
                One goal per category keeps the {SCALE_ADJ[scale].toLowerCase()} three balanced
                across life domains.
              </p>
            </div>
          </>
        ) : (
          <>
            <p className="text-caption text-fg-muted">
              Each of your three goals lives in a different category — pick an unused one.
            </p>
            <WinAdd
              scale={scale}
              now={now}
              parents={parents}
              available={available}
              index={slot}
              onAdded={onClose}
            />
          </>
        )}
      </div>

      {/* footer */}
      <div className="flex items-center justify-end gap-2.5 border-t border-border-line bg-bg-canvas/50 px-6 py-4">
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
