import { MapPin } from 'lucide-react'
import regiaoPhoto from '../../fundo.avif'
import type { CompanyData } from '../../types/company'
import { formatCnpj } from '../../utils/cnpj'

interface CompanySummaryProps {
  company: CompanyData
  cultura?: string
  regiao?: string
}

function CompanySummary({ company, cultura, regiao }: CompanySummaryProps) {
  const location = [company.municipio, company.uf].filter(Boolean).join(' / ')

  return (
    <div className="overflow-hidden rounded-2xl border border-sage-200/70 bg-white shadow-softer animate-fade-up">
      {location && (
        <div className="relative h-36 w-full sm:h-44">
          <img src={regiaoPhoto} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/20 to-transparent" />
          <span className="absolute right-3 top-3 rounded-full bg-forest-950/50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-forest-100">
            Imagem ilustrativa da região
          </span>
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-white">
              <MapPin className="h-4 w-4 flex-shrink-0" strokeWidth={2.4} />
              {location}
            </p>
            {(cultura || regiao) && (
              <p className="mt-0.5 text-xs text-forest-100/80">
                {[cultura && `Cultura: ${cultura}`, regiao].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="p-6">
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
    </div>
  )
}

export default CompanySummary
