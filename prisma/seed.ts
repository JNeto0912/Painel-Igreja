// prisma/seed.ts
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  // 1) Cria a igreja padrão
  const igreja = await prisma.igreja.create({
    data: {
      nome: 'Igreja Padrão',
      slug: 'padrao',
      ativo: true,
    },
  });

  console.log('✅ Igreja criada:', igreja.nome, '(id:', igreja.id + ')');

  // 2) Cria o usuário admin vinculado à igreja
  const senha = '123456';
  const senhaHash = await bcrypt.hash(senha, 10);

  const usuario = await prisma.usuario.create({
    data: {
      login: 'admin',
      senha: senhaHash,
      telefone: '11999999999',
      aprovado: true,
      admin: true,
      igrejaId: igreja.id,
    },
  });

  console.log('✅ Usuário admin criado:');
  console.log('   login:', usuario.login);
  console.log('   senha:', senha);
  console.log('   igrejaId:', usuario.igrejaId);
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });