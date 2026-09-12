// Cliente HTTP para a nossa própria API local (api/server.mjs), que roda
// em http://localhost:8000 e concentra todo o cálculo determinístico de
// score, ranking e simulação. O frontend nunca calcula score sozinho —
// só consome o que a API já devolveu pronto.
const API_BASE_URL = 'http://localhost:8000'

export type ApiClassificacao = 'BAIXO' | 'MODERADO' | 'ALTO' | 'CRITICO'

/** Resposta de GET /cadastro/{cnpj} — real e ao vivo, via BrasilAPI. */
export interface ApiCadastro {
  cnpj: string
  razao_social: string
  nome_fantasia: string | null
  situacao_cadastral: string
  natureza_juridica: string
  data_inicio_atividade: string
  municipio: string
  uf: string
  cnae_principal: string | null
  nota_cadastral: number
  justificativa_cadastral: string
  fonte: string
}

export interface ApiProdutor {
  cliente_id: string
  nome: string
  regiao: string
  exposicao: number
  limite_credito: number
  prazo_dias: number
  area_ha: number
  cultura: string
  historico_atraso_dias: number
  situacao_cadastral: string
  car_regular: boolean
  ibama_embargo_ativo: boolean
  recuperacao_judicial: boolean
  processos_judiciais: number
  margem_liquida: number
  receita_esperada: number
  custo_total: number
  produtividade_media_ha: number
  produtividade_projetada: number
  preco_commodity: number
  custo_producao_ha: number
  observacoes: string
  score?: number
  classificacao?: ApiClassificacao
  cobertura_exposicao?: number
  travas_acionadas?: string[]
}

export interface ApiFatorNota {
  fator: string
  nota: number
  peso: number
  justificativa: string
  acao_sugerida: string
}

export interface ApiScoreResult {
  cliente_id: string
  nome: string
  regiao: string
  score: number
  classificacao: ApiClassificacao
  faixa: ApiClassificacao
  notas_fatores: ApiFatorNota[]
  travas_acionadas: string[]
  cobertura_exposicao: number
}

export interface ApiRankingEntry {
  cliente_id: string
  nome: string
  regiao: string
  exposicao: number
  score: number
  classificacao: ApiClassificacao
  travas_acionadas: string[]
}

export interface ApiRankingResponse {
  total_clientes: number
  clientes_vulneraveis: number
  exposicao_total_risco: number
  ranking: ApiRankingEntry[]
}

export interface ApiConformidade {
  cliente_id: string
  nome: string
  regiao: string
  situacao_cadastral: string
  car_regular: boolean
  ibama_embargo_ativo: boolean
  recuperacao_judicial: boolean
  classificacao: ApiClassificacao
  impacto_financeiro: string
  observacoes: string
}

export interface ApiSafra {
  regiao: string
  cultura: string
  produtividade_media_historica: number
  produtividade_projetada: number
  variacao_percentual: number
  nivel_risco_climatico: string
  preco_commodity: number
  custo_producao_ha: number
}

export interface ApiSimulacaoResult {
  cliente_id: string
  nome: string
  queda_produtividade_percentual: number
  receita_esperada: number
  custo_total: number
  margem: number
  cobertura_exposicao: number
  status: 'CONFORTAVEL' | 'APERTADA' | 'COMPROMETIDA'
}

export class KrillApiError extends Error {}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, init)
  } catch {
    throw new KrillApiError(
      'Não foi possível conectar à API local em http://localhost:8000. Verifique se o servidor está rodando (node api/server.mjs).',
    )
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { erro?: string } | null
    throw new KrillApiError(body?.erro ?? `Erro ${response.status} ao consultar ${path}.`)
  }

  return response.json() as Promise<T>
}

export function getCadastro(cnpj: string): Promise<ApiCadastro> {
  return request<ApiCadastro>(`/cadastro/${encodeURIComponent(cnpj)}`)
}

export function getProdutores(regiao?: string): Promise<ApiProdutor[]> {
  const query = regiao ? `?regiao=${encodeURIComponent(regiao)}` : ''
  return request<ApiProdutor[]>(`/produtores${query}`)
}

export function getProdutor(clienteId: string): Promise<ApiProdutor> {
  return request<ApiProdutor>(`/produtores/${encodeURIComponent(clienteId)}`)
}

export function getConformidade(clienteId: string): Promise<ApiConformidade> {
  return request<ApiConformidade>(`/conformidade/${encodeURIComponent(clienteId)}`)
}

export function getSafra(regiao: string, cultura?: string): Promise<ApiSafra> {
  const query = cultura ? `?cultura=${encodeURIComponent(cultura)}` : ''
  return request<ApiSafra>(`/safra/${encodeURIComponent(regiao)}${query}`)
}

export function getScore(
  clienteId: string,
  quedaProdutividadePercentual = 0,
): Promise<ApiScoreResult> {
  return request<ApiScoreResult>(
    `/score/${encodeURIComponent(clienteId)}?queda_produtividade_percentual=${quedaProdutividadePercentual}`,
  )
}

export function getRanking(
  regiao?: string,
  quedaProdutividadePercentual = 0,
): Promise<ApiRankingResponse> {
  const params = new URLSearchParams()
  if (regiao) params.set('regiao', regiao)
  params.set('queda_produtividade_percentual', String(quedaProdutividadePercentual))
  return request<ApiRankingResponse>(`/ranking?${params.toString()}`)
}

export function postSimulacao(
  clienteId: string,
  quedaProdutividadePercentual: number,
): Promise<ApiSimulacaoResult> {
  return request<ApiSimulacaoResult>('/simulacao', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cliente_id: clienteId,
      queda_produtividade_percentual: quedaProdutividadePercentual,
    }),
  })
}
