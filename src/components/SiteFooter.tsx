interface SiteFooterProps {
  onShortcuts: () => void
}

/** Calm hairline footer. */
export function SiteFooter({ onShortcuts }: SiteFooterProps) {
  return (
    <footer className="flex flex-col items-center justify-between gap-2 border-t border-border-line pt-4 text-caption text-fg-muted sm:flex-row">
      <div>
        <span className="font-medium text-fg-primary">Dots of Time</span> · Intentional pacing
        &amp; calm presence
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onShortcuts}
          className="inline-flex items-center gap-1 transition-colors hover:text-fg-primary"
        >
          Keyboard shortcuts{' '}
          <kbd className="rounded border border-border-line bg-surface-container px-1.5 py-0.5 font-mono text-[10px]">
            ?
          </kbd>
        </button>
        <span>·</span>
        <span className="tabular-nums">v1.2</span>
      </div>
    </footer>
  )
}
