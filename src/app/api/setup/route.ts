import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  // Remova ou proteja esta rota depois de usar!
  const login = 'admin';
  const senha = 'igreja123';
  const telefone = '000000000';

  const hash = await bcrypt.hash(senha, 10);

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
    });
  }

  await prisma.usuario.create({
    data: {
      login,
      senha: hash,
      telefone,
      admin: true,
      aprovado: true,
    },
  });

  return NextResponse.json({
    ok: true,
    mensagem: 'Admin criado com sucesso.',
    login,
    senha,
  });
}