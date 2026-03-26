import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const avisos = await prisma.aviso.findMany({
    orderBy: { ordem: 'asc' },
  });
  return NextResponse.json(avisos);
}

export async function POST(req: Request) {
  const body = await req.json();
  const {
    titulo,
    descricao,
    imagemUrl,
    dataInicio,
    dataFim,
    ordem,
    ativo,
  } = body;

  const aviso = await prisma.aviso.create({
    data: {
      titulo,
      descricao,
      imagemUrl,
      dataInicio: new Date(dataInicio),
      dataFim: new Date(dataFim),
      ordem: Number(ordem),
      ativo: Boolean(ativo),
    },
  });

  return NextResponse.json(aviso, { status: 201 });
}