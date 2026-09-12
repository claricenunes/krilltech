import { CheckCircle2, Circle, Loader2 } from 'lucide-react'
import { useState } from 'react'
import type { ScoreTrendPoint } from '../components/charts/ScoreTrendChart'
import PageShell from '../components/layout/PageShell'
import DownloadReportButton from '../components/produtor/DownloadReportButton'
import CnpjInput from '../components/triagem/CnpjInput'
import CompanySummary from '../components/triagem/CompanySummary'
import ScreeningResult from '../components/risk/ScreeningResult'
import type { ApiProdutor } from '../services/api/krillApi'
import {
  fetchAgroclima,
  getColetorPorCnpj,
  getProdutor,
  getSafra,
  getScoreDetalhado,
  getSintese,
  getTimelineDoProdutor,
  KrillApiError,
  type FatorScoring,
  type TimelineEvento,
} from '../services/api/staticData'
import { calculateRating, simulateProductivityImpact } from '../services/scoring/simulator'
import type { CompanyData } from '../types/company'

/** Extrai "de X para Y" do texto do evento de recálculo de score, quando presente. */
function parsePreviousScore(descricao: string, currentScore: number): number {
  const match = descricao.match(/de (\d+) para (\d+)/)
  return match ? Number(match[1]) : currentScore
}

type Status = 'idle' | 'loading' | 'success' | 'error'

const STEPS = [
  { label: 'Consultando dados cadastrais da Receita Federal...', delay: 550 },
  { label: 'Consultando histórico judicial do CNJ...', delay: 500 },
  { label: 'Verificando embargos e dados ambientais do IBAMA...', delay: 500 },
  { label: 'Cruzando dados de safra e clima da região...', delay: 550 },
  { label: 'Simulando cenários de risco...', delay: 550 },
  { label: 'Gerando recomendação...', delay: 500 },
]

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

interface TriagemResultado {
  company: CompanyData
  produtor: ApiProdutor
  score: number
  rating: 'A' | 'B' | 'C' | 'D'
  fatores: FatorScoring[]
  recomendacao: string
  textoExplicativo: string
  trendPoints: ScoreTrendPoint[]
  timeline: TimelineEvento[]
}

