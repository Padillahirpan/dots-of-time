interface DateTipProps {
  label: string
  /** position relative to the grid container */
  anchor: { x: number; y: number }
}

/** Small tooltip above a year dot, e.g. "Day 289 · Fri, Oct 16 (Today)". */
export function DateTip({ label, anchor }: DateTipProps) {
  return (
    <div
      role="status"
      style={{ left: anchor.x, top: anchor.y }}
      className="date-tip pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[calc(100%+8px)] rounded bg-inverse-surface px-2.5 py-1 text-caption whitespace-nowrap text-inverse-on-surface"
    >
      {label}
    </div>
  )
}
