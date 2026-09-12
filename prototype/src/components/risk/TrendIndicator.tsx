import { ArrowDown, ArrowRight, ArrowUp } from 'lucide-react'
import type { TrendDirection } from '../../types/risk'

interface TrendIndicatorProps {
  direction: TrendDirection
  value?: number
  label?: string
}

const icons: Record<TrendDirection, typeof ArrowUp> = {
  up: ArrowUp,
  down: ArrowDown,
  stable: ArrowRight,
}

const toneClasses: Record<TrendDirection, string> = {
  up: 'text-alert-orange-600',
  down: 'text-forest-600',
  stable: 'text-sage-500',
}

function TrendIndicator({ direction, value, label }: TrendIndicatorProps) {
  const Icon = icons[direction]

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-sage-500">
        Tendência
      </p>
      <p className={`mt-1.5 flex items-center gap-1.5 text-2xl font-bold ${toneClasses[direction]}`}>
        <Icon className="h-5 w-5" strokeWidth={2.6} />
        {typeof value === 'number' && (
          <span>{value > 0 ? `+${value}` : value} pts</span>
        )}
      </p>
      {label && <p className="mt-1.5 text-xs text-sage-500">{label}</p>}
    </div>
  )
}

export default TrendIndicator
