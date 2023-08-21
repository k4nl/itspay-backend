# Projeto Back-end Itspay
## pt-br
![Itspay](./assets/logo.png) <br>
Processo seletivo de backend desenvolvido por Gustavo Braga

# Teste Técnico em Node.js utilizando Express

Este repositório contém o resultado do meu teste técnico, no qual desenvolvi um aplicativo backend utilizando Node.js e Express. O objetivo do teste foi avaliar minhas habilidades de programação, especialmente em relação ao desenvolvimento de APIs e ao uso de tecnologias relevantes.

## Tecnologias Utilizadas

- Node.js
- Express
- Postgres
- Jest (para testes unitários)

## Etapas para Executar o Backend

Siga as etapas abaixo para configurar e executar o backend em sua máquina:

1. **Clonar o Repositório:**

```
git clone git@github.com:k4nl/itspay-backend.git

cd itspay-backend
```

2. **Configurar Variáveis de Ambiente:**

Renomeie o arquivo `.env.example` para `.env` e preencha as variáveis de ambiente necessárias, como informações de banco de dados e chaves secretas.<br>

### Exemplo de um .env
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=itspay
SECRET_KEY="secret"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/itspay?schema=public"
DATABASE_URL_DOCKER="postgresql://postgres:postgres@postgres:5432/itspay?schema=public"
```

3. **Como rodar o projeto:**

    1. **Utilizando Docker** <br>

        Certifique-se de ter o docker instalado na sua maquina.

        Caso nao possua o docker instalado, siga o passo a passo no site.

        **docker**
        ```
        https://docs.docker.com/get-docker/
        ```

        **Execute os comandos no seu terminal**

        ```
        docker-compose build
        docker-compose up
        ```
      
    2. **Utilizando um ambiente linux** <br>

        Certifique de ter o postgres instalado em sua maquina.

         Caso nao possua o postgres instalado, siga o passo a passo no site.

        **postgres**
        ```
        https://www.postgresql.org/download/
        ```

        Execute o comando para instalar as dependencias:

        ```
        npm install
        ```

        Configure o arquivo **schema.prisma** dentro da pasta prisma.
        Voce devera trocar <br>

        De:
        ```
        datasource db {
          provider = "postgresql"
          url      = env("DATABASE_URL_DOCKER")
        }
        ```

         Para:
        ```
        datasource db {
          provider = "postgresql"
          url      = env("DATABASE_URL")
        }
        ```

        Rode o comando
        ```
        npm run start:linux
        ```

    3. **Utilizando um ambiente windows** <br>

      Certifique de ter o postgres instalado em sua maquina.
      Caso nao possua o postgres instalado, siga o passo a passo no site.
        
      **postgres**
      ```
      https://www.postgresql.org/download/
      ```

      Execute o comando para instalar as dependencias:

      ```
      npm install
      ```

      Configure o arquivo **schema.prisma** dentro da pasta prisma.
      Voce devera trocar <br>

      De:
      ```
      datasource db {
        provider = "postgresql"
        url      = env("DATABASE_URL_DOCKER")
      }
      ```
      Para:
      ```
      datasource db {
        provider = "postgresql"
        url      = env("DATABASE_URL")
      }
      ```

      Atualize o path do script start:win dentro de package.json

      **exemplo**
      ```
      "C:\\usuario\\seu_nome\\projetos\\itspay\\scripts\\start.bat"
      ```

      Rode o comando
      ```
      npm run start:win
      ```

5. **Executar Testes:**

```
npm run test
```

7. **Endpoints da API:**

### Usuario
- `GET /user`: Retorna a lista de usuários.

#### Filtros

**email**, 
**name**, 
**createdAt**, 
**updatedAt**, 

```
/?email=gustavo@email.com&name=gustavo
```

```
Resposta - body
[
  {
    "id": 1,
    "createdAt": "2023-08-20T22:36:30.317Z",
    "updatedAt": "2023-08-20T22:36:30.317Z",
    "email": "exemplo@email.com",
    "name": "exemplo"
  },
  {
    "id": 2,
    "createdAt": "2023-08-20T21:46:18.550Z",
    "updatedAt": "2023-08-20T21:46:18.550Z",
    "email": "exemplo2@email.com",
    "name": "exemplo2"
  },
]
```
```
Resposta - headers
"Current-Page": 1
"Page-Size": 2
"Total-Count": 2
"Total-Pages": 1
```

- `GET /user/:id`: Retorna os detalhes de um usuário específico.
```
Resposta - body
{
  "id": 1,
  "createdAt": "2023-08-20T21:46:18.550Z",
  "updatedAt": "2023-08-20T21:46:18.550Z",
  "email": "exemplo@email.com",
  "name": "exemplo"
}
```
- `POST /user`: Cria um novo usuário.

**email**: Deve ser um email válido e único. Obrigatório. <br>
**password**: Deve conter pelo menos 3 caracteres. Obrigatório.<br>
**name**: Deve conter pelo menos 3 caracteres. Obrigatório.<br>
```
Request - body

