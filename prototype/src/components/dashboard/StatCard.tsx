import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface StatCardProps {
  icon: LucideIcon
  iconClasses: string
  label: string
  value: string
  footer?: ReactNode
}

function StatCard({ icon: Icon, iconClasses, label, value, footer }: StatCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-sage-200/70 bg-white p-5 shadow-softer transition-shadow hover:shadow-soft">
      <div className="flex items-center gap-2.5">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconClasses}`}
        >
          <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
        </span>
        <p className="text-sm font-medium text-sage-600">{label}</p>
      </div>
      <p className="font-display text-3xl font-extrabold tracking-tight text-forest-950">
        {value}
      </p>
      {footer && <div className="text-xs text-sage-500">{footer}</div>}
    </div>
  )
}

export default StatCard
