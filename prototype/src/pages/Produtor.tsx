import { ArrowLeft } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'
import ScreeningResult from '../components/risk/ScreeningResult'
import SimulatorPanel from '../components/simulator/SimulatorPanel'
import { getClientById } from '../data/mockClients'
import { buildRiskReportForRating } from '../data/mock-risk'
import { STATUS_META } from '../utils/rating'

function Produtor() {
  const { id } = useParams()
  const client = id ? getClientById(id) : undefined

  const report = useMemo(
    () => (client ? buildRiskReportForRating(client.rating) : null),
    [client],
  )

  if (!client || !report) {
    return (
      <PageShell title="Cliente não encontrado" subtitle="Verifique o link acessado.">
        <div className="rounded-2xl border border-sage-200/70 bg-white p-8 text-center shadow-softer">
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

  return (
    <PageShell
      title={client.name}
      subtitle={`${client.culture} · ${client.region} (${client.state})`}
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <Link
          to="/carteira"
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-forest-700 transition-colors hover:text-forest-900"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
          Voltar para a carteira
        </Link>

        <div className="rounded-xl border border-dashed border-sage-300 bg-sage-50 px-4 py-2.5 text-xs font-medium text-sage-500">
          MOCK — dados de demonstração para {client.name}, sem relação com
          clientes reais da KRILLTECH.
        </div>

        <ScreeningResult
          clientName={client.name}
          document={client.document}
          score={client.score}
          rating={client.rating}
          operationalStatus={STATUS_META[client.status].label}
          trend={report.trend}
          factors={report.factors}
          evidences={[]}
          recommendationTitle={report.recommendationTitle}
          recommendationBody={report.recommendationBody}
        />

        <SimulatorPanel
          currentScore={client.score}
          currentRating={client.rating}
          currentRevenue={client.annualRevenue}
          fixedCosts={client.fixedCosts}
        />
      </div>
    </PageShell>
  )
}

export default Produtor
