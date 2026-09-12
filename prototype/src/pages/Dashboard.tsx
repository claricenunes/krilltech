import ExposureHero from '../components/dashboard/ExposureHero'
import PriorityAlertCard from '../components/dashboard/PriorityAlertCard'
import RiskProjection from '../components/dashboard/RiskProjection'
import PageShell from '../components/layout/PageShell'
import { homeSummary, priorityAlerts } from '../data/mockAlerts'
import { getCaseForClient } from '../data/mockCases'
import { getClientById } from '../data/mockClients'

function Dashboard() {
  const featuredAlert = priorityAlerts[0]
  const featuredClient = getClientById(featuredAlert.clientId)!
  const featuredCase = getCaseForClient(featuredClient.id, featuredClient.score)

  return (
    <PageShell
      title="Bom dia, Davi."
      subtitle="Veja o que mudou na sua carteira e onde agir primeiro."
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <ExposureHero summary={homeSummary} />

        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-sage-500">
            Alertas prioritários
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {priorityAlerts.map((alert) => (
              <PriorityAlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-sage-500">
            Destaque do dia · por que o primeiro alerta é urgente
          </h3>
          <RiskProjection
            clientId={featuredClient.id}
            clientName={featuredClient.name}
            state={featuredClient.state}
            currentScore={featuredClient.score}
            currentRating={featuredClient.rating}
            projectedScore={featuredCase.projectedScore}
            projectedRating={featuredCase.projectedRating}
          />
        </section>
      </div>
    </PageShell>
  )
}

export default Dashboard
