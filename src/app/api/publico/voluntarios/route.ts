import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug'); // <- era 'igreja', agora é 'slug'

  if (!slug) {
    return NextResponse.json([]);
  }

  const igreja = await prisma.igreja.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!igreja) {
    return NextResponse.json([]);
  }

  const voluntarios = await prisma.voluntario.findMany({
    where: {
      igrejaId: igreja.id,
      disponivel: true,
    },
    include: { area: true },
    orderBy: { nome: 'asc' },
  });

  return NextResponse.json(voluntarios);
}