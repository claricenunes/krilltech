import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
}

function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-sage-300 bg-white px-8 py-16 text-center shadow-softer">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-100 text-forest-600">
        <Icon className="h-6 w-6" strokeWidth={2} />
      </span>
      <h3 className="mt-4 text-base font-semibold text-forest-950">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-sage-500">{description}</p>
    </div>
  )
}

export default EmptyState
