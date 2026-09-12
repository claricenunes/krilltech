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
  ambiental: {
    label: 'Alerta ambiental',
    textClasses: 'text-alert-amber-600',
    dotClasses: 'bg-alert-amber-500',
  },
}

/** Deriva a categoria do alerta a partir do texto — os dados de
 * 07_alertas_dashboard.json não trazem uma categoria estruturada, só
 * "nivel" (severidade) e o título em texto livre. */
export function deriveAlertTag(titulo: string, nivel: string): AlertTag {
  const t = titulo.toLowerCase()
  if (t.includes('judicial')) return 'deterioracao'
  if (t.includes('ambiental') || t.includes('embargo')) return 'ambiental'
  if (t.includes('produtividade') || t.includes('clima')) return 'climatico'
  return nivel === 'critico' ? 'deterioracao' : 'climatico'
}
