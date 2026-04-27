<p align="center"> 
  <img src=".github/logo.png" alt="Breakfast Bliss Logo" width="80px" height="80px">
</p>
<h1 align="center"> Breakfast Bliss - Back End</h1>
<h3 align="center"> API para gestão de operações de pedidos de um restaurante </h3>

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)
<h2 id="sobre-o-projeto"> :pencil: Sobre o Projeto</h2>

O Breakfast Bliss - Back End é o api por trás de uma plataforma de pedidos de café da manhã. Desenvolvida para oferecer uma experiência fluida tanto para clientes quanto para administradores, a API gerencia desde o catálogo de itens e ingredientes até o controle de carrinhos de compras em tempo real. Este projeto foi construído com foco em segurança, escalabilidade e performance.


![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)
<h2 id="tecnologias"> 🛠️ Tecnologias Utilizadas</h2>

- Node.js: Ambiente de execução JavaScript no servidor.
- Express 5: Framework web veloz para gerenciamento de rotas e middlewares.
- TypeScript: Superset que adiciona tipagem estática, garantindo código mais robusto.
- Prisma ORM: Modelagem de dados e interface intuitiva com o banco PostgreSQL.
- Zod: Validação de esquemas e dados de entrada com foco em segurança.
- JWT (JSON Web Token): Estrutura padrão para autenticação entre cliente e servidor.
- Swagger UI: Documentação interativa para teste de endpoints em tempo real.
- Bcrypt: Hashing de senhas para proteção de dados sensíveis.
- Multer: Middleware para processamento e armazenamento de imagens de produtos.

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)
<h2 id="rotas"> 🛤️ Estrutura de Rotas</h2>

A API segue os padrões REST, utilizando os métodos HTTP para representar ações específicas sobre os recursos do sistema:

🔐 Autenticação (/sessions)
POST: Responsável pelo login. Recebe as credenciais do usuário, valida a senha com bcrypt e retorna o Token JWT necessário para acessar as rotas protegidas.

👥 Usuários (/users)
POST: Permite o autocadastro de novos clientes na plataforma.

GET: (Restrito a Admin) Lista todos os usuários cadastrados. Permite filtros por nome para gestão administrativa.

🍳 Ingredientes (/ingredients)
GET: Permite que usuários autenticados listem todos os ingredientes disponíveis (útil para montar filtros no frontend).

POST: (Restrito a Admin) Cadastra um novo insumo básico no sistema.

PATCH: (Restrito a Admin) Permite editar informações de um ingrediente existente sem a necessidade de reenviar todos os dados.

🍕 Itens do Menu (/menu-items)
GET: Rota pública que lista os pratos do cardápio. Suporta busca por nome e filtro por ingredientes.

GET /:id: Retorna os detalhes completos de um item específico, incluindo sua lista de ingredientes vinculados.

POST: (Restrito a Admin) Cria um novo item no menu. Esta rota utiliza o Multer para processar o upload da imagem do prato.

DELETE: (Restrito a Admin) Remove permanentemente um item do catálogo.

🛒 Carrinho (/cart)
GET: Retorna todos os itens que o usuário logado adicionou ao seu carrinho, junto com o cálculo do valor total.

POST: Adiciona um produto ao carrinho. Se o item já existir, a lógica do controlador incrementa automaticamente a quantidade.

PATCH /:id: Ajusta a quantidade de um item específico que já está no carrinho.

DELETE /:id: Remove um item do carrinho do usuário.

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)
<h2 id="instalacao"> 🚀 Instalação e Configuração</h2>

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/game-library-api.git](https://github.com/seu-usuario/game-library-api.git)
    cd game-library-api
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configuração do Ambiente (.env):**
    Crie um arquivo `.env` na raiz do projeto e preencha as variáveis:
    ```env
    DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/NOME_DO_BANCO?schema=public"
    AUTH_SECRET="sua_chave_secreta_aqui"
    ```

4.  **Banco de Dados (Prisma):**
    Execute as migrações para criar as tabelas no banco de dados:
    ```bash
    npx prisma migrate dev
    ```

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)
<h2 id="sobre-o-projeto"> :pencil: Execução do Projeto </h2>

Para iniciar o servidor em ambiente de desenvolvimento com auto-reload:
```bash
npm run dev

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)
<h2 id="proximos-passos"> 🏁 Próximos Passos</h2>

O projeto continua em evolução ativa. As próximas funcionalidades planejadas são:

Módulo de Pedidos (Orders): Implementação do checkout, transformando o carrinho em um pedido finalizado.

Status em Tempo Real: Monitoramento do preparo dos pedidos (Pendente, Em Preparo, Pronto, Entregue).

Integração de Pagamentos: Adição de gateways de pagamento para simulação de transações reais.

Histórico do Cliente: Painel para que o usuário acompanhe seus pedidos anteriores e favoritos.