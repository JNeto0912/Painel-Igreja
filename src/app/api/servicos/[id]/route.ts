import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

export async function PUT(request: Request, { params }: Params) {
  const cookieStore = await cookies();
  const igrejaId = cookieStore.get('igrejaId')?.value;
  const id = Number(params.id);

  if (!igrejaId) {
    return NextResponse.json({ error: 'Igreja não encontrada' }, { status: 401 });
  }

  const body = await request.json();
  const { nome, tipoId, descricao, telefone } = body;

  const result = await prisma.servico.updateMany({
    where: { id, igrejaId: Number(igrejaId) },
    data: { nome, tipoId, descricao, telefone },
  });

  return NextResponse.json(result);
}

export async function DELETE(request: Request, { params }: Params) {
  const cookieStore = await cookies();
  const igrejaId = cookieStore.get('igrejaId')?.value;
  const id = Number(params.id);

  if (!igrejaId) {
    return NextResponse.json({ error: 'Igreja não encontrada' }, { status: 401 });
  }

  await prisma.servico.deleteMany({
    where: { id, igrejaId: Number(igrejaId) },
  });

  return NextResponse.json({ ok: true });
}