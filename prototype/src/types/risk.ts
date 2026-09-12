export type Rating = 'A' | 'B' | 'C' | 'D'

export type DataSourceType =
  | 'REAL'
  | 'MOCK'
  | 'SNAPSHOT'
  | 'CALCULADO'
  | 'SIMULACAO'

export type TrendDirection = 'up' | 'down' | 'stable'

export interface Trend {
  direction: TrendDirection
  value?: number
  label?: string
}

export type RiskFactorKey = 'judicial' | 'ambiental' | 'clima' | 'financeiro' | 'cadastral'

export interface RiskFactor {
  factorKey: RiskFactorKey
  title: string
  status: string
  description?: string
  /** Usado pelos fatores calculados via API (score-engine), em % do score. */
  weight?: number
  /** Usado pelos fatores da Triagem (mock-risk), nome da fonte do dado. */
  source?: string
}

export interface Evidence {
  title: string
  description: string
  source: string
  sourceType: DataSourceType
}

/** Nível de impacto de um fator na projeção de risco — usado no drill-down de carteira. */
export type ImpactLevel = 'alto' | 'medio' | 'baixo'

export interface ImpactFactor {
  factorKey: RiskFactorKey
  title: string
  impact: ImpactLevel
}
