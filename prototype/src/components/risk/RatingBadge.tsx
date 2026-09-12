import type { Rating } from '../../types/risk'
import { RATING_META } from '../../utils/rating'

function RatingBadge({ rating, size = 'lg' }: { rating: Rating; size?: 'lg' | 'md' | 'sm' }) {
  const style = RATING_META[rating]
  const dimensions =
    size === 'lg'
      ? 'h-14 w-14 text-3xl'
      : size === 'md'
        ? 'h-11 w-11 text-xl'
        : 'h-8 w-8 text-sm'

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-sage-500">
        Rating
      </p>
      <div
        className={`mt-1.5 inline-flex items-center justify-center rounded-2xl border font-bold ${style.badgeClasses} ${dimensions}`}
      >
        {rating}
      </div>
      <p className="mt-1.5 text-xs text-sage-500">{style.description}</p>
    </div>
  )
}

export default RatingBadge
