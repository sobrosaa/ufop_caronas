# CSI606-2026-01 - Trabalho Final - Resultados

## Discente: Lucas Sobrosa Rufino — 22.2.8070

## Resumo

O UFOP Caronas é um sistema web desenvolvido para aproximar estudantes que oferecem e procuram caronas. A aplicação permite cadastrar usuários, publicar trajetos, localizar caronas disponíveis, reservar vagas e acompanhar o histórico de viagens.

O domínio foi delimitado para o gerenciamento de caronas universitárias. Pagamento eletrônico, chat em tempo real, avaliação de usuários e recuperação automática de senha não fazem parte do escopo da versão final.

O código-fonte do projeto está disponível no seguinte repositório:

**GitHub:** https://github.com/sobrosaa/ufop_caronas

## 1. Tecnologias utilizadas — Backend e Frontend

### Backend

- Node.js;
- Express;
- PostgreSQL;
- JSON Web Token — JWT;
- bcryptjs.

### Frontend

- HTML5;
- CSS3;
- JavaScript.

### Arquitetura

A aplicação utiliza o framework Express e possui uma organização em camadas semelhante ao padrão MVC:

1. **View:** páginas HTML armazenadas em `public/pages`, estilos em `public/css` e códigos JavaScript executados no navegador em `public/js`;
2. **Controller:** rotas e regras responsáveis pelo tratamento das requisições, organizadas na pasta `routes`;
3. **Model e persistência:** tabelas, relacionamentos e gatilhos definidos em `schema.sql`, com acesso ao PostgreSQL realizado por meio do arquivo `db/database.js`.

Os middlewares responsáveis pela autenticação e autorização estão localizados em `middleware/auth.js`. A comunicação entre o frontend e o backend ocorre por meio de uma API REST, utilizando dados no formato JSON.

## 2. Funcionalidades implementadas

### Usuário comum

Foram implementadas as seguintes funcionalidades para os usuários comuns:

- Cadastro de usuário;
- Login no sistema;
- Encerramento da sessão;
- Busca de caronas por origem, destino, data e quantidade de vagas;
- Consulta dos detalhes de uma carona;
- Publicação de uma nova carona;
- Cancelamento de uma carona oferecida pelo próprio usuário;
- Reserva de uma vaga em uma carona;
- Cancelamento de uma reserva;
- Consulta do histórico de caronas oferecidas;
- Consulta do histórico de reservas;
- Consulta dos passageiros de uma carona oferecida.

### Administrador

Foram implementadas as seguintes funcionalidades administrativas:

- Consulta de indicadores gerais do sistema;
- Visualização das rotas mais utilizadas;
- Consulta dos usuários cadastrados;
- Visualização da quantidade de caronas e reservas associadas aos usuários.

### Regras de negócio implementadas

O sistema também possui as seguintes regras de negócio:

- Um motorista não pode reservar uma vaga na própria carona;
- Não é possível reservar uma carona cancelada;
- Não é possível reservar uma carona sem vagas disponíveis;
- Um passageiro não pode possuir duas reservas confirmadas na mesma carona;
- Somente o motorista responsável ou um administrador pode cancelar uma carona;
- Somente o passageiro responsável ou um administrador pode cancelar uma reserva;
- Somente usuários administradores podem acessar o painel e os relatórios administrativos.

## 3. Funcionalidades previstas e não implementadas

As seguintes funcionalidades não foram implementadas na versão final:

- Validação institucional dos endereços de e-mail dos estudantes;
- Recuperação automática de senha;
- Chat entre motorista e passageiro;
- Sistema de avaliação dos usuários;
- Pagamento eletrônico;
- Testes automatizados;
- Publicação da aplicação em um servidor de produção.

Essas funcionalidades poderão ser implementadas em versões futuras do sistema.

## 4. Outras funcionalidades implementadas

Além do fluxo principal de publicação e reserva de caronas, foram implementadas as seguintes funcionalidades:

- Interface responsiva;
- Painel administrativo com indicadores;
- Relatório das rotas mais utilizadas;
- Listagem de usuários e de suas atividades;
- Controle de acesso baseado no perfil do usuário;
- Endpoint para verificar a conexão com o banco de dados;
- Armazenamento seguro das senhas utilizando hash com bcrypt;
- Autenticação utilizando JSON Web Token;
- Consultas parametrizadas no PostgreSQL;
- Atualização automática da quantidade de vagas por meio de gatilho no banco de dados;
- Armazenamento das informações sensíveis fora do código-fonte por meio do arquivo `.env`;
- Arquivo `.env.example` com o modelo das variáveis necessárias para executar a aplicação.

## 5. Principais desafios e dificuldades

Durante o desenvolvimento, um dos principais desafios foi configurar corretamente a comunicação entre o Node.js e o PostgreSQL.

