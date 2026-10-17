import { CATEGORY_META, CATEGORY_THEME } from '../../lib/categories'
import type { Win } from '../../types'
import { Icon } from '../Icon'
import { LiquidWave } from './LiquidWave'

interface SlotCardProps {
  /** 1-based slot number */
  slot: number
  win: Win | null
  /** tank variant is the day screen; flat is week/month/year */
  variant: 'tank' | 'flat'
  /** completed goals over the three slots, 0..100 */
  pct: number
  doneCount: number
  /** e.g. "Month" for "Linked to Month: …"; null hides the link note */
  parentName: string | null
  linkedTitle?: string
  onInspect: () => void
}

/** One of the three period slots, drawn as a liquid reservoir. */
export function SlotCard({
  slot,
  win,
  variant,
  pct,
  doneCount,
  parentName,
  linkedTitle,
  onInspect,
}: SlotCardProps) {
  // empty slot: a dashed invite
  if (!win) {
    return (
      <button
        type="button"
        onClick={onInspect}
        aria-label={`Add goal for slot ${slot}`}
        className="flex min-h-[210px] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border-line bg-surface-panel/40 p-4 text-center transition-colors hover:border-fg-primary/50"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border-line text-fg-muted">
          <Icon name="add" />
        </span>
        <span className="text-label-sm font-medium text-fg-primary">Empty slot</span>
        <span className="text-caption text-fg-muted">
          Add a goal from an unused category · Slot {slot} of 3
        </span>
      </button>
    )
  }

  const t = CATEGORY_THEME[win.category]
  const meta = CATEGORY_META[win.category]

  const anchorTag = win.one ? (
    <div className={`mb-1 flex items-center gap-1 text-[11px] font-medium tracking-wide uppercase ${t.text}`}>
      <Icon name="star" size={14} fill />
      <span>The One · Anchor Goal</span>
    </div>
  ) : (
    <div className="mb-1 flex items-center gap-1 text-[11px] font-medium tracking-wide uppercase text-fg-muted">
      <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />
      <span>Slot {slot} · {meta.label}</span>
    </div>
  )

  const linkNote =
    linkedTitle &&
    parentName &&
    (variant === 'tank' ? (
      <p className="mt-2 flex items-center gap-1 text-caption text-fg-muted">
        <Icon name="link" size={14} />
        Linked: <span className="text-fg-primary">{linkedTitle}</span>
      </p>
    ) : (
      <p className="mt-2 text-caption text-fg-muted">
        Linked to {parentName}: <span className="text-fg-primary">{linkedTitle}</span>
      </p>
    ))

  const footer = (
    <div className="relative z-10 mt-5 border-t border-border-line pt-3">
      {variant === 'flat' && (
        <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-container">
          <div className={`h-full rounded-full ${t.bar}`} style={{ width: `${pct}%` }} />
        </div>
      )}
      <div className="flex items-center justify-between text-caption">
        <span className={win.done ? `${t.text} font-medium` : 'text-fg-muted'}>
          {doneCount} of 3 completed
        </span>
        <button
          type="button"
          onClick={onInspect}
          className={`inline-flex items-center gap-0.5 font-medium hover:underline ${t.text}`}
        >
          Inspect <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  )

  if (variant === 'tank') {
    return (
      <article
        className={`relative flex flex-col justify-between overflow-hidden rounded-xl border border-border-line bg-surface-panel transition-colors ${t.hoverBorder}`}
      >
        <div className="relative h-28 overflow-hidden border-b border-border-line bg-surface-container-low">
          <div
            className={`absolute inset-x-0 bottom-0 border-t ${t.strongBorder} ${t.liquidBgStrong} transition-all duration-500`}
            style={{ height: `${pct}%` }}
          >
            <LiquidWave fill={t.waveFill} />
          </div>
          <div className="relative z-10 flex items-start justify-between p-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border border-border-line bg-surface-panel/90 px-2 py-0.5 text-caption font-medium ${t.text}`}
            >
              <Icon name={meta.icon} size={14} />
              {meta.label}
            </span>
            <span className="flex items-center gap-1">
              {win.done && <Icon name="check_circle" size={18} className={t.text} fill />}
              <span className={`text-headline-sm font-medium tabular-nums ${t.text}`}>{pct}%</span>
            </span>
          </div>
          <div className="absolute right-3 bottom-2 text-caption font-medium text-fg-muted">
            <span className="rounded border border-border-line bg-surface-panel/85 px-1.5 py-0.5">
              Slot {slot} of 3
            </span>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between p-4">
          <div>
            {anchorTag}
            <h3 className="text-body-md font-medium leading-snug text-fg-primary">{win.title}</h3>
            {linkNote}
          </div>
          {footer}
        </div>
      </article>
    )
  }

  return (
    <article
      className={`relative flex min-h-[210px] flex-col justify-between overflow-hidden rounded-xl border border-border-line bg-surface-panel p-4 transition-colors ${t.hoverBorder}`}
    >
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 border-t ${t.liquidBorder} ${t.liquidBg} transition-all duration-500`}
        style={{ height: `${pct}%` }}
      >
        <LiquidWave fill={t.waveFill} />
      </div>

      <div className="relative z-10">
        <div className="mb-3 flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1.5 ${t.text} text-label-sm font-medium`}
          >
            <Icon name={meta.icon} size={15} />
            {meta.label}
          </span>
          <span
            className={`rounded-full border px-2 py-0.5 text-caption font-medium tabular-nums ${t.chipBg} ${t.chipBorder} ${t.text}`}
          >
            {pct}%
          </span>
        </div>
        {anchorTag}
        <h3 className="line-clamp-2 text-body-md font-medium leading-snug text-fg-primary">
          {win.title}
        </h3>
        {linkNote}
      </div>

      {footer}
    </article>
  )
}
