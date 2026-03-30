import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { nome } = await req.json();

  if (!nome || nome.trim() === '') {
    return NextResponse.json({ error: 'Nome obrigatório' }, { status: 400 });
  }

  const area = await prisma.voluntarioArea.update({
    where: { id: Number(id) },
    data: { nome: nome.trim() },
  });

  return NextResponse.json(area);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const possuiVoluntarios = await prisma.voluntario.count({
    where: { areaId: Number(id) },
  });

  if (possuiVoluntarios > 0) {
    return NextResponse.json(
      {
        error:
          'Não é possível excluir uma área que possui voluntários cadastrados.',
      },
      { status: 400 }
    );
  }

  await prisma.voluntarioArea.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json({ ok: true });
}