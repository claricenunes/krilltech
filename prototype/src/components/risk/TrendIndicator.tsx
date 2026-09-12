import type { TrendDirection } from '../../types/risk'

interface TrendIndicatorProps {
  direction: TrendDirection
  value?: number
  label?: string
}

const arrows: Record<TrendDirection, string> = {
  up: '↑',
  down: '↓',
  stable: '→',
}

const toneClasses: Record<TrendDirection, string> = {
  up: 'text-amber-700',
  down: 'text-emerald-700',
  stable: 'text-stone-500',
}

function TrendIndicator({ direction, value, label }: TrendIndicatorProps) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
        Tendência
      </p>
      <p className={`mt-1 text-3xl font-semibold ${toneClasses[direction]}`}>
        {arrows[direction]}
        {typeof value === 'number' && (
          <span className="ml-1 text-2xl">
            {value > 0 ? `+${value}` : value} pontos
          </span>
        )}
      </p>
      {label && <p className="mt-1.5 text-xs text-stone-400">{label}</p>}
    </div>
  )
}

export default TrendIndicator
