import { useCallback, useEffect, useState } from 'react'
import { useNow } from './hooks/useNow'
import { useTheme } from './hooks/useTheme'
import { useShortcuts } from './hooks/useShortcuts'
import { useAppStore } from './store/useAppStore'
import { useWinsStore } from './store/useWinsStore'
import { areaStats } from './lib/areas'
import { periodKey } from './lib/keys'
import { TopNavBar } from './components/TopNavBar'
import { PeriodHeader } from './components/PeriodHeader'
import { CadenceGrid } from './components/CadenceGrid'
import { GridLegend, type LegendItem } from './components/GridLegend'
import { DayDots } from './components/dots/DayDots'
import { WeekDots } from './components/dots/WeekDots'
import { MonthDots } from './components/dots/MonthDots'
import { YearDots } from './components/dots/YearDots'
import { DimensionsSection } from './components/dimensions/DimensionsSection'
import { GuidanceCard } from './components/GuidanceCard'
import { SettingsPanel } from './components/SettingsPanel'
import { SiteFooter } from './components/SiteFooter'
import { Toast } from './components/Toast'
import {
  dayOfYear,
  daysInMonth,
  daysInYear,
  progress,
  weekOfYear,
  weeksInYear,
} from './lib/time'
import {
  monthShort,
  percent,
  periodEyebrow,
  periodHeadline,
  periodSubline,
  percentLabel,
  scaleCaption,
  yearBadge,
} from './lib/format'
import type { Scale } from './types'

const isScale = (v: string | null): v is Scale =>
  v === 'd' || v === 'w' || v === 'm' || v === 'y'

const GRID_TITLE: Record<Scale, string> = {
  d: 'Cadence Grid',
  w: 'Cadence Grid',
  m: 'Cadence Grid',
  y: '365-Day Cadence',
}

/** half-filled "current" legend swatch */
const CURRENT_SWATCH =
  'border border-area-career bg-[linear-gradient(90deg,var(--area-career)_50%,transparent_50%)]'

function Pill({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-border-line bg-surface-container px-2.5 py-1 text-caption whitespace-nowrap text-fg-muted">
      {children}
    </span>
  )
}

/** wins of the currently viewed period */
function usePeriodWins(view: Scale, now: Date) {
  const key = periodKey(view, now)
  return useWinsStore((s) => s.byPeriod[key]) ?? []
}

