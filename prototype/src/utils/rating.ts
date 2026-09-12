import type { Rating } from '../types/risk'

interface RatingMeta {
  description: string
  badgeClasses: string
  dotClasses: string
  barClasses: string
  textClasses: string
}

export const RATING_META: Record<Rating, RatingMeta> = {
  A: {
    description: 'Baixo risco',
    badgeClasses: 'border-forest-200 bg-forest-50 text-forest-700',
    dotClasses: 'bg-forest-500',
    barClasses: 'bg-forest-500',
    textClasses: 'text-forest-700',
  },
  B: {
    description: 'Risco moderado',
    badgeClasses: 'border-alert-amber-100 bg-alert-amber-50 text-alert-amber-600',
    dotClasses: 'bg-alert-amber-500',
    barClasses: 'bg-alert-amber-500',
    textClasses: 'text-alert-amber-600',
  },
  C: {
    description: 'Risco elevado',
    badgeClasses: 'border-alert-orange-100 bg-alert-orange-50 text-alert-orange-600',
    dotClasses: 'bg-alert-orange-500',
    barClasses: 'bg-alert-orange-500',
    textClasses: 'text-alert-orange-600',
  },
  D: {
    description: 'Crítico',
    badgeClasses: 'border-alert-red-100 bg-alert-red-50 text-alert-red-600',
    dotClasses: 'bg-alert-red-500',
    barClasses: 'bg-alert-red-500',
    textClasses: 'text-alert-red-600',
  },
}
