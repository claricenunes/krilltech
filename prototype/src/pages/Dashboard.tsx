import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import ExposureHero from '../components/dashboard/ExposureHero'
import PriorityAlertCard from '../components/dashboard/PriorityAlertCard'
import RiskProjection from '../components/dashboard/RiskProjection'
import PageShell from '../components/layout/PageShell'
import { classificacaoToRating } from '../services/api/mappers'
import { simulateProductivityImpact } from '../services/scoring/simulator'
import {
  getAlertasDashboard,
  getProdutor,
  getSafra,
  KrillApiError,
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
  const [summary, setSummary] = useState<HomeSummary | null>(null)
  const [alerts, setAlerts] = useState<PriorityAlert[]>([])
  const [featured, setFeatured] = useState<FeaturedProjection | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const dashboard = await getAlertasDashboard()

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
      <PageShell title="Exposição da carteira" subtitle="Calculando onde está o dinheiro em risco...">
        <div className="mx-auto flex max-w-4xl items-center justify-center gap-2 rounded-2xl border border-sage-200/70 bg-white p-10 text-sm text-sage-500 shadow-softer">
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.2} />
          Consultando os agentes de risco...
        </div>
      </PageShell>
    )
  }

  if (error || !summary) {
    return (
      <PageShell title="Exposição da carteira" subtitle="Não foi possível carregar a exposição da carteira.">
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
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <ExposureHero summary={summary} />

        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-sage-500">
            Alertas prioritários
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {alerts.map((alert) => (
              <PriorityAlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </section>

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
    </PageShell>
  )
}

export default Dashboard
