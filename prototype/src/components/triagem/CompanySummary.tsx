import { Building2 } from 'lucide-react'
import type { CompanyData } from '../../types/company'
import { formatCnpj } from '../../utils/cnpj'
import DataSourceTag from '../risk/DataSourceTag'

function CompanySummary({ company }: { company: CompanyData }) {
  const location = [company.municipio, company.uf].filter(Boolean).join(' / ')
  const address = [company.logradouro, company.bairro]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="rounded-2xl border border-sage-200/70 bg-white p-6 shadow-softer animate-fade-up">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage-100 text-forest-700">
          <Building2 className="h-[18px] w-[18px]" strokeWidth={2.1} />
        </span>
        <p className="text-xs font-semibold uppercase tracking-wide text-sage-500">
          Cliente identificado
        </p>
      </div>

      <p className="mt-3 text-lg font-semibold text-forest-950">
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
        {address && (
          <div>
            <dt className="text-xs text-sage-400">Endereço</dt>
            <dd>{address}</dd>
          </div>
        )}
      </dl>

      <div className="mt-4 flex items-center justify-between border-t border-sage-100 pt-4">
        <p className="text-xs text-sage-400">Fonte: BrasilAPI</p>
        <DataSourceTag type="REAL" />
      </div>
    </div>
  )
}

export default CompanySummary
