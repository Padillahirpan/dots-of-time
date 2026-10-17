import { useEffect, useState } from 'react'

/** Ticking clock: every 30 s, plus an immediate tick when the tab is visible again. */
export function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const tick = () => setNow(new Date())
    const id = setInterval(tick, intervalMs)
    const vis = () => {
      if (!document.hidden) tick()
    }
    document.addEventListener('visibilitychange', vis)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', vis)
    }
  }, [intervalMs])
  return now
}
