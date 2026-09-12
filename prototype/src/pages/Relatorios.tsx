import { Download, FileCheck2, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import PageShell from '../components/layout/PageShell'
import RatingBadge from '../components/risk/RatingBadge'
import RecommendationCard from '../components/risk/RecommendationCard'
import RiskFactorCard from '../components/risk/RiskFactorCard'
import RiskScore from '../components/risk/RiskScore'
import type { ApiProdutor } from '../services/api/krillApi'
import {
  getProdutor,
  getScoreDetalhado,
  getSintese,
  getTimelineDoProdutor,
  KrillApiError,
  type FatorScoring,
  type TimelineEvento,
} from '../services/api/staticData'
import { generateProdutorReportPdf } from '../services/report/generateProdutorReport'
import type { Rating } from '../types/risk'
import { RATING_META } from '../utils/rating'

const EVIDENCE_SOURCES = ['Receita Federal', 'CNJ / DataJud', 'IBAMA', 'Dados agroclimáticos']

// Cliente de referência para o relatório padronizado — o mesmo caso usado
// no roteiro do pitch (Fazenda Boa Vista Ltda.).
const REPORT_CLIENT_ID = '12345678000199'

const DEMO_PD_BY_RATING: Record<Rating, number> = { A: 8, B: 22, C: 41, D: 67 }

interface Sintese {
  texto_explicativo: string
  recomendacao: string
}

function Relatorios() {
  const [produtor, setProdutor] = useState<ApiProdutor | null>(null)
  const [score, setScore] = useState<{ score: number; rating: Rating; fatores: FatorScoring[] } | null>(null)
  const [sintese, setSintese] = useState<Sintese | null>(null)
  const [timeline, setTimeline] = useState<TimelineEvento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [produtorData, scoreData, sinteseData, timelineData] = await Promise.all([
          getProdutor(REPORT_CLIENT_ID),
          getScoreDetalhado(REPORT_CLIENT_ID),
          getSintese(REPORT_CLIENT_ID),
          getTimelineDoProdutor(REPORT_CLIENT_ID),
        ])
        if (cancelled) return
        setProdutor(produtorData)
        setScore(scoreData)
        setSintese(sinteseData)
        setTimeline(timelineData)
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof KrillApiError ? err.message : 'Não foi possível carregar o relatório.',
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

  async function handleDownload() {
    if (!produtor || !score) return
    setDownloading(true)
    try {
      await generateProdutorReportPdf({
        produtor,
        score,
        sintese,
        trendPoints: [],
        timeline,
      })
    } finally {
      setDownloading(false)
    }
  }

  const downloadButton = (
    <button
      type="button"
      onClick={handleDownload}
      disabled={!produtor || !score || downloading}
      className="inline-flex items-center gap-2 rounded-full bg-forest-700 px-4 py-2 text-sm font-semibold text-white shadow-softer transition-colors hover:bg-forest-800 disabled:cursor-not-allowed disabled:bg-sage-300"
    >
      {downloading ? (
        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.2} />
      ) : (
        <Download className="h-4 w-4" strokeWidth={2.2} />
      )}
      Baixar relatório completo
    </button>
  )

  if (loading) {
    return (
      <PageShell title="Relatório Padronizado de Risco" subtitle="Carregando...">
        <div className="mx-auto flex max-w-3xl items-center justify-center gap-2 rounded-2xl border border-sage-200/70 bg-white p-10 text-sm text-sage-500 shadow-softer">
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.2} />
          Gerando relatório...
        </div>
      </PageShell>
    )
  }

  if (error || !score || !produtor) {
    return (
      <PageShell title="Relatório Padronizado de Risco" subtitle="Não foi possível carregar.">
        <div className="mx-auto max-w-3xl rounded-2xl border border-sage-200/70 bg-white p-8 text-center text-sm text-alert-red-600 shadow-softer">
          {error ?? 'Nenhum dado disponível.'}
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell
      title="Relatório Padronizado de Risco"
      subtitle={`${produtor.nome} · gerado em 12/05/2025`}
      actions={downloadButton}
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-sage-200/70 bg-white p-8 shadow-softer sm:p-10">
        <div className="flex items-center gap-2.5 border-b border-sage-100 pb-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest-50 text-forest-700">
            <FileCheck2 className="h-[18px] w-[18px]" strokeWidth={2} />
          </span>
          <div>
            <p className="text-sm font-semibold text-forest-950">Cliente</p>
            <p className="text-sm text-sage-600">{produtor.nome}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-12 gap-y-6 border-b border-sage-100 pb-6">
          <RiskScore
            score={score.score}
            label="Score"
            barClasses={RATING_META[score.rating].barClasses}
          />
          <RatingBadge rating={score.rating} />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-sage-500">
              Probabilidade projetada de inadimplência
            </p>
            <p className="mt-1.5 font-display text-3xl font-extrabold text-alert-orange-600">
              {DEMO_PD_BY_RATING[score.rating]}%
            </p>
            <p className="mt-1 text-xs text-sage-400">em 12 meses · valor demonstrativo</p>
          </div>
        </div>

        <div className="border-b border-sage-100 py-6">
          <p className="text-sm font-semibold text-forest-950">Fatores</p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {score.fatores.map((fator) => (
              <RiskFactorCard key={fator.factorKey} {...fator} />
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
            title={sintese?.recomendacao ?? 'Sem recomendação disponível.'}
            body="Sugestão de apoio à decisão — a decisão final permanece com o gestor."
          />
        </div>
      </div>
    </PageShell>
  )
}

export default Relatorios
