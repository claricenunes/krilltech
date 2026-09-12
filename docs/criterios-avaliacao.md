# Critérios de Avaliação

> Guia interno da equipe para orientar decisões durante o Hackathon 2026 Student Club PMI-DF.
>
> Os pesos e critérios abaixo seguem o edital oficial. As estratégias e perguntas são interpretações práticas para ajudar a equipe a atender aos critérios.

---

# 1. Visão geral

A solução será avaliada em cinco critérios:

| Critério | Peso | Prioridade no desempate |
|---|---:|---:|
| Diagnóstico do Problema & Impacto | 25% | 1º |
| Viabilidade Técnica & Execução | 25% | 2º |
| Arquitetura de Negócios & Custos | 20% | 3º |
| Implementação & Gestão de Mudanças | 15% | 4º |
| Pitch de Defesa & Articulação | 15% | 5º |
| **Total** | **100%** | |

> Como os dois primeiros critérios somam 50% da nota e também são os dois primeiros critérios de desempate, a equipe deve evitar sacrificar diagnóstico e viabilidade em favor de funcionalidades extras ou estética.

---

# 2. Diagnóstico do Problema & Impacto — 25%

## O que é avaliado

- Clareza na identificação do problema.
- Compreensão da dor real do usuário.
- Dados/evidências que sustentem o diagnóstico.
- Identificação de quem se beneficia da solução.
- Impacto gerado pela solução.

**Desempate:** 1º critério.

---

## O que precisamos demonstrar

### Problema

Não basta dizer:

> "Existe um problema no processo."

Precisamos demonstrar:

> "O processo X apresenta o problema Y, afetando Z usuários e gerando o impacto W."

---

## Perguntas

- Qual é o problema?
- Quem sofre com ele?
- Onde ele acontece?
- Por que acontece?
- Qual é a causa?
- Qual é a frequência?
- Quanto tempo é perdido?
- Quanto custa?
- Qual é o impacto operacional?
- Qual é o impacto para o usuário?
- Temos dados que comprovam isso?

---

## Evidências

Priorizar:

- dados fornecidos no desafio;
- dados reais;
- dados públicos;
- pesquisas;
- estudos;
- indicadores;
- informações oficiais.

### Regra

**Não confundir hipótese com evidência.**

Se não tivermos um dado real, deixar claro que é:

- estimativa;
- hipótese;
- simulação;
- projeção.

---

## Checklist

- [ ] Problema definido em uma frase.
- [ ] Usuário identificado.
- [ ] Dor claramente explicada.
- [ ] Causa identificada.
- [ ] Impacto quantificado quando possível.
- [ ] Dados/evidências apresentados.
- [ ] Beneficiário da solução identificado.
- [ ] Relação entre problema e impacto demonstrada.

---

# 3. Viabilidade Técnica & Execução — 25%

## O que é avaliado

- Lógica da solução.
- Viabilidade técnica.
- Possibilidade prática de execução.
- Fluxo da solução.
- Protótipo/MVP.

**Desempate:** 2º critério.

---

## O que precisamos demonstrar

A solução precisa parecer **construível**, não apenas interessante.

A pergunta principal é:

> "Isso realmente poderia funcionar?"

---

## Arquitetura

Precisamos conseguir explicar:

```text
ENTRADA
   ↓
PROCESSAMENTO
   ↓
IA / AGENTE
   ↓
FERRAMENTAS / APIs / DADOS
   ↓
RESULTADO
   ↓
DECISÃO / AÇÃO
```

No KrillRadar, esse fluxo é: CNPJ → coleta (BrasilAPI/IBAMA/DataJud) → agentes de risco agro/exposição → motor de scoring determinístico → score/rating explicado → recomendação ao gestor (decisão humana). Ver `solution/agentes.md` e `docs/arquitetura.md` para o detalhamento completo.

---

## Perguntas

- Conseguimos construir um MVP?
- Qual é o fluxo principal?
- Quais tecnologias serão utilizadas?
- Quais dados são necessários?
- O que será automatizado?
- O que continuará dependendo de decisão humana?
- Como demonstrar a solução funcionando?

---

## Regra de ouro para este critério

**Transparência real vs. mock vale mais do que fingir automação completa.** A banca valoriza a equipe que diz claramente "isto é real, isto é simulado para a demo" — inventar uma automação que não existe (ex.: busca automática CNPJ→DataJud) é o maior risco de perder pontos aqui por credibilidade técnica.

---

## Checklist

- [ ] Fluxo principal (Triagem → score → simulador → alerta) funcionando de ponta a ponta.
- [ ] Motor de scoring determinístico implementado e testável isoladamente.
- [ ] Ao menos uma integração real com API pública (BrasilAPI e/ou IBAMA).
- [ ] Separação clara entre o que é LLM e o que é código determinístico.
- [ ] Transparência sobre real vs. mock explicitada na demo e no Canvas.
- [ ] Equipe consegue explicar a arquitetura de agentes sem "caixa-preta".

---

# 4. Arquitetura de Negócios & Custos — 20%

## O que é avaliado

