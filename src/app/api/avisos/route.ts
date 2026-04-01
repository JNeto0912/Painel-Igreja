import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const cookieStore = await cookies();
  const igrejaId = cookieStore.get('igrejaId')?.value;

  if (!igrejaId) {
    return NextResponse.json({ error: 'Igreja não encontrada na sessão' }, { status: 401 });
  }

  const avisos = await prisma.aviso.findMany({
    where: { igrejaId: Number(igrejaId) },
    orderBy: [{ ordem: 'asc' }, { dataInicio: 'desc' }],
  });

  return NextResponse.json(avisos);
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const igrejaId = cookieStore.get('igrejaId')?.value;

  if (!igrejaId) {
    return NextResponse.json({ error: 'Igreja não encontrada na sessão' }, { status: 401 });
  }

  const body = await request.json();
  const { titulo, descricao, imagemUrl, dataInicio, dataFim, ordem, ativo } = body;

  const aviso = await prisma.aviso.create({
    data: {
      titulo,
      descricao,
      imagemUrl,
      dataInicio: new Date(dataInicio),
      dataFim: new Date(dataFim),
      ordem: ordem ?? 0,
      ativo: ativo ?? true,
      igrejaId: Number(igrejaId),
    },
  });

  return NextResponse.json(aviso, { status: 201 });
}