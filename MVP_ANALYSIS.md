# MVP_ANALYSIS.md — Sentinela Krill

> Análise do MVP para o Hackathon PMI-DF 2026 (desafio KRILLTECH), com base em `docs/desafio.md`, `docs/pesquisa.md`, `pitch/roteiro.md` e no contexto fechado do produto já definido.
> Este documento não contém código. É a base de decisão antes da implementação.

---

## 1. Resumo executivo

O Sentinela Krill é um sistema de **triagem, monitoramento e explicação de risco de crédito** para clientes da KRILLTECH no agronegócio. A dor central não é identificar quem já está inadimplente, e sim **antecipar quem parece saudável hoje mas pode deixar de pagar** — o problema oficial do desafio (`desafio.md`, seção 3) e o fio condutor do pitch (persona Marcelo).

Os dois entregáveis **obrigatórios** do Hackathon são o Project Canvas e o pitch de 3 minutos; **código/protótipo é bônus competitivo**, não obrigatório (`pesquisa.md`, seção 6, nota final). Isso muda a prioridade de esforço: o MVP existe para **provar viabilidade técnica e reforçar o diagnóstico no pitch**, não para virar um produto completo. Cada hora gasta em código deve se pagar em pontos de "Viabilidade Técnica" (25%) ou "Diagnóstico & Impacto" (25%) — juntos, metade da nota.

A menor versão que convence a banca é: **um fluxo único e real, de ponta a ponta, com um caso curado**, mostrando triagem → score explicado → simulação → alerta → recomendação → decisão humana. Tudo o mais é diferencial ou dispensável.

---

## 2. Objetivo do MVP

> **"Qual é a menor versão do Sentinela Krill que consegue convencer a banca de que nossa solução resolve o problema da KRILLTECH?"**

O MVP precisa provar, com o mínimo de superfície possível:

1. Que é possível **calcular um score explicável** (não caixa-preta) a partir de dados públicos reais + dados agro/clima.
2. Que é possível **detectar deterioração** e gerar um alerta acionável.
3. Que a arquitetura de agentes proposta é **tecnicamente coerente**, mesmo que parcialmente simulada.
4. Que a **decisão final permanece humana** — a IA recomenda, não decide.

Tudo que não sustenta diretamente um desses quatro pontos é candidato a corte.

---

## 3. Jornada da demo

### 3.1 Avaliação do fluxo proposto no contexto

O fluxo do contexto (seção 12 do prompt) é bom, mas tem uma lacuna: ele começa direto no Radar da Carteira e **nunca demonstra a Triagem de Cliente Novo** — que é exatamente o "Fluxo 1" do pitch (`pitch/roteiro.md`, 0:55–1:35, busca por CNPJ). Se o MVP demonstrar só o Radar, ele **contradiz o próprio pitch escrito**, que promete as duas telas.

### 3.2 Fluxo corrigido (recomendado)

```text
Marcelo abre o Sentinela Krill
        ↓
FLUXO 1 — Triagem: digita o CNPJ de um cliente novo
        ↓
Sistema cruza cadastro + judicial + ambiental + clima/safra da região
        ↓
Relatório Padronizado de Risco aparece (score + rating + motivos)
        ↓
FLUXO 2 — Radar da Carteira: "3 clientes precisam de atenção"
        ↓
Marcelo abre o produtor em destaque (risco em deterioração)
        ↓
Drill-down: score atual, fatores, evidências, tendência
        ↓
Simulador: "e se a produtividade cair 20%?"
        ↓
Risco recalculado (score ↓, rating B→C, capacidade de pagamento ↓)
        ↓
Sistema gera alerta + recomendação ("não ampliar exposição")
        ↓
Marcelo toma a decisão final
```

Isso preserva a estrutura de 3 minutos do pitch e garante que **cada tela demonstrada no MVP tenha uma linha correspondente no roteiro do pitch** (ver seção 19).

---

## 4. Funcionalidades

### A. Indispensável (sem isso a demo não existe)

- Triagem por CNPJ com resultado real (BrasilAPI).
- Score 0–1000 + rating A/B/C/D, **sempre acompanhado dos motivos**.
- Drill-down do produtor com fatores e evidências.
- Simulador "e se a produtividade cair X%" recalculando score/rating/capacidade de pagamento.
- Um alerta gerado a partir de deterioração, com recomendação (não decisão).
- Um caso curado onde o histórico judicial (DataJud) é real, ainda que pré-selecionado.

