import { prisma } from '@/lib/prisma';
import DisplayClient from './DisplayClient';

export const dynamic = 'force-dynamic';

type Aviso = {
  id: number;
  titulo: string;
  descricao: string | null;
  imagemUrl: string;
  dataInicio: Date;
  dataFim: Date;
  ordem: number;
  ativo: boolean;
};

type Membro = {
  id: number;
  nome: string;
  dataNascimento: Date;
  fotoUrl: string | null;
  ativo: boolean;
};

export const revalidate = 60;

export default async function DisplayPage() {
  const hoje = new Date();

  const avisos: Aviso[] = await prisma.aviso.findMany({
    where: {
      ativo: true,
      dataInicio: { lte: hoje },
      dataFim: { gte: hoje },
    },
    orderBy: { ordem: 'asc' },
  });

  const membros: Membro[] = await prisma.membro.findMany({
    where: { ativo: true },
  });

  const aniversariantes = membros.filter((m: Membro) => {
    const nasc = new Date(m.dataNascimento);
    return (
      nasc.getDate() === hoje.getDate() &&
      nasc.getMonth() === hoje.getMonth()
    );
  });

  const slides = [
    ...avisos.map((a: Aviso) => ({
      tipo: 'aviso' as const,
      data: {
        id: a.id,
        titulo: a.titulo,
        descricao: a.descricao,
        imagemUrl: a.imagemUrl,
      },
    })),
    ...aniversariantes.map((m: Membro) => ({
      tipo: 'aniversario' as const,
      data: {
        id: m.id,
        nome: m.nome,
        dataNascimento: m.dataNascimento.toISOString(),
        fotoUrl: m.fotoUrl,
      },
    })),
  ];

  return <DisplayClient slides={slides} />;
}