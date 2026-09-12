import { TriangleAlert } from 'lucide-react'
import type { Evidence, Rating, RiskFactor, Trend } from '../../types/risk'
import { RATING_META } from '../../utils/rating'
import EvidenceCard from './EvidenceCard'
import RatingBadge from './RatingBadge'
import RecommendationCard from './RecommendationCard'
import RiskFactorCard from './RiskFactorCard'
import RiskScore from './RiskScore'
import TrendIndicator from './TrendIndicator'

interface ScreeningResultProps {
  clientName: string
  document: string
  score: number
  rating: Rating
  operationalStatus: string
  trend: Trend
  factors: RiskFactor[]
  evidences: Evidence[]
  recommendationTitle: string
  recommendationBody: string
  /** Data/hora de referência do cálculo — quando os dados foram atualizados pela última vez. */
  atualizadoEm: string
  /** Limitações do modelo, exibidas para deixar claro o que o score NÃO representa. */
  limitacoes: string
}

const STATUS_TONE: Record<Rating, string> = {
  A: 'bg-forest-50 text-forest-700',
  B: 'bg-alert-amber-50 text-alert-amber-600',
  C: 'bg-alert-orange-50 text-alert-orange-600',
  D: 'bg-alert-red-50 text-alert-red-600',
}

function ScreeningResult({
  clientName,
  document,
  score,
  rating,
  operationalStatus,
  trend,
  factors,
  evidences,
  recommendationTitle,
  recommendationBody,
  atualizadoEm,
  limitacoes,
}: ScreeningResultProps) {
  const ratingMeta = RATING_META[rating]

  return (
    <div className="flex flex-col gap-6 animate-fade-up">
      <section className="rounded-2xl border border-sage-200/70 bg-white p-5 shadow-softer sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-sage-500">
            Cliente
          </p>
          <p className="text-xs text-sage-400">Atualizado em: {atualizadoEm}</p>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xl font-semibold text-forest-950">{clientName}</p>
            <p className="text-sm text-sage-500">{document}</p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${STATUS_TONE[rating]}`}
          >
            <TriangleAlert className="h-4 w-4" strokeWidth={2.2} />
            {operationalStatus}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 border-t border-sage-100 pt-6 sm:grid-cols-3">
          <RiskScore score={score} label="Score de risco" barClasses={ratingMeta.barClasses} />
          <RatingBadge rating={rating} />
          <TrendIndicator {...trend} />
        </div>
      </section>

      <section>
        <h3 className="text-base font-semibold text-forest-950">
          Por que este cliente recebeu este score?
        </h3>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {factors.map((factor) => (
            <RiskFactorCard key={factor.title} {...factor} />
          ))}
        </div>
      </section>

      <RecommendationCard title={recommendationTitle} body={recommendationBody} />

      {evidences.length > 0 && (
        <section>
          <h3 className="text-base font-semibold text-forest-950">Evidências</h3>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {evidences.map((evidence) => (
              <EvidenceCard key={evidence.title} {...evidence} />
            ))}
          </div>
        </section>
      )}

      <section className="rounded-xl border border-dashed border-sage-300 bg-sage-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-sage-500">
          Limitações do modelo
        </p>
        <p className="mt-1.5 text-xs text-sage-500">{limitacoes}</p>
      </section>
    </div>
  )
}

export default ScreeningResult
