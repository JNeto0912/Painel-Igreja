import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ATUALIZAR um serviço existente
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { nome, tipo, descricao, telefone } = body;

  const servico = await prisma.servico.update({
    where: { id: Number(id) },
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
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.servico.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json({ ok: true });
}