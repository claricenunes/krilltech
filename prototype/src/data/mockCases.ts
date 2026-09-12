// Casos de monitoramento por trás do drill-down de cada cliente da carteira.
// A projeção de risco (score/rating projetados) corresponde ao cenário padrão
// de -20% de produtividade — o mesmo que o simulador reproduz ao vivo.
// NÃO representa clientes reais da KRILLTECH.
import type { ClientCase } from '../types/portfolio'

export const mockCases: Record<string, ClientCase> = {
  'fazenda-boa-vista': {
    clientId: 'fazenda-boa-vista',
    projectedScore: 574,
    projectedRating: 'C',
    baselineProductivity: 80,
    impactFactors: [
      { factorKey: 'clima', title: 'Clima e produtividade', impact: 'alto' },
      { factorKey: 'judicial', title: 'Situação jurídica', impact: 'medio' },
      { factorKey: 'ambiental', title: 'Ambiental', impact: 'baixo' },
      { factorKey: 'cadastral', title: 'Cadastral', impact: 'baixo' },
    ],
    recommendationTitle: 'Não ampliar exposição.',
    recommendationBody:
      'Reavaliar condições comerciais e intensificar o monitoramento do cliente nos próximos ciclos de safra.',
    annualRevenue: 1_000_000,
    fixedCosts: 550_000,
  },
  'agroindustria-horizonte': {
    clientId: 'agroindustria-horizonte',
    projectedScore: 481,
    projectedRating: 'C',
    baselineProductivity: 90,
    impactFactors: [
      { factorKey: 'judicial', title: 'Situação jurídica', impact: 'alto' },
      { factorKey: 'cadastral', title: 'Cadastral', impact: 'medio' },
      { factorKey: 'clima', title: 'Clima e produtividade', impact: 'baixo' },
      { factorKey: 'ambiental', title: 'Ambiental', impact: 'baixo' },
    ],
    recommendationTitle: 'Suspender ampliação de limite.',
    recommendationBody:
      'Acompanhar o desdobramento do evento judicial antes de qualquer nova concessão de crédito.',
    annualRevenue: 2_200_000,
    fixedCosts: 1_600_000,
  },
  'agropecuaria-rio-verde': {
    clientId: 'agropecuaria-rio-verde',
    projectedScore: 592,
    projectedRating: 'C',
    baselineProductivity: 85,
    impactFactors: [
      { factorKey: 'clima', title: 'Clima e produtividade', impact: 'alto' },
      { factorKey: 'cadastral', title: 'Cadastral', impact: 'baixo' },
      { factorKey: 'judicial', title: 'Situação jurídica', impact: 'baixo' },
      { factorKey: 'ambiental', title: 'Ambiental', impact: 'baixo' },
    ],
    recommendationTitle: 'Monitorar antes de ampliar exposição.',
    recommendationBody:
      'Acompanhar o impacto climático na produtividade regional ao longo da safra atual.',
    annualRevenue: 1_400_000,
    fixedCosts: 900_000,
  },
}

const DEFAULT_CASE: Omit<ClientCase, 'clientId' | 'annualRevenue' | 'fixedCosts'> = {
  projectedScore: 0,
  projectedRating: 'A',
  baselineProductivity: 100,
  impactFactors: [
    { factorKey: 'cadastral', title: 'Cadastral', impact: 'baixo' },
    { factorKey: 'judicial', title: 'Situação jurídica', impact: 'baixo' },
    { factorKey: 'ambiental', title: 'Ambiental', impact: 'baixo' },
    { factorKey: 'clima', title: 'Clima e produtividade', impact: 'baixo' },
  ],
  recommendationTitle: 'Manter condições atuais.',
  recommendationBody:
    'Nenhum sinal de deterioração identificado. Cliente segue apto a novas concessões dentro da política vigente.',
}

export function getCaseForClient(clientId: string, currentScore: number): ClientCase {
  const existing = mockCases[clientId]
  if (existing) return existing

  return {
    ...DEFAULT_CASE,
    clientId,
    projectedScore: currentScore,
    annualRevenue: 1_500_000,
    fixedCosts: 850_000,
  }
}
