import { Filter, Loader2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import ClientTable from '../components/dashboard/ClientTable'
import PageShell from '../components/layout/PageShell'
import { getProdutores, getRanking, KrillApiError } from '../services/api/krillApi'
import { produtorAndRankingToPortfolioClient } from '../services/api/mappers'
import type { ClientStatus, PortfolioClient } from '../types/portfolio'
import type { Rating } from '../types/risk'
import { STATUS_META } from '../utils/rating'

const RATINGS: Array<'Todos' | Rating> = ['Todos', 'A', 'B', 'C', 'D']
const STATUSES: Array<'Todos' | ClientStatus> = [
  'Todos',
  'saudavel',
  'atencao',
  'risco_elevado',
  'critico',
]

function Carteira() {
  const [clients, setClients] = useState<PortfolioClient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [region, setRegion] = useState('Todas')
  const [rating, setRating] = useState<'Todos' | Rating>('Todos')
  const [status, setStatus] = useState<'Todos' | ClientStatus>('Todos')

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const [produtores, rankingResponse] = await Promise.all([
          getProdutores(),
          getRanking(),
        ])

        if (cancelled) return

        const rankingById = new Map(
          rankingResponse.ranking.map((entry) => [entry.cliente_id, entry]),
        )

        setClients(
          produtores.map((produtor) =>
            produtorAndRankingToPortfolioClient(produtor, rankingById.get(produtor.cliente_id)),
          ),
        )
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof KrillApiError
              ? err.message
              : 'Não foi possível carregar a carteira da API local.',
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const REGIONS = useMemo(
    () => ['Todas', ...Array.from(new Set(clients.map((c) => c.region)))],
    [clients],
  )

  const filtered = useMemo(() => {
    return clients.filter((client) => {
      if (region !== 'Todas' && client.region !== region) return false
      if (rating !== 'Todos' && client.rating !== rating) return false
      if (status !== 'Todos' && client.status !== status) return false
      return true
    })
  }, [clients, region, rating, status])

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
            Mostrando {filtered.length} de {clients.length} clientes
          </span>
        </div>

        <div className="mt-5">
          {loading ? (
            <p className="flex items-center justify-center gap-2 py-10 text-center text-sm text-sage-500">
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.2} />
              Carregando carteira da API local (http://localhost:8000)...
            </p>
          ) : error ? (
            <p className="py-10 text-center text-sm text-alert-red-600">{error}</p>
          ) : filtered.length === 0 ? (
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
