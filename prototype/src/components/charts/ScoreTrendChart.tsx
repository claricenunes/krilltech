import type { Rating } from '../../types/risk'
import { RATING_HEX } from '../../utils/rating'

export interface ScoreTrendPoint {
  label: string
  score: number
  rating: Rating
  /** Ponto ainda não realizado — desenhado com linha tracejada até ele. */
  projected?: boolean
}

interface ScoreTrendChartProps {
  points: ScoreTrendPoint[]
}

const WIDTH = 640
const HEIGHT = 220
const PADDING = { top: 12, right: 16, bottom: 28, left: 40 }

const RATING_BANDS: Array<{ from: number; to: number; rating: Rating }> = [
  { from: 0, to: 400, rating: 'D' },
  { from: 400, to: 600, rating: 'C' },
  { from: 600, to: 800, rating: 'B' },
  { from: 800, to: 1000, rating: 'A' },
]

function scoreToY(score: number): number {
  const usable = HEIGHT - PADDING.top - PADDING.bottom
  const clamped = Math.min(1000, Math.max(0, score))
  return PADDING.top + usable - (clamped / 1000) * usable
}

function indexToX(index: number, total: number): number {
  const usable = WIDTH - PADDING.left - PADDING.right
  if (total <= 1) return PADDING.left + usable / 2
  return PADDING.left + (index / (total - 1)) * usable
}

/**
 * Linha do tempo do score: de onde veio, onde está hoje, e onde o cenário
 * simulado projeta se a produtividade cair — as bandas de fundo marcam as
 * zonas de rating (A/B/C/D) para que a queda de faixa fique visível, não só
 * numérica.
 */
function ScoreTrendChart({ points }: ScoreTrendChartProps) {
  const usableHeight = HEIGHT - PADDING.top - PADDING.bottom

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="w-full"
      role="img"
      aria-label="Evolução do score: histórico, atual e projetado"
    >
      {RATING_BANDS.map((band) => (
        <rect
          key={band.rating}
          x={PADDING.left}
          y={scoreToY(band.to)}
          width={WIDTH - PADDING.left - PADDING.right}
          height={(usableHeight * (band.to - band.from)) / 1000}
          fill={RATING_HEX[band.rating]}
          fillOpacity={0.06}
        />
      ))}

      {[0, 400, 600, 800, 1000].map((tick) => (
        <g key={tick}>
          <line
            x1={PADDING.left}
            x2={WIDTH - PADDING.right}
            y1={scoreToY(tick)}
            y2={scoreToY(tick)}
            stroke="var(--color-sage-200)"
            strokeWidth={1}
          />
          <text
            x={PADDING.left - 8}
            y={scoreToY(tick) + 3}
            textAnchor="end"
            className="fill-sage-500 text-[10px] font-medium"
          >
            {tick}
          </text>
        </g>
      ))}

      {points.slice(1).map((point, i) => {
        const prev = points[i]
        const x1 = indexToX(i, points.length)
        const x2 = indexToX(i + 1, points.length)
        return (
          <line
            key={point.label}
            x1={x1}
            y1={scoreToY(prev.score)}
            x2={x2}
            y2={scoreToY(point.score)}
            stroke="var(--color-forest-500)"
            strokeWidth={2.5}
            strokeDasharray={point.projected ? '6 5' : undefined}
          />
        )
      })}

      {points.map((point, i) => {
        const x = indexToX(i, points.length)
        const y = scoreToY(point.score)
        const isFirst = i === 0
        const isLast = i === points.length - 1
        const labelAnchor = isFirst ? 'start' : isLast ? 'end' : 'middle'
        return (
          <g key={point.label}>
            <circle
              cx={x}
              cy={y}
              r={point.projected ? 7 : 6}
              fill={RATING_HEX[point.rating]}
              stroke="white"
              strokeWidth={2}
            />
            <text
              x={x}
              y={HEIGHT - 8}
              textAnchor={labelAnchor}
              className="fill-sage-500 text-[10px] font-semibold uppercase tracking-wide"
            >
              {point.label}
            </text>
            <text
              x={x}
              y={y - 12}
              textAnchor="middle"
              className="fill-forest-950 text-xs font-bold"
            >
              {Math.round(point.score)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default ScoreTrendChart
