import { ArrowUpRight, ShieldCheck, ShieldAlert, TriangleAlert, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ActionList from '../components/dashboard/ActionList'
import AlertsPanel from '../components/dashboard/AlertsPanel'
import ClientTable from '../components/dashboard/ClientTable'
import HeroBanner from '../components/dashboard/HeroBanner'
import InstitutionalCard from '../components/dashboard/InstitutionalCard'
import RegionalRiskMap from '../components/dashboard/RegionalRiskMap'
import RiskDistributionChart from '../components/dashboard/RiskDistributionChart'
import StatCard from '../components/dashboard/StatCard'
import PageShell from '../components/layout/PageShell'
import { mockActions } from '../data/mockActions'
import { mockAlerts } from '../data/mockAlerts'
import { mockClients } from '../data/mockClients'
import { mockPortfolioSummary } from '../data/mockPortfolioSummary'

function Dashboard() {
  const navigate = useNavigate()
  const summary = mockPortfolioSummary
  const featuredClients = mockClients.slice(0, 5)

  return (
    <PageShell
      title="Olá, Marcelo!"
      subtitle="Aqui está um resumo da sua carteira e dos principais alertas."
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="flex flex-col gap-6 xl:col-span-2">
          <HeroBanner />

          <section className="rounded-2xl border border-sage-200/70 bg-white p-5 shadow-softer sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-base font-semibold text-forest-950">
                <Users className="h-4 w-4 text-forest-600" strokeWidth={2.2} />
                Visão da carteira
              </h3>
              <p className="text-xs text-sage-500">
                Última atualização: {summary.lastUpdated}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard
                icon={Users}
                iconClasses="bg-sage-100 text-forest-700"
                label="Total de clientes"
                value={String(summary.totalClients)}
                footer={
                  <span className="inline-flex items-center gap-1 text-forest-600">
                    <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.4} />
                    {summary.newClients} novos
                  </span>
                }
              />
              <StatCard
                icon={ShieldAlert}
                iconClasses="bg-alert-orange-50 text-alert-orange-600"
                label="Em risco elevado"
                value={String(summary.riscoElevado)}
                footer={`${summary.riscoElevadoPercent.toString().replace('.', ',')}% da carteira`}
              />
              <StatCard
                icon={TriangleAlert}
                iconClasses="bg-alert-amber-50 text-alert-amber-600"
                label="Em alerta de RJ"
                value={String(summary.alertaRJ)}
                footer={`${summary.alertaRJPercent.toString().replace('.', ',')}% da carteira`}
              />
              <StatCard
                icon={ShieldCheck}
                iconClasses="bg-forest-50 text-forest-700"
                label="Saudáveis"
                value={String(summary.saudaveis)}
                footer={`${summary.saudaveisPercent.toString().replace('.', ',')}% da carteira`}
              />
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <section className="@container rounded-2xl border border-sage-200/70 bg-white p-5 shadow-softer sm:p-6">
              <h3 className="text-base font-semibold text-forest-950">
                Risco por região
              </h3>
              <div className="mt-4">
                <RegionalRiskMap regions={summary.regionRisk} />
              </div>
            </section>

            <section className="@container rounded-2xl border border-sage-200/70 bg-white p-5 shadow-softer sm:p-6">
              <h3 className="text-base font-semibold text-forest-950">
                Distribuição de risco da carteira
              </h3>
              <div className="mt-4">
                <RiskDistributionChart
                  entries={summary.ratingDistribution}
                  total={summary.totalClients}
                />
              </div>
            </section>
          </div>

          <section className="rounded-2xl border border-sage-200/70 bg-white p-5 shadow-softer sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-forest-950">
                Clientes em destaque
              </h3>
              <button
                type="button"
                onClick={() => navigate('/carteira')}
                className="text-xs font-medium text-forest-600 transition-colors hover:text-forest-800"
              >
                Ver todos →
              </button>
            </div>
            <div className="mt-4">
              <ClientTable clients={featuredClients} />
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <AlertsPanel alerts={mockAlerts} />
          <ActionList actions={mockActions} />
          <InstitutionalCard />
        </div>
      </div>
    </PageShell>
  )
}

export default Dashboard
