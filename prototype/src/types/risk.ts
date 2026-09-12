export type Rating = 'A' | 'B' | 'C' | 'D'

export type DataSourceType = 'REAL' | 'MOCK' | 'SNAPSHOT' | 'CALCULADO'

export type TrendDirection = 'up' | 'down' | 'stable'

export interface Trend {
  direction: TrendDirection
  value?: number
  label?: string
}

export interface RiskFactor {
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
