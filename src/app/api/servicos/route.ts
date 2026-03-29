import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// LISTAR todos os serviços
export async function GET() {
  const servicos = await prisma.servico.findMany({
    orderBy: { criadoEm: 'asc' },
  });
  return NextResponse.json(servicos);
}

// CRIAR um novo serviço
export async function POST(req: Request) {
  const body = await req.json();

  const { nome, tipo, descricao, telefone } = body;

  if (!nome || !tipo || !telefone) {
    return NextResponse.json(
      { error: 'Nome, tipo e telefone são obrigatórios.' },
      { status: 400 }
    );
  }

  const servico = await prisma.servico.create({
    data: {
      nome,
      tipo,
      descricao: descricao || null,
      telefone,
    },
  });

  return NextResponse.json(servico, { status: 201 });
}