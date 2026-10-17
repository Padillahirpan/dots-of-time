import { dotFraction, progress } from '../../lib/time'
import { Dot } from './Dot'

const pad = (n: number) => String(n).padStart(2, '0')

const ROWS: readonly number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
]

/** 24 dots in two rows of 12, one per hour, with hour tick labels. */
export function DayDots({ now }: { now: Date }) {
  const p = progress('d', now)

  return (
    <div className="space-y-4">
      {ROWS.map((hours, ri) => (
        <div key={ri}>
          <div className="mb-1.5 grid grid-cols-12 gap-2 text-center text-caption text-fg-muted">
            {hours.map((h) => (
              <span key={h}>{pad(h)}</span>
            ))}
          </div>
          <div className="grid grid-cols-12 items-center gap-2">
            {hours.map((h) => (
              <Dot
                key={h}
                fraction={dotFraction(p, 24, h)}
                ariaLabel={`${pad(h)}:00`}
                title={`${pad(h)}:00`}
                className="aspect-square transition-transform hover:scale-110"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
