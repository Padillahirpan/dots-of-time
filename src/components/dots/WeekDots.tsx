import { dayFraction, mondayOf } from '../../lib/time'
import { weekday2, weekDayTitle } from '../../lib/format'
import { Dot } from './Dot'

/** 7 large day dots, Monday first, with weekday and status labels. */
export function WeekDots({ now }: { now: Date }) {
  const monday = mondayOf(now)
  const days = Array.from(
    { length: 7 },
    (_, i) => new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i),
  )

  return (
    <div className="mx-auto grid max-w-[560px] grid-cols-7 gap-[10px] py-2">
      {days.map((d, i) => {
        const today = d.toDateString() === now.toDateString()
        const fraction = dayFraction(now, d.getFullYear(), d.getMonth(), d.getDate())
        const state = today ? 'today' : fraction >= 1 ? 'passed' : 'open'
        return (
          <div key={+d} className="group flex flex-col items-center gap-2">
            <span
              className={`text-caption transition-colors ${
                today
                  ? 'font-medium text-cat-career'
                  : 'text-fg-muted group-hover:text-fg-primary'
              }`}
            >
              {weekday2(d)}
            </span>
            <Dot
              fraction={fraction}
              label={String(d.getDate())}
              sizeClass="w-11 h-11 sm:w-12 sm:h-12"
              ariaLabel={weekDayTitle(d, today ? 'Today' : fraction >= 1 ? 'Passed' : 'Open')}
              title={weekDayTitle(d, today ? 'Today' : fraction >= 1 ? 'Passed' : 'Open')}
              delayMs={(i / 6) * 320}
              className="transition-transform group-hover:scale-105"
            />
            <span
              className={`text-[11px] ${
                today ? 'font-medium text-cat-career' : 'text-fg-muted'
              }`}
            >
              {state}
            </span>
          </div>
        )
      })}
    </div>
  )
}
