# Sistema Inteligente de Prevenção à Inadimplência e Análise de Risco de Crédito no Agronegócio

**Documento de Desafio**

**Empresa Parceira:** Krill Tech

---

## 1. Apresentação

O presente documento tem por finalidade apresentar, de forma detalhada, o case a ser trabalhado pelas equipes participantes do **Hackathon 2026**, promovido pelo **Student Club do Project Management Institute Distrito Federal (PMI-DF)**, em conformidade com o Edital 01/2026.

O desafio apresentado é proposto pela empresa parceira **Krill Tech**, que atua com soluções e comercialização voltadas a clientes do agronegócio e do mercado B2B, contando com apoio tecnológico da **IBM**, por meio das ferramentas:

* watsonx.ai
* watsonx Orchestrate
* agentes IBM Bob

As equipes deverão apresentar sua proposta de solução por meio de dois entregáveis:

1. **Project Canvas**
2. **Pitch de apresentação** perante a banca avaliadora

---

## 2. Visão Geral do Desafio e o Problema da Krill Tech

Nos últimos ciclos econômicos, a Krill Tech identificou uma dor crítica em sua operação: a **elevação acentuada da inadimplência**, pedidos repentinos de **Recuperação Judicial (RJ)** e quebras de produtores rurais e agroindústrias entre seus clientes.

Quando um cliente entra em RJ ou se torna inadimplente:

* o fluxo de caixa da empresa é severamente comprometido;
* a recuperação do capital investido torna-se um processo demorado;
* a recuperação do capital torna-se complexa.

### Objetivo do Hackathon

As equipes participantes deverão conceber um **sistema inteligente**, composto por um motor preditivo e/ou agente de inteligência artificial, capaz de realizar:

* Due diligence automatizada;
* Triagem cadastral;
* Monitoramento processual;
* Monitoramento financeiro;
* Geração de um **Relatório Padronizado de Risco de Crédito**;
* Geração de **Alerta Precoce de RJ/Insolvência**.

A solução deverá ser voltada aos clientes e parceiros da Krill Tech.

A proposta deverá ser apresentada por meio de um **Project Canvas** e defendida em **pitch** perante a banca avaliadora.

---

## 3. Contexto de Mercado e Cenário Macroeconômico

O agronegócio brasileiro atravessa um ciclo sem precedentes de reestruturação financeira.

Historicamente reconhecido como um setor de inadimplência reduzida, o agro passou a registrar aumentos expressivos em pedidos de recuperação judicial.

### Principais fatores

#### 3.1 Marco Legal — Lei nº 14.112/2020

A norma regulamentou e facilitou a extensão do instituto da Recuperação Judicial ao produtor rural pessoa física, mediante comprovação de atividade mínima de dois anos, por meio de:

* Livro Caixa Digital; ou
* Inscrição estadual.

Esse cenário provocou uma escalada nos pedidos formais de RJ no campo.

#### 3.2 Pressão de margens e quebra de safra

A combinação de:

* instabilidades climáticas;
* fenômenos El Niño e La Niña;
* custos elevados de fertilizantes;
* custos elevados de insumos;
* queda nas cotações de commodities, como soja e milho;

estrangulou a liquidez de médios e grandes produtores rurais.

#### 3.3 Efeito cascata na cadeia produtiva

A inadimplência na ponta do produtor rural contamina progressivamente:

* Distribuidores de insumos;
* Revendas;
* Tradings;
* Indústrias de equipamentos;
* Fornecedores de tecnologia;
* Prestadores de serviços;

a exemplo da própria Krill Tech.

---

# 4. Glossário Fundamental de Crédito e Termos Jurídicos

Para subsidiar o desenvolvimento das soluções, apresenta-se a seguir um glossário com os principais conceitos de crédito e institutos jurídicos relacionados ao desafio.

