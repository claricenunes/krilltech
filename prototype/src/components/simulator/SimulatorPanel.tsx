import { ArrowRight, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState, type ChangeEvent } from 'react'
import {
  getRecommendation,
  simulateProductivityImpact,
} from '../../services/scoring/simulator'
import type { Rating } from '../../types/risk'
import { formatCurrency } from '../../utils/currency'
import { RATING_HEX, RATING_META } from '../../utils/rating'
import DataSourceTag from '../risk/DataSourceTag'
import RatingBadge from '../risk/RatingBadge'
import RiskScore from '../risk/RiskScore'
import TrendIndicator from '../risk/TrendIndicator'

interface SimulatorPanelProps {
  currentScore: number
  currentRating: Rating
  currentRevenue: number
  fixedCosts: number
}

const MIN_DROP = 0
const MAX_DROP = 50
const PRESETS = [100, 90, 80, 70, 60]

function SimulatorPanel({
  currentScore,
  currentRating,
  currentRevenue,
  fixedCosts,
}: SimulatorPanelProps) {
  const [productivity, setProductivity] = useState(100)
  const productivityDrop = 100 - productivity
  const variation = -productivityDrop

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

  const recommendation = useMemo(
    () => getRecommendation(result.projectedScore),
    [result.projectedScore],
  )

  function handleSliderChange(event: ChangeEvent<HTMLInputElement>) {
    setProductivity(100 - Number(event.target.value))
  }

  return (
    <div className="rounded-2xl border border-sage-200/70 bg-white p-6 shadow-softer sm:p-8">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-forest-600" strokeWidth={2.2} />
        <p className="text-xs font-semibold uppercase tracking-wide text-sage-500">
          E se a produtividade cair?
        </p>
      </div>
      <p className="mt-2 text-sm text-sage-600">
        Simule o impacto de uma queda de produtividade na capacidade de
        pagamento e no risco deste cliente.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-sage-500">
        <span className="inline-flex items-center gap-1.5">
          Receita atual: {formatCurrency(currentRevenue)}
          <DataSourceTag type="MOCK" />
        </span>
        <span className="inline-flex items-center gap-1.5">
          Custos fixos estimados: {formatCurrency(fixedCosts)}
          <DataSourceTag type="MOCK" />
        </span>
      </div>

      <div className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label htmlFor="productivity-slider" className="text-sm font-medium text-forest-800">
            Produtividade
          </label>
          <span className="font-display text-2xl font-extrabold text-forest-950">
            {productivity}%
          </span>
        </div>

        <input
          id="productivity-slider"
          type="range"
          min={MIN_DROP}
          max={MAX_DROP}
          step={1}
          value={productivityDrop}
          onChange={handleSliderChange}
          aria-label={`Produtividade: ${productivity}%`}
          className="mt-3 w-full accent-forest-600"
        />
        <div className="mt-1 flex justify-between text-xs text-sage-400">
          <span>100%</span>
          <span>50%</span>
        </div>

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

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-sage-200/70 bg-cream-25 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium uppercase tracking-wide text-sage-500">
              Receita projetada
            </p>
            <DataSourceTag type="SIMULACAO" />
          </div>
          <p className="mt-1 text-xl font-semibold text-forest-950">
            {formatCurrency(result.projectedRevenue)}
          </p>
        </div>
        <div className="rounded-xl border border-sage-200/70 bg-cream-25 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium uppercase tracking-wide text-sage-500">
              Capacidade de pagamento
            </p>
            <DataSourceTag type="SIMULACAO" />
          </div>
          <p
            className={`mt-1 text-xl font-semibold ${
              result.paymentCapacity < 0 ? 'text-alert-red-600' : 'text-forest-950'
            }`}
          >
            {formatCurrency(result.paymentCapacity)}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-sage-200/70 bg-sage-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-sage-500">
          Atual × Projetado
        </p>
        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex min-w-0 items-center gap-2.5">
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

          <div className="flex min-w-0 items-center gap-3">
            <RatingBadge rating={currentRating} size="md" />
            <ArrowRight className="h-4 w-4 flex-shrink-0 text-sage-300" strokeWidth={2.2} />
            <RatingBadge rating={result.projectedRating} size="md" />
          </div>

          <TrendIndicator
            direction={result.scoreDelta === 0 ? 'stable' : 'up'}
            value={result.scoreDelta}
            label={
              result.scoreDelta === 0
                ? 'Sem alteração no cenário atual'
                : 'Aumento estimado do risco'
            }
          />
        </div>
      </div>

      <div
        className="mt-6 rounded-xl border p-4"
        style={{ borderColor: RATING_HEX[result.projectedRating] + '40' }}
      >
        <p className="text-xs font-medium uppercase tracking-wide text-sage-500">
          Recomendação
        </p>
        <p className="mt-1 text-sm text-forest-800">{recommendation}</p>
        <p className="mt-2 text-xs text-sage-400">
          Sugestão de apoio à decisão — a decisão final permanece com o
          gestor.
        </p>
      </div>

      <p className="mt-6 text-xs text-sage-400">
        Simulação determinística de demonstração. Os parâmetros
        (sensibilidade, custos fixos, receita) não foram calibrados com
        histórico de inadimplência da KRILLTECH.
      </p>
    </div>
  )
}

export default SimulatorPanel
