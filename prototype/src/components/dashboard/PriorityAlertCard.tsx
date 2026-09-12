import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { PriorityAlert } from '../../types/portfolio'
import { ALERT_TAG_META } from '../../utils/alerts'

function PriorityAlertCard({ alert }: { alert: PriorityAlert }) {
  const navigate = useNavigate()
  const meta = ALERT_TAG_META[alert.tag]

  return (
    <button
      type="button"
      onClick={() => navigate(`/produtor/${alert.clientId}`)}
      className="group flex flex-col rounded-2xl border border-sage-200/70 bg-white p-5 shadow-softer transition-all hover:-translate-y-0.5 hover:border-sage-300 hover:shadow-soft"
    >
      <span className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide ${meta.textClasses}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClasses}`} />
        {meta.label}
      </span>

      <p className="mt-2.5 text-sm font-semibold text-forest-950">
        {alert.clientName} <span className="font-normal text-sage-400">· {alert.state}</span>
      </p>

      <p className="mt-2 text-sm text-sage-600">{alert.description}</p>

      <span className="mt-4 flex items-center gap-1 text-xs font-semibold text-forest-700 transition-transform group-hover:translate-x-0.5">
        Ver análise
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
      </span>
    </button>
  )
}

export default PriorityAlertCard
