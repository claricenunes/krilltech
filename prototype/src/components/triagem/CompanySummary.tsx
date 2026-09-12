import type { CompanyData } from '../../types/company'
import { formatCnpj } from '../../utils/cnpj'

function CompanySummary({ company }: { company: CompanyData }) {
  const location = [company.municipio, company.uf].filter(Boolean).join(' / ')

  return (
    <div className="rounded-2xl border border-sage-200/70 bg-white p-6 shadow-softer animate-fade-up">
      <p className="text-lg font-semibold text-forest-950">
        {company.razaoSocial}
      </p>
      {company.nomeFantasia && (
        <p className="text-sm text-sage-500">{company.nomeFantasia}</p>
      )}

      <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 text-sm text-forest-700 sm:grid-cols-2">
        <div>
          <dt className="text-xs text-sage-400">CNPJ</dt>
          <dd>{formatCnpj(company.cnpj)}</dd>
        </div>
        {company.situacaoCadastral && (
          <div>
            <dt className="text-xs text-sage-400">Situação</dt>
            <dd>{company.situacaoCadastral}</dd>
          </div>
        )}
        {company.naturezaJuridica && (
          <div>
            <dt className="text-xs text-sage-400">Natureza jurídica</dt>
            <dd>{company.naturezaJuridica}</dd>
          </div>
        )}
        {location && (
          <div>
            <dt className="text-xs text-sage-400">Localização</dt>
            <dd>{location}</dd>
          </div>
        )}
        {company.cnaePrincipal && (
          <div className="sm:col-span-2">
            <dt className="text-xs text-sage-400">Atividade principal (CNAE)</dt>
            <dd>{company.cnaePrincipal}</dd>
          </div>
        )}
      </dl>

      {typeof company.notaCadastral === 'number' && (
        <div className="mt-4 rounded-xl border border-sage-200/70 bg-cream-25 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium uppercase tracking-wide text-sage-500">
              Nota cadastral
            </p>
            <span className="font-display text-xl font-extrabold text-forest-950">
              {company.notaCadastral}/100
            </span>
          </div>
          {company.justificativaCadastral && (
            <p className="mt-1.5 text-sm text-sage-600">{company.justificativaCadastral}</p>
          )}
        </div>
      )}

      <div className="mt-4 border-t border-sage-100 pt-4">
        <p className="text-xs text-sage-400">Fonte: {company.fonte ?? 'BrasilAPI'}</p>
      </div>
    </div>
  )
}

export default CompanySummary