Também foi necessário implementar a autenticação utilizando JWT e controlar as permissões de usuários comuns e administradores, garantindo que somente usuários autorizados tenham acesso ao painel administrativo.

Outros desafios encontrados durante o desenvolvimento foram:

- Disponibilização correta das páginas e dos arquivos estáticos por meio do Express;
- Organização das rotas da aplicação;
- Implementação dos middlewares de autenticação e autorização;
- Formatação das datas retornadas pelo PostgreSQL;
- Atualização da quantidade de vagas após a realização ou o cancelamento de uma reserva;
- Controle das caronas canceladas;
- Proteção das informações sensíveis presentes no arquivo `.env`;
- Configuração do ambiente de execução e das dependências do projeto.

Esses problemas foram resolvidos por meio da organização das rotas, da utilização de middlewares, de consultas parametrizadas e da implementação de gatilhos no banco de dados.

## 6. Instruções para instalação e execução

### Requisitos

Para executar o sistema, é necessário ter instalados:

- Node.js;
- npm;
- PostgreSQL;
- Um gerenciador de banco de dados, como o pgAdmin.

### Obtenção do projeto

O projeto pode ser obtido por meio do repositório:

```text
https://github.com/sobrosaa/ufop_caronas
```

Também é possível utilizar o comando:

```bash
git clone https://github.com/sobrosaa/ufop_caronas.git
```

Depois, acesse a pasta do projeto:

```bash
cd ufop_caronas
```

### Criação do banco de dados

No PostgreSQL, deve ser criado um banco de dados com o seguinte nome:

```text
ufop_caronas
```

Dentro desse banco, deve ser executado primeiro o arquivo:

```text
schema.sql
```

Esse arquivo cria as tabelas, os relacionamentos e os gatilhos necessários para o funcionamento do sistema.

Depois, deve ser executado o arquivo:

```text
seed.sql
```

Esse arquivo insere os dados iniciais que podem ser utilizados para testar a aplicação.

### Configuração do ambiente

Deve ser criada uma cópia do arquivo `.env.example` com o nome `.env`.

No PowerShell, pode ser utilizado o seguinte comando:

```powershell
Copy-Item .env.example .env
```

O arquivo `.env` deve ser configurado de acordo com o ambiente local:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:SUA_SENHA@localhost:5432/ufop_caronas
JWT_SECRET=SUA_CHAVE_SECRETA
```

No campo `SUA_SENHA`, deve ser informada a senha do usuário `postgres`.

No campo `SUA_CHAVE_SECRETA`, deve ser informada uma sequência longa e segura utilizada para a geração dos tokens de autenticação.

O arquivo `.env` não deve ser enviado ao GitHub, pois contém informações sensíveis.

### Instalação das dependências

Dentro da pasta principal do projeto, deve ser executado:

```bash
npm install
```

### Inicialização do servidor

Para iniciar o sistema, deve ser executado:

```bash
npm start
```

Após a inicialização, a aplicação estará disponível no endereço:

```text
http://localhost:3000
```

A conexão com o banco de dados pode ser verificada por meio do endereço:

```text
http://localhost:3000/api/health
```

As instruções detalhadas para instalação e execução também estão disponíveis no arquivo `README.md`.

## 7. Resultados obtidos

A versão final do UFOP Caronas integra frontend, backend e PostgreSQL em uma aplicação web executável localmente.

O sistema cobre o fluxo principal de gerenciamento de caronas universitárias, permitindo que os estudantes:

- Criem uma conta;
- Realizem login;
- Ofereçam caronas;
- Pesquisem caronas disponíveis;
- Consultem os detalhes dos trajetos;
- Reservem vagas;
- Cancelem reservas;
- Cancelem caronas oferecidas;
- Consultem seus históricos;
- Visualizem os passageiros das caronas oferecidas.

Também foi implementado um painel administrativo para a visualização de informações gerais sobre a utilização do sistema.

As senhas dos usuários são armazenadas de forma protegida utilizando bcrypt, e o controle de autenticação é realizado por meio de JWT.

O banco de dados utiliza relacionamentos e gatilhos para manter a consistência das informações, especialmente na atualização da quantidade de vagas após reservas e cancelamentos.

Os diagramas, as histórias de usuário e os protótipos utilizados durante o desenvolvimento estão disponíveis na pasta `docs`.

## 8. Referências

- NODE.JS. Documentação oficial do Node.js.
- EXPRESS. Documentação oficial do Express.
- POSTGRESQL. Documentação oficial do PostgreSQL.
- MDN WEB DOCS. Documentação sobre HTML, CSS e JavaScript.
- JSON WEB TOKEN. Documentação sobre autenticação utilizando JWT.
- UFOP. Materiais disponibilizados na disciplina de Sistemas Web I.