// src/app/api/publico/voluntarios/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('igreja');

  const where = slug
    ? { disponivel: true, igreja: { slug } }
    : { disponivel: true };

  const voluntarios = await prisma.voluntario.findMany({
    where,
    include: { area: true },
    orderBy: { nome: 'asc' },
  });

  return NextResponse.json(voluntarios);
}