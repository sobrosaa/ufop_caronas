# Projeto Final - UFOP Caronas

## 1. Identificação

- **Disciplina:** Sistemas Web I
- **Projeto:** UFOP Caronas
- **Integrante:** Lucas Sobrosa Rufino 22.2.8070

## 2. Descrição do domínio

O UFOP Caronas é um sistema web para aproximar estudantes que oferecem e procuram caronas. A aplicação permite cadastrar usuários, publicar trajetos, localizar caronas disponíveis, reservar vagas e acompanhar o histórico de viagens.

O domínio foi delimitado para o gerenciamento de caronas universitárias. Pagamento eletrônico, chat em tempo real, avaliação de usuários e recuperação automática de senha não fazem parte do escopo da versão final.

## 3. Objetivos

- Facilitar o encontro entre motoristas e passageiros da comunidade universitária.
- Reduzir custos individuais de deslocamento.
- Organizar vagas, reservas e cancelamentos.
- Disponibilizar informações administrativas sobre uso do sistema.

## 4. Perfis de usuário

### Usuário

- Criar conta e autenticar-se.
- Buscar caronas por origem, destino, data e quantidade de vagas.
- Reservar e cancelar uma reserva.
- Oferecer e cancelar uma carona.
- Consultar caronas oferecidas, reservas e passageiros.

### Administrador

- Consultar indicadores gerais.
- Visualizar as rotas mais utilizadas.
- Consultar usuários e suas quantidades de caronas e reservas.

## 5. Requisitos funcionais implementados

| Código | Requisito | Situação |
|---|---|---|
| RF01 | Cadastrar usuário | Implementado |
| RF02 | Autenticar e encerrar sessão | Implementado |
| RF03 | Buscar caronas com filtros | Implementado |
| RF04 | Consultar detalhes de uma carona | Implementado |
| RF05 | Oferecer carona | Implementado |
| RF06 | Cancelar carona própria | Implementado |
| RF07 | Reservar vaga | Implementado |
| RF08 | Cancelar reserva própria | Implementado |
| RF09 | Consultar histórico | Implementado |
| RF10 | Listar passageiros para o motorista | Implementado |
| RF11 | Consultar painel administrativo | Implementado |

## 6. Requisitos não funcionais

- Interface responsiva baseada em HTML e CSS.
- Comunicação entre frontend e backend por API REST em JSON.
- Senhas armazenadas com hash usando bcrypt.
- Autenticação com JSON Web Token (JWT).
- Consultas parametrizadas no PostgreSQL.
- Separação do servidor em rotas, middleware e acesso ao banco.
- Variáveis sensíveis armazenadas fora do código-fonte por meio do arquivo `.env`.

## 7. Tecnologias

- Node.js
- Express
- PostgreSQL
- HTML5
- CSS3
- JavaScript
- JWT
- bcryptjs

## 8. Arquitetura

A aplicação usa o framework Express e uma organização em camadas semelhante ao padrão MVC:

1. **View:** páginas HTML em `public/pages`, estilos em `public/css` e JavaScript do navegador em `public/js`.
2. **Controller:** rotas e regras de requisição organizadas em `routes`.
3. **Model/Persistência:** tabelas, relacionamentos e gatilhos em `schema.sql`, com acesso ao PostgreSQL por `db/database.js`.

Os middlewares de autenticação e autorização estão em `middleware/auth.js`. A comunicação entre a View e os Controllers ocorre por uma API REST em JSON.

## 9. Modelo de dados

### usuarios

Armazena nome, e-mail, hash da senha, cidade, curso, telefone, perfil administrativo e data de criação.

### caronas

Armazena motorista, origem, destino, data, horário, vagas, contribuição, observações e situação.

### reservas

Representa a relação entre passageiro e carona. Um gatilho do banco atualiza a quantidade de vagas disponíveis quando uma reserva é confirmada ou cancelada.

## 10. Principais regras de negócio

- Um motorista não pode reservar a própria carona.
- Não é possível reservar carona cancelada ou sem vaga.
- Um passageiro não pode possuir duas reservas confirmadas na mesma carona.
- Somente o motorista responsável ou um administrador pode cancelar a carona.
- Somente o passageiro responsável ou um administrador pode cancelar a reserva.
- Somente administradores acessam os relatórios administrativos.

## 11. Interfaces

As principais interfaces são:

- Página inicial
- Cadastro
- Login
- Dashboard
- Busca de caronas
- Oferta de carona
- Histórico
- Painel administrativo

Os diagramas, histórias e protótipos estão na pasta `docs`.

## 12. Como executar

Consulte o arquivo `README.md`. Em resumo:

1. Criar o banco `ufop_caronas`.
2. Executar `schema.sql` e depois `seed.sql`.
3. Copiar `.env.example` para `.env` e configurar a conexão.
4. Executar `npm install`.
5. Executar `npm start`.
6. Abrir `http://localhost:3000`.

## 13. Resultados

A versão final integra frontend, backend e PostgreSQL em uma aplicação executável localmente. O sistema cobre o fluxo principal de publicação e reserva de caronas, além de oferecer histórico e visão administrativa.

## 14 Principais desafios e dificuldades

Durante o desenvolvimento, os principais desafios foram configurar corretamente a comunicação entre o Node.js e o PostgreSQL, implementar a autenticação com JWT e controlar as permissões de usuários comuns e administradores.

Também foram necessários ajustes na disponibilização das páginas estáticas pelo Express, na formatação das datas retornadas pelo PostgreSQL e na atualização da quantidade de vagas após reservas e cancelamentos.

Esses problemas foram resolvidos por meio da organização das rotas, uso de middlewares de autenticação, consultas parametrizadas e gatilhos no banco de dados.

## 15 Outras funcionalidades implementadas

Além do fluxo principal de caronas, foram implementados:

- Painel administrativo com indicadores.
- Relatório das rotas mais utilizadas.
- Listagem de usuários e suas atividades.
- Controle de acesso baseado no perfil do usuário.
- Endpoint para verificar a conexão com o banco de dados.
- Atualização automática das vagas por meio de gatilho no PostgreSQL.
- Interface responsiva.
## 14. Limitações e trabalhos futuros

- Validar institucionalmente os e-mails dos estudantes.
- Implementar recuperação de senha.
- Adicionar chat entre motorista e passageiro.
- Adicionar avaliação de usuários.
- Criar testes automatizados.
- Publicar a aplicação em ambiente de produção.

## 15 Referências

- Documentação oficial do Node.js.
- Documentação oficial do Express.
- Documentação oficial do PostgreSQL.
- MDN Web Docs — HTML, CSS e JavaScript.
- Documentação do JSON Web Token.
