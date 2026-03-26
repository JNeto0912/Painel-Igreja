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

    await prisma.aviso.delete({ where: { id: idNum } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Erro ao deletar aviso:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar aviso' },
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
    const { titulo, descricao, imagemUrl, dataInicio, dataFim, ordem, ativo } = body;

    const aviso = await prisma.aviso.update({
      where: { id: idNum },
      data: {
        titulo,
        descricao: descricao ?? null,
        imagemUrl,
        dataInicio: new Date(dataInicio),
        dataFim: new Date(dataFim),
        ordem: ordem ?? 0,
        ativo: ativo ?? true,
      },
    });

    return NextResponse.json(aviso);
  } catch (error) {
    console.error('Erro ao atualizar aviso:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar aviso' },
      { status: 500 }
    );
  }
}