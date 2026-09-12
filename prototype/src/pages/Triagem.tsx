import { useState } from 'react'
import CnpjInput from '../components/triagem/CnpjInput'
import CompanySummary from '../components/triagem/CompanySummary'
import PageShell from '../components/layout/PageShell'
import ScreeningResult from '../components/risk/ScreeningResult'
import SimulatorPanel from '../components/simulator/SimulatorPanel'
import { getClientById } from '../data/mockClients'
import { mockRiskReport } from '../data/mock-risk'
import { BrasilApiError, getCompanyByCnpj } from '../services/api/brasilapi'
import type { CompanyData } from '../types/company'

type Status = 'idle' | 'loading' | 'success' | 'error'

const demoFinancials = getClientById('fazenda-boa-vista')!

function Triagem() {
  const [status, setStatus] = useState<Status>('idle')
  const [company, setCompany] = useState<CompanyData | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleAnalyze(cnpj: string) {
    setStatus('loading')
    setErrorMessage(null)

    try {
      const data = await getCompanyByCnpj(cnpj)
      setCompany(data)
      setStatus('success')
    } catch (error) {
      setCompany(null)
      setStatus('error')
      setErrorMessage(
        error instanceof BrasilApiError
          ? error.message
          : 'Não foi possível consultar este CNPJ. Tente novamente.',
      )
    }
  }

  return (
    <PageShell
      title="Nova triagem"
      subtitle="Avalie um novo cliente antes de ampliar sua exposição de crédito."
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <CnpjInput onSubmit={handleAnalyze} isLoading={status === 'loading'} />

        {status === 'idle' && (
          <p className="text-center text-sm text-sage-400">
            Digite o CNPJ para iniciar uma nova triagem.
          </p>
        )}

        {status === 'error' && errorMessage && (
          <p className="text-center text-sm text-alert-red-600">{errorMessage}</p>
        )}

        {status === 'success' && company && (
          <>
            <CompanySummary company={company} />

            <div className="rounded-xl border border-dashed border-sage-300 bg-sage-50 px-4 py-2.5 text-xs font-medium text-sage-500">
              MOCK — demonstração do fluxo. O motor definitivo de scoring
              ainda será implementado; este resultado não reflete o
              cadastro consultado acima.
            </div>

            <ScreeningResult
              clientName={mockRiskReport.clientName}
              document={company.cnpj}
              score={mockRiskReport.score}
              rating={mockRiskReport.rating}
              operationalStatus={mockRiskReport.operationalStatus}
              trend={mockRiskReport.trend}
              factors={mockRiskReport.factors}
              evidences={mockRiskReport.evidences}
              recommendationTitle={mockRiskReport.recommendationTitle}
              recommendationBody={mockRiskReport.recommendationBody}
            />

            <SimulatorPanel
              currentScore={mockRiskReport.score}
              currentRating={mockRiskReport.rating}
              currentRevenue={demoFinancials.annualRevenue}
              fixedCosts={demoFinancials.fixedCosts}
            />
          </>
        )}
      </div>
    </PageShell>
  )
}

export default Triagem