### B. Diferencial competitivo (aumenta a nota se o P0 estiver estável)

- Radar da Carteira com visão agregada (múltiplos clientes mockados) — reforça "Diagnóstico & Impacto" e "Negócio & Custos" (mostra escala, não só um caso).
- Chamada real e ao vivo à BrasilAPI durante o pitch (dado real na hora, não só print).
- Verificação real de embargo no IBAMA para o CNPJ demonstrado.
- Explicitar na demo, com transparência, o que é real vs. mock (reforça "Viabilidade Técnica" — a banca valoriza honestidade sobre limitação de dados, é citado explicitamente no desafio).
- Estrutura visual dos 4 agentes (mesmo que parte da lógica esteja simulada em código, não literalmente publicada no watsonx Orchestrate).

### C. Nice to have (só se sobrar tempo após o núcleo pronto)

- Gráfico de evolução histórica do score (linha do tempo).
- Mais de um caso de demonstração completo.
- Filtros avançados no Radar (por região, cultura, safra).
- Exportação do Relatório Padronizado em PDF.

### D. Não construir (desperdício de tempo ou indefensável)

- Modelo estatístico/ML preditivo real de PD — não há dados históricos da KRILLTECH para treinar nada; fingir isso é o tipo de coisa que a banca vai questionar tecnicamente (fragiliza "Viabilidade Técnica").
- Busca automatizada CNPJ→DataJud — **não existe** tecnicamente (`pesquisa.md`/contexto, seção 8); construir uma automação falsa aqui é o maior risco de sermos pegos em uma afirmação não sustentável.
- Integrações com PGFN, TST/CNDT, Caixa/CRF-FGTS, MAPA/ZARC, SICAR — não verificadas; não gastar tempo tentando integrar em poucas horas.
- Autenticação/multiusuário, banco de dados real, deploy produtivo, painel administrativo.
- Qualquer mecanismo em que a IA decida limite de crédito automaticamente — fere o princípio "decisão é humana" (seção 6 do contexto) e provavelmente derruba pontos em "Diagnóstico" por descaracterizar o problema (o desafio pede apoio à decisão, não substituição dela).

---

## 5. Telas do MVP

| Tela | Objetivo | Usuário | Informações exibidas | Ações possíveis | Dados | Real/Mock/Calculado | Importância na demo | Prioridade |
|---|---|---|---|---|---|---|---|---|
| **1. Triagem de Cliente Novo** | Avaliar risco antes de conceder crédito | Marcelo | Campo CNPJ, resultado: score, rating, motivos | Digitar CNPJ, ver relatório | BrasilAPI (real) + IBAMA (real) + clima/safra (mock) | Real + Mock combinados | Alta — abre a demo | P0 |
| **2. Radar da Carteira** | Responder "o que mudou na minha carteira?" | Marcelo | Lista/cards de clientes vulneráveis, exposição total em risco, alertas recentes | Clicar em um cliente para abrir drill-down | Portfólio mockado (sintético, não são clientes reais da KRILLTECH) | Mock | Alta — gancho emocional do pitch | P0 |
| **3. Drill-down do Produtor** | Explicar o risco de um cliente específico | Marcelo | Score, rating, fatores, evidências, tendência, recomendação | Abrir simulador | Combinação real (cadastro/judicial/ambiental) + mock (clima/produtividade) | Misto | Alta — é onde o "porquê" aparece | P0 |
| **4. Simulador "E se?"** | Testar sensibilidade do risco à queda de produtividade | Marcelo | Slider de variação %, novo score/rating, nova capacidade de pagamento | Ajustar % e recalcular | Calculado (fórmula determinística, seção 8) | Calculado | Alta — é o momento mais forte do pitch | P0 |
| **5. Relatório Padronizado de Risco** | Unificar a saída de triagem e monitoramento no mesmo formato | Marcelo / banca | Score, rating, motivos, evidências, timestamp | Ver, (opcional) exportar | Deriva das telas 1/3 | Calculado | Alta — é o "fio comum" citado no pitch | P0 |
| **6. Feed de Alertas** | Mostrar histórico de alertas gerados | Marcelo | Lista de alertas com nível e recomendação | Abrir alerta → drill-down | Mock/calculado | Mock | Média | P1 |
| Tela de login/home genérica | — | — | — | — | — | — | Baixa — não agrega à história | **Não construir** (P3) |

Nota: a "Relatório Padronizado" pode ser um **componente reutilizável** (card/painel) dentro das telas 1 e 3, em vez de uma tela isolada — decisão de implementação, não de escopo.

