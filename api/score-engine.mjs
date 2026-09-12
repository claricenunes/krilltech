const portfolio = [
  {
    cliente_id: 'cli-001',
    nome: 'Fazenda São João',
    regiao: 'Norte',
    exposicao: 1200000,
    limite_credito: 1600000,
    prazo_dias: 180,
    area_ha: 980,
    cultura: 'cana',
    historico_atraso_dias: 18,
    situacao_cadastral: 'regular',
    car_regular: true,
    ibama_embargo_ativo: false,
    recuperacao_judicial: false,
    processos_judiciais: 1,
    margem_liquida: 1100000,
    receita_esperada: 2140000,
    custo_total: 1800000,
    produtividade_media_ha: 72,
    produtividade_projetada: 68,
    preco_commodity: 58,
    custo_producao_ha: 1800,
    observacoes: 'Cliente em operação regular, com histórico leve de atraso.'
  },
  {
    cliente_id: 'cli-002',
    nome: 'Lavoura Bonança',
    regiao: 'Sudeste',
    exposicao: 900000,
    limite_credito: 1200000,
    prazo_dias: 210,
    area_ha: 760,
    cultura: 'soja',
    historico_atraso_dias: 42,
    situacao_cadastral: 'regular',
    car_regular: true,
    ibama_embargo_ativo: false,
    recuperacao_judicial: false,
    processos_judiciais: 0,
    margem_liquida: 640000,
    receita_esperada: 1710000,
    custo_total: 1500000,
    produtividade_media_ha: 61,
    produtividade_projetada: 57,
    preco_commodity: 66,
    custo_producao_ha: 2050,
    observacoes: 'Deterioração de margem e atraso recorrente no pagamento.'
  },
  {
    cliente_id: 'cli-003',
    nome: 'Agro Vale',
    regiao: 'Centro-Oeste',
    exposicao: 2400000,
    limite_credito: 3200000,
    prazo_dias: 240,
    area_ha: 1400,
    cultura: 'soja',
    historico_atraso_dias: 45,
    situacao_cadastral: 'regular',
    car_regular: true,
    ibama_embargo_ativo: false,
    recuperacao_judicial: true,
    processos_judiciais: 2,
    margem_liquida: 180000,
    receita_esperada: 2200000,
    custo_total: 1800000,
    produtividade_media_ha: 65,
    produtividade_projetada: 60,
    preco_commodity: 62,
    custo_producao_ha: 1800,
    observacoes: 'Cliente em recuperação judicial e com exposição elevada.'
  },
  {
    cliente_id: 'cli-004',
    nome: 'Cerrado Feliz',
    regiao: 'Centro-Oeste',
    exposicao: 1500000,
    limite_credito: 2000000,
    prazo_dias: 150,
    area_ha: 920,
    cultura: 'milho',
    historico_atraso_dias: 12,
    situacao_cadastral: 'regular',
    car_regular: true,
    ibama_embargo_ativo: true,
    recuperacao_judicial: false,
    processos_judiciais: 0,
    margem_liquida: 1200000,
    receita_esperada: 1950000,
    custo_total: 1360000,
    produtividade_media_ha: 58,
    produtividade_projetada: 54,
    preco_commodity: 54,
    custo_producao_ha: 1700,
    observacoes: 'Embargo ambiental ativo em área de produção relevante.'
  },
  {
    cliente_id: 'cli-005',
    nome: 'Serrana do Sul',
    regiao: 'Sul',
    exposicao: 2100000,
    limite_credito: 2600000,
    prazo_dias: 180,
    area_ha: 1180,
    cultura: 'trigo',
    historico_atraso_dias: 8,
    situacao_cadastral: 'regular',
    car_regular: true,
    ibama_embargo_ativo: false,
    recuperacao_judicial: false,
    processos_judiciais: 0,
    margem_liquida: 1800000,
    receita_esperada: 2480000,
    custo_total: 1740000,
    produtividade_media_ha: 70,
    produtividade_projetada: 66,
    preco_commodity: 71,
    custo_producao_ha: 2200,
    observacoes: 'Carteira estável, com baixa vulnerabilidade à queda de produtividade.'
  }
]

