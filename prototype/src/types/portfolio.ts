import type { ImpactFactor, Rating, TrendDirection } from './risk'

export type ClientStatus = 'saudavel' | 'atencao' | 'risco_elevado' | 'critico'

/** Cliente ativo na carteira — o que aparece na lista de Carteira. */
export interface PortfolioClient {
  id: string
  name: string
  document: string
  state: string
  culture: string
  score: number
  rating: Rating
  /** MOCK — exposição atual em Arbolin Biogenesis concedida a prazo a este cliente. */
  exposure: number
  /** Campos abaixo são preenchidos pelas telas conectadas à API real (Carteira/Produtor). */
  region?: string
  status?: ClientStatus
  recommendedAction?: string
  trend?: TrendDirection
  annualRevenue?: number
  fixedCosts?: number
}

export type AlertTag = 'deterioracao' | 'juridico' | 'climatico'

/** Um dos (no máximo 3) alertas prioritários mostrados na Home. */
export interface PriorityAlert {
  id: string
  tag: AlertTag
  title: string
  clientId: string
  clientName: string
  state: string
  description: string
  currentScore?: number
  projectedScore?: number
  mainFactor?: string
}

/** Caso de monitoramento por trás do drill-down de um cliente da carteira. */
export interface ClientCase {
  clientId: string
  projectedScore: number
  projectedRating: Rating
  /** Percentual de produtividade já refletido na projeção padrão exibida (ex.: 80 = -20%). */
  baselineProductivity: number
  impactFactors: ImpactFactor[]
  recommendationTitle: string
  recommendationBody: string
  /** MOCK — receita anual estimada, base do simulador de cenário. */
  annualRevenue: number
  /** MOCK — custos fixos estimados, usados no cálculo de capacidade de pagamento. */
  fixedCosts: number
}

export interface HomeSummary {
  atRiskCount: number
  vulnerableExposure: number
  mainFactor: string
}
