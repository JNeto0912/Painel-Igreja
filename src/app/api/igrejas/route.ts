import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

function gerarSlug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

async function isAdmin() {
  const cookieStore = await cookies();
  const auth = cookieStore.get('auth')?.value;
  const igrejaId = cookieStore.get('igrejaId')?.value;
  if (!auth || !igrejaId) return false;

  const usuario = await prisma.usuario.findFirst({
    where: { igrejaId: Number(igrejaId), admin: true },
  });

  return !!usuario;
}

export async function GET() {
  const igrejas = await prisma.igreja.findMany({
    where: { ativo: true },
    select: { id: true, nome: true, cidade: true, estado: true },
    orderBy: { nome: 'asc' },
  });

  return NextResponse.json(igrejas);
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { nome, endereco, cidade, estado, cep, telefone, email } =
    await req.json();

  if (!nome) {
    return NextResponse.json(
      { error: 'Nome da igreja é obrigatório.' },
      { status: 400 },
    );
  }

  let slug = gerarSlug(nome);

  const slugExistente = await prisma.igreja.findUnique({ where: { slug } });
  if (slugExistente) {
    slug = `${slug}-${Date.now()}`;
  }

  const nova = await prisma.igreja.create({
    data: {
      nome,
      slug,
      endereco: endereco || null,
      cidade: cidade || null,
      estado: estado || null,
      cep: cep || null,
      telefone: telefone || null,
      email: email || null,
    },
  });

  return NextResponse.json(nova, { status: 201 });
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { id, nome, endereco, cidade, estado, cep, telefone, email, ativo } =
    await req.json();

  if (!id || !nome) {
    return NextResponse.json(
      { error: 'ID e nome são obrigatórios.' },
      { status: 400 },
    );
  }

  let slug = gerarSlug(nome);

  const slugExistente = await prisma.igreja.findFirst({
    where: { slug, NOT: { id: Number(id) } },
  });
  if (slugExistente) {
    slug = `${slug}-${Date.now()}`;
  }

  const atualizada = await prisma.igreja.update({
    where: { id: Number(id) },
    data: {
      nome,
      slug,
      endereco: endereco || null,
      cidade: cidade || null,
      estado: estado || null,
      cep: cep || null,
      telefone: telefone || null,
      email: email || null,
      ativo: ativo ?? true,
    },
  });

  return NextResponse.json(atualizada);
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { id } = await req.json();

  if (!id) {
    return NextResponse.json(
      { error: 'ID é obrigatório.' },
      { status: 400 },
    );
  }

  await prisma.igreja.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json({ ok: true });
}