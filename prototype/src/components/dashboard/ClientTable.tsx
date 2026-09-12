import { ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { PortfolioClient } from '../../types/portfolio'
import { formatCurrency } from '../../utils/currency'
import { RATING_META, STATUS_META } from '../../utils/rating'

interface ClientTableProps {
  clients: PortfolioClient[]
}

function ClientTable({ clients }: ClientTableProps) {
  const navigate = useNavigate()

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="text-left text-xs font-semibold uppercase tracking-wide text-sage-500">
            <th className="px-3 pb-3 font-semibold">Cliente</th>
            <th className="px-3 pb-3 font-semibold">Estado</th>
            <th className="px-3 pb-3 font-semibold">Score</th>
            <th className="px-3 pb-3 font-semibold">Rating</th>
            <th className="px-3 pb-3 font-semibold">Exposição</th>
            <th className="px-3 pb-3 font-semibold">Status</th>
            <th className="px-3 pb-3" />
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => {
            const rating = RATING_META[client.rating]
            const scorePercent = Math.min(100, Math.max(0, (client.score / 1000) * 100))
            const statusMeta = STATUS_META[client.status ?? 'saudavel']

            return (
              <tr
                key={client.id}
                onClick={() => navigate(`/produtor/${client.id}`)}
                className="cursor-pointer border-t border-sage-100 transition-colors hover:bg-sage-50"
              >
                <td className="px-3 py-4">
                  <p className="font-medium text-forest-950">{client.name}</p>
                  <p className="text-xs text-sage-500">{client.culture}</p>
                </td>
                <td className="px-3 py-4 text-sage-600">{client.state}</td>
                <td className="px-3 py-4">
                  <div className="flex items-center gap-2">
                    <span className="w-9 flex-shrink-0 font-semibold tabular-nums text-forest-950">
                      {client.score}
                    </span>
                    <span className="h-1.5 w-16 flex-shrink-0 overflow-hidden rounded-full bg-sage-100">
                      <span
                        className={`block h-full rounded-full ${rating.barClasses}`}
                        style={{ width: `${scorePercent}%` }}
                      />
                    </span>
                  </div>
                </td>
                <td className="px-3 py-4">
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border text-sm font-semibold ${rating.badgeClasses}`}
                  >
                    {client.rating}
                  </span>
                </td>
                <td className="px-3 py-4 text-sage-600">{formatCurrency(client.exposure)}</td>
                <td className="px-3 py-4">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusMeta.classes}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${statusMeta.dotClasses}`} />
                    {statusMeta.label}
                  </span>
                </td>
                <td className="px-3 py-4 text-right">
                  <ChevronRight className="ml-auto h-4 w-4 text-sage-300" strokeWidth={2.2} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default ClientTable
