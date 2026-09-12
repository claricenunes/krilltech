import { ArrowRight, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState, type ChangeEvent } from 'react'
import { simulateProductivityImpact } from '../../services/scoring/simulator'
import type { Rating } from '../../types/risk'
import { formatCurrency } from '../../utils/currency'
import { RATING_META } from '../../utils/rating'
import RatingBadge from '../risk/RatingBadge'
import RiskScore from '../risk/RiskScore'

interface SimulatorPanelProps {
  currentScore: number
  currentRating: Rating
  currentRevenue: number
  fixedCosts: number
}

const PRESETS = [100, 90, 80, 70]

function SimulatorPanel({
  currentScore,
  currentRating,
  currentRevenue,
  fixedCosts,
}: SimulatorPanelProps) {
  const [productivity, setProductivity] = useState(100)
  const variation = productivity - 100

  const result = useMemo(
    () =>
      simulateProductivityImpact({
        currentScore,
        currentRevenue,
        fixedCosts,
        productivityVariationPercent: variation,
      }),
    [currentScore, currentRevenue, fixedCosts, variation],
  )

  function handleSliderChange(event: ChangeEvent<HTMLInputElement>) {
    setProductivity(Number(event.target.value))
  }

  return (
    <div className="rounded-2xl border border-sage-200/70 bg-white p-6 shadow-softer sm:p-8">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-forest-600" strokeWidth={2.2} />
        <h3 className="text-base font-semibold text-forest-950">
          E se a produtividade cair?
        </h3>
      </div>
      <p className="mt-1.5 text-sm text-sage-600">
        Simule o impacto na capacidade de pagamento e no risco projetado deste cliente.
      </p>

      <div className="mt-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-forest-800">Produtividade projetada</p>
          <span className="font-display text-2xl font-extrabold text-forest-950">
            {productivity}%
          </span>
        </div>

        <input
          type="range"
          min={70}
          max={100}
          step={1}
          value={productivity}
          onChange={handleSliderChange}
          aria-label={`Produtividade projetada: ${productivity}%`}
          className="mt-3 w-full accent-forest-600"
        />

        <div className="mt-3 flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setProductivity(preset)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                productivity === preset
                  ? 'border-forest-600 bg-forest-600 text-white'
                  : 'border-sage-200 bg-white text-forest-700 hover:border-forest-300 hover:bg-sage-50'
              }`}
            >
              {preset}%
            </button>
          ))}
        </div>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-sage-200/70 bg-cream-25 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-sage-500">
            Capacidade estimada de pagamento
          </p>
          <p
            className={`mt-1 text-xl font-semibold ${
              result.paymentCapacity < 0 ? 'text-alert-red-600' : 'text-forest-950'
            }`}
          >
            {formatCurrency(result.paymentCapacity)}
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-sage-200/70 bg-cream-25 p-4">
          <RiskScore
            score={currentScore}
            label="Score atual"
            barClasses={RATING_META[currentRating].barClasses}
            compact
          />
          <ArrowRight className="h-4 w-4 flex-shrink-0 text-sage-300" strokeWidth={2.2} />
          <RiskScore
            score={result.projectedScore}
            label="Score projetado"
            barClasses={RATING_META[result.projectedRating].barClasses}
            compact
          />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3 rounded-xl border border-sage-200/70 bg-cream-25 p-4">
        <RatingBadge rating={currentRating} size="md" />
        <ArrowRight className="h-4 w-4 flex-shrink-0 text-sage-300" strokeWidth={2.2} />
        <RatingBadge rating={result.projectedRating} size="md" />
        <p className="ml-2 text-sm text-sage-600">
          {result.scoreDelta === 0
            ? 'Sem alteração no cenário atual.'
            : `Risco projetado sobe com a queda de produtividade.`}
        </p>
      </div>
    </div>
  )
}

export default SimulatorPanel
