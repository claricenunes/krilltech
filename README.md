# KrillRadar

Sistema de triagem, monitoramento e explicação de risco de crédito no agronegócio — proposta desenvolvida para o desafio da **Krill Tech** no Hackathon 2026 Student Club PMI-DF (Distrito Federal).

O objetivo é ajudar a Krill Tech a **antecipar sinais de inadimplência e Recuperação Judicial** de seus clientes (produtores rurais e agroindústrias) antes que a crise se torne um problema maior — com um score de risco explicável, um Radar da Carteira, um simulador de cenários e um Relatório Padronizado de Risco. **A decisão de crédito é sempre humana**: o sistema explica, alerta e recomenda; não decide.

## Documentação

| O quê | Onde |
|---|---|
| Diagnóstico do problema | [`solution/problema.md`](solution/problema.md) |
| Proposta da solução | [`solution/proposta.md`](solution/proposta.md) |
| Jornada do usuário (fluxo) | [`solution/fluxo.md`](solution/fluxo.md) |
| Arquitetura de agentes de IA | [`solution/agentes.md`](solution/agentes.md) |
| Arquitetura técnica completa (API, tools, watsonx Orchestrate) | [`docs/arquitetura.md`](docs/arquitetura.md) |
| Custos, impacto e adoção | [`docs/custos.md`](docs/custos.md) |
| Análise de escopo do MVP e backlog priorizado | [`MVP_ANALYSIS.md`](MVP_ANALYSIS.md) |
| Critérios de avaliação do edital (guia interno) | [`docs/criterios-avaliacao.md`](docs/criterios-avaliacao.md) |
| Roteiro do pitch (3 min) | [`pitch/roteiro.md`](pitch/roteiro.md) |
| Project Model Canvas (entregável oficial) | [`canvas/project-model-canvas.html`](canvas/project-model-canvas.html) / [`canvas/KrillRadar-Project-Model-Canvas.pdf`](canvas/KrillRadar-Project-Model-Canvas.pdf) |
| Regras e marcos do hackathon | [`docs/regras.md`](docs/regras.md) |

## Estrutura do repositório

```text
docs/        Pesquisa, regras, edital, arquitetura técnica, custos
solution/    Documentação de produto (problema, proposta, fluxo, agentes)
canvas/      Project Model Canvas (HTML + PDF)
pitch/       Roteiro da apresentação
prompts/     Prompts dos agentes de IA
prototype/   Frontend (Vite + React + TypeScript + Tailwind)
api/         Backend determinístico (Node.js) — coleta, score, simulador
watsonx/     Definição dos agentes do watsonx Orchestrate
```

## Rodando o protótipo localmente

**Backend (API determinística):**

```bash
node api/server.mjs
```

Sobe em `http://localhost:8000`. Contrato completo em `api/openapi.json`.

**Frontend:**

```bash
cd prototype
npm install
npm run dev
```

Sobe em `http://localhost:5173`. Ver [`prototype/README.md`](prototype/README.md) para rotas e build.

## Princípios do projeto

1. O **score é sempre calculado por um motor determinístico** (regras ponderadas) — nunca por um LLM.
2. O **LLM só explica e recomenda**, a partir dos dados já calculados pelos agentes.
3. A **decisão final de crédito é sempre humana**.
4. Todo dado exibido é rotulado como **real ou de demonstração** — nunca se finge automação que não existe.

Ver `MVP_ANALYSIS.md` para o detalhamento completo dessas decisões e do que está dentro/fora do escopo do MVP.
