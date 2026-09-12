# Arquitetura técnica — Sentinela Krill

Documento de referência técnica do projeto. Hackathon PMI-DF 2026 — Desafio Krill Tech.

## 1. Visão geral

O Sentinela Krill é dividido em duas camadas que se conectam por um contrato OpenAPI:

1. **Backend da solução** — API em Node.js, 100% determinística (sem LLM), responsável por coletar dados públicos, calcular score/risco e rodar o simulador. Toda a lógica de negócio auditável vive aqui.
2. **IBM watsonx Orchestrate** — importa o OpenAPI do backend, transforma cada endpoint em uma *tool*, e distribui essas tools entre agentes especializados. Um agente orquestrador coordena os agentes especializados e usa seu próprio LLM **apenas para explicar e recomendar** — nunca para calcular o score.

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

Princípio central: **o LLM nunca calcula o score.** O backend expõe endpoints determinísticos (score, ranking, simulação) descritos em `/openapi.json`; o watsonx Orchestrate importa esse contrato e cria uma tool por endpoint. Os agentes especializados só chamam essas tools; o orquestrador usa o LLM exclusivamente para montar a explicação final e a recomendação a partir do número que a tool já devolveu. Essa separação é a resposta direta a qualquer pergunta da banca do tipo "o LLM está inventando o score?".

## 2. Backend da solução

- **Stack:** Node.js (Express ou Fastify), documentado via OpenAPI 3.x.
- **Idioma:** respostas em português (mensagens, labels, textos de erro).
- **Regra de ouro:** score e ranking são calculados em código puro — nenhuma chamada a LLM acontece dentro do backend.
- **Contrato:** `/openapi.json`, gerado a partir das rotas (ex: `swagger-jsdoc`/`zod-to-openapi` ou spec escrita à mão), é o artefato que o watsonx Orchestrate importa para criar as tools. Qualquer endpoint novo só vira tool depois de aparecer nesse arquivo.

### 2.1 Endpoints (futuras tools do Orchestrate)

| Endpoint | Método | Papel | Consumido por (agente) |
|---|---|---|---|
| `/cadastro/{cnpj}` | GET | Situação cadastral (BrasilAPI) + embargo (IBAMA) + processo judicial curado (DataJud) | `agente_cadastral_esg` |
| `/risco-safra/{regiao}` | GET | Produtividade/clima/preço da região (mock: CONAB/INMET/CEPEA) | `agente_risco_safra` |
| `/score` | POST | Aplica pesos aos fatores recebidos → score 0–1000 + rating A–D (determinístico) | `agente_exposicao` |
| `/simular` | POST | Recalcula score/rating/capacidade de pagamento sob um cenário hipotético (ex: queda de produtividade) | `agente_exposicao` |
| `/portfolio` | GET | Lista mock de produtores para a tela Radar da Carteira | UI (direto, sem passar por agente) |

`/portfolio` é consumido diretamente pela UI porque é uma listagem estática de apoio à tela — não faz parte do raciocínio de risco que os agentes precisam orquestrar.

### 2.2 Armazenamento

Sem banco de dados relacional no MVP — arquivos JSON locais cumprem o papel de "base de dados" simplificada:

| Arquivo | Conteúdo |
|---|---|
| `data/portfolio.json` | Produtores da carteira (nome, CNPJ, exposição, score atual) |
| `data/mock_clima.json` | Produtividade/clima/preço por região (CONAB/INMET/CEPEA simulados) |
| `data/datajud_curado.json` | 1–2 processos judiciais reais, identificados manualmente |
| `data/cache_brasilapi.json` (opcional) | Cache de respostas da BrasilAPI para evitar rate limit durante a demo |

Justificativa: um banco (mesmo SQLite) adiciona overhead de setup sem ganho de credibilidade no pitch; arquivos JSON são mais rápidos de editar/debugar sob pressão de tempo. Decisão consciente, registrada também no Project Model Canvas.

## 3. watsonx Orchestrate

### 3.1 Importação do OpenAPI

1. Backend expõe `/openapi.json`.
2. No watsonx Orchestrate, esse arquivo é importado como uma fonte de *tools* — cada endpoint documentado (`/cadastro/{cnpj}`, `/risco-safra/{regiao}`, `/score`, `/simular`) vira uma tool disponível para os agentes.
3. As tools são distribuídas entre os agentes conforme a tabela da seção 2.1.

### 3.2 Agentes

