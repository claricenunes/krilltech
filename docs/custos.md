# Custos, Impacto e Adoção — KrillRadar

## 1. Premissas do levantamento

Este levantamento é uma estimativa construída para o contexto do MVP apresentado no Hackathon PMI-DF 2026. A KRILLTECH não disponibilizou base financeira real, portanto:

- Valores de exposição, carteira e clientes em atenção usados neste documento são **sintéticos e demonstrativos**, criados apenas para ilustrar o raciocínio de impacto.
- Onde não existe preço oficial público (ex.: planos de watsonx Orchestrate, cloud, LLM), o custo é classificado por faixa (**baixo / médio / alto / a estimar**), nunca com valor fechado inventado.
- O documento separa três estágios de maturidade — **MVP (hackathon)**, **piloto interno** e **produção** — porque a estrutura de custo muda de forma relevante entre eles.
- Fontes de dados públicas (BrasilAPI, IBAMA, DataJud/CNJ, CONAB, INMET, CEPEA) são tratadas como gratuitas ou de baixo custo no estágio atual, mas podem exigir contratos, cache dedicado ou tratamento adicional em produção.

## 2. Custos do MVP no hackathon

No estágio atual, o custo de operação é **baixo, mas não zero** — há custo de tempo de equipe e de eventuais limites de uso das fontes públicas.

- **BrasilAPI** — cadastro por CNPJ, gratuita, sem API key. Custo: nenhum.
- **Snapshots CONAB / INMET / CEPEA** — dados de produtividade, clima e preço de commodity capturados como arquivo estático para a demo. Custo: nenhum (apenas tempo de curadoria).
- **Dados sintéticos KRILLTECH** — carteira, clientes e exposição simulados no `staticData`/mocks do frontend. Custo: nenhum.
- **Ambiente local** — frontend (Vite/React) e backend (`api/server.mjs`) rodando na máquina da equipe. Custo: nenhum.
- **watsonx Orchestrate Developer Edition** — usado para importar o OpenAPI e criar os agentes (`agente_cadastral_esg`, `agente_risco_safra`, `agente_exposicao`, `orquestrador`). Custo: baixo/gratuito no tier de desenvolvimento, sujeito a limites de uso da IBM.
- **Tempo da equipe** — principal custo real do MVP: horas de desenvolvimento, curadoria de dados e ensaio do pitch.

## 3. Custos de implantação piloto

Ao levar o KrillRadar para um piloto interno na KRILLTECH (carteira limitada, uso real pelo time comercial/crédito), aparecem custos operacionais recorrentes, ainda de porte pequeno:

- **Hospedagem simples** do backend e frontend (ex.: instância única ou serviço gerenciado básico) — custo baixo, variável conforme provedor.
- **Manutenção do backend** (`api/server.mjs`, motor de score, integrações) — tempo de equipe técnica.
- **Atualização de snapshots** (CONAB, INMET, CEPEA) — rotina periódica de atualização manual ou semi-automatizada.
- **Logs** de uso e de chamadas às APIs, para auditoria e diagnóstico de falhas.
- **Segurança básica** — controle de acesso, variáveis de ambiente/segredos, HTTPS.
- **Treinamento do time comercial/crédito** — capacitação para interpretar score, rating e recomendações sem tratá-las como decisão automática.
- **Acompanhamento humano das recomendações** — tempo do gestor de crédito validando os alertas gerados, parte do custo operacional do piloto, não da tecnologia.

## 4. Custos de produção

Uma versão de produção, com carteira real e uso contínuo, introduz custos de escala e de conformidade:

- **Infraestrutura cloud** (compute, banco de dados, rede) dimensionada para volume real de clientes — custo variável, a estimar conforme provedor e volume.
- **Uso de watsonx Orchestrate** em tier pago, conforme número de agentes, chamadas e usuários — custo a estimar junto à IBM.
- **Chamadas de IA/LLM** para geração de explicações e recomendações — custo variável por volume de tokens/chamadas.
- **Manutenção das tools OpenAPI** (`api/openapi.json`) conforme o backend evolui.
- **Integrações com APIs públicas e privadas** — possível necessidade de contratos, cache dedicado ou acesso pago a bases como DataJud/CNJ ou IBAMA em maior escala.
- **Armazenamento de histórico** de score, alertas e simulações por cliente ao longo do tempo.
- **Monitoramento e logs** de produção (observabilidade, alertas de falha, auditoria).
- **Segurança e LGPD** — tratamento de dados cadastrais e financeiros de terceiros exige controles de acesso, criptografia e possível DPO/compliance.
- **Suporte técnico** contínuo para clientes internos (times comercial/crédito) e eventuais clientes externos (modelo SaaS).
- **Evolução do modelo de scoring** — ajuste do motor determinístico e das explicações conforme novos dados e feedback de uso real.

