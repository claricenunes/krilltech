# Problema & Diagnóstico — KrillRadar

> Fontes: `Desafio Hackathon PMI & Krillteck.pdf` (Seções 2 e 3) e `MVP_ANALYSIS.md` (Seção 1).

## 1. A dor da Krill Tech

A Krill Tech vende insumos e soluções a prazo para clientes do agronegócio (produtores rurais e agroindústrias) e do mercado B2B. Nos últimos ciclos econômicos, identificou uma dor crítica em sua operação: **elevação acentuada da inadimplência, pedidos repentinos de Recuperação Judicial (RJ) e quebras de produtores rurais e agroindústrias entre seus clientes**.

Quando um cliente entra em RJ ou se torna inadimplente:

- O fluxo de caixa da Krill Tech é severamente comprometido.
- A recuperação do capital investido torna-se um processo demorado e complexo — créditos anteriores ao pedido de RJ entram no plano de recuperação com **deságios severos** e prazos de pagamento de vários anos.
- Durante o **Stay Period** (suspensão legal de 180 dias, prorrogáveis), a Krill Tech fica legalmente impedida de executar garantias ou protestar o devedor.

## 2. Causas estruturais (por que isso piorou agora)

- **Marco Legal (Lei nº 14.112/2020):** facilitou a extensão da Recuperação Judicial ao produtor rural pessoa física (mediante comprovação de atividade mínima de dois anos via Livro Caixa Digital ou inscrição estadual), o que provocou uma escalada nos pedidos formais de RJ no campo.
- **Pressão de margens e quebra de safra:** instabilidades climáticas (El Niño/La Niña), custos elevados de fertilizantes e insumos e queda nas cotações de commodities (soja, milho) estrangularam a liquidez de médios e grandes produtores.
- **Efeito cascata na cadeia produtiva:** a inadimplência na ponta do produtor rural contamina progressivamente distribuidores de insumos, revendas, tradings, indústrias de equipamentos e fornecedores de tecnologia e serviços — como a própria Krill Tech.

## 3. Quem sofre com o problema

**Persona:** Marcelo, Gestor Comercial e de Crédito da Krill Tech — decide diariamente para quais produtores a empresa vende a prazo (ex.: linha Arbolin) e quanto pode ficar exposta a cada cliente.

A dor real de Marcelo **não** é o cliente já inadimplente — esse ele já enxerga. É o cliente que **parece saudável hoje e pode deixar de pagar em 6 meses**: a Krill Tech vende a prazo, tudo certo, mas um choque climático ou de mercado reduz a produtividade e a receita do produtor, e sinais jurídicos começam a aparecer — sem que ninguém na Krill Tech seja avisado a tempo de agir.

## 4. Causa raiz vs. sintoma

| Sintoma visível | Causa raiz |
|---|---|
| Inadimplência e pedidos de RJ "repentinos" | Ausência de monitoramento contínuo — a deterioração já vinha acontecendo, só não era observada |
| Análise de crédito demorada e inconsistente | Dados cadastrais, jurídicos, ambientais e agroclimáticos ficam **dispersos em fontes públicas diferentes**, sem cruzamento sistemático |
| Decisão de crédito reativa | Não existe um sinal de alerta precoce (Early Warning) nem um critério padronizado de score/rating para agir preventivamente |
| Dificuldade de explicar decisões de crédito | Falta um Relatório Padronizado de Risco que documente **por que** um cliente é classificado como arriscado |

**Distinção importante (Glossário do Desafio):** parte do problema é detectável antes mesmo do atraso de pagamento — a **inadimplência técnica** (violação de índices contratuais, como aumento de endividamento além do limite) precede a inadimplência financeira. Um sistema que só reage ao atraso chega tarde; o objetivo é aproximar o sinal de alerta do momento da causa, não do sintoma final.

## 5. Evidências que comprovam o problema

- O agronegócio brasileiro, historicamente um setor de baixa inadimplência, passou a registrar aumentos expressivos em pedidos de Recuperação Judicial (contexto macroeconômico, Seção 3 do Desafio).
- A Krill Tech relata a dor diretamente como parceira do desafio — não é uma hipótese da equipe, é o problema declarado pela empresa.
- Existem fontes públicas estruturadas (Receita Federal, DataJud/CNJ, SICAR/IBAMA, PGFN/TST/Caixa, CONAB/MAPA/INMET) que já carregam sinais de risco, mas **não são cruzadas hoje** de forma sistemática pela Krill Tech — ou seja, a informação existe, falta o sistema que a organize e explique.

## 6. Por que "prever o óbvio" não basta

Um modelo que só aponta "risco alto" sem explicar os motivos não resolve o problema de Marcelo — ele precisa justificar a decisão internamente e para o próprio cliente. Por isso o diagnóstico do KrillRadar (ver `proposta.md`) parte de três exigências não negociáveis:

1. O score precisa vir **sempre acompanhado dos motivos** (nunca "caixa-preta").
2. O sistema **alerta e recomenda**, mas **nunca decide** o crédito no lugar do gestor.
3. A solução precisa deixar claro, o tempo todo, o que é dado real e o que é dado de demonstração — para não fragilizar a credibilidade técnica da proposta.
