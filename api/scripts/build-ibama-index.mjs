// Baixa o dataset oficial de Termos de Embargo do IBAMA (dados abertos,
// dadosabertos.ibama.gov.br) e gera um índice compacto por CPF/CNPJ em
// data/ibama_embargos.json. É um snapshot REAL (não uma consulta ao vivo
// por requisição) — rode este script novamente quando quiser atualizar o
// dado. Requer `tar` disponível no PATH (nativo no Windows 10+/macOS/Linux)
// para extrair o .zip.
import { execFileSync } from 'node:child_process'
import { createReadStream, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import readline from 'node:readline'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TMP_DIR = path.join(__dirname, '.ibama-tmp')
const ZIP_PATH = path.join(TMP_DIR, 'termo_embargo.zip')
const CSV_PATH = path.join(TMP_DIR, 'termo_embargo.csv')
const ZIP_URL = 'https://dadosabertos.ibama.gov.br/dados/SIFISC/termo_embargo/termo_embargo/termo_embargo_csv.zip'
const OUTPUT_PATH = path.join(__dirname, '..', 'data', 'ibama_embargos.json')

const COL = {
  SIT_CANCELADO: 3,
  DAT_EMBARGO: 7,
  NOME_EMBARGADO: 11,
  CPF_CNPJ_EMBARGADO: 12,
  MUNICIPIO: 16,
  UF: 17,
  LONGITUDE: 19,
  LATITUDE: 20,
  AREA_HA: 24,
  NOME_IMOVEL: 25
}

async function baixarZip() {
  console.log(`Baixando ${ZIP_URL} ...`)
  const response = await fetch(ZIP_URL)
  if (!response.ok) {
    throw new Error(`Falha ao baixar dataset do IBAMA: HTTP ${response.status}`)
  }
  const buffer = Buffer.from(await response.arrayBuffer())
  writeFileSync(ZIP_PATH, buffer)
  console.log(`Baixado (${(buffer.length / 1024 / 1024).toFixed(1)} MB).`)
}

function extrairZip() {
  console.log('Extraindo .zip com tar...')
  execFileSync('tar', ['-xf', ZIP_PATH, '-C', TMP_DIR])
}

function limparCpfCnpj(valor) {
  return String(valor || '').replace(/\D/g, '')
}

async function construirIndice() {
  const indice = {}
  let total = 0
  let ativos = 0

  const rl = readline.createInterface({
    input: createReadStream(CSV_PATH, { encoding: 'utf-8' }),
    crlfDelay: Infinity
  })

  let isFirstLine = true

  for await (const linha of rl) {
    if (isFirstLine) {
      isFirstLine = false
      continue
    }
    if (!linha.trim()) continue

    const campos = linha.split(';')
    const cpfCnpj = limparCpfCnpj(campos[COL.CPF_CNPJ_EMBARGADO])
    if (!cpfCnpj) continue

    total += 1
    const cancelado = campos[COL.SIT_CANCELADO] === 'S'
    if (!cancelado) ativos += 1

    const registro = {
      nome: campos[COL.NOME_EMBARGADO] || null,
      municipio: campos[COL.MUNICIPIO] || null,
      uf: campos[COL.UF] || null,
      data_embargo: campos[COL.DAT_EMBARGO] || null,
      latitude: campos[COL.LATITUDE] ? Number(campos[COL.LATITUDE]) : null,
      longitude: campos[COL.LONGITUDE] ? Number(campos[COL.LONGITUDE]) : null,
      area_ha: campos[COL.AREA_HA] ? campos[COL.AREA_HA].replace(',', '.') : null,
      nome_imovel: campos[COL.NOME_IMOVEL] || null,
      ativo: !cancelado
    }

    if (!indice[cpfCnpj]) indice[cpfCnpj] = []
    indice[cpfCnpj].push(registro)
  }

  console.log(`Total de registros processados: ${total}`)
  console.log(`Registros ativos (não cancelados): ${ativos}`)
  console.log(`CPFs/CNPJs distintos no índice: ${Object.keys(indice).length}`)

  return {
    gerado_em: new Date().toISOString(),
    fonte: 'IBAMA - Dados Abertos (Termos de Embargo) - https://dadosabertos.ibama.gov.br/dataset/fiscalizacao-termo-de-embargo',
    total_registros: total,
    total_ativos: ativos,
    embargos_por_cpf_cnpj: indice
  }
}

async function main() {
  mkdirSync(TMP_DIR, { recursive: true })
  mkdirSync(path.join(__dirname, '..', 'data'), { recursive: true })

  try {
    if (!existsSync(CSV_PATH)) {
      await baixarZip()
      extrairZip()
    } else {
      console.log('Usando CSV já baixado em .ibama-tmp (apague a pasta para forçar novo download).')
    }

    const resultado = await construirIndice()
    writeFileSync(OUTPUT_PATH, JSON.stringify(resultado))
    console.log(`Índice salvo em ${OUTPUT_PATH}`)
  } finally {
    rmSync(TMP_DIR, { recursive: true, force: true })
  }
}

main().catch((error) => {
  console.error('Erro ao construir índice do IBAMA:', error)
  process.exit(1)
})
