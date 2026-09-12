import { CloudRain, Leaf, Scale, Building2, Wallet } from 'lucide-react'
import type { ImpactLevel, RiskFactorKey } from '../../types/risk'

interface ImpactFactorRowProps {
  factorKey: RiskFactorKey
  title: string
  impact: ImpactLevel
}

const ICONS: Record<RiskFactorKey, typeof Scale> = {
  cadastral: Building2,
  judicial: Scale,
  ambiental: Leaf,
  clima: CloudRain,
  financeiro: Wallet,
}

const IMPACT_META: Record<ImpactLevel, { label: string; tone: string; barClasses: string; width: string }> = {
  alto: {
    label: 'Alto impacto',
    tone: 'text-alert-red-600 bg-alert-red-50',
    barClasses: 'bg-alert-red-500',
    width: 'w-full',
  },
  medio: {
    label: 'Médio impacto',
    tone: 'text-alert-orange-600 bg-alert-orange-50',
    barClasses: 'bg-alert-orange-500',
    width: 'w-2/3',
  },
  baixo: {
    label: 'Baixo impacto',
    tone: 'text-sage-600 bg-sage-100',
    barClasses: 'bg-sage-400',
    width: 'w-1/3',
  },
}

function ImpactFactorRow({ factorKey, title, impact }: ImpactFactorRowProps) {
  const Icon = ICONS[factorKey]
  const meta = IMPACT_META[impact]

  return (
    <div className="flex items-center gap-4 py-3">
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-sage-100 text-forest-700">
        <Icon className="h-4 w-4" strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-forest-950">{title}</p>
        <div className="mt-1.5 h-1.5 w-full max-w-[220px] overflow-hidden rounded-full bg-sage-100">
          <div className={`h-full rounded-full ${meta.barClasses} ${meta.width}`} />
        </div>
      </div>
      <span className={`flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${meta.tone}`}>
        {meta.label}
      </span>
    </div>
  )
}

export default ImpactFactorRow
