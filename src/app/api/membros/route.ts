import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const membros = await prisma.membro.findMany({
      orderBy: { nome: 'asc' },
    });
    return NextResponse.json(membros);
  } catch (error) {
    console.error('Erro ao buscar membros:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar membros' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, dataNascimento, fotoUrl, ativo } = body;

    if (!nome || !dataNascimento) {
      return NextResponse.json(
        { error: 'Nome e data de nascimento são obrigatórios' },
        { status: 400 }
      );
    }

    const membro = await prisma.membro.create({
      data: {
        nome,
        dataNascimento: new Date(dataNascimento),
        fotoUrl: fotoUrl ?? null,
        ativo: ativo ?? true,
      },
    });

    return NextResponse.json(membro, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar membro:', error);
    return NextResponse.json(
      { error: 'Erro ao criar membro' },
      { status: 500 }
    );
  }
}