**`agente_cadastral_esg`**
- **Recebe:** CNPJ do produtor.
- **Chama:** tool `/cadastro/{cnpj}`.
- **O que a tool faz por baixo:** consulta BrasilAPI (situação cadastral, sócios, CNAE, tempo de atividade), consulta IBAMA (embargo ambiental ativo ou não) e lê o snapshot curado do DataJud (processo judicial pré-identificado, se o CNPJ for o caso B).
- **Devolve ao orquestrador:** bloco de dados normalizado — situação cadastral, presença/ausência de embargo, presença/ausência de processo judicial relevante. Sem interpretação, sem nota, sem score.
- **Não faz:** não pondera nem decide se o dado é "bom" ou "ruim" para o score — só coleta e entrega dado bruto estruturado.

**`agente_risco_safra`**
- **Recebe:** região/cultura associada ao produtor (derivada do CNPJ ou informada junto).
- **Chama:** tool `/risco-safra/{regiao}`.
- **O que a tool faz por baixo:** lookup nos arquivos mock (CONAB/INMET/CEPEA) — produtividade histórica da região, tendência climática, preço de referência da commodity.
- **Devolve ao orquestrador:** indicadores agro-climáticos normalizados (ex: "produtividade projetada X% abaixo da média histórica", "risco climático moderado").
- **Não faz:** não calcula score nem capacidade de pagamento — só entrega o indicador de risco agro/clima da região.

**`agente_exposicao`**
- **Recebe:** os dados já coletados por `agente_cadastral_esg` e `agente_risco_safra` e, no fluxo do simulador, um parâmetro adicional (ex: "queda de produtividade de 20%").
- **Chama:** tool `/score` (fluxo normal) ou tool `/simular` (fluxo "e se").
- **O que as tools fazem por baixo:** aplicam os pesos fixos (35% jurídico, 30% climático, 15% ambiental, 20% cadastral), calculam `score_final` e o `rating` A–D, e — no caso do `/simular` — recalculam capacidade de pagamento projetada.
- **Devolve ao orquestrador:** score numérico, rating, e o detalhamento de quanto cada fator pesou no resultado (para embasar a explicação depois).
- **Não faz:** não gera texto, não recomenda ação — devolve só números e a decomposição por fator.

**`orquestrador`**
- **Recebe:** o pedido original do usuário (CNPJ novo, ou "simular queda de X% para o produtor Y").
- **Decide a sequência:** aciona `agente_cadastral_esg` e `agente_risco_safra` (em paralelo ou sequência), espera os dois retornarem, e então aciona `agente_exposicao` passando os dados consolidados.
- **Único ponto onde o LLM atua de fato:** depois de receber o score/rating/fatores já calculados (números fixos, determinísticos), o LLM do orquestrador redige a explicação em linguagem natural ("risco moderado, impulsionado principalmente por...") e a recomendação ("não ampliar exposição, revisar prazo...").
- **Restrição dura:** o prompt do orquestrador é restrito a narrar apenas os dados que os outros agentes já devolveram — sem liberdade para inventar um fator, mudar o score ou citar evidência que não veio de uma tool. É essa restrição que sustenta a resposta "o LLM não inventa o score" diante da banca.
- **Saída final:** o JSON de resposta (score, rating, fatores, texto explicativo, recomendação) que a UI renderiza.

Fluxo típico de uma triagem:

```text
orquestrador recebe CNPJ
        │
        ├──► agente_cadastral_esg  → GET /cadastro/{cnpj}
        ├──► agente_risco_safra    → GET /risco-safra/{regiao}
        │
        ▼
agente_exposicao → POST /score (com os dados acima) → score + rating + fatores
        │
        ▼
orquestrador (LLM) → gera texto explicativo + recomendação, sem alterar o número
        │
        ▼
Resposta final (score, rating, fatores, texto, recomendação)
```

Para o simulador (`/simular`), o mesmo padrão se repete: `agente_exposicao` chama a tool com o parâmetro alterado (ex: queda de produtividade de 20%) e o `orquestrador` narra a diferença entre o score atual e o projetado.

## 4. Como a UI consome o sistema

