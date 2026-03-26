import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const hoje = new Date();

    const avisos = await prisma.aviso.findMany({
      where: {
        ativo: true,
        dataInicio: { lte: hoje },
        dataFim: { gte: hoje },
      },
      orderBy: { ordem: 'asc' },
    });

    const membros = await prisma.membro.findMany({
      where: { ativo: true },
    });

    const aniversariantes = membros.filter((m) => {
      const nasc = new Date(m.dataNascimento);
      return (
        nasc.getDate() === hoje.getDate() &&
        nasc.getMonth() === hoje.getMonth()
      );
    });

    const slides = [
      ...avisos.map((a) => ({
        tipo: 'aviso' as const,
        data: {
          id: a.id,
          titulo: a.titulo,
          descricao: a.descricao,
          imagemUrl: a.imagemUrl,
        },
      })),
      ...aniversariantes.map((m) => ({
        tipo: 'aniversario' as const,
        data: {
          id: m.id,
          nome: m.nome,
          dataNascimento: m.dataNascimento.toISOString(),
          fotoUrl: m.fotoUrl,
        },
      })),
    ];

    return NextResponse.json(slides);
  } catch (error) {
    console.error('Erro ao buscar slides:', error);
    return NextResponse.json([], { status: 500 });
  }
}