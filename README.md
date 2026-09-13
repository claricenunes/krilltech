# Sentinela Krill

Sistema de **triagem, monitoramento e explicação de risco de crédito agro**, desenvolvido para o desafio da **KRILLTECH** no Hackathon PMI-DF 2026.

> A dor não é descobrir que um cliente já está inadimplente — é **antecipar quem parece saudável hoje mas pode deixar de pagar**, dando à KRILLTECH tempo para agir antes que o risco vire prejuízo.

## O problema

A KRILLTECH vende insumos a prazo para produtores rurais em um cenário de instabilidade crescente no agronegócio (quebras de safra, El Niño, queda de commodities, Lei 14.112/20). As três dores centrais do desafio:

1. Aumento da inadimplência e das quebras no agro.
2. Pedidos repentinos de Recuperação Judicial, sem sinais de alerta antecipados.
3. Recuperação de capital lenta e complexa quando o risco já virou prejuízo.

Detalhes completos em [docs/desafio.md](docs/desafio.md) e no contexto da empresa em [docs/contexto-krilltech.md](docs/contexto-krilltech.md).

## A solução

O Sentinela Krill cobre a jornada completa — **triagem → score explicado → monitoramento → simulação → alerta → recomendação → decisão humana**:

- **Triagem de cliente novo** — consulta por CNPJ cruzando cadastro (Receita Federal), embargo ambiental (IBAMA) e processos judiciais relevantes (DataJud) antes de conceder crédito.
- **Score de risco explicável (0–1000, rating A–D)** — calculado por regras determinísticas em código, nunca por LLM, para que cada nota seja auditável e nunca uma "caixa-preta".
- **Radar da Carteira** — visão consolidada dos clientes, priorizando quem precisa de atenção imediata.
- **Simulador de cenários** — "e se a produtividade cair 20%?" recalcula score, rating e capacidade de pagamento projetada.
- **Alertas e recomendações narrados por IA** — o LLM explica e recomenda em linguagem natural a partir dos números já calculados; a decisão final permanece humana.

Regra de ouro do produto: **o LLM nunca calcula o score, apenas o explica.**

## Arquitetura

```text
[UI do protótipo (React)]
        │
        ▼
[watsonx Orchestrate]
   ├── agente_cadastral_esg  ──┐
   ├── agente_risco_safra     ─┼─► tools (OpenAPI) ──► [Backend Node.js]
   ├── agente_exposicao       ─┘                             │
   └── orquestrador (LLM: narra e recomenda)                 ├──► BrasilAPI / IBAMA / DataJud (real)
                                                               └──► JSON local (mock: CONAB/INMET/CEPEA, portfólio)
```

- **Backend** (`api/`) — Node.js puro (sem framework), 100% determinístico, expõe um contrato OpenAPI (`/openapi.json`) que o watsonx Orchestrate importa como tools.
- **watsonx Orchestrate** (`watsonx/`) — 3 agentes especializados (cadastral/ESG, risco de safra, exposição) coordenados por um agente orquestrador, cujo LLM só narra e recomenda a partir dos números que as tools já devolveram.
- **Frontend** (`prototype/`) — Vite + React + TypeScript + Tailwind, consumindo o backend diretamente para leitura de dados e o Orchestrate para os fluxos que precisam de explicação em linguagem natural.

Documento técnico completo em [solution/arquitetura.md](solution/arquitetura.md).

### Regra de scoring

| Fator | Peso |
|---|---:|
| Jurídico/processual (DataJud) | 35% |
| Climático/produtividade | 30% |
| Ambiental (embargo IBAMA) | 15% |
| Cadastral/societário (BrasilAPI) | 20% |

| Score | Rating |
|---|---|
| ≥ 800 | A |
| 600–799 | B |
| 400–599 | C |
| < 400 | D |

### Real vs. mock

| Componente | Status |
|---|---|
| Cadastro (BrasilAPI) e embargo (IBAMA) | Real, ao vivo |
| Processos judiciais (DataJud) | Real, curado (casos identificados manualmente) |
| Produtividade/clima/preços (CONAB/INMET/CEPEA) | Mock |
| Score, rating, simulação | Calculado (regras determinísticas em código) |
| Texto de relatório/alerta | Gerado por LLM real (watsonx Orchestrate), narrando dados parcialmente mock |

## Estrutura do repositório

```text
api/          Backend Node.js — score engine, integrações (BrasilAPI, IBAMA) e contrato OpenAPI
prototype/    Frontend Vite + React + TypeScript
watsonx/      Definição dos agentes do watsonx Orchestrate + guia de setup
docs/         Contexto do desafio, da empresa e critérios de avaliação
solution/     Entregáveis do hackathon (arquitetura, proposta, fluxo, problema)
pitch/        Roteiro da apresentação
prompts/      Prompts de apoio usados no desenvolvimento
MVP_ANALYSIS.md        Análise do escopo mínimo viável para a demo
PENDENCIAS_PROJETO.txt Checklist do que falta para a entrega
```

## Rodando o projeto

### Backend

```bash
node api/server.mjs
```

Sobe em `http://localhost:8000`. Sem dependências externas (usa apenas módulos nativos do Node).

### Frontend

```bash
cd prototype
npm install
npm run dev
```

Rotas: `/` (Radar da Carteira), `/triagem` (Triagem de Cliente Novo), `/produtor/:id` (Drill-down do produtor).

### watsonx Orchestrate (opcional, para os agentes de IA)

Guia passo a passo em [watsonx/README.md](watsonx/README.md) — requer Docker Desktop e o ADK do watsonx Orchestrate.

## Status

Projeto em desenvolvimento para o Hackathon PMI-DF 2026. Acompanhe as pendências em [PENDENCIAS_PROJETO.txt](PENDENCIAS_PROJETO.txt).
