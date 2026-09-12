import type { Rating } from '../../types/risk'

const ratingStyles: Record<Rating, { classes: string; description: string }> = {
  A: {
    classes: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    description: 'Baixo risco',
  },
  B: {
    classes: 'border-amber-200 bg-amber-50 text-amber-800',
    description: 'Risco moderado',
  },
  C: {
    classes: 'border-orange-200 bg-orange-50 text-orange-800',
    description: 'Risco elevado',
  },
  D: {
    classes: 'border-red-200 bg-red-50 text-red-800',
    description: 'Risco crítico',
  },
}

function RatingBadge({ rating }: { rating: Rating }) {
  const style = ratingStyles[rating]

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
        Rating
      </p>
      <div
        className={`mt-1 inline-flex h-12 w-12 items-center justify-center rounded-lg border text-2xl font-semibold ${style.classes}`}
      >
        {rating}
      </div>
      <p className="mt-1.5 text-xs text-stone-400">{style.description}</p>
    </div>
  )
}

export default RatingBadge
