interface PeriodHeaderProps {
  variant: 'card' | 'plain'
  eyebrow?: string
  /** optional badge next to the headline, e.g. "Q4 · Autumn" */
  badge?: string
  headline: string
  subline?: string
  sublineTone?: 'caption' | 'body'
  /** pre-formatted percent string, e.g. "60.4%" */
  percent: string
  percentLabel: string
}

/** Time header: eyebrow, headline, subline, and the big percent readout. */
export function PeriodHeader({
  variant,
  eyebrow,
  badge,
  headline,
  subline,
  sublineTone = 'caption',
  percent,
  percentLabel,
}: PeriodHeaderProps) {
  const left = (
    <div className="min-w-0">
      {eyebrow && (
        <div className="mb-1 flex items-center gap-1.5 text-caption font-medium tracking-wider text-fg-muted uppercase">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cat-career" />
          <span>{eyebrow}</span>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-headline-sm font-medium tracking-tight text-fg-primary">{headline}</h1>
        {badge && (
          <span className="inline-flex items-center rounded border border-border-line bg-surface-panel px-2 py-0.5 text-caption text-fg-muted">
            {badge}
          </span>
        )}
      </div>
      {subline && (
        <p
          className={`mt-0.5 ${
            sublineTone === 'body' ? 'text-body-md text-pretty' : 'text-caption'
          } text-fg-muted`}
        >
          {subline}
        </p>
      )}
    </div>
  )

  const right = (
    <div className="flex w-full flex-col items-baseline justify-between border-t border-border-line pt-3 sm:w-auto sm:flex-col sm:items-end sm:border-t-0 sm:pt-0 sm:text-right">
      <div className="text-display-percent font-medium tracking-tight text-fg-primary tabular-nums">
        {percent}
      </div>
      <div className="text-caption text-fg-muted">{percentLabel}</div>
    </div>
  )

  if (variant === 'card') {
    return (
      <section className="flex flex-col justify-between gap-4 rounded-3xl bg-surface-panel p-5 sm:flex-row sm:items-center">
        {left}
        {right}
      </section>
    )
  }

  return (
    <section className="flex flex-col justify-between gap-4 border-b border-border-line pb-6 pt-1 sm:flex-row sm:items-end">
      {left}
      {right}
    </section>
  )
}
