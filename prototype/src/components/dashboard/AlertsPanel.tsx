import { AlertTriangle, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { PortfolioAlert } from '../../types/portfolio'
import { ALERT_SEVERITY_META } from '../../utils/alerts'

interface AlertsPanelProps {
  alerts: PortfolioAlert[]
}

function AlertsPanel({ alerts }: AlertsPanelProps) {
  const navigate = useNavigate()

  return (
    <div className="rounded-2xl border border-sage-200/70 bg-white p-5 shadow-softer">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-forest-950">
          <AlertTriangle className="h-4 w-4 text-alert-orange-500" strokeWidth={2.2} />
          Alertas recentes
        </h3>
        <button
          type="button"
          onClick={() => navigate('/carteira')}
          className="flex items-center gap-1 text-xs font-medium text-forest-600 transition-colors hover:text-forest-800"
        >
          Ver todos
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.4} />
        </button>
      </div>

      <ul className="mt-3 flex flex-col divide-y divide-sage-100">
        {alerts.map((alert) => {
          const meta = ALERT_SEVERITY_META[alert.severity]
          return (
            <li key={alert.id}>
              <button
                type="button"
                onClick={() => alert.clientId && navigate(`/produtor/${alert.clientId}`)}
                className="group flex w-full items-center gap-3 rounded-xl px-1.5 py-3 text-left transition-colors hover:bg-sage-50"
              >
                <span className={`mt-0.5 h-2 w-2 flex-shrink-0 rounded-full ${meta.dotClasses}`} />
                <span className="min-w-0 flex-1">
                  <span className={`block text-sm font-medium ${meta.textClasses}`}>
                    {alert.title}
                  </span>
                  <span className="block truncate text-xs text-sage-500">
                    {alert.clientName} ({alert.state})
                  </span>
                </span>
                <span className="flex-shrink-0 text-xs text-sage-400">{alert.timeAgo}</span>
                <ChevronRight className="h-4 w-4 flex-shrink-0 text-sage-300 transition-transform group-hover:translate-x-0.5" strokeWidth={2.2} />
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default AlertsPanel
