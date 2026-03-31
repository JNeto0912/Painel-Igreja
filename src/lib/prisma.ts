// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg'; // Importa o adapter para PostgreSQL
import pg from 'pg'; // Importa o driver pg

const { Pool } = pg;

// Garante que o PrismaClient seja uma instância única globalmente
// Isso evita que múltiplas instâncias sejam criadas durante o hot-reloading em desenvolvimento
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: pg.Pool | undefined; // Adicionado para gerenciar o pool globalmente também
};

// Cria um pool de conexão para o adapter
// Reutiliza o pool existente em desenvolvimento para evitar múltiplos pools
const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL, // Sua URL de conexão do banco de dados
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.pool = pool;
}

// Cria o adapter do Prisma
const adapter = new PrismaPg(pool);

// Inicializa o PrismaClient com o adapter
// Reutiliza a instância existente em desenvolvimento
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter, // Passa o adapter aqui
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'], // Opcional: logs úteis em desenvolvimento
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;