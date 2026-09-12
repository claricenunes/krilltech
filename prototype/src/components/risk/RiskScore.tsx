interface RiskScoreProps {
  score: number
  label?: string
}

function RiskScore({ score, label = 'Risco estimado' }: RiskScoreProps) {
  const percent = Math.min(100, Math.max(0, (score / 1000) * 100))

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
        {label}
      </p>
      <p className="mt-1 text-5xl font-semibold tabular-nums text-stone-900">
        {score}
      </p>
      <div className="mt-3 h-1.5 w-full max-w-[180px] rounded-full bg-stone-200">
        <div
          className="h-1.5 rounded-full bg-emerald-700"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs text-stone-400">de 0 a 1000</p>
    </div>
  )
}

export default RiskScore
