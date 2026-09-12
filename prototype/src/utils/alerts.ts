import type { ActionPriority, AlertSeverity } from '../types/portfolio'

export const ALERT_SEVERITY_META: Record<
  AlertSeverity,
  { dotClasses: string; textClasses: string }
> = {
  critico: { dotClasses: 'bg-alert-red-500', textClasses: 'text-alert-red-600' },
  atencao: { dotClasses: 'bg-alert-orange-500', textClasses: 'text-alert-orange-600' },
}

export const PRIORITY_META: Record<
  ActionPriority,
  { label: string; classes: string }
> = {
  alta: { label: 'Prioridade alta', classes: 'text-alert-red-600' },
  media: { label: 'Prioridade média', classes: 'text-alert-orange-600' },
  baixa: { label: 'Prioridade baixa', classes: 'text-sage-600' },
}
