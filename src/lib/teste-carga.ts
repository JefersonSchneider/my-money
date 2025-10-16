import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const users = [
    { name: 'Jeferson', email: 'jeferson@example.com', password: '123456' },
    { name: 'Maria', email: 'maria@example.com', password: 'senha123' },
    { name: 'Carlos', email: 'carlos@example.com', password: 'abc123' },
  ];

  for (const user of users) {
    const existing = await prisma.user.findUnique({ where: { email: user.email } });

    if (existing) {
      console.log(`Usuário com email ${user.email} já existe. Pulando...`);
      continue;
    }

    const passwordHash = await bcrypt.hash(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: passwordHash,
      },
    });

    console.log(`Usuário ${user.name} criado com sucesso.`);
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Erro ao executar carga de usuários:', err);
  prisma.$disconnect();
});