import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = Number(id);

    if (isNaN(idNum)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    await prisma.membro.delete({ where: { id: idNum } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Erro ao deletar membro:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar membro' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = Number(id);

    if (isNaN(idNum)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const body = await req.json();
    const { nome, dataNascimento, fotoUrl, ativo } = body;

    const membro = await prisma.membro.update({
      where: { id: idNum },
      data: {
        nome,
        dataNascimento: new Date(dataNascimento),
        fotoUrl: fotoUrl ?? null,
        ativo: ativo ?? true,
      },
    });

    return NextResponse.json(membro);
  } catch (error) {
    console.error('Erro ao atualizar membro:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar membro' },
      { status: 500 }
    );
  }
}