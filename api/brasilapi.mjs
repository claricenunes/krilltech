// Integração real com a BrasilAPI (https://brasilapi.com.br) para consulta
// de situação cadastral por CNPJ. É a única fonte de dado REAL e AO VIVO do
// backend hoje — diferente de score-engine.mjs, que é 100% mock/demonstração.
const BRASIL_API_CNPJ_URL = 'https://brasilapi.com.br/api/cnpj/v1'

export class BrasilApiError extends Error {}

function calcularAnosAtividade(dataInicioAtividade) {
  if (!dataInicioAtividade) return null
  const inicio = new Date(dataInicioAtividade)
  if (Number.isNaN(inicio.getTime())) return null
  const anos = (Date.now() - inicio.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  return Math.max(0, anos)
}

export async function consultarCnpj(cnpj) {
  const cnpjLimpo = String(cnpj).replace(/\D/g, '')

  if (cnpjLimpo.length !== 14) {
    throw new BrasilApiError('CNPJ inválido — informe os 14 dígitos, com ou sem pontuação.')
  }

  let response

  try {
    response = await fetch(`${BRASIL_API_CNPJ_URL}/${cnpjLimpo}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SentinelaKrill/1.0)',
        Accept: 'application/json'
      }
    })
  } catch {
    throw new BrasilApiError('Não foi possível conectar à BrasilAPI. Tente novamente.')
  }

  if (response.status === 404) {
    throw new BrasilApiError('CNPJ não encontrado na Receita Federal.')
  }

  if (!response.ok) {
    throw new BrasilApiError(`Erro ${response.status} ao consultar a BrasilAPI.`)
  }

  const data = await response.json()

  const situacaoRegular = data.descricao_situacao_cadastral === 'ATIVA'
  const anosAtividade = calcularAnosAtividade(data.data_inicio_atividade)

  let notaCadastral = 40
  if (situacaoRegular) {
    notaCadastral = anosAtividade !== null && anosAtividade >= 5 ? 90 : 70
  }

  const justificativaCadastral = situacaoRegular
    ? `Empresa com situação cadastral ativa${
        anosAtividade !== null ? `, em atividade há aproximadamente ${Math.floor(anosAtividade)} anos` : ''
      }.`
    : `Situação cadastral "${data.descricao_situacao_cadastral}" exige atenção antes de qualquer concessão de crédito.`

  return {
    cnpj: data.cnpj,
    razao_social: data.razao_social,
    nome_fantasia: data.nome_fantasia || null,
    situacao_cadastral: data.descricao_situacao_cadastral,
    natureza_juridica: data.natureza_juridica,
    data_inicio_atividade: data.data_inicio_atividade,
    municipio: data.municipio,
    uf: data.uf,
    cnae_principal: data.cnae_fiscal_descricao || null,
    nota_cadastral: notaCadastral,
    justificativa_cadastral: justificativaCadastral,
    fonte: 'BrasilAPI (real, ao vivo)'
  }
}
