# Implementando os agentes no watsonx Orchestrate

Guia passo a passo para conectar o backend real (`api/server.mjs`) ao
watsonx Orchestrate, criando os 4 agentes descritos em
`solution/arquitetura.md`: `agente_cadastral_esg`, `agente_risco_safra`,
`agente_exposicao` e `orquestrador`.

> Os nomes exatos de flags/comandos do ADK podem mudar entre versões.
> Sempre que um comando abaixo der erro, rode `orchestrate --help` (ou
> `orchestrate <comando> --help`) para conferir a sintaxe da versão
> instalada antes de assumir que o comando mudou de nome.

## 0. Pré-requisitos

- Docker Desktop instalado e rodando (o Developer Edition roda como
  containers locais).
- Python 3.11+ instalado.
- Uma "entitlement key" gratuita do IBM Container Registry (crie uma conta
  em https://myibm.ibm.com/products-services/containerlibrary — é grátis
  para o Developer Edition).
- Nosso backend rodando em `http://localhost:8000` (`node api/server.mjs`).

## 1. Instalar o ADK (Agent Development Kit)

```bash
pip install --upgrade ibm-watsonx-orchestrate
```

## 2. Subir o watsonx Orchestrate localmente (Developer Edition)

Crie um arquivo `.env` (não commitar — já está coberto pelo `.gitignore`
do projeto, confira antes de commitar) com:

```
WO_DEVELOPER_EDITION_SOURCE=orchestrate
WO_ENTITLEMENT_KEY=<sua entitlement key>
```

Depois:

```bash
orchestrate server start --env-file .env
orchestrate env activate local
```

Isso sobe os containers locais e abre a UI do Orchestrate (o comando
imprime a URL, normalmente `http://localhost:4321` ou similar).

## 3. Importar o OpenAPI do nosso backend como tools

Com o backend rodando em `http://localhost:8000`:

```bash
orchestrate tools import -k openapi -f api/openapi.json
```

> Como o Developer Edition roda em containers Docker, se o import falhar
> tentando alcançar `localhost:8000` de dentro do container, troque a URL
> em `servers` do `api/openapi.json`/`api/server.mjs` para
> `http://host.docker.internal:8000` (funciona direto no Docker Desktop do
> Windows) antes de reimportar. Para baixar o spec direto do backend
> rodando: `curl http://localhost:8000/openapi.json -o api/openapi.json`.

Isso deve gerar uma tool para cada `operationId` do spec:
`health_check`, `listar_produtores`, `obter_produtor`,
`obter_conformidade`, `obter_safra_regiao`, `simular_cenario`,
`obter_score`, `obter_ranking`.

Confirme com:

```bash
orchestrate tools list
```

## 4. Importar os 3 agentes especializados

```bash
orchestrate agents import -f watsonx/agents/agente_cadastral_esg.yaml
orchestrate agents import -f watsonx/agents/agente_risco_safra.yaml
orchestrate agents import -f watsonx/agents/agente_exposicao.yaml
```

## 5. Importar o orquestrador (agente supervisor)

O `orquestrador` referencia os 3 agentes acima como `collaborators` — por
isso ele deve ser importado por último, depois que os outros três já
existirem:

```bash
orchestrate agents import -f watsonx/agents/orquestrador.yaml
```

## 6. Testar

```bash
orchestrate chat start
```

Na conversa que abrir, teste com o `orquestrador` algo como:

```
Analise o risco de crédito do cliente cli-003.
```

```
E se a produtividade do cliente cli-002 cair 20%?
```

O orquestrador deve acionar os agentes especializados, que chamam as
tools do nosso backend real, e devolver uma explicação em texto — sem
nunca inventar o número do score (ele sempre vem de `obter_score` /
`simular_cenario`).

## Se vocês usarem uma instância na nuvem (SaaS) em vez do Developer Edition local

A diferença principal: o Orchestrate na nuvem não consegue alcançar
`http://localhost:8000` nem `host.docker.internal`. É preciso expor o
backend publicamente antes do passo 3, por exemplo com um túnel:

```bash
ngrok http 8000
```

E então trocar a URL em `servers` do `openapi.json` para a URL pública
gerada pelo ngrok antes de rodar `orchestrate tools import`. Mantenha o
túnel aberto durante toda a demo — se ele cair, as tools param de
responder.