| Termo / Conceito                               | Definição Operacional                                                                                                                                                                                                                      | Impacto no Risco da Krill Tech                                                                                         |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| **Recuperação Judicial (RJ)**                  | Procedimento jurídico (Lei nº 11.101/2005) requerido por empresas ou produtores rurais em crise para renegociar coletivamente suas dívidas perante a Justiça, evitando a falência.                                                         | Créditos da Krill Tech anteriores ao pedido entram no plano com deságios severos e prazos de pagamento de vários anos. |
| **Stay Period**                                | Período de suspensão legal de 180 dias (prorrogáveis) de todas as execuções e cobranças contra o devedor que teve o processamento da RJ deferido pelo juiz.                                                                                | A Krill Tech fica legalmente impedida de executar garantias ou protestar o devedor durante esse prazo.                 |
| **Inadimplência Técnica vs. Financeira**       | A inadimplência financeira corresponde ao não pagamento no vencimento. A inadimplência técnica ocorre quando o cliente viola índices contratuais, como aumento de endividamento além do limite estabelecido, antes de atrasar o pagamento. | Identificar a inadimplência técnica permite agir preventivamente antes que o calote se concretize.                     |
| **CPR (Cédula de Produto Rural)**              | Título de crédito emitido pelo produtor ou cooperativa, prometendo a entrega futura de produtos agrícolas (CPR Física) ou a liquidação em dinheiro (CPR Financeira).                                                                       | Instrumento comum para colateralização ou garantia em operações de barter e crédito direto no agro.                    |
| **Barter / Operação de Troca**                 | Mecanismo de financiamento pelo qual insumos ou serviços são pagos com a entrega da safra futura colhida pelo produtor.                                                                                                                    | Exige monitoramento contínuo de produtividade, condições climáticas e integridade da área plantada.                    |
| **Garantias: Alienação Fiduciária vs. Penhor** | A alienação fiduciária transfere a propriedade resolúvel do bem ao credor, permanecendo fora dos efeitos da RJ (crédito extraconcursal). O penhor apenas vincula a safra ou a máquina como garantia.                                       | Créditos lastreados em alienação fiduciária protegem a Krill Tech mesmo em caso de pedido de RJ pelo cliente.          |
| **Rating de Crédito & Score**                  | Classificação quantitativa e qualitativa (por exemplo, de AAA a D) que mensura a probabilidade de inadimplência (PD – Probability of Default) em até 12 meses.                                                                             | Define se o cliente pode comprar a prazo, qual o limite de crédito concedido e quais as taxas de juros aplicáveis.     |

---

# 5. Fontes e Bases de Dados Públicas Disponíveis

As equipes poderão consumir dados públicos abertos ou disponibilizados via API para enriquecer seus modelos preditivos e agentes de inteligência artificial.

| Dimensão do Dado            | Base / Órgão Público                                                          | Dados Extraídos e Relevância                                                                                                        |
| --------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Cadastral & Societário**  | Receita Federal (CNPJ Abertos) / Portal Redesim                               | Quadro de Sócios e Administradores (QSA), capital social, atividade principal (CNAE), filiais e tempo de atividade.                 |
| **Processual & Jurídico**   | DataJud (CNJ) / Diários de Justiça Eletrônicos (DJEs) / Jusbrasil / Escavador | Identificação de ações de execução de títulos, protestos de duplicatas, pedidos de falência e distribuição de Recuperação Judicial. |
| **Territorial & Ambiental** | SICAR (Cadastro Ambiental Rural) & IBAMA                                      | Verificação da regularidade da propriedade rural, área consolidada de plantio, reservas legais e embargos por infração ambiental.   |
| **Fiscal & Trabalhista**    | PGFN (Dívida Ativa) / TST (CNDT) / Caixa (CRF-FGTS)                           | Certidões Negativas de Débitos (CNDs), identificação de execuções fiscais federais e passivos trabalhistas com trânsito em julgado. |
| **Agronômico & Climático**  | Conab / MAPA (ZARC – Zoneamento Agrícola) / INMET                             | Produtividade média da região, risco climático da cultura em cada safra e séries históricas de precipitação e temperatura.          |

---

# 6. Arquitetura da Solução Sugerida e Uso do Ecossistema IBM

As equipes terão à disposição ferramentas do ecossistema IBM, como:

* **watsonx.ai**
* **watsonx Orchestrate**
* **Agentes IBM Bob**

A título de referência, e sem caráter de adoção obrigatória, sugere-se o seguinte fluxo de solução:

### 6.1 Agente Coletor & Parser — RAG / Data Ingestion

Recebe o **CNPJ ou CPF do cliente**, consulta as bases públicas estruturadas e realiza o parsing de:

* Publicações dos Diários Oficiais;
* Certidões em formato PDF.

### 6.2 Agente de Risco Agro & Climático

Cruza a localização do imóvel, obtida via **CAR**, com:

* Dados de zoneamento agrícola — ZARC;
* Histórico de quebra de safra da região.

### 6.3 Motor de Decisão & Scoring — Predictive ML

