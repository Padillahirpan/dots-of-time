interface IconProps {
  name: string
  size?: number
  fill?: boolean
  className?: string
}

/** Material Symbols Outlined icon (ligature-based, decorative by default). */
export function Icon({ name, size = 20, fill = false, className = '' }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined${fill ? ' fill-icon' : ''} ${className}`}
      style={{ fontSize: size }}
    >
      {name}
    </span>
  )
}
