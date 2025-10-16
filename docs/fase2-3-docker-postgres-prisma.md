# Fase 2 e 3: Docker, PostgreSQL, Prisma e Modelagem de Dados

Este documento detalha passo a passo a configuração do ambiente Docker, banco de dados PostgreSQL, integração com Prisma e definição/teste dos modelos de dados para o projeto My Money.

## 1. Preparação do Ambiente Docker


### 1.1. Instalar Docker
- Certifique-se que o Docker está instalado e rodando localmente.

> ⚠️ Etapa já concluída manualmente antes deste guia.


### 1.2. Criar arquivo `docker-compose.yml`
- Adicione um serviço para o PostgreSQL.
- Exemplo básico:

> ✅ Etapa executada e validada: arquivo docker-compose.yml criado.

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16
    restart: always
    environment:
      POSTGRES_USER: mymoney
      POSTGRES_PASSWORD: mymoney123
      POSTGRES_DB: mymoneydb
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```


### 1.3. Subir o container
- Execute: `docker-compose up -d`
- Validar se o container está rodando: `docker ps`

> ✅ Etapa executada e validada: container do PostgreSQL está rodando.

## 2. Integração com Prisma ORM


### 2.1. Instalar dependências
- No projeto, execute:
  - `npm install prisma @prisma/client`

> ✅ Etapa executada e validada: dependências instaladas.


### 2.2. Inicializar Prisma
- Execute: `npx prisma init`
- > ✅ Etapa executada e validada: Prisma inicializado.
- Configure o arquivo `.env` com a string de conexão:
  - `DATABASE_URL="postgresql://mymoney:mymoney123@localhost:5432/mymoneydb"`

### 2.3. Definir o modelo inicial
- Edite o arquivo `prisma/schema.prisma`:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
}
```

### 2.4. Executar migração
- Execute: `npx prisma migrate dev --name init`
- Validar se a tabela foi criada no banco.

## 3. Testes de Consulta Simples ORM

### 3.1. Criar script de teste
- Exemplo de consulta com Prisma:

```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log(users);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
```

- Execute o script para validar a consulta.

## 4. Próximos Passos
- Expandir modelos conforme necessidade.
- Testar inserção, atualização e remoção de dados.
- Documentar problemas e soluções encontradas.

---

Siga cada etapa validando o funcionamento antes de avançar. Se precisar de exemplos ou explicações detalhadas de cada comando, peça aqui!
