# 🚗 UFOP Caronas

Sistema web de caronas universitárias para conectar motoristas e passageiros da comunidade da UFOP.

## Funcionalidades

- Cadastro, login e logout.
- Busca de caronas por origem, destino, data e vagas.
- Oferta e cancelamento de caronas.
- Reserva e cancelamento de vagas.
- Histórico de caronas e reservas.
- Listagem de passageiros para o motorista.
- Painel administrativo com indicadores, usuários e rotas.

## Requisitos

- Node.js 18 ou superior.
- PostgreSQL 14 ou superior.

## Como executar

### 1. Instale as dependências

```powershell
npm install
```

### 2. Crie e configure o banco

No pgAdmin, crie um banco chamado:

```text
ufop_caronas
```

Abra o Query Tool conectado a esse banco e execute, nesta ordem:

1. `schema.sql`
2. `seed.sql`

### 3. Configure as variáveis de ambiente

No PowerShell:

```powershell
Copy-Item .env.example .env
```

Edite o arquivo `.env`:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:SUA_SENHA@localhost:5432/ufop_caronas
JWT_SECRET=coloque-uma-chave-longa-e-aleatoria
```

### 4. Inicie o servidor

```powershell
npm start
```

Abra:

```text
http://localhost:3000
```

Teste a conexão com o banco em:

```text
http://localhost:3000/api/health
```

## Contas de teste

Todas usam a senha `senha123`.

| Perfil | E-mail |
|---|---|
| Administrador | `admin.jm@ufop.br` |
| Usuário | `lucas.jm@aluno.ufop.br` |
| Usuária | `mariana.jm@aluno.ufop.br` |
| Usuária | `ana.jm@aluno.ufop.br` |

## Estrutura

```text
ufop-caronas/
├── db/
│   └── database.js
├── docs/
├── middleware/
│   └── auth.js
├── Projeto/
│   └── 02-final-version.md
├── public/
│   ├── css/
│   ├── js/
│   └── pages/
├── routes/
│   ├── admin.js
│   ├── auth.js
│   ├── caronas.js
│   ├── historico.js
│   ├── public.js
│   └── reservas.js
├── .env.example
├── .gitignore
├── package.json
├── schema.sql
├── seed.sql
└── server.js
```

## API REST

| Método | Rota | Descrição | Acesso |
|---|---|---|---|
| POST | `/api/auth/register` | Cadastrar usuário | Público |
| POST | `/api/auth/login` | Entrar | Público |
| POST | `/api/auth/logout` | Sair | Público |
| GET | `/api/auth/me` | Dados do usuário autenticado | Autenticado |
| GET | `/api/caronas` | Buscar caronas | Público |
| GET | `/api/caronas/:id` | Detalhar carona | Público |
| POST | `/api/caronas` | Criar carona | Autenticado |
| DELETE | `/api/caronas/:id` | Cancelar carona | Motorista/Admin |
| GET | `/api/caronas/:id/passageiros` | Listar passageiros | Motorista/Admin |
| POST | `/api/reservas` | Reservar vaga | Autenticado |
| DELETE | `/api/reservas/:id` | Cancelar reserva | Passageiro/Admin |
| GET | `/api/historico` | Consultar histórico | Autenticado |
| GET | `/api/admin/relatorios` | Indicadores gerais | Admin |
| GET | `/api/admin/rotas` | Rotas mais utilizadas | Admin |
| GET | `/api/admin/usuarios` | Usuários cadastrados | Admin |

## Banco de dados

- `usuarios`: dados e credenciais dos usuários.
- `caronas`: trajetos oferecidos.
- `reservas`: relação entre passageiros e caronas.

O banco possui um gatilho para atualizar as vagas disponíveis quando reservas são confirmadas ou canceladas.

## Tecnologias

- Node.js e Express
- PostgreSQL
- JWT e bcryptjs
- HTML, CSS e JavaScript
