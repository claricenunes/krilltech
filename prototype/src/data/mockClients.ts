// Amostra demonstrativa da carteira do KrillRadar — pequena e curada de propósito
// para a demo: mostra o estado ATUAL (aparentemente saudável) dos 3 clientes
// que a Home sinaliza como precisando de atenção, ao lado de clientes estáveis.
// NÃO representa clientes reais da KRILLTECH.
import type { PortfolioClient } from '../types/portfolio'

export const mockClients: PortfolioClient[] = [
  {
    id: 'fazenda-boa-vista',
    name: 'Fazenda Boa Vista Ltda.',
    document: '12.345.678/0001-90',
    state: 'GO',
    culture: 'Soja e milho',
    score: 812,
    rating: 'A',
    exposure: 500_000,
  },
  {
    id: 'agroindustria-horizonte',
    name: 'Agroindústria Horizonte',
    document: '22.333.444/0001-55',
    state: 'GO',
    culture: 'Cana-de-açúcar',
    score: 705,
    rating: 'B',
    exposure: 450_000,
  },
  {
    id: 'agropecuaria-rio-verde',
    name: 'Agropecuária Rio Verde',
    document: '98.765.432/0001-10',
    state: 'MT',
    culture: 'Algodão',
    score: 748,
    rating: 'B',
    exposure: 250_000,
  },
  {
    id: 'sementes-do-cerrado',
    name: 'Sementes do Cerrado',
    document: '11.222.333/0001-44',
    state: 'BA',
    culture: 'Soja',
    score: 835,
    rating: 'A',
    exposure: 380_000,
  },
  {
    id: 'agropecuaria-santa-fe',
    name: 'Agropecuária Santa Fé',
    document: '33.444.555/0001-21',
    state: 'PR',
    culture: 'Milho',
    score: 902,
    rating: 'A',
    exposure: 610_000,
  },
  {
    id: 'cooperativa-terra-forte',
    name: 'Cooperativa Terra Forte',
    document: '77.888.999/0001-65',
    state: 'MS',
    culture: 'Soja e milho',
    score: 888,
    rating: 'A',
    exposure: 720_000,
  },
]

export function getClientById(id: string): PortfolioClient | undefined {
  return mockClients.find((client) => client.id === id)
}