export default function App() {
  const now = useNow()
  const view = useAppStore((s) => s.view)
  const setView = useAppStore((s) => s.setView)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [helpKey, setHelpKey] = useState(0)
  useTheme()

  const showHelp = useCallback(() => setHelpKey((k) => k + 1), [])
  useShortcuts(setView, showHelp)

  // deep link: ?view=day wins over the remembered tab
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get('view')
    if (isScale(v)) setView(v)
  }, [setView])

  // the URL always reflects the active tab
  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('view', view)
    window.history.replaceState(null, '', url)
  }, [view])

  // auto-hide the shortcuts toast
  useEffect(() => {
    if (!helpKey) return
    const t = window.setTimeout(() => setHelpKey(0), 5000)
    return () => window.clearTimeout(t)
  }, [helpKey])

  const p = progress(view, now)
  const list = usePeriodWins(view, now)
  const stats = areaStats(list)

  const pill = (() => {
    switch (view) {
      case 'd':
        return <Pill>{`Hour ${now.getHours()} Active`}</Pill>
      case 'w':
        return <Pill>{`Week ${weekOfYear(now)} of ${weeksInYear(now.getFullYear())}`}</Pill>
      case 'm':
        return null
      case 'y':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border-line bg-bg-canvas px-2.5 py-1 text-caption whitespace-nowrap text-fg-primary">
            <span className="h-2 w-2 rounded-full bg-area-career" />
            Current: Day {dayOfYear(now)} ({monthShort(now)} {now.getDate()})
          </span>
        )
    }
  })()

  const legend = (() => {
    switch (view) {
      case 'd': {
        const h = now.getHours()
        const items: LegendItem[] = [
          { swatch: 'bg-area-career', label: `Passed (${h} hours)` },
          {
            swatch: CURRENT_SWATCH,
            label: `Current (${String(h).padStart(2, '0')}:00–${String((h + 1) % 24).padStart(2, '0')}:00)`,
            strong: true,
          },
          { swatch: 'border border-area-career/45', label: `Space remaining (${23 - h} hours open)` },
        ]
        return <GridLegend items={items} />
      }
      case 'w': {
        const dayIdx = (now.getDay() + 6) % 7
        const items: LegendItem[] = [
          { swatch: 'bg-area-career', label: `Passed (${dayIdx} days)` },
          { swatch: CURRENT_SWATCH, label: `Today (${monthShort(now)} ${now.getDate()})` },
          { swatch: 'border border-area-career/50', label: `Space remaining (${6 - dayIdx} days)` },
        ]
        return <GridLegend items={items} />
      }
      case 'm': {
        const dim = now.getDate()
        const total = daysInMonth(now.getFullYear(), now.getMonth())
        const items: LegendItem[] = [
          { swatch: 'bg-area-career', label: `Passed (${dim - 1} days)` },
          { swatch: CURRENT_SWATCH, label: `Today (${monthShort(now)} ${dim})` },
          { swatch: 'border border-area-career/45', label: `Space remaining (${total - dim} days)` },
        ]
        return <GridLegend items={items} />
      }
      case 'y': {
        const doy = dayOfYear(now)
        const total = daysInYear(now.getFullYear())
        const items: LegendItem[] = [
          { swatch: 'bg-area-career', label: 'Passed', strong: true },
          { swatch: 'bg-area-career ring-2 ring-area-career/30 ring-offset-1', label: 'Today', strong: true },
          { swatch: 'border border-area-career/50', label: 'Remaining', strong: true },
        ]
        return (
          <GridLegend
            items={items}
            footer={`${doy - 1} passed · ${total - doy} remaining · ${weeksInYear(now.getFullYear())} weeks`}
          />
        )
      }
    }
  })()

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-fg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-bg-canvas"
      >
        Skip to main content
      </a>

      <TopNavBar
        view={view}
        now={now}
        onView={setView}
        settingsOpen={settingsOpen}
        onToggleSettings={() => setSettingsOpen((v) => !v)}
      />

      <main
        id="main"
        className={`mx-auto flex max-w-[720px] flex-col px-margin pt-5 pb-12 ${
          view === 'y' ? 'gap-8' : 'gap-6'
        }`}
      >
        <PeriodHeader
          variant={'card'}
          eyebrow={periodEyebrow(view, now) ?? undefined}
          badge={view === 'y' ? yearBadge(now) : undefined}
          headline={periodHeadline(view, now)}
          subline={periodSubline(view, now) ?? undefined}
          sublineTone={view === 'y' ? 'body' : 'caption'}
          percent={percent(p)}
          percentLabel={percentLabel(view, now)}
        />

        <CadenceGrid
          title={GRID_TITLE[view]}
          caption={scaleCaption(view, now)}
          pill={pill}
          legend={legend}
        >
          {view === 'd' && <DayDots now={now} />}
          {view === 'w' && <WeekDots now={now} />}
          {view === 'm' && <MonthDots now={now} />}
          {view === 'y' && <YearDots now={now} />}
        </CadenceGrid>

        <DimensionsSection scale={view} now={now} />

        <GuidanceCard scale={view} stats={stats} />

        {settingsOpen && <SettingsPanel />}

        <SiteFooter onShortcuts={showHelp} />
      </main>

      {helpKey > 0 && (
        <Toast
          key={helpKey}
          message="Shortcuts: D Day · W Week · M Month · Y Year"
          action={
            <button
              type="button"
              onClick={() => setHelpKey(0)}
              className="shrink-0 font-medium underline underline-offset-2 hover:opacity-80"
            >
              Dismiss
            </button>
          }
        />
      )}
    </>
  )
}