- Sustentabilidade da solução.
- Custos de implementação.
- Viabilidade de longo prazo.
- Modelo de funcionamento da solução.

**Desempate:** 3º critério.

---

## O que precisamos demonstrar

Que o KrillRadar não é só tecnicamente possível, mas **financeiramente defensável** — a equipe sabe quanto custa, de onde vem o retorno, e como o modelo evolui do MVP para produção sem inventar números que não temos como sustentar.

---

## Perguntas

- Quanto custa implementar?
- Quais recursos são necessários?
- Quais serviços/infraestrutura serão utilizados?
- Como a solução pode ser mantida?
- Qual é o benefício gerado em relação ao custo?

---

## Onde isso já está resolvido no projeto

- `docs/custos.md` — levantamento completo (MVP, piloto, produção, custos fixos/variáveis, por componente).
- `solution/proposta.md` (Seção 7) — impacto financeiro esperado com os exemplos demonstrativos (exposição por cliente, carteira vulnerável).
- Canvas (`canvas/project-model-canvas.html`) — blocos Custos e Benefícios resumidos para a banca.

## Regra deste critério

**Nunca afirmar custo zero.** O MVP tem baixo custo inicial (dados públicos, sintéticos, ambiente local), mas o custo real de tempo de equipe, piloto e produção deve estar sempre explícito — inclusive os itens que hoje são "a estimar" por falta de preço oficial (ex.: plano comercial do watsonx Orchestrate).

## Checklist

- [ ] Custos de MVP, piloto e produção diferenciados.
- [ ] Nenhum preço exato inventado sem fonte.
- [ ] Impacto financeiro esperado conectado a um exemplo concreto (mesmo que sintético).
- [ ] Modelo de negócio futuro (uso interno → SaaS) articulado.

---

# 5. Implementação & Gestão de Mudanças — 15%

## O que é avaliado

- Próximos passos.
- Premissas.
- Restrições.
- Riscos.
- Estratégias de mitigação.
- Implementação da solução.

**Desempate:** 4º critério.

---

## O que precisamos demonstrar

Que a equipe pensou **além do hackathon**: como a Krill Tech adotaria o KrillRadar de verdade, quais barreiras existem (técnicas, organizacionais, de dados) e como cada risco identificado tem um plano de mitigação — não apenas uma lista de problemas sem resposta.

---

## Perguntas

- O que acontece depois do hackathon?
- Quais são os próximos passos?
- Quais são as principais restrições?
- Quais riscos existem?
- Como esses riscos serão mitigados?
- Como a organização adotaria a solução?

---

## Onde isso já está resolvido no projeto

- `solution/proposta.md` (Seção 10) — próximos passos, plano de 6 meses de implementação.
- Canvas — blocos Premissas, Restrições e Riscos.
- `MVP_ANALYSIS.md` (Seção 18) — riscos técnicos detalhados com mitigação.

## Regra deste critério

**Risco sem mitigação não conta ponto — soma dúvida.** Cada risco apresentado (no Canvas ou no pitch) precisa vir acompanhado de como a equipe pretende lidar com ele, mesmo que a resposta seja "plano B: gravação de demonstração de backup".

## Checklist

- [ ] Premissas explicitadas (o que assumimos como verdade sem confirmação da Krill Tech).
- [ ] Restrições reais do projeto listadas (dados, tempo, integrações fora de escopo).
- [ ] Riscos técnicos e de negócio mapeados, cada um com mitigação.
- [ ] Plano de adoção pós-hackathon articulado (piloto → produção).

---

# 6. Pitch de Defesa & Articulação — 15%

## O que é avaliado

- Apresentação oral.
- Clareza do valor da solução.
- Demonstração.
- Capacidade de responder aos avaliadores.
- Articulação da proposta.

**Desempate:** 5º critério (último).

---

## O que o pitch precisa deixar claro

1. Qual é o problema?
2. Quem é afetado?
3. Qual é o impacto?
4. Qual é a solução?
5. Como ela funciona?
6. Onde a tecnologia/IA entra?
7. Qual é o impacto esperado?
8. Quanto custa?
9. Como implementar?
10. Por que essa solução é viável?

---

## Onde isso já está resolvido no projeto

- `pitch/roteiro.md` — roteiro de 3 minutos com a persona Marcelo, cobrindo os 10 pontos acima.
- Canvas — apoio visual único para a banca acompanhar o raciocínio durante o pitch.

## Regra deste critério

**Ensaiar é parte da nota, não um extra.** A equipe precisa treinar respostas para perguntas difíceis previsíveis (ex.: "o LLM está inventando o score?", "isso é uma busca automática?", "quanto custa isso de verdade?") — improvisar essas respostas na hora é o maior risco deste critério.

## Checklist

- [ ] Pitch ensaiado dentro do tempo definido.
- [ ] Demo funcionando (ou vídeo de backup gravado).
- [ ] Papéis de cada integrante definidos na apresentação.
- [ ] Perguntas difíceis antecipadas com resposta preparada (ver `MVP_ANALYSIS.md`, Seção 19).