import http from 'node:http'
import { URL } from 'node:url'

import { BrasilApiError, consultarCnpj } from './brasilapi.mjs'
import {
  calcularRanking,
  calcularScore,
  calcularSimulacao,
  getClienteById,
  getPortfolio,
  getSafraData
} from './score-engine.mjs'

const PORT = 8000

const openapiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Sentinela Krill API',
    version: '1.0.0',
    description: 'API de risco de crédito agro para a KRILLTECH.'
  },
  servers: [{ url: 'http://localhost:8000', description: 'Servidor local de desenvolvimento' }],
  paths: {
    '/health': {
      get: {
        operationId: 'health_check',
        summary: 'Health check',
        description: 'Verifica se a API está em funcionamento.',
        responses: {
          '200': { description: 'Serviço disponível' }
        }
      }
    },
    '/cadastro/{cnpj}': {
      get: {
        operationId: 'obter_cadastro_cnpj',
        summary: 'Consulta cadastral real por CNPJ (BrasilAPI)',
        description: 'Consulta ao vivo a situação cadastral do CNPJ na BrasilAPI (Receita Federal). Diferente de /produtores, não depende da carteira mockada — funciona para qualquer CNPJ real válido.',
        parameters: [
          {
            name: 'cnpj',
            in: 'path',
            required: true,
            description: 'CNPJ a consultar, com ou sem pontuação (14 dígitos).',
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': { description: 'Dados cadastrais reais do CNPJ' },
          '400': { description: 'CNPJ inválido' },
          '404': { description: 'CNPJ não encontrado na Receita Federal' },
          '502': { description: 'Falha ao consultar a BrasilAPI' }
        }
      }
    },
    '/produtores': {
      get: {
        operationId: 'listar_produtores',
        summary: 'Listar produtores',
        description: 'Lista a carteira de produtores com filtro opcional por região.',
        parameters: [
          {
            name: 'regiao',
            in: 'query',
            required: false,
            description: 'Região geográfica para filtrar os produtores.',
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': { description: 'Lista de produtores' }
        }
      }
    },
    '/produtores/{cliente_id}': {
      get: {
        operationId: 'obter_produtor',
        summary: 'Detalhar produtor',
        description: 'Retorna a exposição e os principais indicadores do produtor informado.',
        parameters: [
          {
            name: 'cliente_id',
            in: 'path',
            required: true,
            description: 'Identificador único do produtor.',
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': { description: 'Detalhes do produtor' },
          '404': { description: 'Produtor não encontrado' }
        }
      }
    },
    '/conformidade/{cliente_id}': {
      get: {
        operationId: 'obter_conformidade',
        summary: 'Conformidade do produtor',
        description: 'Retorna o status cadastral, ambiental e jurídico do produtor.',
        parameters: [
          {
            name: 'cliente_id',
            in: 'path',
            required: true,
            description: 'Identificador único do produtor.',
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': { description: 'Dados de conformidade' },
          '404': { description: 'Produtor não encontrado' }
        }
      }
    },
    '/safra/{regiao}': {
      get: {
        operationId: 'obter_safra_regiao',
        summary: 'Dados de safra por região',
        description: 'Retorna indicadores históricos e projetados de produtividade e clima da região.',
        parameters: [
          {
            name: 'regiao',
            in: 'path',
            required: true,
            description: 'Região para consulta de safra e clima.',
            schema: { type: 'string' }
          },
          {
            name: 'cultura',
            in: 'query',
            required: false,
            description: 'Cultura agrícola a ser filtrada para a região.',
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': { description: 'Dados da safra' },
          '404': { description: 'Região ou cultura não encontrada' }
        }
      }
    },
    '/simulacao': {
      post: {
        operationId: 'simular_cenario',
        summary: 'Simular cenário de produtividade',
        description: 'Calcula a margem e a cobertura da exposição para uma queda percentual de produtividade.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['cliente_id', 'queda_produtividade_percentual'],
                properties: {
                  cliente_id: {
                    type: 'string',
                    description: 'Identificador do produtor a ser simulado.'
                  },
                  queda_produtividade_percentual: {
                    type: 'number',
                    description: 'Queda percentual de produtividade esperada.'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Resultado da simulação' },
          '400': { description: 'Dados incompletos ou inválidos' }
        }
      }
    },
    '/score/{cliente_id}': {
      get: {
        operationId: 'obter_score',
        summary: 'Score do produtor',
        description: 'Retorna o score determinístico de 0 a 1000, os fatores e as travas aplicadas.',
        parameters: [
          {
            name: 'cliente_id',
            in: 'path',
            required: true,
            description: 'Identificador único do produtor.',
            schema: { type: 'string' }
          },
          {
            name: 'queda_produtividade_percentual',
            in: 'query',
            required: false,
            description: 'Queda percentual de produtividade utilizada no cálculo do clima e do score.',
            schema: { type: 'number' }
          }
        ],
        responses: {
          '200': { description: 'Score do produtor' },
          '404': { description: 'Produtor não encontrado' }
        }
      }
    },
    '/ranking': {
      get: {
        operationId: 'obter_ranking',
        summary: 'Ranking de risco',
        description: 'Lista os clientes ordenados do pior score para o melhor, com vulnerabilidade e exposição total em risco.',
        parameters: [
          {
            name: 'regiao',
            in: 'query',
            required: false,
            description: 'Região para filtrar a carteira analisada.',
            schema: { type: 'string' }
          },
          {
            name: 'queda_produtividade_percentual',
            in: 'query',
            required: false,
            description: 'Queda percentual de produtividade aplicada na simulação de risco.',
            schema: { type: 'number' }
          }
        ],
        responses: {
          '200': { description: 'Ranking da carteira' }
        }
      }
    }
  }
}

function jsonResponse(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  })
  res.end(JSON.stringify(payload, null, 2))
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []

    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => {
      const rawBody = Buffer.concat(chunks).toString()
      if (!rawBody) {
        resolve({})
        return
      }

      try {
        resolve(JSON.parse(rawBody))
      } catch (error) {
        reject(new Error('Corpo da requisição deve ser um JSON válido.'))
      }
    })
    req.on('error', (error) => reject(error))
  })
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    })
    res.end()
    return
  }

  try {
    if (req.method === 'GET' && url.pathname === '/health') {
      jsonResponse(res, 200, { status: 'ok', mensagem: 'API do Sentinela Krill está operacional.' })
      return
    }

    if (req.method === 'GET' && url.pathname === '/openapi.json') {
      jsonResponse(res, 200, openapiSpec)
      return
    }

    if (req.method === 'GET' && /^\/cadastro\//.test(url.pathname) && url.pathname !== '/cadastro') {
      const cnpj = url.pathname.split('/').filter(Boolean)[1]

      try {
        const cadastro = await consultarCnpj(cnpj)
        jsonResponse(res, 200, cadastro)
      } catch (error) {
        if (error instanceof BrasilApiError) {
          const status = /não encontrado/i.test(error.message)
            ? 404
            : /inválido/i.test(error.message)
              ? 400
              : 502
          jsonResponse(res, status, { erro: error.message })
          return
        }
        throw error
      }

      return
    }

    if (req.method === 'GET' && url.pathname === '/produtores') {
      const regiao = url.searchParams.get('regiao')
      const produtores = getPortfolio(regiao)
      jsonResponse(res, 200, produtores)
      return
    }

    if (req.method === 'GET' && /^\/produtores\//.test(url.pathname) && url.pathname !== '/produtores') {
      const id = url.pathname.split('/').filter(Boolean)[1]
      if (!id) {
        jsonResponse(res, 400, { erro: 'Identificador do produtor é obrigatório.' })
        return
      }

      const cliente = getClienteById(id)
      if (!cliente) {
        jsonResponse(res, 404, { erro: `Produtor com cliente_id ${id} não encontrado.` })
        return
      }

      const score = calcularScore(cliente)
      jsonResponse(res, 200, {
        ...cliente,
        score: score.score,
        classificacao: score.classificacao,
        cobertura_exposicao: score.cobertura_exposicao,
        travas_acionadas: score.travas_acionadas
      })
      return
    }

    if (req.method === 'GET' && /^\/conformidade\//.test(url.pathname) && url.pathname !== '/conformidade') {
      const id = url.pathname.split('/').filter(Boolean)[1]
      const cliente = getClienteById(id)
      if (!cliente) {
        jsonResponse(res, 404, { erro: `Produtor com cliente_id ${id} não encontrado.` })
        return
      }

      const score = calcularScore(cliente)
      jsonResponse(res, 200, {
        cliente_id: cliente.cliente_id,
        nome: cliente.nome,
        regiao: cliente.regiao,
        situacao_cadastral: cliente.situacao_cadastral,
        car_regular: cliente.car_regular,
        ibama_embargo_ativo: cliente.ibama_embargo_ativo,
        recuperacao_judicial: cliente.recuperacao_judicial,
        classificacao: score.classificacao,
        impacto_financeiro: cliente.recuperacao_judicial
          ? 'A recuperação judicial aumenta o risco de perda de recebimento e exige redução imediata do limite.'
          : cliente.ibama_embargo_ativo
            ? 'O embargo ambiental pode gerar interrupção operacional e impactos financeiros significativos.'
            : 'Não houve irregularidade relevante no cadastro, ambiental ou jurídico que altere a exposição atual.',
        observacoes: cliente.observacoes
      })
      return
    }

    if (req.method === 'GET' && /^\/safra\//.test(url.pathname) && url.pathname !== '/safra') {
      const regiao = url.pathname.split('/').filter(Boolean)[1]
      const cultura = url.searchParams.get('cultura')
      const dados = getSafraData(regiao, cultura)

      if (!dados) {
        jsonResponse(res, 404, {
          erro: `Dados de safra para a região ${regiao || 'informada'} e cultura ${cultura || 'solicitada'} não foram encontrados.`
        })
        return
      }

      jsonResponse(res, 200, dados)
      return
    }

    if (req.method === 'POST' && url.pathname === '/simulacao') {
      const body = await parseJsonBody(req)
      const { cliente_id, queda_produtividade_percentual } = body

      if (!cliente_id || typeof queda_produtividade_percentual === 'undefined') {
        jsonResponse(res, 400, {
          erro: 'Os campos cliente_id e queda_produtividade_percentual são obrigatórios.'
        })
        return
      }

      const cliente = getClienteById(cliente_id)
      if (!cliente) {
        jsonResponse(res, 404, { erro: `Produtor com cliente_id ${cliente_id} não encontrado.` })
        return
      }

      const simulacao = calcularSimulacao(cliente, queda_produtividade_percentual)
      jsonResponse(res, 200, simulacao)
      return
    }

    if (req.method === 'GET' && /^\/score\//.test(url.pathname) && url.pathname !== '/score') {
      const id = url.pathname.split('/').filter(Boolean)[1]
      const queda = url.searchParams.get('queda_produtividade_percentual') ?? '0'
      const cliente = getClienteById(id)
      if (!cliente) {
        jsonResponse(res, 404, { erro: `Produtor com cliente_id ${id} não encontrado.` })
        return
      }
      const resultado = calcularScore(cliente, Number(queda))
      jsonResponse(res, 200, resultado)
      return
    }

    if (req.method === 'GET' && url.pathname === '/ranking') {
      const regiao = url.searchParams.get('regiao')
      const queda = url.searchParams.get('queda_produtividade_percentual') ?? '0'
      const ranking = calcularRanking(getPortfolio(regiao), Number(queda))
      jsonResponse(res, 200, {
        total_clientes: ranking.total_clientes,
        clientes_vulneraveis: ranking.clientes_vulneraveis,
        exposicao_total_risco: ranking.exposicao_total_risco,
        ranking: ranking.map((cliente) => ({
          cliente_id: cliente.cliente_id,
          nome: cliente.nome,
          regiao: cliente.regiao,
          exposicao: cliente.exposicao,
          score: cliente.score,
          classificacao: cliente.classificacao,
          travas_acionadas: cliente.travas_acionadas
        }))
      })
      return
    }

    jsonResponse(res, 404, { erro: 'Endpoint não encontrado.' })
  } catch (error) {
    jsonResponse(res, 500, {
      erro: 'Erro interno ao processar a requisição.',
      detalhe: error.message
    })
  }
})

server.listen(PORT, () => {
  console.log(`API do Sentinela Krill executando em http://localhost:${PORT}`)
})
