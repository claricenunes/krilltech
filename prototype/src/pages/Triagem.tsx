import { useState } from 'react'
import CnpjInput from '../components/triagem/CnpjInput'
import CompanySummary from '../components/triagem/CompanySummary'
import PageShell from '../components/layout/PageShell'
import StepHeader from '../components/layout/StepHeader'
import RatingBadge from '../components/risk/RatingBadge'
import RiskFactorCard from '../components/risk/RiskFactorCard'
import RiskScore from '../components/risk/RiskScore'
import { triageFactors, triageResult } from '../data/mock-risk'
import { BrasilApiError, getCompanyByCnpj } from '../services/api/brasilapi'
import type { CompanyData } from '../types/company'
import { RATING_META } from '../utils/rating'

type Status = 'idle' | 'loading' | 'success' | 'error'

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
      subtitle="Analise um cliente antes de ampliar sua exposição."
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <CnpjInput onSubmit={handleAnalyze} isLoading={status === 'loading'} />

        {status === 'error' && errorMessage && (
          <p className="text-center text-sm text-alert-red-600">{errorMessage}</p>
        )}

        {status === 'success' && company && (
          <>
            <div>
              <StepHeader step={1} title="Cliente identificado" />
              <CompanySummary company={company} />
            </div>

            <section className="rounded-2xl border border-sage-200/70 bg-white p-6 shadow-softer sm:p-8">
              <StepHeader step={2} title="Resultado da triagem" />
              <p className="text-base font-semibold text-forest-950">
                {company.razaoSocial}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-10 gap-y-5">
                <RiskScore
                  score={triageResult.score}
                  label="Score"
                  barClasses={RATING_META[triageResult.rating].barClasses}
                />
                <RatingBadge rating={triageResult.rating} />
              </div>
            </section>

            <div>
              <StepHeader step={3} title="Por que este score?" />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {triageFactors.map((factor) => (
                  <RiskFactorCard key={factor.factorKey} {...factor} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </PageShell>
  )
}

export default Triagem
