import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ATUALIZAR um serviço existente
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const body = await req.json();

  const { nome, tipo, descricao, telefone } = body;

  const servico = await prisma.servico.update({
    where: { id },
    data: {
      nome,
      tipo,
      descricao: descricao || null,
      telefone,
    },
  });

  return NextResponse.json(servico);
}

// REMOVER um serviço
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  await prisma.servico.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}