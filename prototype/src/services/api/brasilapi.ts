import type { CompanyData } from '../../types/company'

const BRASIL_API_CNPJ_URL = 'https://brasilapi.com.br/api/cnpj/v1'

// Campos consumidos da resposta real da BrasilAPI (GET /api/cnpj/v1/{cnpj}).
// Somente os campos usados pela triagem cadastral são tipados aqui.
interface BrasilApiCnpjResponse {
  cnpj: string
  razao_social: string
  nome_fantasia: string
  descricao_situacao_cadastral: string
  natureza_juridica: string
  logradouro: string
  bairro: string
  municipio: string
  uf: string
}

export class BrasilApiError extends Error {}

export async function getCompanyByCnpj(cnpj: string): Promise<CompanyData> {
  let response: Response

  try {
    response = await fetch(`${BRASIL_API_CNPJ_URL}/${cnpj}`)
  } catch {
    throw new BrasilApiError(
      'Não foi possível consultar este CNPJ. Tente novamente.',
    )
  }

  if (response.status === 404) {
    throw new BrasilApiError('CNPJ não encontrado.')
  }

  if (!response.ok) {
    throw new BrasilApiError(
      'Não foi possível consultar este CNPJ. Tente novamente.',
    )
  }

  const data = (await response.json()) as BrasilApiCnpjResponse

  return {
    cnpj: data.cnpj,
    razaoSocial: data.razao_social,
    nomeFantasia: data.nome_fantasia || undefined,
    situacaoCadastral: data.descricao_situacao_cadastral || undefined,
    naturezaJuridica: data.natureza_juridica || undefined,
    logradouro: data.logradouro || undefined,
    bairro: data.bairro || undefined,
    municipio: data.municipio || undefined,
    uf: data.uf || undefined,
  }
}
