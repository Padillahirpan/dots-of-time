import type { ReactNode } from 'react'

interface CadenceGridProps {
  title: string
  caption: string
  pill?: ReactNode
  legend?: ReactNode
  children: ReactNode
}

/** Panel that frames every dot matrix: title, caption, status pill, legend. */
export function CadenceGrid({ title, caption, pill, legend, children }: CadenceGridProps) {
  return (
    <section className="rounded-3xl bg-surface-panel p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-title-section font-medium text-fg-primary">{title}</h2>
          <p className="text-caption text-fg-muted">{caption}</p>
        </div>
        {pill}
      </div>
      {children}
      {legend && <div className="mt-5 border-t border-border-line pt-3.5">{legend}</div>}
    </section>
  )
}
