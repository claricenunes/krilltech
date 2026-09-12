import {
  FileText,
  LayoutGrid,
  Search,
  Settings,
  Wallet,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import Logo from './Logo'

const navItems = [
  { to: '/', label: 'Início', icon: LayoutGrid, end: true },
  { to: '/triagem', label: 'Triagem de Clientes', icon: Search, end: false },
  { to: '/carteira', label: 'Carteira', icon: Wallet, end: false },
  { to: '/relatorios', label: 'Relatórios', icon: FileText, end: false },
  { to: '/configuracoes', label: 'Configurações', icon: Settings, end: false },
]

function Sidebar() {
  return (
    <aside className="hidden w-60 flex-shrink-0 flex-col bg-forest-900 md:flex xl:w-64">
      <div className="flex items-center gap-2.5 px-6 pb-2 pt-7">
        <Logo className="h-8 w-8 text-forest-100" />
        <span className="font-display text-lg font-extrabold tracking-tight text-white">
          KrillRadar
        </span>
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-1 px-4">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
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
      </nav>

      <div className="mx-4 mb-6 flex items-center gap-3 rounded-xl bg-forest-800/60 px-3 py-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-forest-400 text-sm font-semibold text-forest-950">
          MR
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-white">Marcelo Ribeiro</p>
          <p className="text-xs text-forest-200">Gestor de Crédito</p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
