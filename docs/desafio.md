# Desafio — Krill Risk Intelligence

## Visão geral

O desafio do Hackathon PMI & Krill Tech propõe a criação de um sistema inteligente capaz de apoiar a **prevenção de inadimplência e a identificação antecipada de risco de Recuperação Judicial (RJ) e insolvência no agronegócio**.

A Krill Tech identificou uma elevação da inadimplência, pedidos repentinos de Recuperação Judicial e quebras de produtores rurais e agroindústrias entre seus clientes. Quando um cliente entra em RJ ou se torna inadimplente, o fluxo de caixa da empresa é comprometido e a recuperação do capital investido se torna mais lenta e complexa.

O desafio, portanto, não é simplesmente descobrir quem já está inadimplente. É criar uma forma de **identificar sinais de deterioração antes que o problema se concretize**, permitindo que a Krill Tech tenha tempo para tomar decisões preventivas.

> **O risco não aparece no dia em que o cliente deixa de pagar. Antes dele, existem sinais.**

O sistema deve combinar **due diligence automatizada, triagem cadastral, monitoramento processual e financeiro, análise de risco e Early Warning**, produzindo um relatório padronizado que auxilie o tomador de decisão da Krill Tech.

---

# 1. Problema

A Krill Tech está exposta ao risco de inadimplência e Recuperação Judicial de produtores rurais e agroindústrias clientes.

O problema central é a **identificação tardia da deterioração financeira e operacional dos clientes**.

Um cliente pode apresentar sinais de risco muito antes de deixar de pagar uma obrigação. Esses sinais podem estar distribuídos em diferentes dimensões:

* novos processos judiciais;
* protestos;
* execuções;
* aumento do endividamento;
* problemas fiscais;
* passivos trabalhistas;
* irregularidades ambientais;
* risco climático;
* queda de produtividade;
* deterioração das condições de mercado;
* aumento da exposição financeira da Krill Tech.

Atualmente, essas informações podem estar espalhadas por diferentes fontes, dificultando sua consolidação, interpretação e acompanhamento contínuo.

O resultado é um processo mais **reativo do que preventivo**.

### Situação atual

```text
Sinais de deterioração
        ↓
Dados espalhados
        ↓
Análise manual
        ↓
Problema se agrava
        ↓
Inadimplência / RJ
        ↓
Ação da empresa
```

### Situação desejada

```text
Sinais de deterioração
        ↓
Coleta automática
        ↓
Cruzamento de dados
        ↓
Score + Red Flags
        ↓
Early Warning
        ↓
Análise e recomendação
        ↓
Ação preventiva
```

O objetivo é transformar uma situação em que a empresa **descobre o problema tarde** em uma situação em que ela **recebe sinais e consegue agir antecipadamente**.

---

# 2. Usuário afetado

## Usuário principal

### Tomador de decisão da Krill Tech

O sistema será utilizado principalmente por profissionais responsáveis por:

* análise de crédito;
* financeiro;
* gestão de clientes;
* acompanhamento de parceiros;
* exposição financeira;
* cobrança e recuperação.

O desafio estabelece que o relatório de risco deve ser direcionado ao tomador de decisão da Krill Tech.

## Beneficiários indiretos

### Produtores rurais e agroindústrias

A identificação antecipada de deterioração permite que a empresa avalie medidas preventivas antes que a situação chegue à inadimplência ou à Recuperação Judicial.

---

# 3. Causa

O risco de inadimplência não possui necessariamente uma única causa.

No agronegócio, diferentes fatores podem se combinar e reduzir a capacidade de pagamento do produtor ou da agroindústria.

## 3.1. Fatores jurídicos

* novas ações judiciais;
* execuções;
* protestos;
* pedidos de falência;
* Recuperação Judicial.

## 3.2. Fatores financeiros

* aumento do endividamento;
* redução da capacidade de pagamento;
* aumento da exposição;
* redução das margens;
* problemas de liquidez.

## 3.3. Fatores fiscais e trabalhistas

* dívida ativa;
* execuções fiscais;
* passivos trabalhistas;
* irregularidades em certidões.

## 3.4. Fatores ambientais

* embargos ambientais;
* irregularidades cadastrais;
* problemas relacionados à propriedade rural.

## 3.5. Fatores climáticos e produtivos

* seca;
* excesso de chuva;
* temperaturas desfavoráveis;
* risco climático da região;
* possibilidade de quebra de safra;
* redução da produtividade.

## 3.6. Fatores de mercado

