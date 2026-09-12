import type { DataSourceType } from '../../types/risk'

const styles: Record<DataSourceType, string> = {
  REAL: 'border-sky-200 bg-sky-50 text-sky-700',
  MOCK: 'border-sage-300 border-dashed bg-sage-50 text-sage-600',
  SNAPSHOT: 'border-violet-200 bg-violet-50 text-violet-700',
  CALCULADO: 'border-forest-200 bg-forest-50 text-forest-700',
  SIMULACAO: 'border-clay-100 bg-clay-100/60 text-clay-600',
}

function DataSourceTag({ type }: { type: DataSourceType }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${styles[type]}`}
    >
      {type}
    </span>
  )
}

export default DataSourceTag
