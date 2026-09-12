import { ArrowLeft, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'
import ScreeningResult from '../components/risk/ScreeningResult'
import SimulatorPanel from '../components/simulator/SimulatorPanel'
import {
  getProdutor,
  getScoreDetalhado,
  getSintese,
  getTimelineDoProdutor,
  KrillApiError,
  type FatorScoring,
  type TimelineEvento,
} from '../services/api/staticData'
import type { ApiProdutor } from '../services/api/krillApi'
import { classificacaoToStatus } from '../services/api/mappers'
import { LIMITACOES_MODELO } from '../data/relatorioLimitacoes'
import type { Evidence } from '../types/risk'
import { formatDate } from '../utils/date'
import { STATUS_META } from '../utils/rating'

function construirEvidencias(produtor: ApiProdutor): Evidence[] {
  return [
    {
      title: 'Situação cadastral',
      description: `${produtor.situacao_cadastral === 'ATIVA' ? 'Empresa ativa' : produtor.situacao_cadastral}, CAR ${produtor.car_regular ? 'regular' : 'irregular'}.`,
      source: 'Cadastro da carteira',
      sourceType: 'MOCK',
    },
    {
      title: 'Situação judicial',
      description: produtor.recuperacao_judicial
        ? 'Recuperação judicial em curso.'
        : produtor.processos_judiciais > 0
          ? `${produtor.processos_judiciais} processo(s) judicial(is) identificado(s), sem recuperação judicial.`
          : 'Nenhum processo judicial relevante identificado.',
      source: 'Base jurídica (mock)',
      sourceType: 'MOCK',
    },
    {
      title: 'Conformidade ambiental',
      description: produtor.ibama_embargo_ativo
        ? 'Embargo ambiental ativo identificado em área de produção.'
        : 'Sem embargos ambientais ativos.',
      source: 'IBAMA (mock)',
      sourceType: 'MOCK',
    },
    {
      title: 'Produtividade da região',
      description: `Produtividade projetada de ${produtor.produtividade_projetada} sc/ha, frente a uma média histórica de ${produtor.produtividade_media_ha} sc/ha na região ${produtor.regiao}.`,
      source: 'Dados agroclimáticos (mock)',
      sourceType: 'MOCK',
    },
  ]
}

const TIMELINE_LABELS: Record<TimelineEvento['tipo'], string> = {
  cadastral: 'Cadastral',
  comercial: 'Comercial',
  financeiro: 'Financeiro',
  juridico: 'Jurídico',
  climatico: 'Climático',
  score: 'Score',
}

function Produtor() {
  const { id } = useParams()
  const [produtor, setProdutor] = useState<ApiProdutor | null>(null)
  const [score, setScore] = useState<{ score: number; rating: 'A' | 'B' | 'C' | 'D'; fatores: FatorScoring[] } | null>(null)
  const [sintese, setSintese] = useState<{ texto_explicativo: string; recomendacao: string } | null>(null)
  const [timeline, setTimeline] = useState<TimelineEvento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const [produtorData, scoreData, sinteseData, timelineData] = await Promise.all([
          getProdutor(id as string),
          getScoreDetalhado(id as string),
          getSintese(id as string),
          getTimelineDoProdutor(id as string),
        ])

        if (cancelled) return
        setProdutor(produtorData)
        setScore(scoreData)
        setSintese(sinteseData)
        setTimeline(timelineData)
      } catch (err) {
        if (!cancelled) {
          setProdutor(null)
          setScore(null)
          setError(
            err instanceof KrillApiError
              ? err.message
              : 'Não foi possível carregar este produtor.',
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
      <PageShell title="Carregando..." subtitle="Consultando os dados de demonstração.">
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
            {error ?? 'Não encontramos um cliente com este identificador na carteira demonstrativa.'}
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

  const status = classificacaoToStatus(produtor.classificacao ?? 'MODERADO')
  const ultimoEvento = timeline[timeline.length - 1]
  const atualizadoEm = ultimoEvento ? formatDate(ultimoEvento.data) : formatDate(new Date().toISOString())

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
          MOCK — dados de demonstração para {produtor.nome}, sem relação com clientes reais da
          KRILLTECH. cliente_id: {produtor.cliente_id}.
        </div>

        <ScreeningResult
          clientName={produtor.nome}
          document={produtor.cliente_id}
          score={score.score}
          rating={score.rating}
          operationalStatus={STATUS_META[status].label}
          trend={{ direction: 'stable', label: 'Ver histórico completo na timeline abaixo.' }}
          factors={score.fatores}
          evidences={construirEvidencias(produtor)}
          recommendationTitle="Recomendação do Sentinela Krill"
          recommendationBody={sintese?.recomendacao ?? ''}
          atualizadoEm={atualizadoEm}
          limitacoes={LIMITACOES_MODELO}
        />

        {sintese && (
          <section className="rounded-2xl border border-sage-200/70 bg-white p-5 shadow-softer sm:p-6">
            <h3 className="text-base font-semibold text-forest-950">Explicação do score</h3>
            <p className="mt-2 text-sm text-sage-600">{sintese.texto_explicativo}</p>
          </section>
        )}

        {timeline.length > 0 && (
          <section className="rounded-2xl border border-sage-200/70 bg-white p-5 shadow-softer sm:p-6">
            <h3 className="text-base font-semibold text-forest-950">Histórico de eventos</h3>
            <ol className="mt-4 flex flex-col gap-4">
              {timeline.map((evento, index) => (
                <li key={index} className="flex gap-3 border-l-2 border-sage-200 pl-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-sage-400">
                      {evento.data} · {TIMELINE_LABELS[evento.tipo]}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-forest-950">{evento.titulo}</p>
                    <p className="mt-0.5 text-sm text-sage-600">{evento.descricao}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        <SimulatorPanel
          currentScore={score.score}
          currentRating={score.rating}
          currentRevenue={produtor.receita_esperada}
          fixedCosts={produtor.custo_total}
        />
      </div>
    </PageShell>
  )
}

export default Produtor
