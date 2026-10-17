import type { ReactNode } from 'react'

interface ToastProps {
  message: string
  /** optional action, e.g. an Undo button */
  action?: ReactNode
}

/** Quiet bottom toast; visibility and timers are owned by the parent. */
export function Toast({ message, action }: ToastProps) {
  return (
    <div
      role="status"
      className="fixed inset-x-0 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-[60] mx-auto flex w-fit max-w-[calc(100%-2rem)] items-center gap-3 rounded-lg bg-inverse-surface px-4 py-2.5 text-body-md text-inverse-on-surface"
    >
      <p className="min-w-0 truncate">{message}</p>
      {action}
    </div>
  )
}
