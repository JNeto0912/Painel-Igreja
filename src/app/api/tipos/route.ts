import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const tipos = await prisma.tipoServico.findMany({
    orderBy: { nome: 'asc' },
  });
  return NextResponse.json(tipos);
}

export async function POST(req: Request) {
  const { nome } = await req.json();

  if (!nome || nome.trim() === '') {
    return NextResponse.json({ error: 'Nome obrigatório' }, { status: 400 });
  }

  const tipo = await prisma.tipoServico.create({
    data: { nome: nome.trim() },
  });

  return NextResponse.json(tipo);
}