export interface CompanyData {
  cnpj: string
  razaoSocial: string
  nomeFantasia?: string
  situacaoCadastral?: string
  naturezaJuridica?: string
  municipio?: string
  uf?: string
  cnaePrincipal?: string
  /** Nota cadastral (0-100) calculada pelo nosso backend a partir do dado real da BrasilAPI. */
  notaCadastral?: number
  justificativaCadastral?: string
  fonte?: string
}
