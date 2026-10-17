interface LiquidWaveProps {
  /** fill-cat-health/family/career/… */
  fill: string
}

/**
 * Two layered wave crests that ride on top of a reservoir's liquid level.
 * The animation translates X only; disabled under prefers-reduced-motion.
 */
export function LiquidWave({ fill }: LiquidWaveProps) {
  return (
    <>
      <div className="wave-anim absolute -top-[14px] left-0 h-[20px] w-[200%] opacity-35" aria-hidden="true">
        <svg className="h-full w-full" viewBox="0 0 500 20" preserveAspectRatio="none">
          <path className={fill} d="M0,10 C150,25 350,-5 500,10 L500,20 L0,20 Z" />
        </svg>
      </div>
      <div className="wave-anim-delayed absolute -top-[12px] left-0 h-[20px] w-[200%] opacity-25" aria-hidden="true">
        <svg className="h-full w-full" viewBox="0 0 500 20" preserveAspectRatio="none">
          <path className={fill} d="M0,8 C120,-3 320,23 500,8 L500,20 L0,20 Z" />
        </svg>
      </div>
    </>
  )
}
