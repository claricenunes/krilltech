import type { Rating, TrendDirection } from './risk'

export type ClientStatus = 'saudavel' | 'atencao' | 'risco_elevado' | 'critico'

export interface PortfolioClient {
  id: string
  name: string
  document: string
  region: string
  state: string
  culture: string
  score: number
  rating: Rating
  status: ClientStatus
  recommendedAction: string
  trend: TrendDirection
  /** MOCK — receita anual estimada, base para o simulador de cenário. */
  annualRevenue: number
  /** MOCK — custos fixos estimados, usados no cálculo de capacidade de pagamento. */
  fixedCosts: number
}

export type AlertSeverity = 'critico' | 'atencao'

export interface PortfolioAlert {
  id: string
  severity: AlertSeverity
  title: string
  clientName: string
  clientId?: string
  state: string
  timeAgo: string
}

export type ActionPriority = 'alta' | 'media' | 'baixa'

export interface PortfolioAction {
  id: string
  title: string
  priority: ActionPriority
  due: string
  done: boolean
}

export interface RegionRisk {
  region: string
  clients: number
  level: 'alto' | 'medio' | 'baixo' | 'none'
}

export interface RatingDistributionEntry {
  rating: Rating
  label: string
  count: number
  percent: number
}

export interface PortfolioSummary {
  totalClients: number
  newClients: number
  riscoElevado: number
  riscoElevadoPercent: number
  alertaRJ: number
  alertaRJPercent: number
  saudaveis: number
  saudaveisPercent: number
  lastUpdated: string
  ratingDistribution: RatingDistributionEntry[]
  regionRisk: RegionRisk[]
}