---

## 6. Caso(s) de demonstração

Definir **2 casos**, ambos sintéticos/mockados no nome do produtor (para não atribuir risco de crédito a uma empresa real sem consentimento), mas com **dados públicos reais por trás quando possível**:

| Caso | Papel na demo | CNPJ | Dados reais | Dados mockados |
|---|---|---|---|---|
| **Caso A — Cliente novo** | Fluxo 1 (Triagem) | CNPJ real de uma empresa/produtor rural já verificado na BrasilAPI (situação ativa, sem pendências relevantes) | Cadastro (BrasilAPI), embargo (IBAMA, resultado negativo) | Produtividade/clima da região (CONAB/INMET snapshot) |
| **Caso B — Cliente em deterioração** | Fluxo 2 (Radar + drill-down + simulador) | CNPJ curado com **processo judicial real conhecido previamente** (número do processo já identificado à mão no DataJud) | Cadastro (BrasilAPI), 1 processo real (DataJud, consulta manual pré-hackathon), embargo (IBAMA) | Produtividade caindo, clima adverso na região, portfólio de "3 clientes vulneráveis" ao redor dele |

**Como manter transparência sem enfraquecer a apresentação:** dizer explicitamente no pitch e no Canvas que o Caso B usa "um processo judicial real, identificado manualmente para fins de demonstração — a integração automática CNPJ→processo depende de evolução futura da API pública do CNJ." Isso responde de forma honesta se a banca perguntar "isso é ao vivo?" — e reforça, não enfraquece, o critério de Viabilidade Técnica, porque mostra que o time entende a limitação real da API em vez de escondê-la.

**Nunca:** atribuir a uma empresa real, identificável, um score de risco alto/crítico fabricado. Se o Caso B usar um CNPJ real só para o processo judicial (informação pública), o restante dos dados de "deterioração de produtividade" deve ser claramente rotulado como simulação para fins de demonstração.

---

## 7. Dados do MVP

| Dado | Fonte | Real/Mock | Ao vivo/Snapshot | Utilização |
|---|---|---|---|---|
| Situação cadastral, QSA, CNAE, capital social | Receita Federal via BrasilAPI (`/api/cnpj/v1/{cnpj}`) | Real | Ao vivo | Triagem, drill-down |
| Áreas embargadas | IBAMA (busca por CNPJ/CPF) | Real | Ao vivo (com fallback em cache, ver riscos) | Triagem, fator "ambiental" |
| Processos judiciais (RJ, execução) | DataJud/CNJ | Real | Snapshot curado (1–2 casos, nº de processo pré-identificado) | Fator "jurídico", caso B |
| Produtividade regional | CONAB | Mock | Snapshot pré-baixado | Fator "climático/produtividade", simulador |
| Preços de commodities | CEPEA/ESALQ | Mock | Snapshot pré-baixado | Cálculo de receita estimada no simulador |
| Clima/precipitação histórica | INMET | Mock | Snapshot (opcional, se der tempo) | Contexto de risco climático |
| Portfólio de clientes (Radar) | Sintético, criado pela equipe | Mock | Estático | Radar da Carteira |
| PGFN, TST/CNDT, CRF-FGTS, MAPA/ZARC, SICAR | — | — | **Não usar no MVP** | Mencionar apenas como evolução futura no Canvas |

**Indispensáveis:** BrasilAPI (cadastro) e o motor de scoring. **Podem ser simuladas:** produtividade, clima, preços, portfólio. **Ficam para depois:** qualquer integração da lista "não verificada".

---

## 8. Lógica de scoring (v1 — regras ponderadas)

Deixar explícito no Canvas e no pitch: **isto é um modelo demonstrativo baseado em regras ponderadas, não um modelo estatístico treinado** — porque não há dados históricos de inadimplência da KRILLTECH disponíveis. A evolução natural pós-hackathon é treinar um modelo de ML sobre uma base histórica real quando ela existir.

### Fatores e pesos (proposta v1)

| Fator | Peso | Fonte | Direção |
|---|---:|---|---|
| Jurídico/processual (RJ, execução, protesto) | 35% | DataJud (curado) | Quanto mais grave, menor o score |
| Climático/produtividade (queda projetada vs. média histórica da região/cultura) | 30% | CONAB/INMET (mock) | Queda de produtividade reduz o score |
| Ambiental (embargo IBAMA) | 15% | IBAMA | Embargo ativo reduz o score |
| Cadastral/societário (tempo de atividade, situação ativa, capital social) | 20% | BrasilAPI | Empresa recém-aberta ou baixada reduz o score |

