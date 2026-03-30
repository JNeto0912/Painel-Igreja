import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { aprovado, admin } = await req.json();

  const usuario = await prisma.usuario.update({
    where: { id: Number(id) },
    data: {
      ...(aprovado !== undefined && { aprovado }),
      ...(admin !== undefined && { admin }),
    },
    select: {
      id: true,
      login: true,
      telefone: true,
      aprovado: true,
      admin: true,
    },
  });

  return NextResponse.json(usuario);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.usuario.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json({ ok: true });
}