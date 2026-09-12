import { CloudRain, FileCheck2, Leaf, Scale, Wallet } from 'lucide-react'
import type { RiskFactorKey } from '../../types/risk'

interface RiskFactorCardProps {
  factorKey: RiskFactorKey
  title: string
  weight: number
  status: string
  description?: string
}

const ICONS: Record<RiskFactorKey, typeof Scale> = {
  judicial: Scale,
  ambiental: Leaf,
  clima: CloudRain,
  financeiro: Wallet,
  cadastral: FileCheck2,
}

const STATUS_TONE: Record<string, string> = {
  'Risco crítico': 'text-alert-red-600 bg-alert-red-50',
  Crítico: 'text-alert-red-600 bg-alert-red-50',
  'Risco elevado': 'text-alert-orange-600 bg-alert-orange-50',
  Atenção: 'text-alert-amber-600 bg-alert-amber-50',
  'Risco moderado': 'text-alert-amber-600 bg-alert-amber-50',
  Regular: 'text-forest-700 bg-forest-50',
  Estável: 'text-forest-700 bg-forest-50',
  Saudável: 'text-forest-700 bg-forest-50',
}

function RiskFactorCard({ factorKey, title, weight, status, description }: RiskFactorCardProps) {
  const Icon = ICONS[factorKey]
  const tone = STATUS_TONE[status] ?? 'text-sage-600 bg-sage-100'

  return (
    <div className="rounded-2xl border border-sage-200/70 bg-white p-4 shadow-softer transition-shadow hover:shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sage-100 text-forest-700">
            <Icon className="h-4 w-4" strokeWidth={2.2} />
          </span>
          <p className="text-sm font-semibold text-forest-950">{title}</p>
        </span>
        <span className="text-xs font-medium text-sage-400">peso {weight}%</span>
      </div>
      <span className={`mt-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${tone}`}>
        {status}
      </span>
      {description && (
        <p className="mt-2 text-sm text-sage-600">{description}</p>
      )}
    </div>
  )
}

export default RiskFactorCard
