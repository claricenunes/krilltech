// Dados fictícios para desenvolvimento visual dos componentes de risco.
// NÃO representam nenhum cliente real da KRILLTECH — uso apenas para validar o layout.
import type { Rating } from '../types/risk'
import type { Evidence, RiskFactor, Trend } from '../types/risk'

interface MockRiskReport {
  clientName: string
  score: number
  rating: Rating
  operationalStatus: string
  trend: Trend
  factors: RiskFactor[]
  evidences: Evidence[]
  recommendationTitle: string
  recommendationBody: string
}

// Resultado padrão exibido na Triagem — usado como demonstração do fluxo
// completo independentemente do CNPJ consultado, já que o motor definitivo
// de scoring ainda não está implementado.
export const mockRiskReport: MockRiskReport = {
  clientName: 'Fazenda Boa Vista Ltda.',
  score: 412,
  rating: 'C',
  operationalStatus: 'Atenção',
  trend: {
    direction: 'up',
    value: 124,
    label: 'Risco aumentou nos últimos 90 dias',
  },
  factors: [
    {
      factorKey: 'judicial',
      title: 'Situação judicial',
      weight: 35,
      status: 'Risco elevado',
      description: 'Processo judicial relevante identificado para o CNPJ analisado.',
    },
    {
      factorKey: 'ambiental',
      title: 'Ambiental',
      weight: 15,
      status: 'Atenção',
      description: 'Indício de embargo ambiental na propriedade associada.',
    },
    {
      factorKey: 'clima',
      title: 'Clima e produtividade',
      weight: 30,
      status: 'Risco moderado',
      description: 'Queda de produtividade projetada para a região na safra atual.',
    },
    {
      factorKey: 'financeiro',
      title: 'Capacidade financeira',
      weight: 20,
      status: 'Atenção',
      description: 'Margem entre receita estimada e custos fixos está se estreitando.',
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
  recommendationTitle:
    'Reavaliar a exposição de crédito antes de ampliar o limite.',
  recommendationBody:
    'Os sinais encontrados indicam deterioração potencial da capacidade de pagamento. Recomenda-se revisar a exposição atual e acompanhar os indicadores nos próximos ciclos.',
}

const FACTOR_PROFILES: Record<
  Rating,
  { statuses: [string, string, string, string]; trend: Trend; recommendationTitle: string; recommendationBody: string }
> = {
  A: {
    statuses: ['Regular', 'Regular', 'Estável', 'Saudável'],
    trend: { direction: 'down', value: 18, label: 'Risco reduziu nos últimos 90 dias' },
    recommendationTitle: 'Manter condições atuais e ampliar relacionamento.',
    recommendationBody:
      'O cliente apresenta indicadores estáveis em todas as dimensões monitoradas. Não há sinais de deterioração — é um bom candidato para ampliação de limite, se houver demanda.',
  },
  B: {
    statuses: ['Regular', 'Atenção', 'Risco moderado', 'Atenção'],
    trend: { direction: 'stable', value: 6, label: 'Risco estável nos últimos 90 dias' },
    recommendationTitle: 'Monitorar o cliente antes de ampliar exposição.',
    recommendationBody:
      'Alguns indicadores exigem acompanhamento, mas nada indica deterioração aguda. Recomenda-se manter o limite atual e revisar no próximo ciclo de safra.',
  },
  C: {
    statuses: ['Risco elevado', 'Atenção', 'Risco moderado', 'Atenção'],
    trend: { direction: 'up', value: 94, label: 'Risco aumentou nos últimos 90 dias' },
    recommendationTitle: 'Reavaliar a exposição de crédito antes de ampliar o limite.',
    recommendationBody:
      'Os sinais encontrados indicam deterioração potencial da capacidade de pagamento. Recomenda-se revisar a exposição atual e acompanhar os indicadores nos próximos ciclos.',
  },
  D: {
    statuses: ['Risco crítico', 'Risco elevado', 'Risco elevado', 'Crítico'],
    trend: { direction: 'up', value: 187, label: 'Deterioração acentuada nos últimos 90 dias' },
    recommendationTitle: 'Suspender ampliação de limite e acionar acompanhamento próximo.',
    recommendationBody:
      'Múltiplos sinais de deterioração convergem para este cliente, incluindo risco de recuperação judicial. Recomenda-se suspender novas concessões e revisar as garantias existentes.',
  },
}

const FACTOR_DEFS: Array<{ factorKey: RiskFactor['factorKey']; title: string; weight: number; description: string }> = [
  {
    factorKey: 'judicial',
    title: 'Situação judicial',
    weight: 35,
    description: 'Processos judiciais e histórico de recuperação judicial associados ao CNPJ.',
  },
  {
    factorKey: 'ambiental',
    title: 'Ambiental',
    weight: 15,
    description: 'Embargos ambientais e restrições de uso do solo na propriedade.',
  },
  {
    factorKey: 'clima',
    title: 'Clima e produtividade',
    weight: 30,
    description: 'Projeção climática e de produtividade da cultura na região.',
  },
  {
    factorKey: 'financeiro',
    title: 'Capacidade financeira',
    weight: 20,
    description: 'Relação entre receita estimada, custos fixos e capacidade de pagamento.',
  },
]

export function buildRiskReportForRating(rating: Rating) {
  const profile = FACTOR_PROFILES[rating]

  const factors: RiskFactor[] = FACTOR_DEFS.map((def, index) => ({
    factorKey: def.factorKey,
    title: def.title,
    weight: def.weight,
    status: profile.statuses[index],
    description: def.description,
  }))

  return {
    factors,
    trend: profile.trend,
    recommendationTitle: profile.recommendationTitle,
    recommendationBody: profile.recommendationBody,
  }
}
