import { Filter } from 'lucide-react'
import { useMemo, useState } from 'react'
import ClientTable from '../components/dashboard/ClientTable'
import PageShell from '../components/layout/PageShell'
import { mockClients } from '../data/mockClients'
import type { ClientStatus } from '../types/portfolio'
import type { Rating } from '../types/risk'
import { STATUS_META } from '../utils/rating'

const REGIONS = ['Todas', ...Array.from(new Set(mockClients.map((c) => c.region)))]
const RATINGS: Array<'Todos' | Rating> = ['Todos', 'A', 'B', 'C', 'D']
const STATUSES: Array<'Todos' | ClientStatus> = [
  'Todos',
  'saudavel',
  'atencao',
  'risco_elevado',
  'critico',
]

function Carteira() {
  const [region, setRegion] = useState('Todas')
  const [rating, setRating] = useState<'Todos' | Rating>('Todos')
  const [status, setStatus] = useState<'Todos' | ClientStatus>('Todos')

  const filtered = useMemo(() => {
    return mockClients.filter((client) => {
      if (region !== 'Todas' && client.region !== region) return false
      if (rating !== 'Todos' && client.rating !== rating) return false
      if (status !== 'Todos' && client.status !== status) return false
      return true
    })
  }, [region, rating, status])

  return (
    <PageShell
      title="Carteira"
      subtitle="Todos os clientes monitorados pelo KrillRadar, com filtros por região, rating e status."
    >
      <section className="rounded-2xl border border-sage-200/70 bg-white p-5 shadow-softer sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 text-sm font-medium text-forest-800">
            <Filter className="h-4 w-4 text-sage-500" strokeWidth={2.2} />
            Filtros
          </span>

          <select
            value={region}
            onChange={(event) => setRegion(event.target.value)}
            className="rounded-full border border-sage-200 bg-sage-50 px-3.5 py-1.5 text-sm text-forest-800 outline-none transition-colors focus:border-forest-400"
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r === 'Todas' ? 'Todas as regiões' : r}
              </option>
            ))}
          </select>

          <select
            value={rating}
            onChange={(event) => setRating(event.target.value as 'Todos' | Rating)}
            className="rounded-full border border-sage-200 bg-sage-50 px-3.5 py-1.5 text-sm text-forest-800 outline-none transition-colors focus:border-forest-400"
          >
            {RATINGS.map((r) => (
              <option key={r} value={r}>
                {r === 'Todos' ? 'Todos os ratings' : `Rating ${r}`}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as 'Todos' | ClientStatus)}
            className="rounded-full border border-sage-200 bg-sage-50 px-3.5 py-1.5 text-sm text-forest-800 outline-none transition-colors focus:border-forest-400"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === 'Todos' ? 'Todos os status' : STATUS_META[s].label}
              </option>
            ))}
          </select>

          <span className="ml-auto text-xs text-sage-500">
            Mostrando {filtered.length} de 48 clientes
          </span>
        </div>

        <div className="mt-5">
          {filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-sage-500">
              Nenhum cliente encontrado com os filtros selecionados.
            </p>
          ) : (
            <ClientTable clients={filtered} />
          )}
        </div>
      </section>
    </PageShell>
  )
}

export default Carteira
