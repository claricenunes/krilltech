import type { Rating } from '../../types/risk'
import type { SimulationInput, SimulationResult } from '../../types/simulator'

/**
 * Sensibilidade de demonstração: quantos "pontos de risco" cada 1 ponto
 * percentual de queda de produtividade adiciona. É uma regra de negócio
 * simples para o MVP — NÃO é uma calibração estatística feita com
 * histórico real de inadimplência da KRILLTECH.
 */
export const DEMO_RISK_SENSITIVITY = 11.9

export function calculateProjectedRevenue(
  currentRevenue: number,
  productivityVariationPercent: number,
): number {
  return currentRevenue * (1 + productivityVariationPercent / 100)
}

export function calculatePaymentCapacity(
  projectedRevenue: number,
  fixedCosts: number,
): number {
  return projectedRevenue - fixedCosts
}

/**
 * Magnitude da deterioração do risco (sempre >= 0) — uma queda de
 * produtividade nunca melhora o cenário, por isso o valor é tratado em módulo.
 */
export function calculateRiskDelta(
  productivityVariationPercent: number,
  sensitivity: number = DEMO_RISK_SENSITIVITY,
): number {
  return Math.abs(productivityVariationPercent) * sensitivity
}

/**
 * O score representa qualidade de crédito nesta mesma escala usada pelo
 * RatingBadge (0–1000, quanto MAIOR o score, MENOR o risco — 800+ é "A,
 * Baixo Risco"). Por isso a deterioração é SUBTRAÍDA do score, nunca somada:
 * mais risco projetado = score menor = rating pior (ex.: B -> C).
 */
export function calculateProjectedScore(
  currentScore: number,
  riskDelta: number,
): number {
  return Math.min(1000, Math.max(0, currentScore - riskDelta))
}

export function calculateRating(score: number): Rating {
  if (score >= 800) return 'A'
  if (score >= 600) return 'B'
  if (score >= 400) return 'C'
  return 'D'
}

export function simulateProductivityImpact(
  input: SimulationInput,
): SimulationResult {
  const projectedRevenue = calculateProjectedRevenue(
    input.currentRevenue,
    input.productivityVariationPercent,
  )
  const paymentCapacity = calculatePaymentCapacity(
    projectedRevenue,
    input.fixedCosts,
  )
  const scoreDelta = calculateRiskDelta(input.productivityVariationPercent)
  const projectedScore = calculateProjectedScore(input.currentScore, scoreDelta)
  const projectedRating = calculateRating(projectedScore)

  return {
    projectedRevenue,
    paymentCapacity,
    projectedScore,
    projectedRating,
    scoreDelta,
  }
}

/**
 * Recomendação baseada em regra de negócio determinística e explícita —
 * não é gerada por IA nem reflete uma probabilidade de inadimplência
 * calculada. É sempre uma sugestão de apoio à decisão humana.
 */
export function getRecommendation(projectedScore: number): string {
  if (projectedScore < 600) {
    return 'Não ampliar exposição e reavaliar condições de pagamento.'
  }
  return 'Monitorar o cliente e reavaliar caso a deterioração persista.'
}
