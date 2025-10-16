import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Cria ou atualiza um usuário de teste
  const user = await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {}, // Nenhum campo para atualizar se o usuário já existir
    create: {
      name: 'Alice',
      email: 'alice@prisma.io',
      password: 'password123',
    },
  });
  console.log('Usuário de teste criado/encontrado:', user);

  // Busca todos os usuários
  const users = await prisma.user.findMany();
  console.log('Todos os usuários:', users);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