Algoritmo de classificação responsável por calcular:

* Probabilidade de inadimplência — **PD (Probability of Default)**;
* Risco de Recuperação Judicial;

considerando horizontes de:

* **6 meses**
* **12 meses**
* **24 meses**

### 6.4 Agente Sintetizador & Gerador de Relatórios

Modelo de linguagem responsável por compilar os achados técnicos em uma recomendação clara, redigida em linguagem natural, destinada ao tomador de decisão da Krill Tech.

### Fluxo conceitual

```text
CNPJ / CPF
    ↓
Agente Coletor & Parser
    ↓
Bases Públicas + Documentos
    ↓
Agente de Risco Agro & Climático
    ↓
Motor de Decisão & Scoring
    ↓
Probabilidade de Inadimplência + Risco de RJ
    ↓
Agente Sintetizador
    ↓
Relatório de Risco + Recomendação + Alertas
```

> **Importante:** esse fluxo é apresentado apenas como referência conceitual. A equipe deve representá-lo de forma sintética no Project Canvas e detalhá-lo durante o pitch. **Não é exigida a implementação funcional do sistema em código durante o Hackathon.**

---

# 7. Especificação dos Entregáveis

Para fins de avaliação no Hackathon 2026, cada equipe deverá apresentar sua proposta de solução por meio de dois entregáveis:

1. **Project Canvas**
2. **Pitch de apresentação** perante a banca avaliadora.

---

## 7.1 Project Canvas da Solução

O Project Canvas é a síntese visual, em uma única página, da proposta desenvolvida pela equipe, permitindo à banca examinadora compreender rapidamente a lógica da solução antes do pitch.

Recomenda-se que o Canvas contemple, no mínimo, os seguintes blocos:

### 1. Problema & Diagnóstico

Descrição da dor do usuário identificada, com base nos dados e no contexto de mercado apresentados nas Seções 2 e 3 deste documento.

### 2. Público-Alvo / Beneficiários

Identificação clara de quem será impactado ou beneficiado pela solução proposta.

### 3. Lógica de Funcionamento da Solução

Fluxo geral da proposta, incluindo, quando aplicável, os agentes e etapas de referência descritos na Seção 6.

### 4. Score & Classificação de Rating

Proposta de nota de **0 a 1000**, associada a uma escala de risco.

Exemplo:

```text
0 ─────────────────────────────────────────── 1000
A                         B      C          D
↓                         ↓      ↓          ↓
Baixo Risco                              Risco Crítico
                                         / Alerta de RJ
```

Exemplo de classificação:

* **A — Baixo Risco**
* **B — Risco Moderado**
* **C — Alto Risco**
* **D — Risco Crítico / Alerta de RJ**

### 5. Matriz de Red Flags

Principais sinais de perigo que a solução se propõe a identificar, como:

* Pedidos de Recuperação Judicial;
* Aumento de protestos;
* Embargos ambientais;
* Outros eventos relevantes de risco.

### 6. Recomendação de Decisão Operacional

Como a solução orienta decisões de:

* Limite de crédito;
* Condições de pagamento;

para os clientes da Krill Tech.

### 7. Monitoramento Contínuo — Early Warning System

Mecanismo proposto para gerar alertas automáticos diante de novos:

* Processos;
* Eventos de risco;
* Indicadores de deterioração financeira.

### 8. Arquitetura de Negócios & Custos

Modelo de sustentação da solução e principais custos envolvidos em sua:

* Implementação;
* Operação.

### 9. Premissas, Restrições e Riscos

Pontos de partida e limites do projeto, além dos principais riscos à execução e de como a equipe pretende lidar com eles.

### 10. Próximos Passos

Plano de implementação e evolução da solução após o Hackathon.

---

# 7.2 Pitch de Apresentação

Cada equipe defenderá sua proposta perante a banca avaliadora por meio de um **pitch oral**, com apoio do Project Canvas e de outros recursos visuais que a equipe julgar pertinentes.

O pitch deve demonstrar, com clareza e segurança:

* O valor gerado pela solução;
* A lógica de funcionamento na prática;
* A capacidade da equipe de responder às perguntas da banca avaliadora.

A apresentação deverá estar alinhada ao critério **“Pitch de Defesa & Articulação”** do Edital 01/2026, item 5.4.5.

> O formato, a duração e os demais detalhes operacionais do pitch serão comunicados oportunamente pela Comissão Organizadora.
