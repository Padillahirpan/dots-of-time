import { dayFraction, daysInMonth, monthPadStart } from '../../lib/time'
import { monthDayLabel, weekday2 } from '../../lib/format'
import { Dot, PadCell } from './Dot'

/** Calendar matrix: 7 columns, Monday-aligned, with adjacent-month padding. */
export function MonthDots({ now }: { now: Date }) {
  const y = now.getFullYear()
  const m = now.getMonth()
  const count = daysInMonth(y, m)
  const pad = monthPadStart(y, m)
  const endPad = (7 - ((pad + count) % 7)) % 7

  // day numbers of the adjacent month cells
  const prevMonthDays = daysInMonth(y, m - 1)
  const prevLabels = Array.from({ length: pad }, (_, i) => String(prevMonthDays - pad + i + 1))
  const nextLabels = Array.from({ length: endPad }, (_, i) => String(i + 1))

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mb-3 grid w-full max-w-[340px] grid-cols-7 gap-2.5 text-center text-caption text-fg-muted">
        {Array.from({ length: 7 }, (_, i) => (
          <span key={i}>{weekday2(new Date(2024, 0, i + 1))}</span>
        ))}
      </div>
      <div className="grid w-full max-w-[340px] grid-cols-7 items-center justify-items-center gap-2.5">
        {prevLabels.map((label, i) => (
          <PadCell key={`p-${i}`} label={label} />
        ))}
        {Array.from({ length: count }, (_, i) => {
          const day = i + 1
          return (
            <Dot
              key={day}
              fraction={dayFraction(now, y, m, day)}
              label={String(day)}
              sizeClass="w-9 h-9"
              ariaLabel={monthDayLabel(now, day)}
              title={monthDayLabel(now, day)}
              delayMs={(i / (count - 1)) * 420}
            />
          )
        })}
        {nextLabels.map((label, i) => (
          <PadCell key={`n-${i}`} label={label} />
        ))}
      </div>
    </div>
  )
}