## 5. Custos fixos e variáveis

| Categoria | Itens |
|---|---|
| **Custos fixos** | Hospedagem base do backend/frontend; licença/assinatura mínima do watsonx Orchestrate; manutenção básica da equipe técnica; segurança básica (certificados, controle de acesso) |
| **Custos variáveis** | Volume de chamadas de IA/LLM; número de CNPJs analisados; frequência de atualização de snapshots/dados; volume de relatórios gerados; armazenamento de histórico conforme a carteira cresce |
| **Custos evitáveis no MVP** | Infraestrutura cloud dedicada; contratos pagos com fontes de dados; equipe de suporte dedicada; monitoramento/observabilidade avançada; segurança/LGPD em nível de produção |
| **Custos futuros** | Escalonamento de infraestrutura para múltiplos clientes (modelo SaaS); certificações de segurança/compliance; suporte técnico formal (SLA); evolução contínua do motor de score com novos dados |

## 6. Possíveis fontes de custo por componente

| Componente | Tipo de custo | No MVP | Em produção | Observações |
|---|---|---|---|---|
| BrasilAPI | Consulta a API pública | Nenhum | Baixo | Gratuita e sem API key hoje; monitorar mudanças de política de uso |
| IBAMA | Consulta/snapshot de embargo ambiental | Nenhum | Baixo/médio | Pode exigir rotina de atualização de cache em maior escala |
| DataJud/CNJ | Processo judicial curado | Nenhum (curadoria manual) | A estimar | Hoje é snapshot curado, não busca automática CNPJ→processos; automação futura pode ter custo técnico |
| CONAB | Produtividade agrícola | Nenhum (snapshot) | Baixo | Fonte pública; custo é de curadoria/atualização, não de acesso |
| INMET | Dados climáticos | Nenhum (snapshot) | Baixo | Fonte pública; mesmo padrão de custo do CONAB |
| CEPEA | Preço de commodity | Nenhum (snapshot) | Baixo | Fonte pública; mesmo padrão de custo do CONAB/INMET |
| Dados KRILLTECH | Cadastro/carteira interna | Nenhum (sintético) | A estimar | Depende de a KRILLTECH liberar dados financeiros reais no futuro |
| Backend (`api/server.mjs`) | Desenvolvimento e hospedagem | Tempo de equipe | Baixo/médio (hospedagem) | Custo cresce com volume de requisições e integrações |
| Frontend (Vite/React) | Desenvolvimento e hospedagem estática | Tempo de equipe | Baixo | Hospedagem estática é historicamente de baixo custo |
| watsonx Orchestrate | Plataforma de agentes/orquestração | Baixo/gratuito (Developer Edition) | A estimar | Custo real depende do plano comercial da IBM, não divulgado aqui |
| LLM (explicação/recomendação) | Chamadas de IA generativa | Baixo (uso limitado na demo) | Variável | Custo escala com volume de chamadas/tokens |
| Cloud (infraestrutura) | Compute, banco de dados, rede | Nenhum (execução local) | Variável/a estimar | Depende do provedor e do volume de carteira monitorada |
| Segurança/LGPD | Controles de acesso e conformidade | Básico | Médio/alto | Cresce com dados reais de clientes e exigências regulatórias |
| Suporte | Atendimento técnico | Nenhum (equipe do hackathon) | Médio | Necessário ao virar produto interno ou SaaS |

## 7. Impacto financeiro esperado

O valor do KrillRadar não está em reduzir custo de operação, e sim em **evitar perdas por decisões de crédito tardias ou mal informadas**. A lógica de retorno se apoia em quatro efeitos:

