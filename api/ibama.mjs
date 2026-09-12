// Consulta de embargos ambientais do IBAMA — dado REAL, mas de SNAPSHOT
// (não é uma chamada ao vivo por requisição como a BrasilAPI). O snapshot
// é gerado por api/scripts/build-ibama-index.mjs a partir do dataset
// oficial de Dados Abertos do IBAMA (Termos de Embargo) e salvo em
// api/data/ibama_embargos.json.
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const INDEX_PATH = path.join(__dirname, 'data', 'ibama_embargos.json')

let indiceCache = null
let tentouCarregar = false

function carregarIndice() {
  if (tentouCarregar) return indiceCache
  tentouCarregar = true

  if (!existsSync(INDEX_PATH)) {
    console.warn(
      `[ibama] Índice não encontrado em ${INDEX_PATH}. Rode "node api/scripts/build-ibama-index.mjs" para gerar o snapshot real do IBAMA.`
    )
    return null
  }

  const bruto = readFileSync(INDEX_PATH, 'utf-8')
  indiceCache = JSON.parse(bruto)
  return indiceCache
}

export function indiceDisponivel() {
  return carregarIndice() !== null
}

export function consultarEmbargo(cpfCnpj) {
  const chave = String(cpfCnpj).replace(/\D/g, '')
  const indice = carregarIndice()

  if (!indice) {
    return {
      cpf_cnpj: chave,
      indice_disponivel: false,
      embargo_ativo: null,
      total_registros: 0,
      registros: [],
      mensagem: 'Índice do IBAMA não foi gerado neste ambiente ainda.'
    }
  }

  const registros = indice.embargos_por_cpf_cnpj[chave] || []
  const ativos = registros.filter((registro) => registro.ativo)

  return {
    cpf_cnpj: chave,
    indice_disponivel: true,
    indice_gerado_em: indice.gerado_em,
    embargo_ativo: ativos.length > 0,
    total_registros: registros.length,
    registros,
    fonte: 'IBAMA - Dados Abertos, Termos de Embargo (snapshot real)'
  }
}
