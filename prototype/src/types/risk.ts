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

export type RiskFactorKey = 'judicial' | 'ambiental' | 'clima' | 'financeiro'

export interface RiskFactor {
  factorKey: RiskFactorKey
  title: string
  weight: number
  status: string
  description?: string
}

export interface Evidence {
  title: string
  description: string
  source: string
  sourceType: DataSourceType
}