* queda ou volatilidade dos preços das commodities;
* aumento dos custos de produção;
* variações nas condições de mercado.

## 3.7. Fragmentação das informações

O principal problema operacional é que essas informações pertencem a **fontes e dimensões diferentes**.

O analista precisa transformar dados heterogêneos em uma visão única do cliente.

A solução propõe automatizar justamente essa consolidação.

---

# 4. Impacto

## Tempo

### Problema

A análise pode exigir consultas, coleta, organização e interpretação de informações provenientes de diferentes fontes.

### Impacto esperado

Redução do tempo necessário para realizar uma análise de risco e atualizar o acompanhamento de um cliente.

### Indicador

**Tempo médio para gerar/atualizar um relatório de risco.**

---

## Custo

### Problema

Quando o risco é identificado apenas depois da inadimplência ou RJ, a recuperação do capital pode se tornar demorada e complexa.

### Impacto esperado

Redução da exposição a clientes que apresentam deterioração e aumento da capacidade de atuação preventiva.

### Indicadores

* exposição financeira em clientes classificados como alto risco;
* perdas evitadas;
* recuperação de crédito;
* valor de crédito sob monitoramento.

---

## Produtividade

### Problema

Profissionais podem gastar tempo coletando e consolidando informações em vez de concentrar seus esforços na análise e tomada de decisão.

### Impacto esperado

Automatização das etapas repetitivas de coleta, organização, monitoramento e geração de relatórios.

### Indicador

**Horas de trabalho economizadas por análise.**

---

## Qualidade

### Problema

A análise de diferentes fontes pode resultar em avaliações menos padronizadas.

### Impacto esperado

Criação de uma metodologia padronizada de avaliação de risco.

### Indicadores

* percentual de análises com dados completos;
* padronização dos relatórios;
* quantidade de fatores de risco identificados;
* rastreabilidade das evidências utilizadas na análise.

---

## Outros

### Antecedência

O principal impacto esperado é aumentar o tempo disponível para reação.

A métrica mais importante será:

> **Quantos dias ou meses antes da inadimplência/RJ um sinal relevante foi identificado?**

---

# 5. Dados disponíveis

O desafio disponibiliza diferentes fontes públicas que podem ser utilizadas para enriquecer a análise.

## 5.1. Cadastral e societário

### Receita Federal / CNPJ Aberto / Redesim

Dados:

* CNPJ;
* Quadro de Sócios e Administradores (QSA);
* capital social;
* CNAE;
* filiais;
* tempo de atividade.

### Objetivo

Identificar características cadastrais e societárias que possam contribuir para a análise do cliente.

---

## 5.2. Processual e jurídico

### DataJud / CNJ / Diários de Justiça Eletrônicos

Possíveis dados:

* processos;
* execuções;
* protestos;
* pedidos de falência;
* Recuperação Judicial.

### Objetivo

Identificar deterioração jurídica e novos eventos relevantes.

---

## 5.3. Territorial e ambiental

### SICAR / IBAMA

Possíveis dados:

* propriedade rural;
* área consolidada;
* área de plantio;
* reserva legal;
* embargos ambientais.

### Objetivo

Avaliar riscos relacionados à propriedade e à atividade rural.

---

## 5.4. Fiscal e trabalhista

### PGFN / TST / Caixa

Possíveis dados:

* dívida ativa;
* execuções fiscais;
* certidões;
* passivos trabalhistas;
* situação do FGTS.

### Objetivo

Identificar passivos que possam indicar deterioração financeira ou operacional.

---

## 5.5. Agronômico e climático

### Conab / MAPA — ZARC / INMET

Possíveis dados:

* produtividade média regional;
* risco climático;
* precipitação;
* temperatura;
* histórico climático.

### Objetivo

Avaliar como condições climáticas e produtivas podem afetar a capacidade de pagamento do cliente.

---

## 5.6. Dados internos da Krill Tech

A solução também deve considerar dados privados disponíveis na operação da empresa, quando existentes.

Exemplos:

* histórico de compras;
* valor contratado;
* limite de crédito;
* histórico de pagamentos;
* atrasos;
* exposição atual;
* garantias;
* operações realizadas;
* histórico de relacionamento.

Esses dados são especialmente importantes porque permitem combinar **risco externo** com **exposição real da Krill Tech**.

---

# 6. Processo atual

O processo atual pode ser representado de forma simplificada:

