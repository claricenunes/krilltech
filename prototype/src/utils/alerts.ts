import type { AlertTag } from '../types/portfolio'

export const ALERT_TAG_META: Record<AlertTag, { label: string; textClasses: string; dotClasses: string }> = {
  deterioracao: {
    label: 'Risco em deterioração',
    textClasses: 'text-alert-red-600',
    dotClasses: 'bg-alert-red-500',
  },
  juridico: {
    label: 'Alerta jurídico',
    textClasses: 'text-alert-orange-600',
    dotClasses: 'bg-alert-orange-500',
  },
  climatico: {
    label: 'Risco climático',
    textClasses: 'text-alert-amber-600',
    dotClasses: 'bg-alert-amber-500',
  },
}
