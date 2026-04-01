import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

async function getIgrejaId() {
  const cookieStore = await cookies();
  const igrejaId = cookieStore.get('igrejaId')?.value;
  return igrejaId ? Number(igrejaId) : null;
}

export async function PUT(request: Request, { params }: Params) {
  const igrejaId = await getIgrejaId();
  const id = Number(params.id);

  if (!igrejaId) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  const { nome, dataNascimento, fotoUrl, ativo } = await request.json();

  if (!nome || !dataNascimento) {
    return NextResponse.json(
      { error: 'Nome e data de nascimento são obrigatórios.' },
      { status: 400 },
    );
  }

  // Garante que o membro pertence à igreja do usuário logado
  const membroExiste = await prisma.membro.findFirst({
    where: { id, igrejaId },
  });

  if (!membroExiste) {
    return NextResponse.json(
      { error: 'Membro não encontrado.' },
      { status: 404 },
    );
  }

  const atualizado = await prisma.membro.update({
    where: { id },
    data: {
      nome,
      dataNascimento: new Date(dataNascimento),
      fotoUrl: fotoUrl || null,
      ativo: ativo ?? true,
    },
  });

  return NextResponse.json(atualizado);
}

export async function DELETE(_request: Request, { params }: Params) {
  const igrejaId = await getIgrejaId();
  const id = Number(params.id);

  if (!igrejaId) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  // Garante que o membro pertence à igreja do usuário logado
  const membroExiste = await prisma.membro.findFirst({
    where: { id, igrejaId },
  });

  if (!membroExiste) {
    return NextResponse.json(
      { error: 'Membro não encontrado.' },
      { status: 404 },
    );
  }

  await prisma.membro.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}