### Normalização e fórmula

1. Cada fator é normalizado para uma nota de 0 a 100 (regras simples: ex. "sem RJ/execução = 100; execução fiscal = 60; RJ distribuída = 10").
2. `score_bruto = Σ (nota_fator × peso_fator)` → resultado entre 0–100.
3. `score_final = score_bruto × 10` → escala 0–1000.
4. Classificação:

| Score | Rating | Classificação |
|---:|:---:|---|
| 800–1000 | A | Baixo Risco |
| 600–799 | B | Risco Moderado |
| 400–599 | C | Risco Elevado |
| 0–399 | D | Risco Crítico / Alerta de RJ |

### Regra de alerta

Disparar alerta quando:
- o score cair **≥ 100 pontos** entre duas avaliações, OU
- o rating **mudar de faixa** (ex. B→C), OU
- um evento crítico novo for detectado (RJ distribuída, novo embargo, nova execução) — **independente da variação de pontos**.

### Explicação obrigatória

O score nunca aparece sozinho. Sempre junto: "Risco [X] devido a [fator 1], [fator 2] e [fator 3], sendo [fator com maior peso] o principal fator."

---

## 9. Simulador "E se a produtividade cair X%?"

- **Entrada:** percentual de queda de produtividade (slider, ex. 0% a -50%).
- **Variável alterada:** produtividade estimada da safra/região do produtor.
- **Cálculo:**
  1. `receita_projetada = receita_estimada_atual × (1 + variação%)`
  2. `capacidade_pagamento = receita_projetada − custos_fixos_estimados` (custos fixos: valor de referência mockado por cultura/região)
  3. Recalcular a **nota do fator climático/produtividade** proporcionalmente à queda.
  4. Recalcular `score_final` com a fórmula da seção 8.
- **Impacto no score:** exibido lado a lado (score atual → score projetado).
- **Impacto no rating:** exibir a mudança de faixa, se houver (ex. B → C).
- **Impacto na capacidade de pagamento:** exibir em R$ e como % do valor necessário para honrar a exposição atual.
- **Mensagem ao gestor:** *"Se a produtividade cair 20%, a capacidade de pagamento estimada cai para R$ X (Y% do necessário) e o risco projetado sobe de B (Moderado) para C (Elevado). Recomendação: não ampliar exposição."*

Este cálculo é simples o bastante para implementar em poucas horas (função pura, sem ML) e ainda assim visualmente convincente.

---

## 10. Alertas e recomendação

### Formato do alerta

```json
{
  "cliente": "string (nome ou identificador mockado)",
  "cnpj": "string",
  "score": 620,
  "rating": "B",
  "probabilidade_de_inadimplencia": "estimativa demonstrativa, não calibrada estatisticamente",
  "horizonte": "6 meses | 12 meses | 24 meses",
  "principais_fatores": [
    { "fator": "climático/produtividade", "peso": "30%", "evidencia": "queda projetada de 20% na produtividade regional (fonte: CONAB, snapshot)" },
    { "fator": "jurídico", "peso": "35%", "evidencia": "nenhum processo relevante identificado" }
  ],
  "nivel_de_alerta": "moderado | alto | crítico",
  "recomendacao": "Não ampliar exposição; reavaliar condições de pagamento",
  "justificativa": "Rating caiu de B para C após simulação de queda de produtividade de 20%",
  "timestamp": "ISO-8601"
}
```

`recomendacao` é sempre uma sugestão para o humano — nunca um campo do tipo `decisao_automatica`. Isso deve aparecer literalmente assim no schema para deixar o princípio auditável no próprio contrato de dados.

---

## 11. Arquitetura de agentes — contrato

```text
Input (CNPJ/CPF ou região)
        ↓
[1] Agente Coletor & Parser
        ↓
[2] Agente de Risco Agro & Climático
        ↓
[3] Motor de Decisão & Scoring
        ↓
[4] Agente Sintetizador & Gerador de Relatórios
        ↓
Output (Relatório Padronizado de Risco + Alerta)
```

