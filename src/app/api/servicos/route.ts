import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const nome = searchParams.get('nome') || '';
  const tipoId = searchParams.get('tipoId') || '';

  const servicos = await prisma.servico.findMany({
    where: {
      ativo: true,
      ...(nome && {
        nome: { contains: nome, mode: 'insensitive' },
      }),
      ...(tipoId && {
        tipoId: Number(tipoId),
      }),
    },
    include: {
      tipo: true,
    },
    orderBy: { nome: 'asc' },
  });

  return NextResponse.json(servicos);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { nome, tipoId, descricao, telefone } = body;

  const servico = await prisma.servico.create({
    data: {
      nome,
      tipo: {
        connect: { id: Number(tipoId) },
      },
      descricao: descricao || null,
      telefone,
    },
    include: { tipo: true },
  });

  return NextResponse.json(servico);
}