- **Evitar aumento de exposição em cliente de risco** — ao sinalizar deterioração de rating antes da renovação/ampliação de crédito, o gestor pode reduzir ou condicionar o novo aporte.
- **Reduzir análise manual** — o score determinístico e o relatório padronizado diminuem o tempo gasto reunindo dados de múltiplas fontes para cada análise.
- **Padronizar a decisão** — todos os clientes passam pelos mesmos critérios de score/rating, reduzindo variação de julgamento entre analistas.
- **Antecipar sinais antes da inadimplência/Recuperação Judicial** — o simulador de produtividade e os alertas de exposição dão tempo para negociar antes do default.

**Exemplos demonstrativos (dados sintéticos, não reais):**

- Um cliente com **R$ 500 mil** de exposição, se identificado a tempo como rating em queda, permite ao gestor renegociar condições antes de uma inadimplência total.
- Uma carteira com **R$ 1,2 milhão** classificado como exposição vulnerável representa o valor total que o Radar mantém sob observação ativa.
- **3 clientes em atenção** simultânea ilustram o volume que o time de crédito conseguiria monitorar de forma priorizada, em vez de tratar toda a carteira com o mesmo nível de atenção.
- Uma **queda simulada de 20% na produtividade** mostra ao gestor, antes que aconteça de fato, o efeito estimado no risco daquele cliente — permitindo ação preventiva.

Esses números não são uma promessa de economia, mas uma forma de tornar tangível, para a banca, o tipo de decisão que a solução ajuda a antecipar.

## 8. Indicadores de sucesso

- Tempo médio de análise de crédito **antes vs. depois** do uso do KrillRadar.
- Número de clientes efetivamente monitorados no Radar da Carteira.
- Número de alertas gerados classificados como **úteis** pelo gestor (feedback qualitativo).
- Redução de exposição em clientes cujo rating se deteriorou, comparando decisão com e sem o relatório.
- Número de decisões de crédito tomadas **com base explícita** no relatório de risco gerado.
- Frequência de uso do relatório pelo gestor no fluxo real de aprovação.
- Casos de **renegociação antecipada** motivados por um alerta do sistema, antes de uma inadimplência efetiva.

## 9. Modelo de negócio futuro

- **Uso interno KRILLTECH** — primeira etapa, como ferramenta de apoio ao time comercial/crédito.
- **SaaS B2B** para revendas agrícolas, cooperativas, tradings e fornecedores de insumos do agronegócio que também concedem crédito a produtores.
- **Cobrança por assinatura** — plano mensal/anual por organização cliente.
- **Cobrança por usuário** — plano por analista/gestor com acesso à plataforma.
- **Cobrança por CNPJ analisado** — modelo de consumo, adequado para uso esporádico ou sazonal (safra).
- **Plano premium com monitoramento contínuo** — inclui atualização automática de rating, alertas proativos e simulações ilimitadas, para clientes que querem acompanhamento em tempo real da carteira.

## 10. Texto curto para o Project Model Canvas

> O KrillRadar tem baixo custo inicial de implantação: o MVP roda com dados públicos (BrasilAPI, CONAB, INMET, CEPEA), snapshots curados e dados sintéticos, sem infraestrutura dedicada. Os custos reais aparecem ao evoluir para piloto (hospedagem simples, atualização de dados, treinamento do time) e produção (infraestrutura cloud, uso pago do watsonx Orchestrate e de LLM, segurança/LGPD e suporte técnico), todos variáveis conforme volume de clientes e CNPJs analisados. O retorno esperado vem de evitar aumento de exposição em clientes de risco e antecipar sinais de inadimplência antes que se tornem perdas.

## 11. Versão resumida para apresentação

- O MVP tem **baixo custo inicial**: dados públicos, snapshots e dados sintéticos, sem infraestrutura dedicada — o custo real de piloto e produção é variável e cresce com o número de clientes monitorados.
- O retorno não vem de "economizar tecnologia", mas de **evitar perdas de crédito**: identificar cedo um cliente em deterioração pode evitar que uma exposição de centenas de milhares de reais vire inadimplência ou Recuperação Judicial.
- A decisão de crédito **continua sempre humana** — o KrillRadar reduz tempo de análise e padroniza critérios, mas quem decide é o gestor, com base no relatório e nos alertas gerados.