| Agente | Entrada | Saída | Responsabilidade | Pode fazer | NÃO pode fazer | LLM ou determinístico |
|---|---|---|---|---|---|---|
| **1. Coletor & Parser** | CNPJ/CPF/região | Dados estruturados (cadastro, embargo, processo) | Consultar fontes públicas e normalizar formato | Chamar BrasilAPI, IBAMA, ler snapshot do processo curado | Inventar dado ausente; decidir score | Determinístico (chamadas de API + parsing) |
| **2. Risco Agro & Climático** | Localização/região + dados coletados | Indicadores agro/clima normalizados | Cruzar região com produtividade/clima histórico e projeção do simulador | Aplicar variação % do simulador | Calcular score final; gerar texto para o usuário | Determinístico (lookup + fórmula) |
| **3. Motor de Decisão & Scoring** | Indicadores normalizados dos agentes 1 e 2 | Score 0–1000, rating A–D, PD estimada | Aplicar pesos e regras de forma auditável | Recalcular a qualquer mudança de entrada | Usar LLM para decidir o número; inventar peso | **Determinístico — nunca LLM** |
| **4. Sintetizador & Gerador de Relatórios** | Score, rating, fatores, evidências | Texto explicativo, alerta, recomendação | Traduzir números em linguagem natural para o gestor | Explicar causalidade, sugerir ação | Inventar evidência não presente na entrada; decidir automaticamente | **LLM**, com entrada restrita aos dados já calculados |

Esta separação é a resposta direta a qualquer pergunta da banca do tipo "o LLM está inventando o score?" — a resposta documentada é não: o LLM só narra o que o motor determinístico já calculou.

---

## 12. O que é real / mock / calculado / snapshot — visão consolidada

| Categoria | Itens |
|---|---|
| **Real, ao vivo** | Cadastro via BrasilAPI; consulta de embargo no IBAMA |
| **Real, snapshot curado** | 1–2 processos judiciais do DataJud (número identificado manualmente antes do hackathon) |
| **Mock/snapshot** | Produtividade (CONAB), preços (CEPEA/ESALQ), clima (INMET), portfólio de clientes do Radar |
| **Calculado** | Score, rating, PD demonstrativa, resultado do simulador, texto do alerta |
| **Fora do MVP** | PGFN, TST/CNDT, CRF-FGTS, MAPA/ZARC, SICAR |

---

## 13. O que deve funcionar / mockado / prototipado / pós-hackathon

### Deve funcionar (P0)
- Consulta real à BrasilAPI e ao IBAMA para o(s) CNPJ(s) de demonstração.
- Motor de scoring determinístico com os 4 fatores da seção 8.
- Simulador recalculando score/rating/capacidade de pagamento em tempo real.
- Geração de pelo menos 1 alerta com o JSON da seção 10.
- Texto explicativo gerado por LLM a partir da saída do motor (agente 4).

### Pode ser mockado (P1)
- Portfólio da carteira (Radar) com clientes sintéticos.
- Dados de produtividade, clima e preços.
- Feed de alertas históricos.

### Pode ser apenas prototipado/narrado (P2)
- Orquestração literal via watsonx Orchestrate (pode ser simulada em código, com a divisão de responsabilidades da seção 11 preservada e explicada verbalmente no pitch como "implementado no padrão dos agentes IBM").
- Exportação em PDF do relatório.

### Fica para pós-Hackathon (P3)
- Modelo de ML treinado com dados históricos reais.
- Integração automatizada CNPJ→DataJud.
- Integrações com PGFN, TST, CRF-FGTS, MAPA/ZARC, SICAR.
- Multiusuário, autenticação, banco de dados produtivo.
- Detecção de inadimplência técnica (violação de covenants) como fator separado.

---

## 14. Arquitetura técnica do MVP

Prioridade: **funcionar → demonstrar → explicar → escalar.**

```text
Frontend (SPA simples — React ou HTML/JS direto)
        ↓ chamadas HTTP
Backend leve (API única — Python/FastAPI ou Node/Express)
        ├── Módulo Coletor: chamadas a BrasilAPI e IBAMA + leitura do snapshot DataJud
        ├── Módulo Risco Agro/Clima: lookup em arquivos JSON/CSV mockados (CONAB/INMET/CEPEA)
        ├── Módulo Motor de Scoring: função pura, determinística, testável isoladamente
        └── Módulo Sintetizador: 1 chamada a LLM (watsonx.ai ou equivalente) com prompt restrito
        ↓
Armazenamento: arquivos JSON locais (sem banco de dados relacional) para portfólio mockado e snapshots
        ↓
Deployment: execução local ou em um único serviço (ex. Replit/Render/local com túnel) — suficiente para demo ao vivo, com fallback gravado em vídeo em caso de falha de internet
```

