import { Sparkles, UserCheck } from 'lucide-react'

interface RecommendationCardProps {
  title: string
  body: string
}

function RecommendationCard({ title, body }: RecommendationCardProps) {
  return (
    <div className="rounded-2xl border border-forest-200 bg-forest-50/60 p-5 shadow-softer sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-forest-700">
          Recomendação do KrillRadar
        </p>
        <span className="inline-flex items-center overflow-hidden rounded-full border border-forest-200 bg-white text-[11px] font-semibold">
          <span className="flex items-center gap-1 bg-forest-700 px-2.5 py-1 text-white">
            <Sparkles className="h-3 w-3" strokeWidth={2.4} />
            IA sugere
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 text-forest-700">
            <UserCheck className="h-3 w-3" strokeWidth={2.4} />
            Gestor decide
          </span>
        </span>
      </div>

      <p className="mt-3 text-base font-semibold text-forest-950">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-forest-700">{body}</p>
    </div>
  )
}

export default RecommendationCard
