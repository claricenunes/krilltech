import { Bell, ChevronDown, Search, Sun } from 'lucide-react'
import { useMemo, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockAlerts } from '../../data/mockAlerts'
import { mockClients } from '../../data/mockClients'
import { ALERT_SEVERITY_META } from '../../utils/alerts'
import { useOnClickOutside } from '../../utils/useOnClickOutside'

interface TopbarProps {
  title: string
  subtitle: string
  actions?: ReactNode
}

function Topbar({ title, subtitle, actions }: TopbarProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)

  const searchRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(searchRef, () => setSearchOpen(false))
  useOnClickOutside(notifRef, () => setNotifOpen(false))
  useOnClickOutside(userRef, () => setUserOpen(false))

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return []
    return mockClients
      .filter(
        (client) =>
          client.name.toLowerCase().includes(normalized) ||
          client.document.replace(/\D/g, '').includes(normalized.replace(/\D/g, '')),
      )
      .slice(0, 6)
  }, [query])

  function handleSelectClient(id: string) {
    setQuery('')
    setSearchOpen(false)
    navigate(`/produtor/${id}`)
  }

  return (
    <header className="flex flex-col gap-4 border-b border-sage-200/70 bg-cream-50/95 px-6 py-5 backdrop-blur lg:flex-row lg:items-center lg:justify-between lg:px-10">
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-alert-amber-100 text-alert-amber-600">
          <Sun className="h-4 w-4" strokeWidth={2.2} />
        </span>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-forest-950">
            {title}
          </h1>
          <p className="text-sm text-sage-600">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {actions}

        <div ref={searchRef} className="relative">
          <div className="flex items-center gap-2 rounded-full border border-sage-200 bg-white px-3.5 py-2 shadow-softer">
            <Search className="h-4 w-4 text-sage-500" strokeWidth={2} />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setSearchOpen(true)
              }}
              onFocus={() => setSearchOpen(true)}
              type="text"
              placeholder="Buscar por CNPJ, CPF ou nome do cliente..."
              className="w-56 bg-transparent text-sm text-forest-950 outline-none placeholder:text-sage-500 xl:w-72"
            />
          </div>

          {searchOpen && query.trim() && (
            <div className="absolute right-0 z-30 mt-2 w-80 overflow-hidden rounded-2xl border border-sage-200 bg-white py-2 shadow-lifted animate-fade-up">
              {results.length === 0 ? (
                <p className="px-4 py-3 text-sm text-sage-500">
                  Nenhum cliente encontrado para "{query}".
                </p>
              ) : (
                results.map((client) => (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => handleSelectClient(client.id)}
                    className="flex w-full flex-col items-start px-4 py-2.5 text-left transition-colors hover:bg-sage-50"
                  >
                    <span className="text-sm font-medium text-forest-950">
                      {client.name}
                    </span>
                    <span className="text-xs text-sage-500">
                      {client.document} · {client.state}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

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
                Alertas recentes
              </p>
              {mockAlerts.map((alert) => {
                const meta = ALERT_SEVERITY_META[alert.severity]
                return (
                  <button
                    key={alert.id}
                    type="button"
                    onClick={() => {
                      setNotifOpen(false)
                      if (alert.clientId) navigate(`/produtor/${alert.clientId}`)
                    }}
                    className="flex w-full items-start gap-2.5 px-4 py-2.5 text-left transition-colors hover:bg-sage-50"
                  >
                    <span className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${meta.dotClasses}`} />
                    <span>
                      <span className="block text-sm font-medium text-forest-950">
                        {alert.title}
                      </span>
                      <span className="block text-xs text-sage-500">
                        {alert.clientName} ({alert.state}) · {alert.timeAgo}
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
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-forest-700 text-xs font-semibold text-white">
              MR
            </span>
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-sm font-medium text-forest-950">
                Marcelo Ribeiro
              </span>
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-sage-500" strokeWidth={2.2} />
          </button>

          {userOpen && (
            <div className="absolute right-0 z-30 mt-2 w-52 overflow-hidden rounded-2xl border border-sage-200 bg-white py-1.5 shadow-lifted animate-fade-up">
              <div className="px-4 py-2">
                <p className="text-sm font-medium text-forest-950">Marcelo Ribeiro</p>
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
  )
}

export default Topbar
