import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const nome = searchParams.get('nome') || '';
  const areaId = searchParams.get('areaId') || '';

  const voluntarios = await prisma.voluntario.findMany({
    where: {
      disponivel: true,
      ...(nome && {
        nome: { contains: nome, mode: 'insensitive' },
      }),
      ...(areaId && {
        areaId: Number(areaId),
      }),
    },
    include: {
      area: true,
    },
    orderBy: { nome: 'asc' },
  });

  return NextResponse.json(voluntarios);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { nome, areaId, dons, telefone, email } = body;

  const voluntario = await prisma.voluntario.create({
    data: {
      nome,
      area: { connect: { id: Number(areaId) } },
      dons: dons || null,
      telefone,
      email: email || null,
    },
    include: { area: true },
  });

  return NextResponse.json(voluntario);
}