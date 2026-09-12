export type Rating = 'A' | 'B' | 'C' | 'D'

export type RiskFactorKey = 'cadastral' | 'judicial' | 'ambiental' | 'clima'

export type ImpactLevel = 'alto' | 'medio' | 'baixo'

/** Fator explicado com status + evidência — usado na Triagem de cliente novo. */
export interface RiskFactor {
  factorKey: RiskFactorKey
  title: string
  status: string
  description: string
  source: string
}

/** Fator de impacto na projeção de risco — usado no drill-down de carteira. */
export interface ImpactFactor {
  factorKey: RiskFactorKey
  title: string
  impact: ImpactLevel
}
