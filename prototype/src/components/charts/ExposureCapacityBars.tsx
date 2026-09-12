import { formatCurrency } from '../../utils/currency'

interface ExposureCapacityBarsProps {
  exposicao: number
  margemLiquida: number
  limiteCredito: number
}

interface BarSpec {
  label: string
  value: number
  barClass: string
  note?: string
}

/**
 * Compara, lado a lado, quanto a KRILLTECH tem exposto neste cliente contra
 * quanto o cliente teria de margem para cobrir essa exposição — a pergunta
 * "ele consegue pagar se precisar?" em uma régua, não em uma frase.
 */
function ExposureCapacityBars({
  exposicao,
  margemLiquida,
  limiteCredito,
}: ExposureCapacityBarsProps) {
  const covered = margemLiquida >= exposicao

  const bars: BarSpec[] = [
    {
      label: 'Exposição atual (KRILLTECH)',
      value: exposicao,
      barClass: 'bg-forest-700',
    },
    {
      label: 'Margem líquida do produtor',
      value: margemLiquida,
      barClass: covered ? 'bg-forest-400' : 'bg-alert-red-500',
      note: covered
        ? 'Cobre a exposição atual.'
        : 'Não cobre a exposição atual — sinal de atenção.',
    },
    {
      label: 'Limite de crédito aprovado',
      value: limiteCredito,
      barClass: 'bg-sage-400',
    },
  ]

  const maxValue = Math.max(...bars.map((b) => b.value), 1)

  return (
    <div className="flex flex-col gap-3.5">
      {bars.map((bar) => {
        const widthPercent = Math.min(100, Math.max(2, (bar.value / maxValue) * 100))
        return (
          <div key={bar.label}>
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-xs font-medium text-sage-600">{bar.label}</p>
              <p className="text-sm font-semibold tabular-nums text-forest-950">
                {formatCurrency(bar.value)}
              </p>
            </div>
            <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-sage-100">
              <div
                className={`h-full rounded-full ${bar.barClass}`}
                style={{ width: `${widthPercent}%` }}
              />
            </div>
            {bar.note && (
              <p
                className={`mt-1 text-xs ${covered ? 'text-forest-600' : 'text-alert-red-600'}`}
              >
                {bar.note}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ExposureCapacityBars
