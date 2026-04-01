import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

async function getIgrejaId() {
  const cookieStore = await cookies();
  const igrejaId = cookieStore.get('igrejaId')?.value;
  return igrejaId ? Number(igrejaId) : null;
}

export async function GET() {
  const igrejaId = await getIgrejaId();

  if (!igrejaId) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  const membros = await prisma.membro.findMany({
    where: { igrejaId },
    orderBy: { nome: 'asc' },
  });

  return NextResponse.json(membros);
}

export async function POST(req: Request) {
  const igrejaId = await getIgrejaId();

  if (!igrejaId) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  const { nome, dataNascimento, fotoUrl, ativo } = await req.json();

  if (!nome || !dataNascimento) {
    return NextResponse.json(
      { error: 'Nome e data de nascimento são obrigatórios.' },
      { status: 400 },
    );
  }

  const novo = await prisma.membro.create({
    data: {
      nome,
      dataNascimento: new Date(dataNascimento),
      fotoUrl: fotoUrl || null,
      ativo: ativo ?? true,
      igrejaId,
    },
  });

  return NextResponse.json(novo, { status: 201 });
}