{
  "email": "exemplo@email.com",
  "password": "123",
  "name": "exemplo"
}
```
```
Resposta - body
{
  "id": 13,
  "createdAt": "2023-08-20T22:36:30.317Z",
  "updatedAt": "2023-08-20T22:36:30.317Z",
  "email": "exemplo@email.com",
  "name": "exemplo",
  "token": "token"
}
```
- `POST /user/login`: Faz login de um usuário.

**email**: Deve ser um email válido Obrigatório.<br>
**password**: Deve conter pelo menos 3 caracteres. Obrigatório.<br>
```
Request - body
{
  "email": "exemplo@email.com",
  "password": "123"
}
```
```
Resposta - body
{
  "name": "exemplo",
  "email": "exemplo@email.com",
  "id": 1,
  "token": "token"
}
```
- `PUT /user/:id`: Atualiza os detalhes de um usuário.

**name**: Deve conter pelo menos 3 caracteres.<br>
**password**: Deve conter pelo menos 3 caracteres.<br>
```
Request - body
{
  "password": "123",
  "name": "gustavo1"
}
```
```
Resposta - body
{
  "name": "exemplo3",
  "email": "exemplo3@email.com",
  "id": 1
}
```
- `DELETE /user/:id`: Remove um usuário.
```
Resposta - status
200
```

### Loja
- `GET /store`: Retorna a lista de lojas.
#### Filtros

**name**,
**address**,
**logo**,
**url**,
**createdAt**,
**updatedAt**,
**owner**,
**createdBy**,

```
/?owner=1&name=Loja
```

```
Resposta - body
[
  {
    "id": 1,
    "name": "Loja",
    "url": "loja.com.br",
    "logo": "https://logo.com.br/logo.png",
    "address": "Rua 123, Minas Gerais",
    "createdAt": "2023-08-20T21:48:35.503Z",
    "updatedAt": "2023-08-20T21:48:35.505Z",
    "owner": {
      "userInfo": {
        "id": 1,
        "name": "exemplo"
      }
    },
    "createdByUser": {
      "name": "exemplo",
      "id": 1
    }
  }
]
```
```
Resposta - headers
"Current-Page": 1
"Page-Size": 1
"Total-Count": 1
"Total-Pages": 1
```
- `GET /store/:id`: Retorna os detalhes de um loja específica.
```
Resposta - body
{
  "id": 1,
  "name": "Loja",
  "url": "loja.com.br",
  "logo": "https://logo.com.br/logo.png",
  "address": "Rua 123, Minas Gerais",
  "createdAt": "2023-08-20T21:48:35.503Z",
  "updatedAt": "2023-08-20T21:48:35.505Z",
  "owner": {
    "userInfo": {
      "id": 1,
      "name": "exemplo"
    }
  },
  "createdByUser": {
    "name": "exemplo",
    "id": 1
  }
}
```
- `POST /store`: Cria uma nova loja.

**name**: Obrigatório.<br>
**url**: Obrigatório.<br>
**logo**: Obrigatório.<br>
**address**: Obrigatório.<br>
**owner**: Id do usuario que é dono da loja, não necessariamente quem cria a loja deverá ser o dono dela. Pode ser criada por outro usuário Obrigatório.<br>
```
Request - body
```
{
  "name": "Loja",
  "url": "loja.com.br",
  "logo": "https://logo.com.br/logo.png",
  "address": "Rua 123, Minas Gerais",
  "owner": 1
}
```
Resposta - body
{
  "id": 1,
  "name": "Loja",
  "url": "loja.com.br",
  "logo": "https://logo.com.br/logo.png",
  "address": "Rua 123, Minas Gerais",
  "createdAt": "2023-08-20T21:48:35.503Z",
  "updatedAt": "2023-08-20T21:48:35.505Z",
}
```
- `PUT /store/:id`: Atualiza uma loja.

**name**: Podera atualizar o nome da loja.<br>
**url**: Podera atualizar a url da loja.<br>
**logo**: Podera atualizar a logo da loja.<br>
**address**: Podera atualizar o endereço da loja.<br>
**owner**: Podera atualizar o dono da loja
```
Request - body
{
    "name": "Loja 1",
    "address": "Endereço 1",
    "owner": 2
}
```
```
Resposta - body
{
  "id": 1,
  "name": "Loja",
  "url": "loja.com.br",
  "logo": "https://logo.com.br/logo.png",
  "address": "Rua 123, Minas Gerais",
  "createdAt": "2023-08-20T21:48:35.503Z",
  "updatedAt": "2023-08-20T21:48:35.505Z",
}
```
- `DELETE /store/:id`: Remove uma loja.
```
Resposta - status
200
```

## Considerações Finais

O teste técnico foi uma ótima oportunidade para aprimorar minhas habilidades em Node.js e Express, além de me proporcionar uma experiência prática na criação de APIs robustas. A utilização de ferramentas de teste como Jest e Supertest ajudou a garantir a qualidade do código desenvolvido.

Se você tiver alguma dúvida ou feedback sobre o meu teste técnico, não hesite em entrar em contato. Estou aberto a sugestões de melhoria e ansioso para aprender mais a partir desse desafio.

