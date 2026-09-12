import { FileText, LayoutGrid, Menu, Search, Wallet } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import Logo from './Logo'

const navItems = [
  { to: '/', label: 'Início', icon: LayoutGrid, end: true },
  { to: '/triagem', label: 'Triagem', icon: Search, end: false },
  { to: '/carteira', label: 'Carteira', icon: Wallet, end: false },
  { to: '/relatorios', label: 'Relatórios', icon: FileText, end: false },
]

function Sidebar() {
  return (
    <aside className="fixed left-4 top-4 z-40 sm:left-6 sm:top-6">
      <nav
        tabIndex={0}
        aria-label="Navegação principal"
        className="group flex w-14 max-h-14 flex-col overflow-hidden rounded-2xl bg-forest-900 shadow-lifted outline-none transition-[width,max-height] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:w-64 hover:max-h-96 focus-within:w-64 focus-within:max-h-96 focus-visible:ring-2 focus-visible:ring-forest-300"
      >
        <div className="flex h-14 w-64 flex-shrink-0 items-center gap-2.5 px-4">
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center text-forest-100">
            <Menu className="h-6 w-6" strokeWidth={2.2} />
          </span>
          <span className="flex items-center gap-2 whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
            <Logo className="h-5 w-5 text-forest-100" />
            <span className="font-display text-sm font-extrabold tracking-tight text-white">
              KrillRadar
            </span>
          </span>
        </div>

        <div className="mx-4 h-px flex-shrink-0 bg-forest-700/60" />

        <div className="flex w-64 flex-shrink-0 flex-col gap-1 px-3 py-3">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 whitespace-nowrap rounded-xl px-2.5 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-forest-50 text-forest-900 shadow-softer'
                    : 'text-forest-100/80 hover:bg-forest-800 hover:text-white'
                }`
              }
            >
              <Icon className="h-[18px] w-[18px] flex-shrink-0" strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar
