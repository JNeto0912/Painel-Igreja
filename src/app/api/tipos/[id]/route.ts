import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const temServicos = await prisma.servico.count({
    where: { tipoId: Number(id) },
  });

  if (temServicos > 0) {
    return NextResponse.json(
      { error: 'Não é possível excluir um tipo que possui serviços cadastrados.' },
      { status: 400 }
    );
  }

  await prisma.tipoServico.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json({ ok: true });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { nome } = await req.json();

  const tipo = await prisma.tipoServico.update({
    where: { id: Number(id) },
    data: { nome: nome.trim() },
  });

  return NextResponse.json(tipo);
}