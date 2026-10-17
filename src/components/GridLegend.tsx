export interface LegendItem {
  /** full class list for the swatch, e.g. "bg-area-career" */
  swatch: string
  label: string
  strong?: boolean
}

interface GridLegendProps {
  items: LegendItem[]
  /** right-aligned extra, e.g. "52 Weeks Completed" */
  footer?: string
}

/** Flat legend row under a cadence grid. */
export function GridLegend({ items, footer }: GridLegendProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-caption text-fg-muted">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {items.map((item) => (
          <span key={item.label} className="inline-flex items-center gap-1.5">
            <span className={`inline-block h-2.5 w-2.5 rounded-full ${item.swatch}`} />
            <span className={item.strong ? 'font-medium text-fg-primary' : undefined}>
              {item.label}
            </span>
          </span>
        ))}
      </div>
      {footer && <span className="tabular-nums">{footer}</span>}
    </div>
  )
}
