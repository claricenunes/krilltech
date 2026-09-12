import type { Evidence, Rating, RiskFactor, Trend } from '../../types/risk'
import DataSourceTag from './DataSourceTag'
import EvidenceCard from './EvidenceCard'
import RatingBadge from './RatingBadge'
import RiskFactorCard from './RiskFactorCard'
import RiskScore from './RiskScore'
import TrendIndicator from './TrendIndicator'

interface RiskReportProps {
  score: number
  rating: Rating
  trend?: Trend
  factors: RiskFactor[]
  evidences: Evidence[]
}

function RiskReport({ score, rating, trend, factors, evidences }: RiskReportProps) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white shadow-sm">
      <div className="border-b border-stone-200 p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
          Relatório Padronizado de Risco
        </p>

        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <RiskScore score={score} />
            <div className="mt-2">
              <DataSourceTag type="CALCULADO" />
            </div>
          </div>
          <RatingBadge rating={rating} />
          {trend && <TrendIndicator {...trend} />}
        </div>
      </div>

      <div className="border-b border-stone-200 p-6">
        <h3 className="text-sm font-semibold text-stone-800">Fatores de risco</h3>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {factors.map((factor) => (
            <RiskFactorCard key={factor.title} {...factor} />
          ))}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-sm font-semibold text-stone-800">Evidências</h3>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {evidences.map((evidence) => (
            <EvidenceCard key={evidence.title} {...evidence} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default RiskReport
