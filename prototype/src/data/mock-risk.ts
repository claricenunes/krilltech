// Dados fictícios para desenvolvimento visual dos componentes de risco.
// NÃO representam nenhum cliente real da KRILLTECH — uso apenas para validar o layout.
import type { Evidence, Rating, RiskFactor, Trend } from '../types/risk'

interface MockRiskReport {
  score: number
  rating: Rating
  trend: Trend
  factors: RiskFactor[]
  evidences: Evidence[]
}

export const mockRiskReport: MockRiskReport = {
  score: 742,
  rating: 'B',
  trend: {
    direction: 'up',
    value: 124,
    label: 'Risco aumentou nos últimos 90 dias',
  },
  factors: [
    {
      title: 'Jurídico / Processual',
      weight: 35,
      status: 'Atenção',
      description: 'Há processo judicial relevante identificado para análise.',
    },
    {
      title: 'Climático / Produtividade',
      weight: 30,
      status: 'Atenção',
      description:
        'Queda de produtividade projetada para a região na safra atual.',
    },
    {
      title: 'Ambiental',
      weight: 15,
      status: 'Regular',
      description: 'Nenhum embargo ambiental identificado.',
    },
    {
      title: 'Cadastral / Societário',
      weight: 20,
      status: 'Regular',
      description: 'Empresa ativa, sem alterações societárias recentes.',
    },
  ],
  evidences: [
    {
      title: 'Processo judicial',
      description: 'Processo nº 0000000-00.0000.0.00.0000',
      source: 'DataJud',
      sourceType: 'SNAPSHOT',
    },
    {
      title: 'Situação cadastral',
      description: 'Empresa ativa desde 2014, sem pendências cadastrais.',
      source: 'BrasilAPI',
      sourceType: 'REAL',
    },
    {
      title: 'Produtividade regional',
      description: 'Queda estimada de 12% na safra 2025/26 para a região.',
      source: 'CONAB (snapshot)',
      sourceType: 'MOCK',
    },
  ],
}
