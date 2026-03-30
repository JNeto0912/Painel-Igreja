import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Lista voluntários (tela pública / admin reuso)
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

// Inscrição / criação de voluntário
export async function POST(req: Request) {
  const body = await req.json();
  const { nome, areaId, dons, telefone, email } = body;

  if (!nome || !areaId || !telefone) {
    return NextResponse.json(
      { error: 'Nome, área e telefone são obrigatórios.' },
      { status: 400 }
    );
  }

  const voluntario = await prisma.voluntario.create({
    data: {
      nome: nome.trim(),
      area: { connect: { id: Number(areaId) } },
      dons: dons ? dons.trim() : null,
      telefone: telefone.trim(),
      email: email ? email.trim() : null,
      disponivel: true,
    },
    include: { area: true },
  });

  return NextResponse.json(voluntario, { status: 201 });
}