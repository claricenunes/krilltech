interface RiskScoreProps {
  score: number
  label?: string
  barClasses?: string
  compact?: boolean
}

function RiskScore({
  score,
  label = 'Score',
  barClasses = 'bg-forest-500',
  compact = false,
}: RiskScoreProps) {
  const percent = Math.min(100, Math.max(0, (score / 1000) * 100))

  return (
    <div className="min-w-0">
      <p className="truncate text-xs font-medium uppercase tracking-wide text-sage-500">
        {label}
      </p>
      <p
        className={`mt-1 font-display font-extrabold tabular-nums text-forest-950 ${
          compact ? 'text-2xl' : 'text-5xl'
        }`}
      >
        {score}
        {!compact && (
          <span className="ml-1.5 text-lg font-medium text-sage-400">/1000</span>
        )}
      </p>
      <div
        className={`mt-2 h-1.5 w-full overflow-hidden rounded-full bg-sage-100 ${
          compact ? 'max-w-[96px]' : 'max-w-[200px]'
        }`}
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barClasses}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {!compact && (
        <p className="mt-1.5 text-xs text-sage-400">
          Quanto menor o score, maior o risco de inadimplência.
        </p>
      )}
    </div>
  )
}

export default RiskScore
