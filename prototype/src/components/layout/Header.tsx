import { NavLink } from 'react-router-dom'

const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  `border-b-2 pb-1 text-sm font-medium transition-colors ${
    isActive
      ? 'border-emerald-700 text-emerald-900'
      : 'border-transparent text-stone-500 hover:text-emerald-800'
  }`

function Header() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2.5">
          <span
            className="h-2.5 w-2.5 flex-shrink-0 rounded-sm bg-emerald-700"
            aria-hidden="true"
          />
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-wide text-emerald-950">
              SENTINELA KRILL
            </p>
            <p className="hidden text-xs text-stone-500 sm:block">
              Inteligência para decisão de crédito agro
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-5 sm:gap-6">
          <NavLink to="/" end className={navLinkClasses}>
            Radar da Carteira
          </NavLink>
          <NavLink to="/triagem" className={navLinkClasses}>
            Nova Triagem
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Header
