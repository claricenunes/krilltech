// Converte as respostas da nossa API local (score, ranking, produtores) nos
// tipos que os componentes de UI já esperavam quando trabalhavam só com
// dados mockados. Nenhuma lógica de risco é recalculada aqui — é só
// tradução de formato.
import type { ClientStatus, PortfolioClient } from '../../types/portfolio'
import type { Rating, RiskFactor } from '../../types/risk'
import type {
  ApiClassificacao,
  ApiFatorNota,
  ApiProdutor,
  ApiRankingEntry,
} from './krillApi'

export function classificacaoToRating(classificacao: ApiClassificacao): Rating {
  switch (classificacao) {
    case 'BAIXO':
      return 'A'
    case 'MODERADO':
      return 'B'
    case 'ALTO':
      return 'C'
    case 'CRITICO':
      return 'D'
  }
}

export function classificacaoToStatus(classificacao: ApiClassificacao): ClientStatus {
  switch (classificacao) {
    case 'BAIXO':
      return 'saudavel'
    case 'MODERADO':
      return 'atencao'
    case 'ALTO':
      return 'risco_elevado'
    case 'CRITICO':
      return 'critico'
  }
}

const FATOR_LABELS: Record<string, string> = {
  juridico: 'Situação judicial',
  cadastral: 'Cadastral',
  financeiro: 'Capacidade financeira',
  ambiental: 'Ambiental',
  clima_produtividade: 'Clima e produtividade',
}

const FATOR_KEY_MAP: Record<string, RiskFactor['factorKey']> = {
  juridico: 'judicial',
  cadastral: 'cadastral',
  financeiro: 'financeiro',
  ambiental: 'ambiental',
  clima_produtividade: 'clima',
}

function notaToStatusLabel(nota: number): string {
  if (nota >= 70) return 'Regular'
  if (nota >= 40) return 'Atenção'
  return 'Risco elevado'
}

export function fatorNotaToRiskFactor(fator: ApiFatorNota): RiskFactor {
  return {
    factorKey: FATOR_KEY_MAP[fator.fator] ?? 'financeiro',
    title: FATOR_LABELS[fator.fator] ?? fator.fator,
    weight: Math.round(fator.peso * 100),
    status: notaToStatusLabel(fator.nota),
    description: fator.justificativa,
  }
}

export function buildRecommendation(notasFatores: ApiFatorNota[]): {
  title: string
  body: string
} {
  const pior = [...notasFatores].sort((a, b) => a.nota - b.nota)[0]

  if (!pior) {
    return {
      title: 'Sem recomendação disponível',
      body: 'Não há fatores suficientes para gerar uma recomendação.',
    }
  }

  return {
    title: `Ação prioritária: ${FATOR_LABELS[pior.fator] ?? pior.fator}`,
    body: pior.acao_sugerida,
  }
}

export function produtorAndRankingToPortfolioClient(
  produtor: ApiProdutor,
  ranking?: ApiRankingEntry,
): PortfolioClient {
  const classificacao: ApiClassificacao = ranking?.classificacao ?? produtor.classificacao ?? 'MODERADO'
  const score = ranking?.score ?? produtor.score ?? 0

  const recommendedAction = produtor.recuperacao_judicial
    ? 'Suspender ampliação de limite'
    : produtor.ibama_embargo_ativo
      ? 'Exigir regularização ambiental'
      : produtor.margem_liquida < produtor.exposicao
        ? 'Reavaliar exposição'
        : 'Manter condições atuais'

  return {
    id: produtor.cliente_id,
    name: produtor.nome,
    document: produtor.cliente_id,
    region: produtor.regiao,
    state: produtor.regiao,
    culture: produtor.cultura,
    score,
    rating: classificacaoToRating(classificacao),
    status: classificacaoToStatus(classificacao),
    recommendedAction,
    trend: 'stable',
    annualRevenue: produtor.receita_esperada,
    fixedCosts: produtor.custo_total,
  }
}
