// src/app/api/publico/servicos/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('igreja'); // ex: ?igreja=padrao

  // Se passar o slug da igreja na URL, filtra por ela
  // Caso contrário, retorna todos os ativos (para demonstração)
  const where = slug
    ? { ativo: true, igreja: { slug } }
    : { ativo: true };

  const servicos = await prisma.servico.findMany({
    where,
    include: { tipo: true },
    orderBy: { id: 'desc' },
  });

  return NextResponse.json(servicos);
}