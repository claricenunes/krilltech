import { ArrowLeft, ArrowRight, FileText } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ImpactFactorRow from '../components/risk/ImpactFactorRow'
import PageShell from '../components/layout/PageShell'
import StepHeader from '../components/layout/StepHeader'
import RatingBadge from '../components/risk/RatingBadge'
import RecommendationCard from '../components/risk/RecommendationCard'
import RiskScore from '../components/risk/RiskScore'
import SimulatorPanel from '../components/simulator/SimulatorPanel'
import { getCaseForClient } from '../data/mockCases'
import { getClientById } from '../data/mockClients'
import { formatCurrency } from '../utils/currency'
import { RATING_META } from '../utils/rating'

function Produtor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const client = id ? getClientById(id) : undefined

  const clientCase = useMemo(
    () => (client ? getCaseForClient(client.id, client.score) : null),
    [client],
  )

  if (!client || !clientCase) {
    return (
      <PageShell title="Cliente não encontrado" subtitle="Verifique o link acessado.">
        <div className="mx-auto max-w-2xl rounded-2xl border border-sage-200/70 bg-white p-8 text-center shadow-softer">
          <p className="text-sm text-sage-500">
            Não encontramos um cliente com este identificador na carteira demonstrativa.
          </p>
          <Link
            to="/carteira"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-forest-700 hover:text-forest-900"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
            Voltar para a carteira
          </Link>
        </div>
      </PageShell>
    )
  }

  const currentMeta = RATING_META[client.rating]

  return (
    <PageShell title={client.name} subtitle={`${client.culture} · ${client.state}`}>
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-forest-700 transition-colors hover:text-forest-900"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
          Voltar
        </button>

        <section className="rounded-2xl border border-sage-200/70 bg-white p-6 shadow-softer sm:p-8">
          <StepHeader step={1} title="Situação atual" />
          <div className="flex flex-wrap items-center gap-x-10 gap-y-5">
            <RiskScore score={client.score} label="Score atual" barClasses={currentMeta.barClasses} />
            <RatingBadge rating={client.rating} />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-sage-500">
                Exposição
              </p>
              <p className="mt-1 font-display text-3xl font-extrabold text-forest-950">
                {formatCurrency(client.exposure)}
              </p>
              <p className="mt-1 text-xs text-sage-400">em Arbolin Biogenesis, a prazo</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-sage-200/70 bg-white p-6 shadow-softer sm:p-8">
          <StepHeader step={2} title="Projeção de risco em 12 meses" />
          <div className="flex flex-wrap items-center gap-x-10 gap-y-5">
            <RiskScore
              score={clientCase.projectedScore}
              label="Score projetado"
              barClasses={RATING_META[clientCase.projectedRating].barClasses}
            />
            <RatingBadge rating={clientCase.projectedRating} />
          </div>

          <p className="mt-6 text-sm font-medium text-forest-800">
            Fatores que explicam a projeção
          </p>
          <div className="mt-1 divide-y divide-sage-100">
            {clientCase.impactFactors.map((factor) => (
              <ImpactFactorRow key={factor.factorKey} {...factor} />
            ))}
          </div>
        </section>

        <div>
          <StepHeader step={3} title="Simule outros cenários" />
          <SimulatorPanel
            currentScore={client.score}
            currentRating={client.rating}
            currentRevenue={clientCase.annualRevenue}
            fixedCosts={clientCase.fixedCosts}
          />
        </div>

        <div>
          <StepHeader step={4} title="O que fazer agora" />
          <RecommendationCard
            title={clientCase.recommendationTitle}
            body={clientCase.recommendationBody}
          />
        </div>

        {client.id === 'fazenda-boa-vista' && (
          <Link
            to="/relatorios"
            className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-forest-700 transition-colors hover:text-forest-900"
          >
            <FileText className="h-4 w-4" strokeWidth={2.2} />
            Ver relatório padronizado de risco
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
          </Link>
        )}
      </div>
    </PageShell>
  )
}

export default Produtor
