import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ApiProdutor } from '../../services/api/krillApi'
import { classificacaoToRating } from '../../services/api/mappers'
import { formatCurrencyCompact } from '../../utils/currency'
import { RATING_HEX } from '../../utils/rating'

interface RiskExposureRadarProps {
  produtores: ApiProdutor[]
}

const WIDTH = 720
const HEIGHT = 320
const PADDING = { top: 16, right: 24, bottom: 40, left: 48 }
const DANGER_SCORE_THRESHOLD = 600

function scaleScore(score: number): number {
  const usable = WIDTH - PADDING.left - PADDING.right
  const clamped = Math.min(1000, Math.max(0, score))
  // Score alto (baixo risco) à direita — risco cresce para a esquerda.
  return PADDING.left + (clamped / 1000) * usable
}

function scaleExposure(exposure: number, maxExposure: number): number {
  const usable = HEIGHT - PADDING.top - PADDING.bottom
  const ratio = maxExposure > 0 ? exposure / maxExposure : 0
  return PADDING.top + usable - ratio * usable
}

function scaleRadius(exposure: number, maxExposure: number): number {
  const min = 7
  const max = 22
  const ratio = maxExposure > 0 ? exposure / maxExposure : 0
  return min + ratio * (max - min)
}

/**
 * Dispersão score x exposição — o "radar de carteira": quem está no canto
 * inferior esquerdo (score baixo, exposição alta) é quem mais pode fazer a
 * KRILLTECH perder dinheiro se piorar. Não é um dashboard de números; é a
 * pergunta "quem eu preciso olhar primeiro" respondida visualmente.
 */
function RiskExposureRadar({ produtores }: RiskExposureRadarProps) {
  const navigate = useNavigate()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [hoveredPosition, setHoveredPosition] = useState<{ cx: number; cy: number } | null>(null)

  const maxExposure = useMemo(
    () => Math.max(...produtores.map((p) => p.exposicao), 1),
    [produtores],
  )

  const dangerZoneX = scaleScore(DANGER_SCORE_THRESHOLD)
  const hovered = produtores.find((p) => p.cliente_id === hoveredId) ?? null

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        role="img"
        aria-label="Dispersão de produtores por score de risco e exposição"
      >
        <rect
          x={PADDING.left}
          y={PADDING.top}
          width={dangerZoneX - PADDING.left}
          height={HEIGHT - PADDING.top - PADDING.bottom}
          fill="var(--color-alert-red-50)"
        />

        {[0, 250, 500, 750, 1000].map((tick) => (
          <line
            key={tick}
            x1={scaleScore(tick)}
            x2={scaleScore(tick)}
            y1={PADDING.top}
            y2={HEIGHT - PADDING.bottom}
            stroke="var(--color-sage-200)"
            strokeWidth={1}
          />
        ))}

        <line
          x1={PADDING.left}
          x2={WIDTH - PADDING.right}
          y1={HEIGHT - PADDING.bottom}
          y2={HEIGHT - PADDING.bottom}
          stroke="var(--color-sage-300)"
          strokeWidth={1.5}
        />
        <line
          x1={PADDING.left}
          x2={PADDING.left}
          y1={PADDING.top}
          y2={HEIGHT - PADDING.bottom}
          stroke="var(--color-sage-300)"
          strokeWidth={1.5}
        />

        {[0, 250, 500, 750, 1000].map((tick) => (
          <text
            key={tick}
            x={scaleScore(tick)}
            y={HEIGHT - PADDING.bottom + 18}
            textAnchor="middle"
            className="fill-sage-500 text-[10px] font-medium"
          >
            {tick}
          </text>
        ))}
        <text
          x={(PADDING.left + WIDTH - PADDING.right) / 2}
          y={HEIGHT - 6}
          textAnchor="middle"
          className="fill-sage-500 text-[10px] font-semibold uppercase tracking-wide"
        >
          Score (risco cresce para a esquerda)
        </text>

        <text
          x={PADDING.left - 8}
          y={PADDING.top + 4}
          textAnchor="end"
          className="fill-sage-500 text-[10px] font-medium"
        >
          {formatCurrencyCompact(maxExposure)}
        </text>
        <text
          x={PADDING.left - 8}
          y={HEIGHT - PADDING.bottom}
          textAnchor="end"
          className="fill-sage-500 text-[10px] font-medium"
        >
          R$ 0
        </text>
        <text
          x={16}
          y={(PADDING.top + HEIGHT - PADDING.bottom) / 2}
          textAnchor="middle"
          transform={`rotate(-90 16 ${(PADDING.top + HEIGHT - PADDING.bottom) / 2})`}
          className="fill-sage-500 text-[10px] font-semibold uppercase tracking-wide"
        >
          Exposição
        </text>

        {produtores.map((produtor) => {
          const cx = scaleScore(produtor.score ?? 0)
          const cy = scaleExposure(produtor.exposicao, maxExposure)
          const r = scaleRadius(produtor.exposicao, maxExposure)
          const rating = classificacaoToRating(produtor.classificacao ?? 'MODERADO')
          const isHovered = hoveredId === produtor.cliente_id

          return (
            <g key={produtor.cliente_id}>
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill={RATING_HEX[rating]}
                fillOpacity={isHovered ? 0.95 : 0.75}
                stroke="white"
                strokeWidth={isHovered ? 2.5 : 1.5}
                className="cursor-pointer transition-all"
                onMouseEnter={() => {
                  setHoveredId(produtor.cliente_id)
                  setHoveredPosition({ cx, cy })
                }}
                onMouseLeave={() => {
                  setHoveredId(null)
                  setHoveredPosition(null)
                }}
                onClick={() => navigate(`/produtor/${produtor.cliente_id}`)}
              />
            </g>
          )
        })}
      </svg>

      {hovered && hoveredPosition && (
        <div
          className="pointer-events-none absolute w-56 rounded-xl border border-sage-200 bg-white p-3 text-xs shadow-lifted"
          style={{
            left: `${Math.min(84, Math.max(16, (hoveredPosition.cx / WIDTH) * 100))}%`,
            top: `${(hoveredPosition.cy / HEIGHT) * 100}%`,
            transform:
              (hoveredPosition.cy / HEIGHT) * 100 < 30
                ? 'translate(-50%, 18px)'
                : 'translate(-50%, calc(-100% - 18px))',
          }}
        >
          <p className="font-semibold text-forest-950">{hovered.nome}</p>
          <p className="mt-0.5 text-sage-500">{hovered.regiao} · {hovered.cultura}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sage-500">Score</span>
            <span className="font-semibold text-forest-950">{hovered.score}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sage-500">Exposição</span>
            <span className="font-semibold text-forest-950">
              {formatCurrencyCompact(hovered.exposicao)}
            </span>
          </div>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-sage-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-alert-red-50 ring-1 ring-inset ring-alert-red-100" />
          Zona de atenção (score abaixo de {DANGER_SCORE_THRESHOLD})
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-sage-300" />
          Tamanho da bolha = exposição
        </span>
        <span>Clique em um cliente para abrir a análise completa.</span>
      </div>
    </div>
  )
}

export default RiskExposureRadar
