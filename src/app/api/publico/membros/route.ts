// src/app/api/publico/membros/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('igreja');

  const where = slug
    ? { ativo: true, igreja: { slug } }
    : { ativo: true };

  const membros = await prisma.membro.findMany({
    where,
    orderBy: { nome: 'asc' },
  });

  return NextResponse.json(membros);
}