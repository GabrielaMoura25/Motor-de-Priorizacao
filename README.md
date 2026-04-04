# Motor de Priorização de Reposição de Estoque

API backend desenvolvida em Node.js + TypeScript para gerenciar peças em estoque e calcular prioridades de reposição com base em regras de negócio isoladas da camada HTTP.

O projeto foi estruturado com foco em separação de responsabilidades, facilidade de manutenção e clareza arquitetural, mantendo o escopo enxuto para um desafio técnico sem abrir mão de boas práticas.

## Visão geral

### O que a aplicação faz

- cadastra, lista, atualiza e remove peças do estoque
- calcula quais peças precisam de reposição
- ordena as prioridades de reposição por regra de urgência
- expõe endpoints HTTP documentados
- valida entradas e padroniza respostas de erro
- registra logs estruturados de requisição e falha

### Principais características

- arquitetura em camadas
- regras de negócio isoladas no domínio
- baixo acoplamento entre HTTP, aplicação e persistência
- repositório abstraído por contrato
- paginação na listagem de peças
- documentação OpenAPI/Swagger
- health check
- testes unitários para domínio e casos de uso
- suporte a execução local e via Docker

## Stack

- Node.js
- TypeScript
- Express
- Prisma
- PostgreSQL
- Zod
- Jest
- Docker / Docker Compose

## Estrutura do projeto

```text
src/
  application/   # casos de uso, DTOs e contratos
  domain/        # entidades e regras de negócio
  infra/         # acesso a dados e composition root
  interfaces/    # controllers, rotas, middlewares e docs HTTP
  shared/        # logger e erros compartilhados
tests/           # testes unitários
prisma/          # schema e migrations
```

## Arquitetura

O projeto segue uma divisão inspirada em Clean Architecture / arquitetura em camadas:

- `domain`: contém as entidades e a regra central de priorização
- `application`: orquestra os casos de uso e define contratos de acesso a dados
- `infra`: implementa os contratos com Prisma/PostgreSQL
- `interfaces`: adapta HTTP para os casos de uso
- `shared`: centraliza preocupações transversais, como logging e erros

### Decisões adotadas

- a regra de priorização foi isolada em `PriorityCalculator`
- controllers não acessam Prisma diretamente
- a aplicação depende da abstração `PartRepository`, não da implementação concreta
- a implementação concreta é injetada no composition root
- o `id` da peça é gerado pelo banco via Prisma/PostgreSQL

## Regras de negócio de priorização

Para cada peça:

1. $expectedConsumption = averageDailySales \times leadTimeDays$
2. $projectedStock = currentStock - expectedConsumption$
3. existe necessidade de reposição quando $projectedStock < minimumStock$
4. $urgencyScore = (minimumStock - projectedStock) \times criticalityLevel$

### Critérios de desempate

Quando duas peças possuem o mesmo `urgencyScore`, a ordenação considera:

1. maior `criticalityLevel`
2. maior `averageDailySales`
3. ordem alfabética por `name`

## Variáveis de ambiente

O projeto usa configuração por ambiente. Existe um arquivo modelo em [​.env.example](.env.example).

### Variáveis utilizadas

```env
PORT=3000
APP_BASE_URL=http://localhost:3000

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=estoque_db
POSTGRES_HOST_PORT=5433

DATABASE_URL=postgresql://postgres:postgres@localhost:5433/estoque_db
DOCKER_DATABASE_URL=postgresql://postgres:postgres@postgres:5432/estoque_db
```

### Observação importante

- `DATABASE_URL` é usada quando a API roda localmente na máquina host
- `DOCKER_DATABASE_URL` é usada quando a API roda dentro do container `app`, apontando para o serviço `postgres` do Compose

## Pré-requisitos

- Node.js >= 18
- Docker e Docker Compose
- Git

## Clonando o repositório

```bash
git clone https://github.com/GabrielaMoura25/Motor-de-Priorizacao.git
cd Motor-de-Priorizacao
```

## Como rodar o projeto

### Opção 1 — rodar localmente com banco no Docker

#### 1. Instalar dependências

```bash
npm install
```

#### 2. Criar o arquivo `.env`

Use [​.env.example](.env.example) como base:

```bash
cp .env.example .env
```

#### 3. Subir apenas o PostgreSQL

```bash
docker compose up -d postgres
```

#### 4. Aplicar as migrations

```bash
npx prisma migrate dev
```

#### 5. Rodar a aplicação em modo desenvolvimento

```bash
npm run dev
```

### Opção 2 — rodar API + banco via Docker Compose

```bash
docker compose up -d --build
```

> Nesse modo, a API usará `DOCKER_DATABASE_URL` para se conectar ao banco dentro da rede do Compose.

## Scripts disponíveis

```bash
npm run dev
npm run build
npm start
npm test
```

### O que cada script faz

- `npm run dev`: sobe a aplicação em desenvolvimento com reload
- `npm run build`: compila TypeScript para a pasta `dist`
- `npm start`: executa a versão compilada
- `npm test`: executa os testes unitários

## Endpoints

Base local padrão: `http://localhost:3000`

### Health check

`GET /health`

Resposta esperada:

