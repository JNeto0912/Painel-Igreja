import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const cookieStore = await cookies();
  const igrejaId = cookieStore.get('igrejaId')?.value;

  if (!igrejaId) {
    return NextResponse.json({ error: 'Igreja não encontrada na sessão' }, { status: 401 });
  }

  const servicos = await prisma.servico.findMany({
    where: { igrejaId: Number(igrejaId) },
    include: { tipo: true },
    orderBy: { id: 'desc' },
  });

  return NextResponse.json(servicos);
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const igrejaId = cookieStore.get('igrejaId')?.value;

  if (!igrejaId) {
    return NextResponse.json({ error: 'Igreja não encontrada na sessão' }, { status: 401 });
  }

  const body = await request.json();
  const { nome, tipoId, descricao, telefone } = body;

  const servico = await prisma.servico.create({
    data: {
      nome,
      tipoId,
      descricao,
      telefone,
      igrejaId: Number(igrejaId),
    },
  });

  return NextResponse.json(servico, { status: 201 });
}