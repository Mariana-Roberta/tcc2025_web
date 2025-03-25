# tcc2025_web

Sistema Web para o TCC do curso de graduação de Engenharia de Software

# Instalação

## Frontend

- Instalar Angular apenas na pasta do \frontend: cd frontend
- Instalação do Angular: npm install -g @angular/cli
- Criação do Projeto: ng new tcc-angular -> CSS
- Entrar na pasta do projeto criado: cd tcc-angular
- Rodar o projeto: ng serve --open

### Clonando um Repositório Angular e Instalando Dependências

Quando você clona um repositório Angular em um novo dispositivo, o diretório `node_modules/` não é incluído, pois ele é ignorado pelo `.gitignore`. Isso é feito para economizar espaço e evitar conflitos de dependências entre diferentes ambientes.

Para obter o `node_modules/` em seu novo dispositivo, você precisa instalar as dependências do projeto usando o `npm` ou o `yarn`. Aqui estão os passos:

#### 1. Clone o repositório:

Use o comando `git clone <URL_do_repositório>` para clonar o repositório para o seu novo dispositivo.

#### 2. Navegue até o diretório do projeto:

Use o comando `cd <nome_do_projeto>` para entrar no diretório do projeto clonado.

#### 3. Instale as dependências:

Use o comando `npm install` ou `yarn install` para instalar as dependências listadas no arquivo `package.json`.

- `npm install`: Instala as dependências usando o npm.
- `yarn install`: Instala as dependências usando o yarn (se você estiver usando yarn).

#### Explicação:

O arquivo `package.json` contém uma lista de todas as dependências necessárias para o projeto Angular. Quando você executa `npm install` ou `yarn install`, o gerenciador de pacotes lê o `package.json` e baixa todas as dependências para o diretório `node_modules/`.

#### Considerações:

- Certifique-se de ter o Node.js e o npm (ou yarn) instalados em seu novo dispositivo antes de executar os comandos de instalação.
- Se o projeto tiver um arquivo `package-lock.json` (para npm) ou `yarn.lock` (para yarn), é altamente recomendável usar o mesmo gerenciador de pacotes que gerou o arquivo de bloqueio. Isso garante que você instale as mesmas versões exatas das dependências.
- Após a instalação, você terá o diretório `node_modules/` completo em seu novo dispositivo e poderá executar o aplicativo Angular normalmente.
