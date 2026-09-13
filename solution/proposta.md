# Proposta da Solução — KrillRadar

> Fontes: `Desafio Hackathon PMI & Krillteck.pdf` (Seções 6 e 7.1) e `MVP_ANALYSIS.md` (Seções 1, 2 e 4).
> Ver também: `problema.md` (diagnóstico), `fluxo.md` (jornada do usuário), `agentes.md` (arquitetura de agentes), `docs/custos.md` (custos e impacto).

## 1. Visão geral

**KrillRadar** (nome do produto do time; codinome interno "Sentinela Krill") é um sistema de **triagem, monitoramento e explicação de risco de crédito** para os clientes da Krill Tech no agronegócio. Responde diretamente ao objetivo do desafio: um sistema inteligente capaz de realizar due diligence automatizada, triagem cadastral, monitoramento processual e financeiro, e gerar um Relatório Padronizado de Risco de Crédito com Alerta Precoce de RJ/Insolvência.

A decisão final de crédito **permanece sempre humana** — o KrillRadar explica, alerta e recomenda; quem decide é o gestor.

## 2. Como resolve o problema

| Causa raiz (ver `problema.md`) | Resposta do KrillRadar |
|---|---|
| Dados dispersos em fontes públicas diferentes | Triagem por CNPJ cruza cadastro (BrasilAPI), judicial (DataJud/CNJ), ambiental (IBAMA) e agroclimático (CONAB/INMET/CEPEA) em um único relatório |
| Ausência de monitoramento contínuo | Radar da Carteira sinaliza clientes em atenção e exposição vulnerável, sem esperar o gestor "lembrar" de reavaliar um cliente |
| Decisão de crédito reativa | Simulador "e se a produtividade cair X%" antecipa o impacto de um choque antes que ele aconteça |
| Falta de um critério padronizado e explicável | Score 0–1000 + rating A–D, sempre acompanhado dos motivos (nunca "caixa-preta") |

## 3. Público-alvo / Beneficiários

- **Usuário direto:** gestores comerciais e de crédito da Krill Tech (persona Marcelo) — usam o relatório e os alertas para decidir limite de crédito e condições de pagamento.
- **Beneficiário indireto:** a própria Krill Tech, ao reduzir exposição a clientes em deterioração e padronizar a análise de crédito.
- **Titulares dos dados consultados:** produtores rurais e agroindústrias avaliados — seus dados públicos (cadastral, judicial, ambiental) são consultados com transparência sobre a finalidade.

## 4. Lógica de funcionamento (visão de produto)

Ver `fluxo.md` para a jornada completa. Em resumo, dois fluxos que convergem no mesmo relatório:

- **Fluxo 1 — Triagem de cliente novo:** CNPJ → cruzamento de dados → Relatório Padronizado de Risco (score, rating, motivos).
- **Fluxo 2 — Radar da Carteira:** visão agregada de clientes → drill-down do produtor → simulador → alerta + recomendação.

## 5. Score & Classificação de Rating

Score de 0 a 1000, calculado por um **motor determinístico de regras ponderadas** (não é IA/LLM decidindo o número — ver `agentes.md`):

| Score | Rating | Classificação |
|---:|:---:|---|
| 800–1000 | A | Baixo Risco |
| 600–799 | B | Risco Moderado |
| 400–599 | C | Risco Elevado |
| 0–399 | D | Risco Crítico / Alerta de RJ |

Pesos dos fatores: Jurídico/processual 35% · Climático/produtividade 30% · Cadastral/societário 20% · Ambiental 15%. Modelo demonstrativo baseado em regras, evolutivo para Machine Learning quando houver histórico real de inadimplência da Krill Tech (hoje inexistente).

## 6. Matriz de Red Flags

Principais sinais de perigo que o KrillRadar se propõe a identificar:

| Categoria | Sinal de alerta | Fonte |
|---|---|---|
| Jurídico | Distribuição de Recuperação Judicial, execução de título, protesto de duplicata | DataJud/CNJ (curado no MVP) |
| Ambiental | Embargo ativo por infração ambiental | IBAMA |
| Cadastral | Empresa recém-aberta, baixada, ou queda abrupta de capital social | BrasilAPI |
| Agroclimático | Queda projetada de produtividade vs. média histórica da região/cultura | CONAB/INMET (mock no MVP) |
| Financeiro (evolução futura) | Inadimplência técnica — violação de índice contratual antes do atraso de pagamento | Fora do escopo do MVP (ver `agentes.md`, seção "Fora do MVP") |

## 7. Recomendação de Decisão Operacional

O KrillRadar nunca decide o crédito — ele **traduz o score em uma recomendação para o gestor avaliar**:

- Score/rating em queda (ex.: B → C) → recomendação padrão: "não ampliar exposição; reavaliar condições de pagamento".
- Evento crítico novo (RJ distribuída, novo embargo, nova execução) → alerta imediato, independente da variação de pontos.
- A recomendação é sempre acompanhada da evidência que a originou (ex.: "queda projetada de 20% na produtividade regional, fonte CONAB").

## 8. Monitoramento Contínuo (Early Warning System)

- **Gatilho de alerta:** score cai ≥ 100 pontos entre duas avaliações, OU o rating muda de faixa, OU surge um evento crítico novo — independentemente da variação de pontos.
- **No MVP:** o Radar da Carteira exibe os clientes em atenção e a exposição vulnerável de forma agregada; o recálculo é sob demanda (triagem ou simulador), não um monitoramento automático em segundo plano.
- **Evolução futura:** monitoramento automatizado por webhooks/cron (reconsulta periódica das fontes públicas), descrito em `docs/arquitetura.md` (Seção 8, "Evolução pós-hackathon").

## 9. Diferenciais da proposta

- **Dados públicos reais onde é possível** (BrasilAPI, IBAMA), não apenas simulação — reforça viabilidade técnica perante a banca.
- **Transparência real vs. mock:** cada dado exibido é rotulado, sem fingir automação que não existe (ex.: busca automática CNPJ→DataJud não é feita, é comunicada como limitação atual).
- **Decisão sempre humana:** a IA (LLM) só traduz os números do motor determinístico em explicação — nunca decide o score nem o crédito.
- **Arquitetura de agentes orquestrados** (watsonx Orchestrate), com contrato de dados auditável entre o que é calculado e o que é narrado (ver `agentes.md`).

## 10. Próximos passos

Ver plano de implementação completo em `docs/custos.md` (Seção 10) e `MVP_ANALYSIS.md` (Seção 20, backlog priorizado). Resumo dos primeiros 6 meses pós-hackathon:

1. Piloto interno com o time de crédito da Krill Tech.
2. Ajuste do motor de scoring com feedback real do time.
3. Radar da Carteira em uso com portfólio real (não mais sintético).
4. Ampliação das integrações de dados (IBAMA, DataJud automatizado).
5. Treinamento do time comercial e expansão gradual do uso.
6. Avaliação de resultados e decisão sobre expansão/produção plena.
