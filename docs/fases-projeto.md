# Fases do Projeto My Money (Next.js + React + TypeScript + Postgres)

Este documento descreve as etapas faseadas para o desenvolvimento do projeto, inspirado no exemplo do Cod3r(https://github.com/cod3rcursos/curso-react-redux/tree/master/my-money-app), mas adaptado para tecnologias modernas e melhores práticas.

## Fase 1: Inicialização do Projeto
- Criar projeto Next.js com TypeScript (`npx create-next-app@latest --typescript`).
- Configurar repositório Git e README inicial.
- Validar estrutura de pastas padrão do Next.js.
- Testar build e execução local.


## Fase 2: Configuração do Banco de Dados
- Instalar e configurar PostgreSQL localmente ou via Docker.
- Definir modelo inicial de dados (usuários, contas, lançamentos).
- Adicionar ORM (ex: Prisma) para integração com o banco.
- Criar conexão básica e migrar modelos iniciais.
- Testar inserção e consulta simples via ORM.

## Fase 2.1: Setup do Docker
- Criar arquivos `Dockerfile` e `docker-compose.yml` para orquestrar containers do banco de dados e ambiente de desenvolvimento.
- Configurar container do PostgreSQL e variáveis de ambiente.
- Validar funcionamento dos containers e integração com o projeto.

## Fase 3: Backend com Next.js API Routes
- Status: Concluída em 2025-10-07
- Utilizar rotas de API do Next.js para endpoints backend (substituindo Express).
- Implementar endpoints para CRUD dos modelos principais.
- Testar endpoints com ferramentas como Postman ou Insomnia.

Nota de arquitetura (2025-10-07):
- Estrutura simplificada e desacoplada implementada para o módulo de usuários:
  - Repositório (src/repositories/user-repository.ts) isolando Prisma.
  - Serviço (src/services/user-service.ts) com regras de negócio e hashing via bcryptjs.
  - Rotas HTTP (src/app/api/users/*) realizando validação com Zod e delegando ao service.
- Este padrão será seguido nas próximas entidades da Fase 4.

## Fase 4: Autenticação e Autorização
- Implementar autenticação JWT ou NextAuth.
- Criar fluxo de login/logout e proteção de rotas.
- Testar autenticação e persistência de sessão.

## Fase 5: Frontend React/Next.js
- Criar páginas e componentes principais (dashboard, cadastro, listagem).
- Utilizar hooks e context API para gerenciamento de estado.
- Integrar frontend com backend via fetch/axios.
- Testar navegação e interações básicas.

## Fase 6: Refino e Testes
- Adicionar testes unitários e de integração (Jest, Testing Library).
- Refatorar código e aplicar boas práticas.
- Validar performance e acessibilidade.


## Fase 7: Deploy e Documentação
- Preparar ambiente para deploy (Vercel, Railway, etc).
- Adaptar configuração Docker para produção, se necessário.
- Documentar endpoints, modelos, decisões técnicas e uso do Docker.
- Revisar README e documentação para onboarding.

---

Cada fase deve ser validada e testada antes de avançar para a próxima, garantindo solidez e rastreabilidade do desenvolvimento.
