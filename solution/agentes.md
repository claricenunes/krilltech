# Agentes — Arquitetura de IA do KrillRadar

> Fontes: `Desafio Hackathon PMI & Krillteck.pdf` (Seção 6, arquitetura sugerida) e `MVP_ANALYSIS.md` (Seção 11).
> Este documento é o resumo **conceitual**, no nível do Project Model Canvas. O contrato técnico completo (endpoints, payloads, tools do watsonx Orchestrate) está em `docs/arquitetura.md`.

## 1. Princípio central

**O LLM nunca calcula o score.** Toda a lógica de decisão (pesos, fórmula, rating) roda em código determinístico. O LLM (dentro do watsonx Orchestrate) é usado exclusivamente para **traduzir números e evidências já calculados em explicação e recomendação em linguagem natural** — nunca para decidir o valor do score ou o limite de crédito.

Essa separação responde diretamente a qualquer pergunta da banca do tipo "o LLM está inventando o score?": a resposta documentada é não.

## 2. Mapeamento: nomes do Desafio ↔ nomes do projeto

O Documento de Desafio (Seção 6) sugere uma arquitetura de referência, **sem caráter de adoção obrigatória**. O KrillRadar adota essa lógica com nomes próprios de implementação:

| Papel (nome do Desafio) | Nome no KrillRadar | LLM ou determinístico |
|---|---|---|
| Agente Coletor & Parser (RAG / Data Ingestion) | `agente_cadastral_esg` | Determinístico — chamadas de API + parsing |
| Agente de Risco Agro & Climático | `agente_risco_safra` | Determinístico — lookup + fórmula |
| Motor de Decisão & Scoring (Predictive ML) | `agente_exposicao` (regras ponderadas, não ML) | Determinístico — aplica pesos fixos |
| Agente Sintetizador & Gerador de Relatórios | `orquestrador` | **LLM**, restrito aos dados já calculados |

**Nota importante:** o Desafio descreve o motor de scoring como "Predictive ML". No MVP, o `agente_exposicao` usa um **modelo de regras ponderadas**, não um modelo estatístico treinado — porque não há histórico de inadimplência real da Krill Tech disponível para treinar nada. Essa é uma escolha deliberada e defensável (ver `problema.md` e `MVP_ANALYSIS.md`, Seção 19.2), não uma limitação escondida: o Canvas e o pitch devem chamar isso explicitamente de "PD estimada por modelo de regras, evolutivo para ML".

## 3. O que cada agente recebe, faz e nunca faz

| Agente | Recebe | Pode fazer | Nunca faz |
|---|---|---|---|
| `agente_cadastral_esg` | CNPJ/CPF | Consultar BrasilAPI, IBAMA; ler snapshot curado do DataJud | Inventar dado ausente; decidir score |
| `agente_risco_safra` | Região/cultura | Cruzar com produtividade/clima histórico (CONAB/INMET/CEPEA) | Calcular score final; gerar texto para o usuário |
| `agente_exposicao` | Dados normalizados dos dois agentes acima | Aplicar pesos e regras de forma auditável; recalcular a qualquer mudança de entrada (simulador) | Usar LLM para decidir o número; inventar peso |
| `orquestrador` | Score, rating, fatores, evidências já calculados | Traduzir números em linguagem natural; sugerir uma recomendação | Inventar evidência não presente na entrada; decidir automaticamente o crédito |

## 4. Fluxo de orquestração (visão resumida)

```text
orquestrador recebe CNPJ (ou pedido de simulação)
        │
        ├──► agente_cadastral_esg   → cadastro + judicial + ambiental
        ├──► agente_risco_safra     → indicadores agro/clima da região
        │
        ▼
agente_exposicao → aplica pesos → score + rating + fatores (determinístico)
        │
        ▼
orquestrador (LLM) → texto explicativo + recomendação, sem alterar o número
        │
        ▼
Relatório Padronizado de Risco (score, rating, fatores, texto, recomendação)
```

Detalhamento completo de cada chamada, payloads e tools do watsonx Orchestrate: ver `docs/arquitetura.md`, Seções 2 e 3.

## 5. Por que orquestração via watsonx Orchestrate (e não só código)

A Krill Tech disponibiliza, via IBM, watsonx.ai, watsonx Orchestrate e agentes IBM Bob. O KrillRadar usa especificamente o **watsonx Orchestrate** como camada que:

1. Importa o contrato OpenAPI do backend (`api/openapi.json`) e transforma cada endpoint em uma *tool*.
2. Distribui essas tools entre os agentes especializados.
3. Conduz a sequência de chamadas entre agentes (coleta → risco agro/clima → scoring → narrativa), em vez de a equipe encadear manualmente cada chamada no backend.

Isso torna a arquitetura de agentes **verificável pela banca**, não apenas narrada em slide — ver [[orquestracao-agentes]] (memória do projeto) e `docs/arquitetura.md`, Seção 3.

## 6. Fora do MVP (mas mapeado para o futuro)

- Modelo estatístico de ML treinado (falta histórico real).
- Busca automatizada CNPJ → DataJud (a API do CNJ hoje exige número do processo, não busca por CNPJ).
- Integrações com PGFN, TST/CNDT, Caixa/CRF-FGTS, MAPA/ZARC, SICAR — mencionadas no Desafio como fontes possíveis, mas não verificadas/priorizadas para o MVP.
- Detecção de inadimplência técnica (violação de covenants) como fator automático de score.

Ver backlog completo e priorização em `MVP_ANALYSIS.md` (Seções 4 e 20).
