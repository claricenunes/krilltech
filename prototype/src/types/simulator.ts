import type { Rating } from './risk'

export interface SimulationInput {
  currentScore: number
  currentRevenue: number
  fixedCosts: number
  /** Percentual negativo (0 a -50), ex.: -20 representa uma queda de 20%. */
  productivityVariationPercent: number
}

export interface SimulationResult {
  projectedRevenue: number
  paymentCapacity: number
  projectedScore: number
  projectedRating: Rating
  /** Magnitude do agravamento do risco, sempre >= 0 ("pontos de risco"). */
  scoreDelta: number
}
