import type { DataSourceType } from '../../types/risk'
import DataSourceTag from './DataSourceTag'

interface EvidenceCardProps {
  title: string
  description: string
  source: string
  sourceType: DataSourceType
}

function EvidenceCard({
  title,
  description,
  source,
  sourceType,
}: EvidenceCardProps) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-medium text-stone-800">{title}</p>
      <p className="mt-1.5 text-sm text-stone-500">{description}</p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs text-stone-400">Fonte: {source}</p>
        <DataSourceTag type={sourceType} />
      </div>
    </div>
  )
}

export default EvidenceCard
