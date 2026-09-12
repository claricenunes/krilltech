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
    <div className="rounded-2xl border border-sage-200/70 bg-white p-4 shadow-softer">
      <p className="text-sm font-semibold text-forest-950">{title}</p>
      <p className="mt-1.5 text-sm text-sage-600">{description}</p>
      <div className="mt-3 flex items-center justify-between gap-3 border-t border-sage-100 pt-3">
        <p className="text-xs text-sage-400">Fonte: {source}</p>
        <DataSourceTag type={sourceType} />
      </div>
    </div>
  )
}

export default EvidenceCard