```json
{
  "status": "ok",
  "uptime": 12.34,
  "timestamp": "2026-04-03T12:00:00.000Z"
}
```

### Criar peça

`POST /parts`

Exemplo de body:

```json
{
  "name": "Filtro de Óleo X",
  "category": "engine",
  "currentStock": 15,
  "minimumStock": 20,
  "averageDailySales": 4,
  "leadTimeDays": 5,
  "unitCost": 18.5,
  "criticalityLevel": 3
}
```

### Listar peças com paginação

`GET /parts`

Query params opcionais:

- `page` — padrão `1`
- `limit` — padrão `20`, máximo `100`
- `category` — filtro por categoria

Exemplo:

`GET /parts?page=1&limit=10&category=engine`

Resposta:

```json
{
  "items": [
    {
      "id": "uuid",
      "name": "Filtro de Óleo X",
      "category": "engine",
      "currentStock": 15,
      "minimumStock": 20,
      "averageDailySales": 4,
      "leadTimeDays": 5,
      "unitCost": 18.5,
      "criticalityLevel": 3
    }
  ],
  "page": 1,
  "limit": 10,
  "total": 42,
  "totalPages": 5
}
```

### Atualizar peça

`PUT /parts/:id`

Todos os campos são opcionais. Apenas os campos enviados serão atualizados.

Exemplo de body:

```json
{
  "currentStock": 30,
  "criticalityLevel": 5
}
```

Resposta (200):

```json
{
  "id": "uuid-1",
  "name": "Filtro de Óleo X",
  "category": "engine",
  "currentStock": 30,
  "minimumStock": 20,
  "averageDailySales": 4,
  "leadTimeDays": 5,
  "unitCost": 18.5,
  "criticalityLevel": 5
}
```

### Remover peça

`DELETE /parts/:id`

Retorna `204 No Content` em caso de sucesso, sem corpo na resposta.

Caso a peça não exista, retorna `404`:

```json
{
  "status": 404,
  "message": "Part not found"
}
```

### Obter prioridades de reposição

`GET /restock/priorities`

Exemplo de resposta:

```json
{
  "priorities": [
    {
      "partId": "uuid-1",
      "name": "Filtro de Óleo X",
      "currentStock": 15,
      "projectedStock": -5,
      "minimumStock": 20,
      "urgencyScore": 75
    }
  ]
}
```

## Documentação da API

Com a aplicação rodando:

- Swagger UI: `http://localhost:3000/docs`
- OpenAPI JSON: `http://localhost:3000/docs.json`

## Validações implementadas

As entradas HTTP são validadas com Zod.

### Regras de validação da peça

- `name` obrigatório
- `category` obrigatória
- `currentStock` inteiro e não negativo
- `minimumStock` inteiro e não negativo
- `averageDailySales` não negativa
- `leadTimeDays` inteiro e mínimo 1
- `unitCost` positivo
- `criticalityLevel` inteiro entre 1 e 5

### Regras de validação da listagem

- `page` inteiro, mínimo 1
- `limit` inteiro, mínimo 1 e máximo 100
- `category` opcional

## Logs e tratamento de erros

O projeto possui:

- log estruturado em JSON
- log de requisições HTTP
- middleware centralizado de erro
- distinção entre erro de negócio e erro inesperado
- resposta padronizada para falhas de validação e recursos inexistentes

Exemplos de cenários tratados:

- query params inválidos
- body inválido
- atualização de peça inexistente
- remoção de peça inexistente
- erro interno inesperado

## Testes

Os testes atuais cobrem principalmente duas frentes:

### Domínio

- cálculo correto do `urgencyScore`
- peças sem necessidade de reposição
- estoque negativo
- vendas zeradas
- lead time alto
- ordenação por score
- desempate por criticidade
- desempate por vendas médias
- desempate por ordem alfabética

### Aplicação

- criação de peça
- paginação da listagem
- filtro por categoria

Para executar:

```bash
npm test
```

## Banco de dados e migrations

O projeto usa Prisma com PostgreSQL.

As migrations ficam em [prisma/migrations](prisma/migrations).

Para aplicar localmente:

```bash
npx prisma migrate dev
```

## Considerações finais

O projeto foi desenvolvido com atenção a um ponto que considero central em qualquer base de código: **clareza intencional**. Cada decisão arquitetural tem uma razão que pode ser seguida pela estrutura de pastas, pelos contratos definidos e pela ausência de acoplamento direto entre as camadas.

A regra de priorização — que é o coração do sistema — está completamente isolada do Express e do Prisma. Isso significa que ela pode ser testada, modificada e evoluída sem tocar em infraestrutura. É esse tipo de separação que faz um projeto crescer sem se tornar difícil de manter.

### O que pode evoluir naturalmente

- **testes de integração HTTP** — cobrir os endpoints com supertest, complementando os testes unitários existentes
- **autenticação** — JWT ou API key para proteger os endpoints de escrita
- **observabilidade** — métricas de latência e erros com Prometheus ou similar
- **pipeline CI** — Github Actions para rodar build, lint e testes a cada push
- **deploy** — a imagem Docker já está pronta para rodar em qualquer ambiente cloud com mínima configuração adicional
