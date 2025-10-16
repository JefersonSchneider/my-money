import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log("Usuários encontrados:", users);
  } catch (error) {
    console.error("Erro ao conectar com o banco:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
