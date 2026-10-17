import { useEffect, useRef } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  /** accessible name for role="dialog" */
  label: string
  onClose: () => void
  children: ReactNode
  /** extra classes for the panel, e.g. max width */
  className?: string
}

const FOCUSABLE =
  'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'

/**
 * Dialog shell: portal to <body>, dimmed backdrop, Escape to close,
 * a focus trap inside the panel, focus restore on exit, and a body
 * scroll lock. The backdrop never closes the dialog on click, so
 * in-progress edits are not lost by accident.
 */
export function Modal({ label, onClose, children, className = '' }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const restoreRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    restoreRef.current = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
      restoreRef.current?.focus?.()
    }
  }, [onClose])

  // Tab cycles inside the panel only
  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key !== 'Tab') return
    const focusables = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE)
    if (!focusables || focusables.length === 0) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
      <div aria-hidden="true" className="fixed inset-0 bg-[#1b1b1f]/40 backdrop-blur-[2px]" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        className={`relative my-8 w-full max-w-[580px] overflow-hidden rounded-xl border border-border-line bg-surface-panel shadow-[0_12px_36px_rgba(27,27,31,0.14)] ${className}`}
        style={{ overscrollBehavior: 'contain' }}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
