// Fonte de dados do protótipo ENQUANTO o backend real (api/server.mjs) fica
// pausado. Tudo aqui lê arquivos JSON estáticos em public/mock-data/ — sem
// rede, sem servidor, sem LLM. Os tipos de retorno são os MESMOS já usados
// pelas telas quando falavam com o backend real (ApiProdutor, ApiScoreResult
// etc., de krillApi.ts), então nenhum componente/mapper precisou mudar —
// só a origem do dado.
import { KrillApiError, type ApiProdutor, type ApiConformidade, type ApiSafra, type ApiRankingResponse, type ApiClassificacao } from './krillApi'

interface ColetorEntry {
  cnpj: string
  razao_social: string
  situacao_cadastral: string
  natureza_juridica: string
  data_abertura: string
  municipio: string
  uf: string
  regiao: string
  cultura: string
  processos_judiciais: number
  recuperacao_judicial: boolean
  embargo_ambiental_ativo: boolean
  car_regular: boolean
  historico_atraso_dias: number
}

interface AgroclimaEntry {
  produtividade_media_historica: number
  produtividade_projetada: number
  variacao_percentual: number
  nivel_risco_climatico: string
  preco_commodity: number
  custo_producao_ha: number
}

export interface FatorScoring {
  factorKey: 'judicial' | 'ambiental' | 'clima' | 'cadastral'
  title: string
  weight: number
  status: string
  description: string
}

interface ScoringResultado {
  score: number
  rating: 'A' | 'B' | 'C' | 'D'
  fatores: FatorScoring[]
}

interface ScoringFile {
  pesos: Record<string, number>
  resultados: Record<string, ScoringResultado>
}

interface SintetizadorEntry {
  texto_explicativo: string
  recomendacao: string
}

interface RadarFile {
  radar: { produtores: ApiProdutor[] }
}

export interface TimelineEvento {
  data: string
  tipo: 'cadastral' | 'comercial' | 'financeiro' | 'juridico' | 'climatico' | 'score'
  titulo: string
  descricao: string
}

interface AlertaDashboard {
  id: string
  nivel: 'critico' | 'atencao_precoce'
  titulo: string
  produtor_id: string
  resumo: string
  acao_sugerida: string
}

interface AlertasFile {
  resumo_diario: {
    clientes_atencao: number
    exposicao_vulneravel: number
    principal_fator: string
  }
  alertas: AlertaDashboard[]
}

const cache = new Map<string, Promise<unknown>>()

function fetchMock<T>(arquivo: string): Promise<T> {
  if (!cache.has(arquivo)) {
    cache.set(
      arquivo,
      fetch(`/mock-data/${arquivo}`).then((res) => {
        if (!res.ok) {
          throw new KrillApiError(`Não foi possível carregar ${arquivo}.`)
        }
        return res.json()
      }),
    )
  }
  return cache.get(arquivo) as Promise<T>
}

export const fetchColetor = () => fetchMock<Record<string, ColetorEntry>>('01_agente_coletor.json')
export const fetchAgroclima = () => fetchMock<Record<string, AgroclimaEntry>>('02_agente_risco_agroclima.json')
export const fetchScoring = () => fetchMock<ScoringFile>('03_motor_scoring.json')
export const fetchSintetizador = () => fetchMock<Record<string, SintetizadorEntry>>('04_agente_sintetizador.json')
export const fetchRadar = () => fetchMock<RadarFile>('05_simulador_e_radar.json')
export const fetchTimeline = () => fetchMock<Record<string, TimelineEvento[]>>('06_timeline_eventos.json')
export const fetchAlertas = () => fetchMock<AlertasFile>('07_alertas_dashboard.json')

export async function getProdutores(regiao?: string): Promise<ApiProdutor[]> {
  const { radar } = await fetchRadar()
  if (!regiao) return radar.produtores
  return radar.produtores.filter((p) => p.regiao.toLowerCase() === regiao.toLowerCase())
}

