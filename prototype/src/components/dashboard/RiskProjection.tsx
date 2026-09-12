import { ArrowDown, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Rating } from '../../types/risk'
import { RATING_META } from '../../utils/rating'

interface RiskProjectionProps {
  clientId: string
  clientName: string
  state: string
  currentScore: number
  currentRating: Rating
  projectedScore: number
  projectedRating: Rating
}

function RiskProjection({
  clientId,
  clientName,
  state,
  currentScore,
  currentRating,
  projectedScore,
  projectedRating,
}: RiskProjectionProps) {
  const navigate = useNavigate()
  const currentMeta = RATING_META[currentRating]
  const projectedMeta = RATING_META[projectedRating]
  const delta = currentScore - projectedScore

  return (
    <section className="rounded-2xl border border-sage-200/70 bg-white px-8 py-9 shadow-softer sm:px-10 sm:py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-sage-500">
            {clientName} · {state}
          </p>
          <h3 className="mt-1.5 text-xl font-bold text-forest-950">
            Saudável hoje. Talvez não daqui a 12 meses.
          </h3>
        </div>
        <button
          type="button"
          onClick={() => navigate(`/produtor/${clientId}`)}
          className="inline-flex items-center gap-1.5 rounded-full border border-sage-200 px-3.5 py-2 text-xs font-semibold text-forest-800 transition-colors hover:bg-sage-50"
        >
          Ver análise completa
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
        </button>
      </div>

      <div className="mt-9 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-12">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-sage-400">Hoje</p>
          <p className="mt-2 font-display text-6xl font-extrabold tracking-tight text-forest-950">
            {currentScore}
          </p>
          <span
            className={`mt-3 inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold ${currentMeta.badgeClasses}`}
          >
            {currentRating} — {currentMeta.description}
          </span>
        </div>

        <div className="flex flex-row items-center gap-2 text-alert-red-600 sm:flex-col">
          <ArrowDown className="h-8 w-8" strokeWidth={2.4} />
          <span className="text-sm font-bold">{delta} pts</span>
        </div>

        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-sage-400">Em 12 meses</p>
          <p className="mt-2 font-display text-6xl font-extrabold tracking-tight text-alert-orange-600">
            {projectedScore}
          </p>
          <span
            className={`mt-3 inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold ${projectedMeta.badgeClasses}`}
          >
            {projectedRating} — {projectedMeta.description}
          </span>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-sage-400">
        Score de 0 a 1000 · quanto menor, maior o risco de inadimplência.
      </p>
    </section>
  )
}

export default RiskProjection
