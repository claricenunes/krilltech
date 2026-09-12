// Alertas demonstrativos exibidos no painel "Alertas recentes".
import type { PortfolioAlert } from '../types/portfolio'

export const mockAlerts: PortfolioAlert[] = [
  {
    id: 'alert-1',
    severity: 'critico',
    title: 'Risco elevado',
    clientName: 'Fazenda Boa Vista Ltda.',
    clientId: 'fazenda-boa-vista',
    state: 'GO',
    timeAgo: '2h atrás',
  },
  {
    id: 'alert-2',
    severity: 'atencao',
    title: 'Embargo ambiental',
    clientName: 'Agropecuária Rio Verde',
    clientId: 'agropecuaria-rio-verde',
    state: 'MT',
    timeAgo: '5h atrás',
  },
  {
    id: 'alert-3',
    severity: 'critico',
    title: 'Deterioração de risco',
    clientName: 'Sementes do Cerrado',
    clientId: 'sementes-do-cerrado',
    state: 'BA',
    timeAgo: '1 dia atrás',
  },
  {
    id: 'alert-4',
    severity: 'atencao',
    title: 'Alerta de RJ',
    clientName: 'Agroindústria Horizonte',
    clientId: 'agroindustria-horizonte',
    state: 'GO',
    timeAgo: '1 dia atrás',
  },
]
