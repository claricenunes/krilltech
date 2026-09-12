import type { RatingDistributionEntry } from '../../types/portfolio'
import { RATING_HEX } from '../../utils/rating'

interface RiskDistributionChartProps {
  entries: RatingDistributionEntry[]
  total: number
}

const RADIUS = 54
const STROKE = 18
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function RiskDistributionChart({ entries, total }: RiskDistributionChartProps) {
  const segments = entries.reduce<Array<{ entry: RatingDistributionEntry; offset: number }>>(
    (acc, entry) => {
      const previous = acc[acc.length - 1]
      const offset = previous ? previous.offset + previous.entry.percent : 0
      return [...acc, { entry, offset }]
    },
    [],
  )

  return (
    <div className="flex flex-col gap-6 @sm:flex-row @sm:items-center">
      <div className="relative mx-auto h-40 w-40 flex-shrink-0 sm:mx-0">
        <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
          <circle
            cx="70"
            cy="70"
            r={RADIUS}
            fill="none"
            stroke="#edf2e6"
            strokeWidth={STROKE}
          />
          {segments.map(({ entry, offset: percentOffset }) => {
            const dash = (entry.percent / 100) * CIRCUMFERENCE
            const offset = (percentOffset / 100) * CIRCUMFERENCE
            return (
              <circle
                key={entry.rating}
                cx="70"
                cy="70"
                r={RADIUS}
                fill="none"
                stroke={RATING_HEX[entry.rating]}
                strokeWidth={STROKE}
                strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
                className="animate-scale-in"
              />
            )
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-extrabold text-forest-950">
            {total}
          </span>
          <span className="text-xs text-sage-500">clientes</span>
        </div>
      </div>

      <ul className="flex flex-1 flex-col gap-3">
        {entries.map((entry) => (
          <li key={entry.rating} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2.5 text-forest-900">
              <span
                className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                style={{ backgroundColor: RATING_HEX[entry.rating] }}
              />
              {entry.label}
            </span>
            <span className="flex items-center gap-2 text-sage-500">
              <span className="font-medium text-forest-800">{entry.count}</span>
              {entry.percent.toFixed(1).replace('.', ',')}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RiskDistributionChart
