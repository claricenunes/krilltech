import { Bell, ChevronDown, Search, Sun } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import daviPhoto from '../../davi.png'
import { getAlertasDashboard, getProdutor } from '../../services/api/staticData'
import type { PriorityAlert } from '../../types/portfolio'
import { ALERT_TAG_META, deriveAlertTag } from '../../utils/alerts'
import { useOnClickOutside } from '../../utils/useOnClickOutside'
import SearchModal from './SearchModal'

interface TopbarProps {
  title: string
  subtitle: string
  actions?: ReactNode
}

function Topbar({ title, subtitle, actions }: TopbarProps) {
  const navigate = useNavigate()
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)

  const notifRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(notifRef, () => setNotifOpen(false))
  useOnClickOutside(userRef, () => setUserOpen(false))

  const [priorityAlerts, setPriorityAlerts] = useState<PriorityAlert[]>([])

  useEffect(() => {
    let cancelled = false

    getAlertasDashboard()
      .then(async (dashboard) => {
        const resolved = await Promise.all(
          dashboard.alertas.map(async (item) => {
            const produtor = await getProdutor(item.produtor_id)
            return {
              id: item.id,
              tag: deriveAlertTag(item.titulo, item.nivel),
              title: item.titulo,
              clientId: item.produtor_id,
              clientName: produtor.nome,
              state: produtor.regiao,
              description: item.resumo,
            } satisfies PriorityAlert
          }),
        )
        if (!cancelled) setPriorityAlerts(resolved)
      })
      .catch(() => {
        if (!cancelled) setPriorityAlerts([])
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
    <header className="flex flex-col gap-4 border-b border-sage-200/70 bg-cream-50/95 px-6 py-5 backdrop-blur lg:flex-row lg:items-center lg:justify-between lg:px-10">
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-alert-amber-100 text-alert-amber-600">
          <Sun className="h-4 w-4" strokeWidth={2.2} />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-forest-950">
            {title}
          </h1>
          <p className="text-sm text-sage-600">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {actions}

        <button
          type="button"
          onClick={() => setSearchModalOpen(true)}
          className="flex items-center gap-2 rounded-full border border-sage-200 bg-white px-3.5 py-2 text-left shadow-softer transition-all hover:border-forest-300 hover:shadow-soft"
        >
          <Search className="h-4 w-4 text-sage-500" strokeWidth={2} />
          <span className="w-52 text-sm text-sage-500 xl:w-64">
            Buscar por CNPJ, CPF ou cliente...
          </span>
        </button>

        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen((open) => !open)}
            aria-label="Notificações"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-sage-200 bg-white text-forest-800 shadow-softer transition-colors hover:bg-sage-50"
          >
            <Bell className="h-[18px] w-[18px]" strokeWidth={2} />
            <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-alert-red-500" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 z-30 mt-2 w-80 overflow-hidden rounded-2xl border border-sage-200 bg-white py-2 shadow-lifted animate-fade-up">
              <p className="px-4 pb-2 pt-1 text-xs font-semibold uppercase tracking-wide text-sage-500">
                Alertas prioritários
              </p>
              {priorityAlerts.length === 0 && (
                <p className="px-4 py-3 text-sm text-sage-400">Nenhum alerta no momento.</p>
              )}
              {priorityAlerts.map((alert) => {
                const meta = ALERT_TAG_META[alert.tag]
                return (
                  <button
                    key={alert.id}
                    type="button"
                    onClick={() => {
                      setNotifOpen(false)
                      navigate(`/produtor/${alert.clientId}`)
                    }}
                    className="flex w-full items-start gap-2.5 px-4 py-2.5 text-left transition-colors hover:bg-sage-50"
                  >
                    <span className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${meta.dotClasses}`} />
                    <span>
                      <span className="block text-sm font-medium text-forest-950">
                        {meta.label}
                      </span>
                      <span className="block text-xs text-sage-500">
                        {alert.clientName} ({alert.state})
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div ref={userRef} className="relative">
          <button
            type="button"
            onClick={() => setUserOpen((open) => !open)}
            className="flex items-center gap-2 rounded-full border border-sage-200 bg-white py-1.5 pl-1.5 pr-3 shadow-softer transition-colors hover:bg-sage-50"
          >
            <img
              src={daviPhoto}
              alt="Davi Brito"
              className="h-7 w-7 flex-shrink-0 rounded-full object-cover"
            />
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-sm font-medium text-forest-950">
                Davi Brito
              </span>
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-sage-500" strokeWidth={2.2} />
          </button>

          {userOpen && (
            <div className="absolute right-0 z-30 mt-2 w-52 overflow-hidden rounded-2xl border border-sage-200 bg-white py-1.5 shadow-lifted animate-fade-up">
              <div className="px-4 py-2">
                <p className="text-sm font-medium text-forest-950">Davi Brito</p>
                <p className="text-xs text-sage-500">Gestor de Crédito</p>
              </div>
              <div className="my-1 h-px bg-sage-100" />
              <button
                type="button"
                onClick={() => setUserOpen(false)}
                className="block w-full px-4 py-2 text-left text-sm text-forest-800 transition-colors hover:bg-sage-50"
              >
                Meu perfil
              </button>
              <button
                type="button"
                onClick={() => setUserOpen(false)}
                className="block w-full px-4 py-2 text-left text-sm text-forest-800 transition-colors hover:bg-sage-50"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>

    {searchModalOpen && <SearchModal onClose={() => setSearchModalOpen(false)} />}
    </>
  )
}

export default Topbar