Não escolher tecnologia pela sofisticação: um backend simples com 4 módulos claramente separados é mais fácil de explicar à banca (critério de Viabilidade Técnica) do que uma stack complexa mal compreendida por toda a equipe.

**Ponto de atenção:** integrar literalmente com watsonx Orchestrate dentro de poucas horas é um risco de tempo. Se a equipe já tiver testado o Orchestrate antes do hackathon (conforme `docs/roteiro.md`, preparação pré-19h), avaliar viabilidade real nas primeiras horas; caso contrário, simular a orquestração em código e ser transparente sobre isso no pitch — a arquitetura conceitual (separação de responsabilidades) importa mais para a nota do que a ferramenta específica usada para orquestrar.

---

## 15. Estrutura de arquivos proposta

A estrutura já existente no repositório está, em geral, adequada. Ajustes sugeridos:

```text
/
├── README.md
├── MVP_ANALYSIS.md          ← este documento
├── docs/
│   ├── desafio.md            (existente)
│   ├── pesquisa.md           (existente)
│   ├── contexto-krilltech.md (existente)
│   ├── criterios-avaliacao.md(existente, incompleto — completar critérios 3 a 5)
│   ├── regras.md             (existente)
│   ├── roteiro.md            (existente)
│   ├── edital.md             (existente)
│   ├── arquitetura.md        (existente, vazio — preencher com a seção 11+14 deste doc)
│   ├── dados.md              (novo — tabela da seção 7)
│   └── scoring.md            (novo — seção 8 e 9 detalhadas)
├── solution/
│   ├── problema.md           (existente, vazio — preencher com seção 1/2 deste doc)
│   ├── proposta.md           (existente, vazio)
│   ├── fluxo.md              (existente, vazio — preencher com seção 3)
│   ├── agentes.md            (existente, vazio — preencher com seção 11)
│   └── arquitetura.md        (existente, vazio — avaliar se duplica docs/arquitetura.md; se sim, remover um dos dois)
├── prompts/
│   └── agente-principal.md   (existente, vazio — prompt do agente Sintetizador)
├── prototype/
│   └── README.md             (existente, vazio — instruções de como rodar o MVP)
├── pitch/
│   └── roteiro.md            (existente)
└── canvas/
    └── project-model-canvas.md (novo — entregável obrigatório)
```

**Observação:** `solution/arquitetura.md` e `docs/arquitetura.md` existem simultaneamente e ambos estão vazios — decidir qual é a fonte única antes de preencher os dois (recomendo manter só `docs/arquitetura.md` e apagar o duplicado, ou vice-versa).

---

## 16. Relação do MVP com os critérios de avaliação

| Elemento do MVP | Diagnóstico & Impacto (25%) | Viabilidade Técnica (25%) | Negócio & Custos (20%) | Gestão de Mudanças (15%) | Pitch (15%) |
|---|---:|---:|---:|---:|---:|
| Triagem por CNPJ (real) | ● | ●●● | ● | — | ●● |
| Score explicado (motivos + evidências) | ●●● | ●● | — | — | ●● |
| Radar da Carteira | ●●● | ● | ●● | ● | ●●● |
| Simulador "e se?" | ●● | ●●● | ●● | — | ●●● |
| Separação LLM vs. determinístico | ● | ●●● | ● | ●● | ● |
| Transparência real/mock | ●● | ●●● | — | ●● | ●● |
| Alerta + recomendação (não decisão) | ●●● | ● | ● | ●●● | ●● |
| Arquitetura de agentes (Canvas) | — | ●●● | ●● | ● | ●● |
| Custos de operação (Canvas) | — | — | ●●● | ● | ● |

(●●● alto impacto, ●● médio, ● baixo, — não se aplica)

**Leitura:** o simulador e a separação LLM/determinístico são os itens de maior retorno em Viabilidade Técnica — o critério mais fácil de perder pontos se a banca perceber "mágica" não explicada. O Radar e o alerta com recomendação humana são os que mais sustentam Diagnóstico & Gestão de Mudanças. **Custos (20%) é o critério menos coberto pelo código** — ele depende quase inteiramente do Canvas (estimativa de custo de APIs, LLM, infraestrutura), então merece tempo dedicado à parte, não só ao MVP técnico.

---

## 17. Relação do MVP com o pitch

O que o pitch promete (`pitch/roteiro.md`) e o que o MVP precisa provar:

