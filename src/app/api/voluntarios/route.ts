import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const cookieStore = await cookies();
  const igrejaId = cookieStore.get('igrejaId')?.value;

  if (!igrejaId) {
    return NextResponse.json({ error: 'Igreja não encontrada na sessão' }, { status: 401 });
  }

  const voluntarios = await prisma.voluntario.findMany({
    where: { igrejaId: Number(igrejaId) },
    include: { area: true },
    orderBy: { id: 'desc' },
  });

  return NextResponse.json(voluntarios);
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const igrejaId = cookieStore.get('igrejaId')?.value;

  if (!igrejaId) {
    return NextResponse.json({ error: 'Igreja não encontrada na sessão' }, { status: 401 });
  }

  const body = await request.json();
  const { nome, areaId, dons, telefone, email, disponivel } = body;

  const voluntario = await prisma.voluntario.create({
    data: {
      nome,
      areaId,
      dons,
      telefone,
      email,
      disponivel,
      igrejaId: Number(igrejaId),
    },
  });

  return NextResponse.json(voluntario, { status: 201 });
}