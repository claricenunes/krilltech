import { Radar } from 'lucide-react'

interface MonitoringStatusBarProps {
  ultimaVerificacao: string
  clientesMonitorados: number
}

/** Formata uma data ISO (YYYY-MM-DD) sem passar por fuso horário, para não
 * arredondar para o dia anterior em fusos negativos (ex.: America/Sao_Paulo). */
function formatDatePt(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  if (!year || !month || !day) return iso
  return new Date(year, month - 1, day).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function MonitoringStatusBar({ ultimaVerificacao, clientesMonitorados }: MonitoringStatusBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-forest-200/70 bg-forest-50 px-5 py-3.5 text-sm">
      <span className="relative flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-forest-600 text-white">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-forest-500 opacity-75" />
        <Radar className="relative h-3.5 w-3.5" strokeWidth={2.2} />
      </span>

      <p className="font-semibold text-forest-900">Monitoramento contínuo ativo</p>

      <span className="hidden h-1 w-1 rounded-full bg-forest-300 sm:inline-block" aria-hidden="true" />

      <p className="text-forest-700">
        Última verificação automática dos agentes:{' '}
        <span className="font-medium text-forest-900">{formatDatePt(ultimaVerificacao)}</span>
      </p>

      <span className="hidden h-1 w-1 rounded-full bg-forest-300 sm:inline-block" aria-hidden="true" />

      <p className="text-forest-700">
        <span className="font-medium text-forest-900">{clientesMonitorados} clientes</span>{' '}
        monitorados 24/7, sem necessidade de consulta manual.
      </p>
    </div>
  )
}

export default MonitoringStatusBar
