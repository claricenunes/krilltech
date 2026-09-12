// Dados demonstrativos da carteira para o MVP do KrillRadar.
// Estrutura pensada para ser substituída, sem mudança de contrato,
// por um endpoint real de agregação de carteira no futuro.
import type { PortfolioSummary } from '../types/portfolio'

export const mockPortfolioSummary: PortfolioSummary = {
  totalClients: 48,
  newClients: 2,
  riscoElevado: 7,
  riscoElevadoPercent: 14.6,
  alertaRJ: 2,
  alertaRJPercent: 4.2,
  saudaveis: 39,
  saudaveisPercent: 81.3,
  lastUpdated: '12/05/2025',
  ratingDistribution: [
    { rating: 'A', label: 'A (800–1000)', count: 32, percent: 66.7 },
    { rating: 'B', label: 'B (600–799)', count: 10, percent: 20.8 },
    { rating: 'C', label: 'C (400–599)', count: 4, percent: 8.3 },
    { rating: 'D', label: 'D (0–399)', count: 2, percent: 4.2 },
  ],
  regionRisk: [
    { region: 'Centro-Oeste', clients: 3, level: 'alto' },
    { region: 'Sul', clients: 2, level: 'medio' },
    { region: 'Sudeste', clients: 1, level: 'baixo' },
    { region: 'Nordeste', clients: 1, level: 'baixo' },
    { region: 'Norte', clients: 0, level: 'none' },
  ],
}
