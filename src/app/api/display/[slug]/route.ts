import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
      { error: 'Igreja não encontrada.' },
      { status: 404 },
    );
  }

  const hoje = new Date();
  const diaHoje = hoje.getDate();
  const mesHoje = hoje.getMonth() + 1;

  // Próximos 7 dias
  const em7dias = new Date(hoje);
  em7dias.setDate(hoje.getDate() + 7);

  // Avisos da igreja dentro do período
  const avisos = await prisma.aviso.findMany({
    where: {
      igrejaId: igreja.id,
      ativo: true,
      dataInicio: { lte: hoje },
      dataFim: { gte: hoje },
    },
    orderBy: { ordem: 'asc' },
    select: {
      id: true,
      titulo: true,
      descricao: true,
      imagemUrl: true,
    },
  });

  // Todos os membros ativos da igreja
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

  // Aniversariantes de HOJE (slide individual)
  const aniversariantesHoje = membros.filter((m) => {
    const data = new Date(m.dataNascimento);
    return (
      data.getDate() === diaHoje &&
      data.getMonth() + 1 === mesHoje
    );
  });

  // Aniversariantes dos próximos 7 dias (slide coletivo)
  // Inclui hoje também
  const aniversariantesSemana = membros
    .map((m) => {
      const data = new Date(m.dataNascimento);
      const diaMembro = data.getDate();
      const mesMembro = data.getMonth() + 1;

      // Monta a data de aniversário no ano atual para comparar
      const anivEsteAno = new Date(hoje.getFullYear(), mesMembro - 1, diaMembro);

      // Se já passou este ano, considera o ano que vem
      if (anivEsteAno < new Date(hoje.getFullYear(), mesHoje - 1, diaHoje)) {
        anivEsteAno.setFullYear(hoje.getFullYear() + 1);
      }

      return { ...m, anivEsteAno };
    })
    .filter((m) => m.anivEsteAno >= hoje && m.anivEsteAno <= em7dias)
    .sort((a, b) => a.anivEsteAno.getTime() - b.anivEsteAno.getTime());

  // Monta os slides na ordem:
  // 1. Avisos
  // 2. Tela coletiva dos próximos 7 dias (se tiver alguém)
  // 3. Slides individuais de quem faz aniversário HOJE
  const slides = [
    ...avisos.map((a) => ({
      tipo: 'aviso' as const,
      data: a,
    })),

    // Slide coletivo (só aparece se tiver alguém nos próximos 7 dias)
    ...(aniversariantesSemana.length > 0
      ? [
          {
            tipo: 'aniversarios-semana' as const,
            data: aniversariantesSemana.map((m) => ({
              id: m.id,
              nome: m.nome,
              fotoUrl: m.fotoUrl,
              dataNascimento: m.dataNascimento.toISOString(),
              aniversarioEm: m.anivEsteAno.toISOString(),
            })),
          },
        ]
      : []),

    // Slides individuais de hoje
    ...aniversariantesHoje.map((m) => ({
      tipo: 'aniversario' as const,
      data: {
        ...m,
        dataNascimento: m.dataNascimento.toISOString(),
      },
    })),
  ];

  return NextResponse.json(slides);
}