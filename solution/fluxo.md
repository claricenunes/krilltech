# Fluxo — Lógica de Funcionamento da Solução

> Fonte: `MVP_ANALYSIS.md` (Seção 3, fluxo corrigido) e `Desafio Hackathon PMI & Krillteck.pdf` (Seção 7.1, bloco "Lógica de Funcionamento da Solução").
> Ver `agentes.md` para o detalhamento técnico de cada etapa e `docs/arquitetura.md` para o contrato de API por trás de cada chamada.

## 1. Visão geral da jornada

O KrillRadar tem dois fluxos de entrada que convergem no mesmo Relatório Padronizado de Risco:

```text
Marcelo abre o KrillRadar
        │
        ├── FLUXO 1 — Triagem de cliente novo (digita o CNPJ)
        │        │
        │        ▼
        │   Sistema cruza cadastro + judicial + ambiental + clima/safra da região
        │        │
        │        ▼
        │   Relatório Padronizado de Risco (score + rating + motivos)
        │
        └── FLUXO 2 — Radar da Carteira ("clientes precisam de atenção")
                 │
                 ▼
            Marcelo abre o produtor em destaque (risco em deterioração)
                 │
                 ▼
            Drill-down: score atual, fatores, evidências, tendência
                 │
                 ▼
            Simulador: "e se a produtividade cair X%?"
                 │
                 ▼
            Risco recalculado (score ↓, rating B→C, capacidade de pagamento ↓)
                 │
                 ▼
            Sistema gera alerta + recomendação
                 │
                 ▼
            Marcelo toma a decisão final
```

## 2. Fluxo 1 — Triagem de cliente novo

**Objetivo:** avaliar o risco de um produtor **antes** de conceder crédito a prazo.

1. Marcelo digita o CNPJ do produtor.
2. O sistema consulta, em paralelo: situação cadastral (BrasilAPI), embargo ambiental (IBAMA) e processo judicial relevante (DataJud/CNJ — curado no MVP).
3. O sistema cruza a região do produtor com produtividade/clima/preço de referência (CONAB/INMET/CEPEA).
4. O motor de scoring calcula o score (0–1000) e o rating (A–D).
5. O Relatório Padronizado de Risco é exibido: score, rating e motivos — nunca o número sozinho.

## 3. Fluxo 2 — Radar da Carteira

**Objetivo:** responder "o que mudou na minha carteira e onde eu olho primeiro?"

1. O Radar exibe os clientes que precisam de atenção e a exposição total em risco.
2. Marcelo abre o produtor em destaque → drill-down: score atual, fatores que compõem o score, evidências de cada fator e tendência (histórico → atual → projetado).
3. Marcelo aciona o simulador: informa uma queda de produtividade hipotética (ex.: -20%).
4. O sistema recalcula, lado a lado: score atual → score projetado, mudança de rating (se houver) e nova capacidade de pagamento estimada.
5. O sistema gera um alerta com recomendação (ex.: "não ampliar exposição; reavaliar condições de pagamento").
6. Marcelo toma a decisão final — o sistema nunca decide por ele.

## 4. O ponto de convergência: o Relatório Padronizado

Independentemente da entrada (CNPJ novo ou cliente já monitorado), a saída é sempre o mesmo formato de relatório: **score, rating, fatores explicados, evidência de cada um, recomendação**. Isso evita que a Krill Tech tenha dois critérios diferentes dependendo de como o cliente entrou no radar.

## 5. Gatilho de alerta (Early Warning)

Um alerta é disparado quando:

- o score cai **≥ 100 pontos** entre duas avaliações, OU
- o rating **muda de faixa** (ex.: B → C), OU
- surge um **evento crítico novo** (RJ distribuída, novo embargo, nova execução) — independentemente da variação de pontos.

## 6. O que fica fora do fluxo do MVP

- Monitoramento automático em segundo plano (hoje o recálculo é sob demanda, disparado pela triagem ou pelo simulador — ver `docs/arquitetura.md`, Seção 8).
- Qualquer caminho em que o sistema decida o limite de crédito automaticamente — fere o princípio "decisão é sempre humana" (ver `problema.md`, Seção 6, e `proposta.md`, Seção 9).
