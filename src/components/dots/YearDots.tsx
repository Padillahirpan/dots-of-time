import { useEffect, useRef, useState } from 'react'
import { dayFraction, daysInYear } from '../../lib/time'
import { yearDotLabel } from '../../lib/format'
import { Dot } from './Dot'
import { DateTip } from './DateTip'

interface Tip {
  label: string
  x: number
  y: number
}

/** 365 (or 366) dots. Hover, focus, or tap a dot for its day tooltip. */
export function YearDots({ now }: { now: Date }) {
  const y = now.getFullYear()
  const count = daysInYear(y)
  const containerRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<number | undefined>(undefined)
  const [tip, setTip] = useState<Tip | null>(null)

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  const show = (label: string, el: HTMLButtonElement) => {
    const r = el.getBoundingClientRect()
    const c = containerRef.current?.getBoundingClientRect()
    setTip({
      label,
      x: r.left - (c?.left ?? 0) + r.width / 2,
      y: r.top - (c?.top ?? 0),
    })
  }

  const hideSoon = () => {
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => setTip(null), 1200)
  }

  return (
    <div ref={containerRef} className="relative py-1 select-none">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(13px,1fr))] gap-[5px]">
        {Array.from({ length: count }, (_, i) => {
          const doy = i + 1
          const date = new Date(y, 0, doy)
          const fraction = dayFraction(now, y, 0, doy)
          const state: 'Passed' | 'Today' | 'Open' =
            fraction >= 1 ? 'Passed' : fraction > 0 ? 'Today' : 'Open'
          const label = yearDotLabel(doy, date, state)
          return (
            <Dot
              key={doy}
              interactive
              fraction={fraction}
              ariaLabel={label}
              title={label}
              delayMs={(i / (count - 1)) * 600}
              className="z-0 aspect-square w-full transition-transform hover:scale-125 data-current:z-10"
              onClick={(e) => show(label, e.currentTarget)}
              onPointerEnter={(e) => show(label, e.currentTarget)}
              onPointerLeave={hideSoon}
              onFocus={(e) => show(label, e.currentTarget)}
              onBlur={hideSoon}
            />
          )
        })}
      </div>
      {tip && <DateTip label={tip.label} anchor={{ x: tip.x, y: tip.y }} />}
    </div>
  )
}
