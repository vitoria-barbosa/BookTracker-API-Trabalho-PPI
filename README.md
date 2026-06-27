## BookTracker-API

API REST em Node.js com Express e PostgreSQL para controle de livros e sessões de leitura.

## Tecnologias

- Node.js
- TypeScript
- Express
- PostgreSQL
- pg
- cors
- dotenv
- ts-node-dev

## Pré-requisitos

- Node.js instalado
- PostgreSQL instalado e rodando
- Banco de dados criado para o projeto

## Configuração

1. Instale as dependências:

```bash
npm install
```

2. Crie um arquivo `.env` na raiz do projeto com as variáveis de ambiente do banco:

```env
PORT=3000
DB_USER=seu_usuario
DB_HOST=localhost
DB_DATABASE=seu_banco
DB_PASSWORD=sua_senha
DB_PORT=5432
```

3. Crie as tabelas no PostgreSQL com o script `script_bd.sql`.

## Como rodar

```bash
npm run dev
```

O servidor será iniciado em `http://localhost:3000` por padrão.

## Entidades

### Livro

A entidade `Livro` contém:

- `id` (number) - identificador do livro
- `titulo` (string) - título do livro
- `autor` (string) - autor do livro
- `genero` (string) - gênero do livro
- `qtdPaginas` (number) - quantidade total de páginas
- `comecouEm` (Date | null) - data de início da leitura
- `terminouEm` (Date | null) - data de término da leitura
- `nota` (number | null) - nota dada ao livro
- `opiniao` (string | null) - opinião sobre o livro

### SessaoLeitura

A entidade `SessaoLeitura` contém:

- `id` (number) - identificador da sessão
- `idLivro` (number) - id do livro relacionado
- `qtdPaginas` (number | null) - páginas lidas na sessão
- `comentario` (string | null) - comentário sobre a sessão
- `dataSessao` (Date) - data em que a sessão foi registrada

## Rotas

### Livros

#### `POST /livros`

Cria um novo livro.

Body esperado:

```json
{
  "titulo": "O Senhor dos Anéis",
  "autor": "J.R.R. Tolkien",
  "genero": "Fantasia",
  "qtdPaginas": 1178
}
```

Resposta `201`:

```json
{
  "id": 1,
  "titulo": "O Senhor dos Anéis",
  "autor": "J.R.R. Tolkien",
  "genero": "Fantasia",
  "qtdPaginas": 1178,
  "comecouEm": null,
  "terminouEm": null,
  "nota": null,
  "opiniao": null
}
```

#### `GET /livros`

Retorna todos os livros cadastrados.

Resposta `200`:

```json
[
  {
    "id": 1,
    "titulo": "O Senhor dos Anéis",
    "autor": "J.R.R. Tolkien",
    "genero": "Fantasia",
    "qtdPaginas": 1178,
    "comecouEm": null,
    "terminouEm": null,
    "nota": null,
    "opiniao": null
  }
]
```

#### `GET /livros/:id`

Retorna um livro pelo ID.

Parâmetros de rota:

- `id`: ID do livro

Resposta `200`:

```json
{
  "id": 1,
  "titulo": "O Senhor dos Anéis",
  "autor": "J.R.R. Tolkien",
  "genero": "Fantasia",
  "qtdPaginas": 1178,
  "comecouEm": "2026-06-27",
  "terminouEm": null,
  "nota": null,
  "opiniao": null
}
```

Resposta `404` quando o livro não existe.

#### `PATCH /livros/:id`

Finaliza a leitura de um livro ou atualiza campos de finalização.

Parâmetros de rota:

- `id`: ID do livro

Body esperado:

```json
{
  "terminouEm": "2026-06-27",
  "nota": 9,
  "opiniao": "Excelente leitura!"
}
```

Observações:

- `terminouEm` é obrigatório para finalizar o livro.
- `nota` e `opiniao` podem ser enviados para registrar avaliação.

Resposta `200`:

```json
{
  "id": 1,
  "titulo": "O Senhor dos Anéis",
  "autor": "J.R.R. Tolkien",
  "genero": "Fantasia",
  "qtdPaginas": 1178,
  "comecouEm": "2026-06-27",
  "terminouEm": "2026-06-27",
  "nota": 9,
  "opiniao": "Excelente leitura!"
}
```

Resposta `404` quando o livro não existe.

#### `DELETE /livros/:id`

Remove um livro.

Parâmetros de rota:

- `id`: ID do livro

Resposta `204` sem conteúdo quando removido com sucesso.

Resposta `404` quando o livro não existe.

### Sessões de leitura

#### `POST /livros/:idLivro/sessoes-de-leitura`

Adiciona uma sessão de leitura para um livro.

Parâmetros de rota:

- `idLivro`: ID do livro

Body esperado:

```json
{
  "qtdPaginas": 25,
  "comentario": "Li o primeiro capítulo"
}
```

Observações:

- `qtdPaginas` deve ser informado.
- `comentario` é opcional.
- Se o livro ainda não tinha `comecouEm`, o serviço define a data de início automaticamente.
- Não é possível adicionar sessão se o livro já estiver finalizado.

Resposta `201`:

```json
{
  "id": 1,
  "idLivro": 1,
  "qtdPaginas": 25,
  "comentario": "Li o primeiro capítulo",
  "dataSessao": "2026-06-27"
}
```

Resposta `404` quando o livro não existe.

#### `GET /livros/:idLivro/sessoes-de-leitura`

Retorna todas as sessões de leitura de um livro.

Parâmetros de rota:

- `idLivro`: ID do livro

Resposta `200`:

```json
[
  {
    "id": 1,
    "idLivro": 1,
    "qtdPaginas": 25,
    "comentario": "Li o primeiro capítulo",
    "dataSessao": "2026-06-27"
  }
]
```

#### `GET /sessoes-de-leitura/:id`

Retorna uma sessão de leitura por ID.

Parâmetros de rota:

- `id`: ID da sessão

Resposta `200`:

```json
{
  "id": 1,
  "idLivro": 1,
  "qtdPaginas": 25,
  "comentario": "Li o primeiro capítulo",
  "dataSessao": "2026-06-27"
}
```

Resposta `404` quando a sessão não existe.

#### `PATCH /sessoes-de-leitura/:id`

Atualiza a quantidade de páginas ou o comentário de uma sessão.

Parâmetros de rota:

- `id`: ID da sessão

Body aceitável:

```json
{
  "qtdPaginas": 30,
  "comentario": "Avancei mais na leitura"
}
```

Observações:

- Deve enviar pelo menos `qtdPaginas` ou `comentario`.
- `dataSessao` não é alterada por esse endpoint.

Resposta `200`:

```json
{
  "id": 1,
  "idLivro": 1,
  "qtdPaginas": 30,
  "comentario": "Avancei mais na leitura",
  "dataSessao": "2026-06-27"
}
```

Resposta `404` quando a sessão não existe.

#### `DELETE /sessoes-de-leitura/:id`

Remove uma sessão de leitura.

Parâmetros de rota:

- `id`: ID da sessão

Resposta `204` sem conteúdo quando removido com sucesso.

Resposta `404` quando a sessão não existe.
