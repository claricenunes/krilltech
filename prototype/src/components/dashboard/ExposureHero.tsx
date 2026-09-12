import { ArrowRight, CloudRain } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { HomeSummary } from '../../types/portfolio'
import { formatCurrencyCompact } from '../../utils/currency'
import heroPhoto from '../../fundo.avif'

function ExposureHero({ summary }: { summary: HomeSummary }) {
  const navigate = useNavigate()

  return (
    <section className="relative overflow-hidden rounded-3xl bg-forest-900 shadow-lifted">
      <div className="absolute inset-0">
        <img
          src={heroPhoto}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-950/85 to-forest-950/25" />

      <div className="relative px-8 py-9 sm:px-10 sm:py-10 lg:max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-forest-300">
          Resumo da carteira hoje
        </p>
        <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          {summary.atRiskCount} clientes precisam de atenção
        </h2>

        <div className="mt-7 flex flex-wrap items-end gap-x-12 gap-y-5">
          <div>
            <p className="font-display text-5xl font-extrabold tracking-tight text-white">
              {formatCurrencyCompact(summary.vulnerableExposure)}
            </p>
            <p className="mt-1 text-sm text-forest-200">de exposição vulnerável</p>
          </div>

          <div className="border-l border-forest-700 pl-8">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-forest-300">
              <CloudRain className="h-3.5 w-3.5" strokeWidth={2.2} />
              Principal fator
            </p>
            <p className="mt-1.5 text-base font-medium text-forest-50">
              {summary.mainFactor}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/carteira')}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-forest-50 px-5 py-3 text-sm font-semibold text-forest-900 shadow-softer transition-all hover:bg-white hover:shadow-lifted active:scale-[0.98]"
        >
          Ver clientes
          <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
        </button>
      </div>
    </section>
  )
}

export default ExposureHero
