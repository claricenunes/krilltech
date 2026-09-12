import { FileCheck2 } from 'lucide-react'
import PageShell from '../components/layout/PageShell'
import ImpactFactorRow from '../components/risk/ImpactFactorRow'
import RatingBadge from '../components/risk/RatingBadge'
import RecommendationCard from '../components/risk/RecommendationCard'
import RiskScore from '../components/risk/RiskScore'
import { getCaseForClient } from '../data/mockCases'
import { getClientById } from '../data/mockClients'
import { RATING_META } from '../utils/rating'

const EVIDENCE_SOURCES = ['Receita Federal', 'CNJ / DataJud', 'IBAMA', 'Dados agroclimáticos']

function Relatorios() {
  const client = getClientById('fazenda-boa-vista')!
  const clientCase = getCaseForClient(client.id, client.score)

  return (
    <PageShell
      title="Relatório Padronizado de Risco"
      subtitle={`${client.name} · gerado em 12/05/2025`}
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-sage-200/70 bg-white p-8 shadow-softer sm:p-10">
        <div className="flex items-center gap-2.5 border-b border-sage-100 pb-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest-50 text-forest-700">
            <FileCheck2 className="h-[18px] w-[18px]" strokeWidth={2} />
          </span>
          <div>
            <p className="text-sm font-semibold text-forest-950">Cliente</p>
            <p className="text-sm text-sage-600">{client.name}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-12 gap-y-6 border-b border-sage-100 pb-6">
          <RiskScore
            score={clientCase.projectedScore}
            label="Score"
            barClasses={RATING_META[clientCase.projectedRating].barClasses}
          />
          <RatingBadge rating={clientCase.projectedRating} />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-sage-500">
              Probabilidade projetada de inadimplência
            </p>
            <p className="mt-1.5 font-display text-3xl font-extrabold text-alert-orange-600">
              34%
            </p>
            <p className="mt-1 text-xs text-sage-400">em 12 meses · valor demonstrativo</p>
          </div>
        </div>

        <div className="border-b border-sage-100 py-6">
          <p className="text-sm font-semibold text-forest-950">Fatores</p>
          <div className="mt-1 divide-y divide-sage-100">
            {clientCase.impactFactors.map((factor) => (
              <ImpactFactorRow key={factor.factorKey} {...factor} />
            ))}
          </div>
        </div>

        <div className="border-b border-sage-100 py-6">
          <p className="text-sm font-semibold text-forest-950">Evidências</p>
          <ul className="mt-3 flex flex-col gap-2">
            {EVIDENCE_SOURCES.map((source) => (
              <li key={source} className="flex items-center gap-2.5 text-sm text-sage-600">
                <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sage-400" />
                {source}
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-6">
          <RecommendationCard
            title={clientCase.recommendationTitle}
            body={clientCase.recommendationBody}
          />
        </div>
      </div>
    </PageShell>
  )
}

export default Relatorios
