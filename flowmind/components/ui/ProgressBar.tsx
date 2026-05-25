interface Props {
  pct: number
  color?: string
  height?: number
}

export function ProgressBar({ pct, color = '#00C896', height = 6 }: Props) {
  const clamped = Math.min(Math.max(pct, 0), 100)
  return (
    <div
      className="w-full rounded-full overflow-hidden"
      style={{ height, background: 'rgba(255,255,255,0.08)' }}
    >
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${clamped}%`, background: color }}
      />
    </div>
  )
}
