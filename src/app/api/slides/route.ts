import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ✅ Impede o Next.js de tentar fazer prerender estático desta route
export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } },
) {
  const { slug } = params;

  const igreja = await prisma.igreja.findUnique({
    where: { slug },
    select: { id: true, ativo: true },
  });

  if (!igreja || !igreja.ativo) {
    return NextResponse.json(
      { error: 'Igreja não encontrada!' },
      { status: 404 },
    );
  }

  const agora = new Date();
  const anoHoje = agora.getUTCFullYear();
  const mesHoje = agora.getUTCMonth() + 1;
  const diaHoje = agora.getUTCDate();

  const hojeUTC    = Date.UTC(anoHoje, mesHoje - 1, diaHoje);
  const em7diasUTC = hojeUTC + 7 * 24 * 60 * 60 * 1000;

  const avisos = await prisma.aviso.findMany({
    where: {
      igrejaId: igreja.id,
      ativo: true,
      dataInicio: { lte: agora },
      dataFim:    { gte: agora },
    },
    orderBy: { ordem: 'asc' },
    select: {
      id: true,
      titulo: true,
      descricao: true,
      imagemUrl: true,
    },
  });

  const membros = await prisma.membro.findMany({
    where: {
      igrejaId: igreja.id,
      ativo: true,
    },
    select: {
      id: true,
      nome: true,
      dataNascimento: true,
      fotoUrl: true,
    },
  });

  // Aniversariantes dos próximos 7 dias (inclui hoje)
  const aniversariantesSemana = membros
    .map((m) => {
      const dn  = new Date(m.dataNascimento);
      const dia = dn.getUTCDate();
      const mes = dn.getUTCMonth() + 1;

      let anivEsteAnoUTC = Date.UTC(anoHoje, mes - 1, dia);

      if (anivEsteAnoUTC < hojeUTC) {
        anivEsteAnoUTC = Date.UTC(anoHoje + 1, mes - 1, dia);
      }

      return { ...m, anivEsteAnoUTC };
    })
    .filter((m) => m.anivEsteAnoUTC >= hojeUTC && m.anivEsteAnoUTC <= em7diasUTC)
    .sort((a, b) => a.anivEsteAnoUTC - b.anivEsteAnoUTC);

  const slides = [
    // Avisos
    ...avisos.map((a) => ({
      tipo: 'aviso' as const,
      data: a,
    })),

    // Slide coletivo da semana — o frontend injeta os individuais de hoje
    ...(aniversariantesSemana.length > 0
      ? [
          {
            tipo: 'aniversarios-semana' as const,
            data: aniversariantesSemana.map((m) => ({
              id: m.id,
              nome: m.nome,
              fotoUrl: m.fotoUrl,
              dataNascimento: m.dataNascimento.toISOString(),
              aniversarioEm: new Date(m.anivEsteAnoUTC).toISOString(),
            })),
          },
        ]
      : []),
  ];

  return NextResponse.json(slides);
}