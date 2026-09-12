// Os 3 alertas prioritários da Home — o coração da narrativa do KrillRadar:
// clientes que parecem saudáveis hoje, mas exigem atenção do gestor.
import type { HomeSummary, PriorityAlert } from '../types/portfolio'

export const homeSummary: HomeSummary = {
  atRiskCount: 3,
  vulnerableExposure: 1_200_000,
  mainFactor: 'Deterioração climática',
}

export const priorityAlerts: PriorityAlert[] = [
  {
    id: 'alert-deterioracao',
    tag: 'deterioracao',
    title: 'Risco em deterioração',
    clientId: 'fazenda-boa-vista',
    clientName: 'Fazenda Boa Vista Ltda.',
    state: 'GO',
    description: 'Projeção de queda acentuada de score nos próximos 12 meses.',
    currentScore: 812,
    projectedScore: 574,
    mainFactor: 'Deterioração climática',
  },
  {
    id: 'alert-juridico',
    tag: 'juridico',
    title: 'Alerta jurídico',
    clientId: 'agroindustria-horizonte',
    clientName: 'Agroindústria Horizonte',
    state: 'GO',
    description: 'Novo evento judicial identificado.',
  },
  {
    id: 'alert-climatico',
    tag: 'climatico',
    title: 'Risco climático',
    clientId: 'agropecuaria-rio-verde',
    clientName: 'Agropecuária Rio Verde',
    state: 'MT',
    description: 'Impacto potencial na capacidade de pagamento.',
  },
]
