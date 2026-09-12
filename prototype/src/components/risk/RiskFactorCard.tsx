interface RiskFactorCardProps {
  title: string
  weight: number
  status: string
  description?: string
}

function RiskFactorCard({
  title,
  weight,
  status,
  description,
}: RiskFactorCardProps) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-stone-800">{title}</p>
        <span className="text-xs font-semibold text-stone-500">{weight}%</span>
      </div>
      <p className="mt-2 text-xs font-medium uppercase tracking-wide text-stone-500">
        {status}
      </p>
      {description && (
        <p className="mt-1.5 text-sm text-stone-500">{description}</p>
      )}
    </div>
  )
}

export default RiskFactorCard
