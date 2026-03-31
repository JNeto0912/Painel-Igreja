// src/app/api/voluntario-areas/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// REMOVA ESTA LINHA: import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
// OU ESTA: import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
// OU ESTA: import { PrismaClientKnownRequestError } from '@prisma/client';

export async function GET() {
  try {
    const areas = await prisma.voluntarioArea.findMany({
      orderBy: { nome: 'asc' },
    });
    return NextResponse.json(areas);
  } catch (error: unknown) {
    console.error('Erro ao buscar áreas de voluntariado:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor ao buscar áreas de voluntariado.' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { nome } = await req.json();
    if (!nome || nome.trim() === '') {
      return NextResponse.json({ error: 'Nome obrigatório' }, { status: 400 });
    }

    const area = await prisma.voluntarioArea.create({
      data: { nome: nome.trim() },
    });

    return NextResponse.json(area, { status: 201 });
  } catch (error: unknown) {
    console.error('Erro ao criar área de voluntariado:', error);

    // Verificação genérica para erros do Prisma (P2002)
    // Verifica se o erro é um objeto e tem as propriedades 'code' e 'meta'
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      typeof (error as any).code === 'string' && // Garante que 'code' é string
      (error as any).code === 'P2002'
    ) {
      const prismaError = error as any; // Asserção de tipo para acessar 'meta'
      return NextResponse.json(
        { error: `Já existe uma área de voluntariado com o nome "${(prismaError.meta?.target as string[])?.[0] || 'fornecido'}".` },
        { status: 409 }
      );
    }

    // Erro genérico do servidor
    return NextResponse.json(
      { error: 'Erro interno do servidor ao criar área de voluntariado.' },
      { status: 500 }
    );
  }
}