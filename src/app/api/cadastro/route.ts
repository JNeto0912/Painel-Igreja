import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const { login, senha, telefone, igrejaId } = await req.json();

  if (!login || !senha || !telefone || !igrejaId) {
    return NextResponse.json(
      { error: 'Login, senha, telefone e igreja são obrigatórios.' },
      { status: 400 }
    );
  }

  const existente = await prisma.usuario.findUnique({
    where: { login: login.trim() },
  });

  if (existente) {
    return NextResponse.json(
      { error: 'Este login já está em uso.' },
      { status: 400 }
    );
  }

  const hash = await bcrypt.hash(senha, 10);

  await prisma.usuario.create({
    data: {
      login: login.trim(),
      senha: hash,
      telefone: telefone.trim(),
      aprovado: false,
      admin: false,
      igrejaId: Number(igrejaId), // aqui amarramos o usuário à igreja escolhida
    },
  });

  return NextResponse.json(
    {
      ok: true,
      mensagem: 'Cadastro enviado! Aguarde a aprovação do administrador.',
    },
    { status: 201 }
  );
}