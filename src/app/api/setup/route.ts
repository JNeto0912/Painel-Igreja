import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  const login = 'admin';
  const senha = 'igreja123';
  const telefone = '000000000';

  const hash = await bcrypt.hash(senha, 10);

  // Busca ou cria uma igreja padrão para o admin
  let igreja = await prisma.igreja.findFirst({
    where: { slug: 'sede' },
  });

  if (!igreja) {
    igreja = await prisma.igreja.create({
      data: {
        nome: 'Igreja Sede',
        slug: 'sede',
        ativo: true,
      },
    });
  }

  // Se o usuário já existe, só atualiza a senha e permissões
  const existente = await prisma.usuario.findUnique({
    where: { login },
  });

  if (existente) {
    await prisma.usuario.update({
      where: { id: existente.id },
      data: {
        senha: hash,
        admin: true,
        aprovado: true,
      },
    });

    return NextResponse.json({
      ok: true,
      mensagem: 'Senha do admin atualizada.',
      login,
      senha,
      igreja: igreja.slug,
    });
  }

  // Cria o admin vinculado à igreja
  await prisma.usuario.create({
    data: {
      login,
      senha: hash,
      telefone,
      admin: true,
      aprovado: true,
      igrejaId: igreja.id,
    },
  });

  return NextResponse.json({
    ok: true,
    mensagem: 'Admin criado com sucesso.',
    login,
    senha,
    igreja: igreja.slug,
  });
}