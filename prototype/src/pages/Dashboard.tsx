import { ArrowRight, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RiskExposureRadar from '../components/charts/RiskExposureRadar'
import ExposureHero from '../components/dashboard/ExposureHero'
import MonitoringStatusBar from '../components/dashboard/MonitoringStatusBar'
import PriorityAlertCard from '../components/dashboard/PriorityAlertCard'
import RiskProjection from '../components/dashboard/RiskProjection'
import Logo from '../components/layout/Logo'
import PageShell from '../components/layout/PageShell'
import logoMark from '../logo.png'
import type { ApiProdutor } from '../services/api/krillApi'
import { classificacaoToRating } from '../services/api/mappers'
import { simulateProductivityImpact } from '../services/scoring/simulator'
import {
  getAlertasDashboard,
  getProdutor,
  getProdutores,
  getSafra,
  getStatusMonitoramento,
  KrillApiError,
  type StatusMonitoramento,
} from '../services/api/staticData'
import type { HomeSummary, PriorityAlert } from '../types/portfolio'
import type { Rating } from '../types/risk'
import { deriveAlertTag } from '../utils/alerts'

interface FeaturedProjection {
  clientId: string
  clientName: string
  state: string
  currentScore: number
  currentRating: Rating
  projectedScore: number
  projectedRating: Rating
}

function Dashboard() {
  const navigate = useNavigate()
  const [summary, setSummary] = useState<HomeSummary | null>(null)
  const [alerts, setAlerts] = useState<PriorityAlert[]>([])
  const [produtores, setProdutores] = useState<ApiProdutor[]>([])
  const [featured, setFeatured] = useState<FeaturedProjection | null>(null)
  const [statusMonitoramento, setStatusMonitoramento] = useState<StatusMonitoramento | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const [dashboard, todosProdutores, status] = await Promise.all([
          getAlertasDashboard(),
          getProdutores(),
          getStatusMonitoramento(),
        ])

        if (!cancelled) {
          setProdutores(todosProdutores)
          setStatusMonitoramento(status)
        }

        const resolved = await Promise.all(
          dashboard.alertas.map(async (item) => {
            const produtor = await getProdutor(item.produtor_id)
            const alert: PriorityAlert = {
              id: item.id,
              tag: deriveAlertTag(item.titulo, item.nivel),
              title: item.titulo,
              clientId: item.produtor_id,
              clientName: produtor.nome,
              state: produtor.regiao,
              description: item.resumo,
              mainFactor: item.titulo,
            }
            return { alert, produtor }
          }),
        )

        if (cancelled) return

        setSummary({
          atRiskCount: dashboard.resumo_diario.clientes_atencao,
          vulnerableExposure: dashboard.resumo_diario.exposicao_vulneravel,
          mainFactor: dashboard.resumo_diario.principal_fator,
        })
        setAlerts(resolved.map((r) => r.alert))

        // Card de destaque: o único alerta cujo cliente ainda está saudável
        // hoje (rating A/B) — é o caso que ilustra "parece bem agora, mas
        // pode não estar em 12 meses". Alertas já críticos hoje não servem
        // para essa narrativa de projeção.
        const candidate = resolved.find(({ produtor }) => {
          const rating = classificacaoToRating(produtor.classificacao ?? 'MODERADO')
          return rating === 'A' || rating === 'B'
        })

        if (candidate) {
          const { alert, produtor } = candidate
          const currentRating = classificacaoToRating(produtor.classificacao ?? 'MODERADO')
          const safra = await getSafra(produtor.regiao, produtor.cultura)
          const projection = simulateProductivityImpact({
            currentScore: produtor.score ?? 0,
            currentRevenue: produtor.receita_esperada,
            fixedCosts: produtor.custo_total,
            productivityVariationPercent: safra.variacao_percentual,
          })

          if (!cancelled) {
            setFeatured({
              clientId: alert.clientId,
              clientName: alert.clientName,
              state: alert.state,
              currentScore: produtor.score ?? 0,
              currentRating,
              projectedScore: Math.round(projection.projectedScore),
              projectedRating: projection.projectedRating,
            })
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof KrillApiError
              ? err.message
              : 'Não foi possível carregar os alertas da carteira.',
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <PageShell
        title="Exposição da carteira"
        subtitle="Calculando onde está o dinheiro em risco..."
        icon={<Logo className="h-5 w-5" />}
        iconBgClassName="bg-sage-100"
      >
        <div className="mx-auto flex max-w-4xl items-center justify-center gap-2 rounded-2xl border border-sage-200/70 bg-white p-10 text-sm text-sage-500 shadow-softer">
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.2} />
          Consultando os agentes de risco...
        </div>
      </PageShell>
    )
  }

  if (error || !summary) {
    return (
      <PageShell
        title="Exposição da carteira"
        subtitle="Não foi possível carregar a exposição da carteira."
        icon={<Logo className="h-5 w-5" />}
        iconBgClassName="bg-sage-100"
      >
        <div className="mx-auto max-w-4xl rounded-2xl border border-sage-200/70 bg-white p-8 text-center text-sm text-alert-red-600 shadow-softer">
          {error ?? 'Nenhum dado disponível.'}
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell
      title="Exposição da carteira"
      subtitle="Onde está o dinheiro que merece sua atenção agora."
      icon={<Logo className="h-5 w-5" />}
      iconBgClassName="bg-sage-100"
    >
      <div className="relative overflow-hidden">
        <img
          src={logoMark}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-16 h-[26rem] w-[26rem] rotate-12 object-contain opacity-[0.05]"
        />
        <img
          src={logoMark}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -left-28 top-[38rem] h-[24rem] w-[24rem] -rotate-6 object-contain opacity-[0.045]"
        />
        <img
          src={logoMark}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rotate-6 object-contain opacity-[0.04]"
        />

        <div className="relative mx-auto flex max-w-6xl flex-col gap-8">
          {statusMonitoramento && (
            <MonitoringStatusBar
              ultimaVerificacao={statusMonitoramento.ultimaVerificacao}
              clientesMonitorados={statusMonitoramento.clientesMonitorados}
            />
          )}

          <ExposureHero summary={summary} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {produtores.length > 0 && (
            <section className="rounded-2xl border border-sage-200/70 bg-white p-5 shadow-softer sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-md">
                  <h3 className="text-base font-semibold text-forest-950">
                    Radar de risco x exposição
                  </h3>
                  <p className="mt-1 text-sm text-sage-600">
                    Quem está no canto inferior esquerdo é quem mais pode fazer a KRILLTECH
                    perder dinheiro se o cenário piorar: score baixo e exposição alta ao mesmo
                    tempo.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/carteira')}
                  className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-full border border-sage-200 bg-white px-4 py-2 text-sm font-semibold text-forest-800 shadow-softer transition-all hover:border-forest-300 hover:shadow-soft active:scale-[0.98]"
                >
                  Ver carteira completa
                  <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
                </button>
              </div>
              <div className="mt-5">
                <RiskExposureRadar produtores={produtores} />
              </div>
            </section>
          )}

          <section>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-sage-500">
              Alertas prioritários
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {alerts.map((alert) => (
                <PriorityAlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </section>
        </div>

        {featured && (
          <section>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-sage-500">
              Destaque do dia · por que este alerta é urgente
            </h3>
            <RiskProjection
              clientId={featured.clientId}
              clientName={featured.clientName}
              state={featured.state}
              currentScore={featured.currentScore}
              currentRating={featured.currentRating}
              projectedScore={featured.projectedScore}
              projectedRating={featured.projectedRating}
            />
          </section>
        )}
        </div>
      </div>
    </PageShell>
  )
}

export default Dashboard
