import type { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

interface PageShellProps {
  title: string
  subtitle: string
  actions?: ReactNode
  icon?: ReactNode
  iconBgClassName?: string
  children: ReactNode
}

function PageShell({
  title,
  subtitle,
  actions,
  icon,
  iconBgClassName,
  children,
}: PageShellProps) {
  return (
    <div className="relative min-h-screen bg-cream-50">
      <Sidebar />
      <div className="flex min-h-screen min-w-0 flex-col pl-20 sm:pl-24">
        <Topbar
          title={title}
          subtitle={subtitle}
          actions={actions}
          icon={icon}
          iconBgClassName={iconBgClassName}
        />
        <main className="flex-1 px-6 py-6 lg:px-10 lg:py-8">{children}</main>
        <footer className="border-t border-sage-200/70 px-6 py-3 text-center text-xs text-sage-400 lg:px-10">
          Protótipo de demonstração — dados fictícios
        </footer>
      </div>
    </div>
  )
}

export default PageShell
