import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const areas = await prisma.voluntarioArea.findMany({
    orderBy: { nome: 'asc' },
  });
  return NextResponse.json(areas);
}

export async function POST(req: Request) {
  const { nome } = await req.json();
  if (!nome || nome.trim() === '') {
    return NextResponse.json({ error: 'Nome obrigatório' }, { status: 400 });
  }
  const area = await prisma.voluntarioArea.create({
    data: { nome: nome.trim() },
  });
  return NextResponse.json(area);
}