| Momento do pitch | O que precisa existir no MVP |
|---|---|
| 0:55–1:35 — Fluxo 1 (Triagem CNPJ) | Tela de triagem funcionando com dado real (BrasilAPI) |
| 1:35–2:20 — Fluxo 2 (Radar + drill-down + simulador) | Radar com card "3 clientes... R$ 1,2 milhão... principal fator: deterioração climática"; drill-down; simulador -20% |
| 2:20–2:35 — Relatório padronizado | Mesmo componente de relatório usado nas telas 1 e 3 |
| 2:35–2:50 — "Dados públicos reais... orquestrados por agentes de IA no watsonx Orchestrate" | Ver ponto de correção abaixo |

**Alinhamento confirmado:** a jornada corrigida na seção 3 cobre exatamente os dois fluxos do pitch. **Números específicos citados no pitch** ("R$ 1,2 milhão de exposição vulnerável", "3 clientes") precisam existir como dado mockado consistente no Radar — decidir esse número agora e usá-lo igual no MVP e no ensaio do pitch, para não haver divergência entre o que é dito e o que aparece na tela.

---

## 18. Riscos técnicos

| Risco | Impacto | Mitigação |
|---|---|---|
| IBAMA não tem API documentada em JSON — pode exigir parsing de HTML frágil | Alto | Testar a consulta antes do hackathon; ter um cache/print do resultado como fallback |
| BrasilAPI fora do ar ou lenta durante o pitch ao vivo | Médio | Cachear a resposta do CNPJ de demonstração com antecedência; usar cache se a chamada ao vivo falhar |
| Tempo insuficiente para configurar watsonx Orchestrate | Médio-Alto | Ter plano B: orquestração simulada em código, mesma separação de responsabilidades, explicada verbalmente |
| Confundir "processo curado manualmente" com "busca automática" na fala do pitch | Alto (credibilidade) | Ajustar o texto do pitch (seção 19) e preparar resposta pronta para perguntas da banca |
| Atribuir dado de risco fabricado a uma empresa real identificável | Alto (ético/reputacional) | Usar CNPJ real só para dado público verificável (cadastro/processo); rotular o resto como mock |
| Fórmula de scoring parecer arbitrária sob perguntas da banca | Médio | Documentar a justificativa de cada peso (seção 8) e treinar a resposta: "é um modelo de regras ponderadas, evolutivo para ML com dados históricos" |
| Falha de internet no local da apresentação | Alto | Gravar um vídeo de backup da demo funcionando |

---

## 19. Pontos que precisamos corrigir

1. **Pitch afirma "base judicial do CNJ" como se fosse consulta automatizada ao vivo.** Na realidade, a API do DataJud exige o número do processo, não busca por CNPJ (`pesquisa.md`/contexto, seção 8). *Recomendação:* ajustar a fala para algo como "cruzamos com processos judiciais públicos do CNJ, incluindo casos já identificados nesta análise" — e preparar a resposta transparente caso a banca pergunte diretamente se é uma busca automática.

2. **`pesquisa.md`/`desafio.md` mencionam "Predictive ML" e cálculo de PD (Probability of Default) em 6/12/24 meses** como se fosse um modelo estatístico. O MVP viável em 12h é um **modelo de regras ponderadas**, não ML treinado. *Recomendação:* no Canvas e no pitch, chamar isso explicitamente de "PD estimada por modelo de regras, evolutivo para ML" — evita a banca perguntar "qual foi a base de treinamento?" e a equipe não ter resposta.

3. **Código/protótipo não é obrigatório** (`pesquisa.md`, seção 6: "Não é exigida a implementação funcional do sistema em código"). Isso significa que o Canvas e o pitch **não podem ser sacrificados** em nome de mais código. *Recomendação:* seguir os marcos de `docs/regras.md` (12h — MVP encaminhado; 14h30 — ensaio do pitch) rigorosamente, e não deixar o MVP consumir tempo do Canvas.

4. **O Radar da Carteira exige um "portfólio" de clientes que a KRILLTECH não nos forneceu.** *Recomendação:* deixar explícito, no pitch e no Canvas, que o portfólio exibido é sintético/demonstrativo — nunca atribuir esses dados a clientes reais da KRILLTECH.

5. **`docs/criterios-avaliacao.md` está incompleto** (documenta só os critérios de Diagnóstico e parte de Viabilidade Técnica; faltam Negócio & Custos, Implementação & Gestão de Mudanças e Pitch). *Recomendação:* completar esse documento antes do hackathon, já que ele é o guia interno da equipe para os 5 critérios.