```text
1. Cliente
   ↓
2. Coleta de informações
   ↓
3. Consultas em diferentes fontes
   ↓
4. Organização dos dados
   ↓
5. Análise pelo responsável
   ↓
6. Avaliação de risco
   ↓
7. Decisão de crédito
   ↓
8. Acompanhamento
   ↓
9. Novo evento ocorre
   ↓
10. Nova análise / reação
```

## Principal deficiência

O acompanhamento pode ser pontual ou depender de alguém perceber que uma informação nova surgiu.

O problema é que um cliente pode se deteriorar gradualmente.

Por isso, a solução deve transformar o processo em um **monitoramento contínuo**.

---

# 7. O que pode ser automatizado?

Grande parte das atividades repetitivas pode ser automatizada.

## 7.1. Coleta

O sistema recebe:

> **CNPJ ou CPF**

e inicia a busca das informações disponíveis.

---

## 7.2. Integração

Os dados de diferentes fontes são centralizados em uma estrutura única.

```text
Receita
   +
Judiciário
   +
Fiscal
   +
Ambiental
   +
Clima
   +
Mercado
   +
Dados Krill
        ↓
Perfil consolidado
```

---

## 7.3. Detecção de novos eventos

O sistema monitora alterações relevantes.

Exemplos:

* novo processo;
* novo protesto;
* alteração cadastral;
* novo débito;
* embargo;
* alteração de indicador climático;
* deterioração de indicador financeiro.

---

## 7.4. Atualização do score

Cada evento relevante pode alterar a avaliação de risco.

Exemplo:

```text
Score anterior: 824

Novo processo       → -35
Dívida fiscal       → -42
Risco climático     → -27

Novo score: 720
```

Os pesos reais devem ser calibrados com dados históricos.

---

## 7.5. Detecção de deterioração

Não analisar apenas o valor atual.

Também analisar:

> **Como o risco está evoluindo?**

Exemplo:

```text
Janeiro   824
Fevereiro 790
Março     710
Abril     650
Maio      580
Junho     490
```

Mesmo que determinado cliente ainda não esteja inadimplente, uma queda acelerada do score deve gerar atenção.

---

## 7.6. Geração de alertas

Quando um evento ou combinação de eventos ultrapassar determinado nível de risco:

> **ALERTA DE DETERIORAÇÃO**

O sistema informa:

* cliente;
* score atual;
* variação do score;
* principais fatores;
* evidências;
* nível de risco;
* recomendação.

---

## 7.7. Geração de relatório

O sistema cria automaticamente um relatório padronizado.

---

# 8. Onde a IA agrega valor?

A IA deve ser utilizada principalmente para **interpretar, sintetizar e explicar informações**, e não para substituir todos os cálculos determinísticos.

## 8.1. Leitura de documentos

Um agente pode analisar documentos, publicações e certidões para extrair informações relevantes.

---

## 8.2. Síntese de informações

Em vez de o analista receber dezenas de resultados:

```text
Processo A
Processo B
Processo C
Dívida X
Dívida Y
Risco climático Z
...
```

a IA pode produzir:

> **“O cliente apresentou deterioração jurídica nos últimos meses, com aumento das ações de execução, simultaneamente a um cenário climático desfavorável para sua região produtiva.”**

---

## 8.3. Explicação do risco

O sistema não deve apenas mostrar:

> **Score = 580**

Deve explicar:

> **“O score caiu 244 pontos nos últimos cinco meses principalmente devido ao aumento de ocorrências jurídicas, crescimento da exposição financeira e aumento do risco climático regional.”**

---

## 8.4. Geração de recomendação

A IA pode transformar os resultados em uma recomendação operacional compreensível:

> **“Recomenda-se reavaliar o limite de crédito e as condições de pagamento, além de solicitar atualização das informações financeiras e garantias.”**

A recomendação deve servir como **apoio à decisão**, não como decisão automática e definitiva.

---

## 8.5. Interface conversacional

No futuro, o responsável poderia perguntar:

> “Por que o risco desse cliente aumentou?”

ou:

> “Quais clientes tiveram maior deterioração esta semana?”

ou:

> “Quais clientes apresentam risco elevado e alta exposição para a Krill?”

A IA responderia utilizando os dados estruturados e as evidências disponíveis.

---

# 9. Solução proposta

# Krill Risk Intelligence

## Proposta de valor

> **Uma plataforma de inteligência contínua de risco agrofinanceiro que transforma dados dispersos em Score, Red Flags, Early Warning e recomendações para apoiar decisões da Krill Tech.**

A solução possui quatro etapas principais:

```text
DADOS
  ↓
ANÁLISE
  ↓
ALERTA
  ↓
DECISÃO
```

---