export async function getProdutor(clienteId: string): Promise<ApiProdutor> {
  const produtores = await getProdutores()
  const produtor = produtores.find((p) => p.cliente_id === clienteId)
  if (!produtor) {
    throw new KrillApiError(`Produtor com cliente_id ${clienteId} não encontrado.`)
  }
  return produtor
}

export async function getRanking(regiao?: string): Promise<ApiRankingResponse> {
  const produtores = await getProdutores(regiao)
  const ranking = [...produtores]
    .sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
    .map((p) => ({
      cliente_id: p.cliente_id,
      nome: p.nome,
      regiao: p.regiao,
      exposicao: p.exposicao,
      score: p.score ?? 0,
      classificacao: (p.classificacao ?? 'MODERADO') as ApiClassificacao,
      travas_acionadas: p.travas_acionadas ?? [],
    }))

  const vulneraveis = ranking.filter((p) => ['ALTO', 'CRITICO'].includes(p.classificacao))

  return {
    total_clientes: ranking.length,
    clientes_vulneraveis: vulneraveis.length,
    exposicao_total_risco: vulneraveis.reduce((soma, p) => soma + p.exposicao, 0),
    ranking,
  }
}

export async function getConformidade(clienteId: string): Promise<ApiConformidade> {
  const produtor = await getProdutor(clienteId)

  return {
    cliente_id: produtor.cliente_id,
    nome: produtor.nome,
    regiao: produtor.regiao,
    situacao_cadastral: produtor.situacao_cadastral,
    car_regular: produtor.car_regular,
    ibama_embargo_ativo: produtor.ibama_embargo_ativo,
    recuperacao_judicial: produtor.recuperacao_judicial,
    classificacao: (produtor.classificacao ?? 'MODERADO') as ApiClassificacao,
    impacto_financeiro: produtor.recuperacao_judicial
      ? 'A recuperação judicial aumenta o risco de perda de recebimento e exige redução imediata do limite.'
      : produtor.ibama_embargo_ativo
        ? 'O embargo ambiental pode gerar interrupção operacional e impactos financeiros significativos.'
        : 'Não houve irregularidade relevante no cadastro, ambiental ou jurídico que altere a exposição atual.',
    observacoes: produtor.observacoes,
  }
}

export async function getSafra(regiao: string, cultura?: string): Promise<ApiSafra> {
  const agroclima = await fetchAgroclima()
  const dados = agroclima[regiao]

  if (!dados) {
    throw new KrillApiError(`Dados de safra para a região ${regiao} não encontrados.`)
  }

  return { regiao, cultura: cultura ?? '', ...dados }
}

export async function getScoreDetalhado(clienteId: string): Promise<{
  score: number
  rating: 'A' | 'B' | 'C' | 'D'
  fatores: FatorScoring[]
}> {
  const { resultados } = await fetchScoring()
  const resultado = resultados[clienteId]
  if (!resultado) {
    throw new KrillApiError(`Resultado de score para ${clienteId} não encontrado.`)
  }
  return resultado
}

export async function getSintese(clienteId: string): Promise<SintetizadorEntry> {
  const sintetizador = await fetchSintetizador()
  const entrada = sintetizador[clienteId]
  if (!entrada) {
    throw new KrillApiError(`Texto explicativo para ${clienteId} não encontrado.`)
  }
  return entrada
}

export async function getTimelineDoProdutor(clienteId: string): Promise<TimelineEvento[]> {
  const timeline = await fetchTimeline()
  return timeline[clienteId] ?? []
}

export async function getAlertasDashboard() {
  return fetchAlertas()
}

export async function getColetorPorCnpj(cnpj: string): Promise<ColetorEntry> {
  const coletor = await fetchColetor()
  const entrada = coletor[cnpj.replace(/\D/g, '')]
  if (!entrada) {
    throw new KrillApiError(
      'CNPJ não encontrado na base de demonstração. Use um dos exemplos: 12345678000199, 98765432000110, 45678912000133.',
    )
  }
  return entrada
}

export { KrillApiError }
