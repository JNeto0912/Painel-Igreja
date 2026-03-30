import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { nome, tipoId, descricao, telefone, ativo } = await req.json();

  const servico = await prisma.servico.update({
    where: { id: Number(id) },
    data: {
      nome,
      tipo: {
        connect: { id: Number(tipoId) },
      },
      descricao: descricao || null,
      telefone,
      ativo: ativo ?? true,
    },
    include: { tipo: true },
  });

  return NextResponse.json(servico);
}

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