6. **`solution/arquitetura.md` e `docs/arquitetura.md` existem duplicados e ambos vazios.** *Recomendação:* escolher um único local (sugestão: `docs/arquitetura.md`) e remover o outro para evitar informação divergente depois.

7. **Glossário jurídico define "inadimplência técnica" (violação de covenant) como distinta da financeira**, mas nenhuma funcionalidade do MVP detecta covenants — só sinais jurídicos/ambientais/climáticos. *Recomendação:* não prometer isso no pitch; se a banca perguntar, responder que é um fator de evolução futura (P3), não parte do motor atual.

8. **Fatores de risco do desafio.md (seção 8) e do contexto do produto não citam explicitamente pesos** — os pesos da seção 8 deste documento são uma proposta da equipe, não um dado fornecido pela KRILLTECH ou pelo edital. *Recomendação:* apresentá-los como hipótese de trabalho da equipe no Canvas, não como "metodologia validada por especialistas".

---

## 20. Backlog priorizado

### P0 — Obrigatório
- [ ] Motor de scoring determinístico (4 fatores, fórmula da seção 8)
- [ ] Integração real BrasilAPI (cadastro)
- [ ] Integração real IBAMA (embargo)
- [ ] Snapshot curado de 1 processo DataJud real
- [ ] Tela de Triagem (CNPJ → relatório)
- [ ] Tela de Drill-down (score + fatores + evidências)
- [ ] Simulador "e se a produtividade cair X%"
- [ ] Geração de 1 alerta no formato JSON da seção 10
- [ ] Texto explicativo via LLM (agente Sintetizador) a partir da saída do motor
- [ ] Project Model Canvas preenchido
- [ ] Pitch ensaiado dentro de 3 minutos

### P1 — Alto impacto
- [ ] Radar da Carteira com portfólio mockado (incluindo o número "3 clientes / R$ 1,2 milhão" citado no pitch)
- [ ] Dados de produtividade/clima/preço mockados (CONAB/INMET/CEPEA)
- [ ] Feed de alertas históricos
- [ ] Completar `docs/criterios-avaliacao.md`
- [ ] Resolver duplicidade `docs/arquitetura.md` vs `solution/arquitetura.md`

### P2 — Diferencial
- [ ] Orquestração literal via watsonx Orchestrate (se viável no tempo)
- [ ] Segundo caso de demonstração
- [ ] Exportação do relatório em PDF
- [ ] Gráfico de evolução histórica do score

### P3 — Pós-Hackathon
- [ ] Modelo de ML treinado com dados históricos reais
- [ ] Integração automatizada CNPJ→DataJud
- [ ] Integrações PGFN, TST/CNDT, CRF-FGTS, MAPA/ZARC, SICAR
- [ ] Detecção de inadimplência técnica (covenants)
- [ ] Multiusuário, autenticação, banco de dados produtivo

---

## 21. Plano de implementação em ordem de prioridade

1. **Arquitetura & dados (primeiras horas):** definir esquema do JSON de saída, estrutura dos snapshots mock, e confirmar que BrasilAPI/IBAMA respondem como esperado para o(s) CNPJ(s) escolhidos.
2. **Motor de scoring:** implementar como função pura, testável isoladamente, antes de qualquer tela.
3. **Fluxo principal (P0) ponta a ponta:** Triagem → Motor → Sintetizador → Relatório, primeiro sem frontend bonito (pode ser JSON no terminal), só para validar a lógica.
4. **Frontend mínimo das telas P0:** Triagem, Drill-down, Simulador.
5. **Alerta:** gerar a partir da mudança de score no simulador.
6. **Radar da Carteira (P1):** só depois do fluxo principal estável — é o item de maior retorno visual para o pitch, mas depende do motor já funcionando.
7. **Ensaio do pitch com o MVP real** (marco de 14h30 em `docs/regras.md`) — testar exatamente a jornada da seção 3 no equipamento que será usado na apresentação.
8. **Feature freeze (16h30):** parar de adicionar funcionalidade; só corrigir bugs que quebrem a demo.
9. **Canvas e custos:** trabalhar em paralelo desde o início (não é sequencial ao MVP) — é entregável obrigatório e não pode ficar para o final.
10. **Diferenciais (P2):** só se P0 e P1 estiverem estáveis e testados antes de 16h30.

Esta ordem segue a regra de ouro de `docs/regras.md`: **fluxo principal funcionando → demonstração → impacto mensurável → funcionalidades secundárias.**
