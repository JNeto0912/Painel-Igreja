import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // ✅ agora lê "slug" igual ao frontend manda
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json(
      { error: 'Parâmetro slug é obrigatório.' },
      { status: 400 },
    );
  }

  const servicos = await prisma.servico.findMany({
    where: {
      ativo: true,
      igreja: { slug },
    },
    include: { tipo: true },
    orderBy: { id: 'desc' },
  });

  return NextResponse.json(servicos);
}