import { CloudRain, Leaf, Scale, Building2 } from 'lucide-react'
import type { RiskFactorKey } from '../../types/risk'

interface RiskFactorCardProps {
  factorKey: RiskFactorKey
  title: string
  status: string
  description: string
  source: string
}

const ICONS: Record<RiskFactorKey, typeof Scale> = {
  cadastral: Building2,
  judicial: Scale,
  ambiental: Leaf,
  clima: CloudRain,
}

const STATUS_TONE: Record<string, string> = {
  OK: 'text-forest-700 bg-forest-50',
  Atenção: 'text-alert-amber-600 bg-alert-amber-50',
  'Risco identificado': 'text-alert-orange-600 bg-alert-orange-50',
  'Risco elevado': 'text-alert-red-600 bg-alert-red-50',
}

function RiskFactorCard({ factorKey, title, status, description, source }: RiskFactorCardProps) {
  const Icon = ICONS[factorKey]
  const tone = STATUS_TONE[status] ?? 'text-sage-600 bg-sage-100'

  return (
    <div className="rounded-2xl border border-sage-200/70 bg-white p-4 shadow-softer transition-shadow hover:shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <span className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-sage-100 text-forest-700">
            <Icon className="h-4 w-4" strokeWidth={2} />
          </span>
          <p className="text-sm font-semibold text-forest-950">{title}</p>
        </span>
        <span className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${tone}`}>
          {status}
        </span>
      </div>
      <p className="mt-2.5 text-sm text-sage-600">{description}</p>
      <p className="mt-2 text-xs text-sage-400">Fonte: {source}</p>
    </div>
  )
}

export default RiskFactorCard