## 9.1. Etapa 1 — Investigação

O usuário informa o:

> **CNPJ/CPF do cliente**

O sistema realiza a coleta e consolidação das informações disponíveis.

### Resultado

Um **perfil de risco consolidado**.

---

# 9.2. Etapa 2 — Motor de risco

Os dados são processados por um motor de scoring.

O sistema pode avaliar diferentes dimensões:

| Dimensão    | Exemplos                                   |
| ----------- | ------------------------------------------ |
| Cadastral   | tempo de atividade, alterações societárias |
| Jurídica    | processos, execuções, protestos, RJ        |
| Fiscal      | dívida ativa, certidões                    |
| Trabalhista | passivos e certidões                       |
| Ambiental   | embargos e situação da propriedade         |
| Climática   | seca, chuva, temperatura, ZARC             |
| Produtiva   | produtividade regional                     |
| Mercado     | preços e condições da commodity            |
| Financeira  | exposição, pagamentos, endividamento       |
| Garantias   | tipo e cobertura das garantias             |

---

# 9.3. Score 0–1000

A solução propõe um score padronizado de:

> **0 a 1000**

Quanto maior o score, menor o risco.

Exemplo de classificação:

|    Score | Rating | Interpretação           |
| -------: | :----: | ----------------------- |
| 850–1000 |    A   | Baixo risco             |
|  700–849 |    B   | Atenção                 |
|  500–699 |    C   | Alto risco              |
|    0–499 |    D   | Crítico / Early Warning |

**Observação:** os intervalos são uma proposta inicial e deverão ser calibrados com dados históricos.

O desafio exige uma nota de 0 a 1000 associada a uma escala de risco, de baixo risco até risco crítico/alerta de RJ.

---

# 9.4. Score não é suficiente

O sistema deve mostrar também a **tendência do risco**.

Exemplo:

```text
Cliente A
Score: 780
Tendência: estável
```

versus:

```text
Cliente B
Score: 780
Tendência: ↓ deterioração acelerada
```

Mesmo score, situações completamente diferentes.

Por isso, o sistema acompanha:

> **Score atual + variação + velocidade de deterioração**

---

# 9.5. Red Flags

O sistema identifica eventos considerados relevantes.

### Exemplos

🔴 Pedido de Recuperação Judicial
🔴 Aumento significativo de protestos
🔴 Execuções judiciais
🔴 Crescimento relevante do endividamento
🔴 Embargo ambiental
🟠 Aumento de exposição financeira
🟠 Risco climático elevado
🟠 Queda de produtividade regional
🟡 Alterações cadastrais relevantes

Cada alerta deve possuir:

* evento;
* data;
* fonte;
* impacto;
* nível de severidade.

---

# 9.6. Early Warning System

Essa é a principal funcionalidade da solução.

O sistema monitora continuamente os clientes e procura mudanças relevantes.

### Exemplo

```text
Cliente: Produtor de café

Janeiro
Score 824
Situação normal

        ↓

Fevereiro
Novo processo
Score 790

        ↓

Março
Aumento da exposição
Score 710

        ↓

Abril
Risco climático elevado
Score 650

        ↓

Maio
Novo protesto
Score 580

        ↓

Junho
Deterioração acelerada
Score 490

        ↓

🚨 EARLY WARNING
```

O objetivo não é afirmar:

> “Este cliente certamente entrará em RJ.”

O objetivo é informar:

> **“Os sinais de deterioração aumentaram significativamente. É necessário reavaliar a exposição.”**

---

# 9.7. Relatório de risco

Cada cliente terá um relatório padronizado.

### Exemplo

```text
KRILL RISK INTELLIGENCE
RELATÓRIO DE RISCO

Cliente: Produtor X
Cultura: Café

SCORE
490 / 1000

RATING
D — CRÍTICO

TENDÊNCIA
↓ Deterioração acelerada

PD
6 meses: elevada
12 meses: elevada
24 meses: elevada

RED FLAGS
🔴 Novo processo de execução
🔴 Crescimento da exposição
🟠 Risco climático elevado
🟠 Queda da produtividade regional

PRINCIPAIS FATORES
1. Deterioração jurídica
2. Aumento da exposição financeira
3. Risco climático

RECOMENDAÇÃO
Reavaliar limite de crédito e condições
de pagamento. Atualizar informações
financeiras e validar garantias.

FONTES
Receita Federal
DataJud
SICAR
INMET
Conab
Dados internos Krill
```

---

# 9.8. Decisão operacional

O sistema não deve simplesmente classificar o cliente.