const safraPorRegiao = {
  Norte: {
    cultura: 'cana',
    produtividade_media_historica: 72,
    produtividade_projetada: 68,
    variacao_percentual: -5.6,
    nivel_risco_climatico: 'moderado',
    preco_commodity: 58,
    custo_producao_ha: 1800
  },
  Sudeste: {
    cultura: 'soja',
    produtividade_media_historica: 61,
    produtividade_projetada: 57,
    variacao_percentual: -6.6,
    nivel_risco_climatico: 'alto',
    preco_commodity: 66,
    custo_producao_ha: 2050
  },
  'Centro-Oeste': {
    cultura: 'soja',
    produtividade_media_historica: 65,
    produtividade_projetada: 60,
    variacao_percentual: -7.7,
    nivel_risco_climatico: 'alto',
    preco_commodity: 62,
    custo_producao_ha: 1800
  },
  Sul: {
    cultura: 'trigo',
    produtividade_media_historica: 70,
    produtividade_projetada: 66,
    variacao_percentual: -5.7,
    nivel_risco_climatico: 'moderado',
    preco_commodity: 71,
    custo_producao_ha: 2200
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function toMoeda(value) {
  return Number(value.toFixed(2))
}

function avaliarCobertura(cliente) {
  return cliente.exposicao > 0 ? cliente.margem_liquida / cliente.exposicao : 0
}

function obterClassificacaoPorScore(score) {
  if (score >= 800) return 'BAIXO'
  if (score >= 600) return 'MODERADO'
  if (score >= 400) return 'ALTO'
  return 'CRITICO'
}

function classificarComTravas(score, travas) {
  const rank = { CRITICO: 4, ALTO: 3, MODERADO: 2, BAIXO: 1 }
  const base = obterClassificacaoPorScore(score)
  const minRank = travas.some((trava) => ['embargo_ambiental_ativo', 'margem_nao_cobre_exposicao', 'historico_pagamento_deteriorado'].includes(trava))
    ? 'ALTO'
    : null
  const critical = travas.includes('recuperacao_judicial') || travas.filter(Boolean).length >= 2

  let final = base
  if (critical) final = 'CRITICO'
  else if (minRank && rank[minRank] > rank[base]) final = minRank

  return final
}

export function getPortfolio(regiao = null) {
  if (!regiao) return portfolio
  return portfolio.filter((cliente) => cliente.regiao.toLowerCase() === regiao.toLowerCase())
}

export function getClienteById(clienteId) {
  return portfolio.find((cliente) => cliente.cliente_id === clienteId) || null
}

export function calcularCobertura(cliente) {
  return toMoeda(avaliarCobertura(cliente))
}

export function calcularSimulacao(cliente, quedaPercentual) {
  if (!cliente) {
    throw new Error('Cliente não encontrado para simulação.')
  }

  const percentual = Number(quedaPercentual || 0)
  const receitaEsperada = cliente.receita_esperada * (1 - percentual / 100)
  const custoTotal = cliente.custo_total
  const margem = receitaEsperada - custoTotal
  const cobertura = cliente.exposicao > 0 ? margem / cliente.exposicao : 0

  let status = 'COMPROMETIDA'
  if (cobertura >= 1.5) status = 'CONFORTAVEL'
  else if (cobertura >= 1.0) status = 'APERTADA'

  return {
    cliente_id: cliente.cliente_id,
    nome: cliente.nome,
    queda_produtividade_percentual: percentual,
    receita_esperada: toMoeda(receitaEsperada),
    custo_total: toMoeda(custoTotal),
    margem: toMoeda(margem),
    cobertura_exposicao: toMoeda(cobertura),
    status
  }
}

export function calcularScore(cliente, quedaProdutividadePercentual = 0) {
  if (!cliente) {
    throw new Error('Cliente não encontrado para calcular score.')
  }

  const cobertura = avaliarCobertura(cliente)
  const queda = Number(quedaProdutividadePercentual || 0)

  const juridico = cliente.recuperacao_judicial
    ? 5
    : cliente.processos_judiciais > 1
      ? 20
      : cliente.historico_atraso_dias > 30
        ? 35
        : 82

  const cadastral = !cliente.car_regular || cliente.situacao_cadastral !== 'regular' ? 42 : 88
  const financeiro = cobertura >= 1 ? 80 : cobertura >= 0.8 ? 58 : 28
  const ambiental = cliente.ibama_embargo_ativo ? 8 : cliente.car_regular ? 91 : 48
  const clima = clamp(100 - Math.abs(queda) * 2.5, 0, 100)

  const fatorNotas = {
    juridico,
    cadastral,
    financeiro,
    ambiental,
    clima_produtividade: clima
  }

  const pesos = {
    juridico: 0.35,
    cadastral: 0.2,
    financeiro: 0.2,
    ambiental: 0.15,
    clima_produtividade: 0.1
  }

  const score = Object.entries(fatorNotas).reduce((acumulador, [nome, nota]) => {
    return acumulador + (nota * pesos[nome])
  }, 0) * 10

  const travas = {
    recuperacao_judicial: cliente.recuperacao_judicial,
    embargo_ambiental_ativo: cliente.ibama_embargo_ativo,
    margem_nao_cobre_exposicao: cobertura < 1,
    historico_pagamento_deteriorado: cliente.historico_atraso_dias > 30
  }

  const travasAtivas = Object.entries(travas)
    .filter(([, ativo]) => ativo)
    .map(([nome]) => nome)

  const classificacao = classificarComTravas(score, travasAtivas)

  const justificativas = {
    juridico: cliente.recuperacao_judicial
      ? 'Há recuperação judicial em curso, o que eleva imediatamente o risco jurídico do cliente.'
      : cliente.processos_judiciais > 0
        ? 'Existem processos jurídicos relevantes na base, ainda que não tenham se convertido em recuperação judicial.'
        : 'O histórico jurídico permanece relativamente estável para a carteira monitorada.',
    cadastral: cliente.car_regular && cliente.situacao_cadastral === 'regular'
      ? 'O cadastro cadastral está regular e o cliente continua habilitado ao crédito.'
      : 'A situação cadastral exige atenção, pois há alguma inconformidade relevante.',
    financeiro: cobertura >= 1
      ? 'A margem liquida cobre a exposição do cliente, preservando capacidade de pagamento.'
      : 'A margem líquida não cobre a exposição atual, ampliando o risco de inadimplência.',
    ambiental: cliente.ibama_embargo_ativo
      ? 'Há embargo ambiental ativo, o que aumenta o risco operacional e de crédito.'
      : 'Sem embargos ambientais ativos, o risco ambiental se mantém controlado.',
    clima_produtividade: queda > 0
      ? `A queda de produtividade projetada de ${queda}% reduz a resiliência financeira do cliente.`
      : 'A produtividade da região está estável e não piora a capacidade de pagamento.'
  }

  const acoes = {
    juridico: 'Solicitar atualização da situação processual e revisar termos de crédito.',
    cadastral: 'Confirmar documentação cadastral e validar o CAR antes de ampliar a linha.',
    financeiro: 'Reavaliar limite e exigir reforço de garantia ou ajuste de prazos.',
    ambiental: 'Exigir regularização ambiental e monitorar risco operacional e reputacional.',
    clima_produtividade: 'Acompanhar a safra e revisar a exposição para cenário de produtividade mais baixa.'
  }

  return {
    cliente_id: cliente.cliente_id,
    nome: cliente.nome,
    regiao: cliente.regiao,
    score: Math.round(score),
    classificacao,
    faixa: classificacao,
    notas_fatores: Object.entries(fatorNotas).map(([nome, nota]) => ({
      fator: nome,
      nota: Math.round(nota),
      peso: pesos[nome],
      justificativa: justificativas[nome],
      acao_sugerida: acoes[nome]
    })),
    travas_acionadas: travasAtivas,
    cobertura_exposicao: toMoeda(cobertura)
  }
}

export function calcularRanking(portfolioClientes, quedaProdutividadePercentual = 0) {
  const clientes = portfolioClientes.map((cliente) => {
    const resultado = calcularScore(cliente, quedaProdutividadePercentual)
    return {
      cliente_id: cliente.cliente_id,
      nome: cliente.nome,
      regiao: cliente.regiao,
      exposicao: cliente.exposicao,
      score: resultado.score,
      classificacao: resultado.classificacao,
      travas_acionadas: resultado.travas_acionadas
    }
  })

  const ranking = clientes.sort((a, b) => a.score - b.score)
  const vulneraveis = ranking.filter((cliente) => ['ALTO', 'CRITICO'].includes(cliente.classificacao)).length
  const exposicaoTotalRisco = ranking
    .filter((cliente) => ['ALTO', 'CRITICO'].includes(cliente.classificacao))
    .reduce((soma, cliente) => soma + cliente.exposicao, 0)

  ranking.total_clientes = ranking.length
  ranking.clientes_vulneraveis = vulneraveis
  ranking.exposicao_total_risco = toMoeda(exposicaoTotalRisco)

  return ranking
}

export function getSafraData(regiao, cultura = null) {
  const regiaoData = safraPorRegiao[regiao]
  if (!regiaoData) {
    return null
  }

  if (cultura && regiaoData.cultura.toLowerCase() !== cultura.toLowerCase()) {
    return null
  }

  return {
    regiao,
    cultura: regiaoData.cultura,
    produtividade_media_historica: regiaoData.produtividade_media_historica,
    produtividade_projetada: regiaoData.produtividade_projetada,
    variacao_percentual: regiaoData.variacao_percentual,
    nivel_risco_climatico: regiaoData.nivel_risco_climatico,
    preco_commodity: regiaoData.preco_commodity,
    custo_producao_ha: regiaoData.custo_producao_ha
  }
}

export { portfolio, safraPorRegiao }
