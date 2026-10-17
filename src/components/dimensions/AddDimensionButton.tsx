import { Icon } from '../Icon'

interface AddDimensionButtonProps {
  onClick: () => void
}

/** Dashed extensibility affordance below the reservoir grid. */
export function AddDimensionButton({ onClick }: AddDimensionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border-line bg-surface-panel/50 px-4 py-2.5 text-caption text-fg-muted transition-colors hover:border-fg-primary hover:text-fg-primary"
    >
      <Icon name="add" size={16} />
      <span>
        Add Custom Dimension (e.g., Creative Arts, Philosophy, Sanctuary) · Cap 4 max
      </span>
    </button>
  )
}