function Triagem() {
  const [status, setStatus] = useState<Status>('idle')
  const [currentStep, setCurrentStep] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [resultado, setResultado] = useState<TriagemResultado | null>(null)

  async function handleAnalyze(cnpj: string) {
    setStatus('loading')
    setErrorMessage(null)
    setResultado(null)
    setCurrentStep(0)

    try {
      // Passos 2 e 3 (CNJ, IBAMA) narram o mesmo dado cadastral já trazido pelo
      // coletor — o protótipo estático não tem chamadas separadas para essas
      // fontes, então aqui é só a pausa visual que demonstra a orquestração.
      await delay(STEPS[0].delay)
      const coletor = await getColetorPorCnpj(cnpj)

      setCurrentStep(1)
      await delay(STEPS[1].delay)

      setCurrentStep(2)
      await delay(STEPS[2].delay)

      setCurrentStep(3)
      await delay(STEPS[3].delay)
      const agroclima = await fetchAgroclima()
      const clima = agroclima[coletor.regiao]

      setCurrentStep(4)
      await delay(STEPS[4].delay)
      const scoring = await getScoreDetalhado(cnpj)

      setCurrentStep(5)
      await delay(STEPS[5].delay)
      const [sintese, produtor, timeline] = await Promise.all([
        getSintese(cnpj),
        getProdutor(cnpj),
        getTimelineDoProdutor(cnpj),
      ])

      const scoreEvent = timeline.find((evento) => evento.tipo === 'score')
      const previousScore = scoreEvent
        ? parsePreviousScore(scoreEvent.descricao, scoring.score)
        : scoring.score

      const safra = await getSafra(produtor.regiao, produtor.cultura)
      const projection = simulateProductivityImpact({
        currentScore: scoring.score,
        currentRevenue: produtor.receita_esperada,
        fixedCosts: produtor.custo_total,
        productivityVariationPercent: safra.variacao_percentual,
      })

      setResultado({
        company: {
          cnpj: coletor.cnpj,
          razaoSocial: coletor.razao_social,
          situacaoCadastral: coletor.situacao_cadastral,
          naturezaJuridica: coletor.natureza_juridica,
          municipio: coletor.municipio,
          uf: coletor.uf,
          fonte: 'Dados de demonstração (mock)',
        },
        produtor,
        score: scoring.score,
        rating: scoring.rating,
        fatores: scoring.fatores,
        recomendacao: sintese.recomendacao,
        textoExplicativo: clima
          ? sintese.texto_explicativo
          : `${sintese.texto_explicativo} (Dados climáticos da região ${coletor.regiao} indisponíveis.)`,
        timeline,
        trendPoints: [
          { label: 'Histórico', score: previousScore, rating: calculateRating(previousScore) },
          { label: 'Atual', score: scoring.score, rating: scoring.rating },
          {
            label: 'Projetado',
            score: projection.projectedScore,
            rating: projection.projectedRating,
            projected: true,
          },
        ],
      })
      setStatus('success')
    } catch (error) {
      setStatus('error')
      setErrorMessage(
        error instanceof KrillApiError
          ? error.message
          : 'Não foi possível analisar este CNPJ. Tente novamente.',
      )
    }
  }

  return (
    <PageShell
      title="Nova triagem"
      subtitle="Avalie um novo cliente antes de ampliar sua exposição de crédito."
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <CnpjInput onSubmit={handleAnalyze} isLoading={status === 'loading'} />

        {status === 'idle' && (
          <p className="text-center text-sm text-sage-400">
            Digite um CNPJ da base de demonstração: 12345678000199, 98765432000110 ou
            45678912000133.
          </p>
        )}

        {status === 'loading' && (
          <div className="animate-fade-up rounded-2xl border border-sage-200/70 bg-white p-6 shadow-softer sm:p-8">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-sage-500">
                Orquestrador Sentinela · agentes em execução
              </p>
              <p className="text-xs font-medium tabular-nums text-sage-400">
                {currentStep + 1}/{STEPS.length}
              </p>
            </div>

            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-sage-100">
              <div
                className="h-full rounded-full bg-forest-600 transition-[width] duration-500 ease-out"
                style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
              />
            </div>

            <ol className="mt-5 flex flex-col gap-3">
              {STEPS.map((step, index) => {
                const isDone = index < currentStep
                const isCurrent = index === currentStep
                return (
                  <li key={step.label} className="flex items-center gap-3">
                    {isDone ? (
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-forest-600" strokeWidth={2} />
                    ) : isCurrent ? (
                      <Loader2 className="h-5 w-5 flex-shrink-0 animate-spin text-forest-600" strokeWidth={2} />
                    ) : (
                      <Circle className="h-5 w-5 flex-shrink-0 text-sage-300" strokeWidth={2} />
                    )}
                    <span
                      className={`text-sm transition-colors duration-300 ${
                        isCurrent ? 'font-semibold text-forest-950' : isDone ? 'text-forest-700' : 'text-sage-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </li>
                )
              })}
            </ol>
          </div>
        )}

        {status === 'error' && errorMessage && (
          <p className="text-center text-sm text-alert-red-600">{errorMessage}</p>
        )}

        {status === 'success' && resultado && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-forest-950">Resultado da triagem</p>
              <DownloadReportButton
                produtor={resultado.produtor}
                score={{ score: resultado.score, rating: resultado.rating, fatores: resultado.fatores }}
                sintese={{
                  texto_explicativo: resultado.textoExplicativo,
                  recomendacao: resultado.recomendacao,
                }}
                trendPoints={resultado.trendPoints}
                timeline={resultado.timeline}
              />
            </div>

            <CompanySummary
              company={resultado.company}
              cultura={resultado.produtor.cultura}
              regiao={resultado.produtor.regiao}
            />

            <div className="rounded-xl border border-dashed border-sage-300 bg-sage-50 px-4 py-2.5 text-xs font-medium text-sage-500">
              MOCK — demonstração do fluxo de agentes (Receita → CNJ → IBAMA → safra/clima →
              simulação → recomendação). Dados fictícios, pré-calculados para esta demo.
            </div>

            <ScreeningResult
              clientName={resultado.company.razaoSocial}
              document={resultado.company.cnpj}
              score={resultado.score}
              rating={resultado.rating}
              operationalStatus={resultado.rating === 'A' ? 'Saudável' : resultado.rating === 'D' ? 'Crítico' : 'Atenção'}
              trend={{ direction: 'stable' }}
              factors={resultado.fatores}
              evidences={[]}
              recommendationTitle={resultado.recomendacao}
              recommendationBody="Sugestão de apoio à decisão — a decisão final permanece com o gestor."
            />

            <section className="rounded-2xl border border-sage-200/70 bg-white p-5 shadow-softer sm:p-6">
              <h3 className="text-base font-semibold text-forest-950">Explicação do score</h3>
              <p className="mt-2 text-sm text-sage-600">{resultado.textoExplicativo}</p>
            </section>
          </>
        )}
      </div>
    </PageShell>
  )
}

export default Triagem
