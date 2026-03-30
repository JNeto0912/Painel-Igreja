import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const usuarios = await prisma.usuario.findMany({
    orderBy: { criadoEm: 'desc' },
    select: {
      id: true,
      login: true,
      telefone: true,
      aprovado: true,
      admin: true,
      criadoEm: true,
    },
  });

  return NextResponse.json(usuarios);
}