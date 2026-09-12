import type { DataSourceType } from '../../types/risk'

const styles: Record<DataSourceType, string> = {
  REAL: 'border-sky-200 bg-sky-50 text-sky-700',
  MOCK: 'border-stone-300 border-dashed bg-stone-100 text-stone-600',
  SNAPSHOT: 'border-violet-200 bg-violet-50 text-violet-700',
  CALCULADO: 'border-slate-300 bg-slate-100 text-slate-700',
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