- **Fluxo de Triagem e Drill-down** (precisa de explicação em linguagem natural): a UI fala com o `orquestrador` no watsonx Orchestrate, que coordena os agentes especializados e devolve o relatório já narrado.
- **Radar da Carteira** (`GET /portfolio`) e ações puramente de leitura de dados já calculados: a UI chama o backend diretamente, sem passar pelo Orchestrate — não há necessidade de narração nem de orquestração para uma listagem.
- **Simulador dentro do drill-down**: passa pelo `orquestrador`/`agente_exposicao` quando o objetivo é obter a explicação e recomendação junto com o novo score; se a demo precisar de resposta instantânea (ex: slider arrastado em tempo real), a UI pode chamar `/simular` direto no backend e só disparar o caminho via Orchestrate quando o usuário "confirma" o cenário para gerar o alerta narrado.

> Nota: este último ponto (chamada direta ao backend para o slider) é uma proposta de otimização de UX para a demo, não uma decisão fechada — ajustar se a equipe preferir que todo o caminho do simulador passe pelo Orchestrate por consistência.

## 5. Regra de scoring (dentro da tool `/score`)

| Fator | Peso |
|---|---:|
| Jurídico/processual (DataJud) | 35% |
| Climático/produtividade | 30% |
| Ambiental (embargo IBAMA) | 15% |
| Cadastral/societário (BrasilAPI) | 20% |

```text
score_final = Σ(nota_do_fator × peso_do_fator) × 10   →  intervalo 0–1000
```

| Score | Rating |
|---|---|
| ≥ 800 | A |
| 600–799 | B |
| 400–599 | C |
| < 400 | D |

Gatilho de alerta: score cai ≥ 100 pontos, muda de faixa de rating, ou surge um evento crítico novo (ex: novo processo judicial).

## 6. Real vs. Mock

| Camada | Componente | Status |
|---|---|---|
| `agente_cadastral_esg` | Cadastro via BrasilAPI | Real, ao vivo |
| `agente_cadastral_esg` | Embargo via IBAMA | Real, ao vivo |
| `agente_cadastral_esg` | Processos judiciais (DataJud) | Real, curado (1–2 casos identificados manualmente) |
| `agente_risco_safra` | Produtividade/clima/preços | Mock (CONAB/INMET/CEPEA simulados) |
| Backend | Portfólio de clientes do Radar | Mock |
| `agente_exposicao` (`/score`, `/simular`) | Score, rating, simulação | Calculado (regras determinísticas, código) |
| `orquestrador` | Texto do relatório/alerta | Calculado (LLM real do Orchestrate, narrando dados parcialmente mock) |

## 7. Decisões arquiteturais e justificativas (para a banca)

| Decisão | Justificativa |
|---|---|
| Score calculado em código, nunca por LLM | Garante que o número é sempre auditável — o LLM só explica, nunca decide o valor |
| Orquestração real via watsonx Orchestrate (não simulada) | O backend expõe um contrato OpenAPI estável; o Orchestrate importa e distribui as tools entre agentes especializados, tornando a arquitetura de agentes verificável pela banca, não apenas narrada |
| Divisão em 3 agentes especializados + 1 orquestrador | Espelha a separação de responsabilidades do domínio (cadastro/jurídico/ambiental, agro/clima, exposição/score) e facilita explicar cada tool isoladamente |
| Sem banco de dados relacional | Reduz tempo de setup; arquivos JSON são suficientes para a escala de dados de uma demo |
| `/portfolio` servido direto pela UI, sem passar pelo Orchestrate | Evita gastar uma chamada de agente em uma listagem que não precisa de raciocínio nem narração |
| Sem autenticação no MVP | Foco do tempo disponível na lógica de negócio, não em infraestrutura de sessão/login |

## 8. Evolução pós-hackathon (roadmap técnico)

- **Fase 1:** substituir arquivos JSON por banco real (PostgreSQL) e API do DataJud com busca automatizada por CNPJ (hoje é manual/curada)
- **Fase 2:** treinar modelo preditivo de ML com histórico real da carteira da Krill Tech (hoje o scoring é por regras, não aprendizado de máquina)
- **Fase 3:** expandir os agentes do watsonx Orchestrate com monitoramento contínuo automatizado (webhooks/cron em vez de consulta sob demanda) e autenticação multiusuário

## 9. Nota sobre organização do repositório

Este documento é a versão de referência/trabalho da arquitetura. A versão **aprovada** para entrega do hackathon está em `solution/arquitetura.md` — mantenha as duas em sincronia ao alterar a arquitetura, ou consolide em uma só assim que a equipe decidir qual pasta é a fonte única (`docs/` vs `solution/`), conforme apontado no `MVP_ANALYSIS.md` (seções 15 e 19.6).
