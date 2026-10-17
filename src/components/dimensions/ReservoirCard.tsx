import { AREA_THEME, type AreaStat } from '../../lib/areas'
import { AREA_LABELS, type Area } from '../../types'
import { Icon } from '../Icon'
import { LiquidWave } from './LiquidWave'

interface ReservoirCardProps {
  area: Area
  stat: AreaStat
  /** tank variant is the day screen; flat is week/month/year */
  variant: 'tank' | 'flat'
  /** e.g. "Month" for "Linked to Month: …"; null hides the link note */
  parentName: string | null
  linkedTitle?: string
  onInspect: () => void
}

/** Liquid reservoir card for one dimension (Career, Life & Vitality, Money). */
export function ReservoirCard({
  area,
  stat,
  variant,
  parentName,
  linkedTitle,
  onInspect,
}: ReservoirCardProps) {
  const t = AREA_THEME[area]
  const label = AREA_LABELS[area]
  const pct = stat.pct
  const full = stat.done >= 3

  const anchorTag = stat.one ? (
    <div className={`mb-1 flex items-center gap-1 text-[11px] font-medium tracking-wide uppercase ${t.text}`}>
      <Icon name="star" size={14} fill />
      <span>The One · Anchor Goal</span>
    </div>
  ) : stat.primary ? (
    <div className="mb-1 flex items-center gap-1 text-[11px] font-medium tracking-wide uppercase text-fg-muted">
      <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />
      <span>Primary Anchor</span>
    </div>
  ) : null

  const title = stat.primary?.title ?? 'No goals yet'

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
        <span className={full ? `${t.text} font-medium` : 'text-fg-muted'}>
          {stat.done} of 3 completed
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
              <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />
              {label}
            </span>
            <span className="flex items-center gap-1">
              {full && <Icon name="check_circle" size={18} className={t.text} fill />}
              <span className={`text-headline-sm font-medium tabular-nums ${t.text}`}>{pct}%</span>
            </span>
          </div>
          <div className="absolute right-3 bottom-2 text-caption font-medium text-fg-muted">
            {full ? (
              <span className="rounded border border-border-line bg-surface-panel/85 px-1.5 py-0.5">
                Capacity reached
              </span>
            ) : (
              <span className={t.text}>
                {stat.done} of 3 units
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between p-4">
          <div>
            {anchorTag}
            <h3 className="text-body-md font-medium leading-snug text-fg-primary">{title}</h3>
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
          <div className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${t.dot}`} />
            <span className="text-label-sm font-medium text-fg-primary">{label}</span>
          </div>
          <span
            className={`rounded-full border px-2 py-0.5 text-caption font-medium tabular-nums ${t.chipBg} ${t.chipBorder} ${t.text}`}
          >
            {pct}%
          </span>
        </div>
        {anchorTag}
        <h3 className="line-clamp-2 text-body-md font-medium leading-snug text-fg-primary">
          {title}
        </h3>
        {linkNote}
      </div>

      {footer}
    </article>
  )
}