Ele deve conectar:

> **Risco → Exposição → Ação**

Exemplo:

```text
RISCO ALTO
     +
EXPOSIÇÃO ALTA
     ↓
PRIORIDADE MÁXIMA
```

Possíveis ações a serem avaliadas:

* reavaliar limite;
* revisar condições de pagamento;
* solicitar documentação atualizada;
* revisar garantias;
* aumentar frequência de acompanhamento;
* encaminhar para análise especializada.

A decisão final continua sendo do responsável.

---

# 9.9. Arquitetura conceitual

A arquitetura pode utilizar o ecossistema IBM disponibilizado no desafio.

```text
                    ┌───────────────┐
                    │ CNPJ / CPF    │
                    └───────┬───────┘
                            ↓
                ┌─────────────────────┐
                │ Agente Coletor      │
                │ & Parser            │
                └──────────┬──────────┘
                           ↓
       ┌───────────────────┼───────────────────┐
       ↓                   ↓                   ↓
   Jurídico            Agroclima           Financeiro
       ↓                   ↓                   ↓
       └───────────────────┼───────────────────┘
                           ↓
                 ┌──────────────────┐
                 │ Motor de Risco   │
                 │ & Scoring        │
                 └────────┬─────────┘
                          ↓
                ┌────────────────────┐
                │ Score + Red Flags  │
                │ + Tendência        │
                └─────────┬──────────┘
                          ↓
                ┌────────────────────┐
                │ IA Sintetizadora   │
                └─────────┬──────────┘
                          ↓
              ┌─────────────────────────┐
              │ Relatório + Early       │
              │ Warning + Recomendação  │
              └────────────┬────────────┘
                           ↓
                    DECISÃO KRILL
```

O desafio apresenta como referência uma arquitetura com agente coletor/parser, agente de risco agroclimático, motor de decisão/scoring e agente sintetizador/gerador de relatórios. A implementação funcional completa não é exigida durante o hackathon.

---

# 10. Como medir o resultado?

## Indicadores principais

### 1. Tempo de análise

**Métrica:**

> Tempo médio para gerar um relatório de risco.

**Objetivo:**

Reduzir o trabalho operacional.

---

### 2. Antecedência do alerta

**Métrica:**

> Tempo entre o primeiro Early Warning e a ocorrência de inadimplência/RJ.

**Objetivo:**

Aumentar a janela de reação da Krill Tech.

### KPI principal do produto

> **Dias de antecedência obtidos para tomada de decisão.**

---

### 3. Precisão do modelo

Após a existência de dados históricos:

> Quantos clientes classificados como alto risco realmente apresentaram deterioração?

Possíveis métricas:

* precisão;
* recall;
* F1-score;
* AUC-ROC.

---

### 4. Cobertura

> Percentual da carteira monitorada continuamente.

Exemplo:

```text
Antes:
Análise pontual de clientes

Depois:
100% da carteira monitorada
```

---

### 5. Qualidade dos alertas

Medir:

* quantidade de falsos positivos;
* quantidade de sinais relevantes identificados;
* percentual de alertas com evidências;
* percentual de alertas considerados úteis pelos analistas.

---

### 6. Impacto financeiro

Após implantação:

* redução de perdas;
* redução da exposição a clientes deteriorados;
* aumento da recuperação de capital;
* redução do valor perdido em operações problemáticas.

---

# MVP PARA O HACKATHON

A solução completa pode evoluir posteriormente, mas o MVP deve demonstrar apenas o fluxo essencial:

```text
CNPJ
 ↓
Coleta de dados
 ↓
Perfil do cliente
 ↓
Score 0–1000
 ↓
Red Flags
 ↓
Evolução do risco
 ↓
Early Warning
 ↓
IA explica o risco
 ↓
Recomendação
```

## O que precisa aparecer na demonstração

### Tela 1 — Buscar cliente

```text
CNPJ: 00.000.000/0001-00

[ ANALISAR CLIENTE ]
```

### Tela 2 — Visão de risco

```text
SCORE: 490 / 1000

RATING: D — CRÍTICO

↓ 244 pontos nos últimos 5 meses
```

### Tela 3 — Por que o score caiu?

```text
🔴 Processo judicial
🔴 Aumento da exposição
🟠 Risco climático
🟠 Queda de produtividade
```

### Tela 4 — Early Warning

```text
🚨 ALERTA DE DETERIORAÇÃO

O cliente apresentou deterioração
acelerada nos últimos meses.

Principais fatores:
• jurídico
• financei
```
