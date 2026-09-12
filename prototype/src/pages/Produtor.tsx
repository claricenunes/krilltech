import { ArrowLeft, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'
import ScreeningResult from '../components/risk/ScreeningResult'
import SimulatorPanel from '../components/simulator/SimulatorPanel'
import {
  getProdutor,
  getScore,
  KrillApiError,
  type ApiProdutor,
  type ApiScoreResult,
} from '../services/api/krillApi'
import {
  buildRecommendation,
  classificacaoToRating,
  classificacaoToStatus,
  fatorNotaToRiskFactor,
} from '../services/api/mappers'
import { STATUS_META } from '../utils/rating'

function Produtor() {
  const { id } = useParams()
  const [produtor, setProdutor] = useState<ApiProdutor | null>(null)
  const [score, setScore] = useState<ApiScoreResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const [produtorData, scoreData] = await Promise.all([
          getProdutor(id as string),
          getScore(id as string),
        ])

        if (cancelled) return
        setProdutor(produtorData)
        setScore(scoreData)
      } catch (err) {
        if (!cancelled) {
          setProdutor(null)
          setScore(null)
          setError(
            err instanceof KrillApiError
              ? err.message
              : 'Não foi possível carregar este produtor na API local.',
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
  }, [id])

  if (loading) {
    return (
      <PageShell title="Carregando..." subtitle="Consultando a API local em http://localhost:8000.">
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-sage-200/70 bg-white p-8 text-sm text-sage-500 shadow-softer">
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.2} />
          Carregando produtor...
        </div>
      </PageShell>
    )
  }

  if (error || !produtor || !score) {
    return (
      <PageShell title="Cliente não encontrado" subtitle="Verifique o link acessado.">
        <div className="rounded-2xl border border-sage-200/70 bg-white p-8 text-center shadow-softer">
          <p className="text-sm text-sage-500">
            {error ?? 'Não encontramos um cliente com este identificador na API local.'}
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

  const rating = classificacaoToRating(score.classificacao)
  const status = classificacaoToStatus(score.classificacao)
  const factors = score.notas_fatores.map(fatorNotaToRiskFactor)
  const recommendation = buildRecommendation(score.notas_fatores)

  return (
    <PageShell
      title={produtor.nome}
      subtitle={`${produtor.cultura} · ${produtor.regiao}`}
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
          Dados calculados ao vivo pela API local (http://localhost:8000) — cliente_id:{' '}
          {produtor.cliente_id}.
        </div>

        <ScreeningResult
          clientName={produtor.nome}
          document={produtor.cliente_id}
          score={score.score}
          rating={rating}
          operationalStatus={STATUS_META[status].label}
          trend={{ direction: 'stable', label: 'Tendência histórica não disponível na API local.' }}
          factors={factors}
          evidences={[]}
          recommendationTitle={recommendation.title}
          recommendationBody={recommendation.body}
        />

        <SimulatorPanel
          clienteId={produtor.cliente_id}
          currentScore={score.score}
          currentRating={rating}
          currentRevenue={produtor.receita_esperada}
          fixedCosts={produtor.custo_total}
        />
      </div>
    </PageShell>
  )
}

export default Produtor
