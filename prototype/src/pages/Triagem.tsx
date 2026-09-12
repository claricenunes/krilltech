import { CheckCircle2, Circle, Loader2 } from 'lucide-react'
import { useState } from 'react'
import CnpjInput from '../components/triagem/CnpjInput'
import CompanySummary from '../components/triagem/CompanySummary'
import PageShell from '../components/layout/PageShell'
import ScreeningResult from '../components/risk/ScreeningResult'
import {
  fetchAgroclima,
  getColetorPorCnpj,
  getScoreDetalhado,
  getSintese,
  KrillApiError,
  type FatorScoring,
} from '../services/api/staticData'
import type { CompanyData } from '../types/company'

type Status = 'idle' | 'loading' | 'success' | 'error'

const STEPS = [
  { label: 'Coletando dados cadastrais e jurídicos...', delay: 800 },
  { label: 'Analisando risco climático da região...', delay: 700 },
  { label: 'Calculando score de risco...', delay: 500 },
  { label: 'Gerando relatório explicativo...', delay: 900 },
]

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

interface TriagemResultado {
  company: CompanyData
  score: number
  rating: 'A' | 'B' | 'C' | 'D'
  fatores: FatorScoring[]
  recomendacao: string
  textoExplicativo: string
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
      await delay(STEPS[0].delay)
      const coletor = await getColetorPorCnpj(cnpj)

      setCurrentStep(1)
      await delay(STEPS[1].delay)
      const agroclima = await fetchAgroclima()
      const clima = agroclima[coletor.regiao]

      setCurrentStep(2)
      await delay(STEPS[2].delay)
      const scoring = await getScoreDetalhado(cnpj)

      setCurrentStep(3)
      await delay(STEPS[3].delay)
      const sintese = await getSintese(cnpj)

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
        score: scoring.score,
        rating: scoring.rating,
        fatores: scoring.fatores,
        recomendacao: sintese.recomendacao,
        textoExplicativo: clima
          ? sintese.texto_explicativo
          : `${sintese.texto_explicativo} (Dados climáticos da região ${coletor.regiao} indisponíveis.)`,
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
          <div className="rounded-2xl border border-sage-200/70 bg-white p-6 shadow-softer sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-sage-500">
              Pipeline de análise
            </p>
            <ol className="mt-4 flex flex-col gap-3">
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
                      className={`text-sm ${
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
            <CompanySummary company={resultado.company} />

            <div className="rounded-xl border border-dashed border-sage-300 bg-sage-50 px-4 py-2.5 text-xs font-medium text-sage-500">
              MOCK — demonstração do fluxo de 4 agentes (coleta → risco agroclimático → scoring →
              síntese). Dados fictícios, pré-calculados para esta demo.
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
              recommendationTitle="Recomendação do Sentinela Krill"
              recommendationBody={resultado.recomendacao}
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
