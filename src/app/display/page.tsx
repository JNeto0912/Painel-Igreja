import { prisma } from '@/lib/prisma';
import DisplayClient from './DisplayClient';

export const dynamic = 'force-dynamic';

export default async function DisplayPage() {
  const agora = new Date();

  const avisos = await prisma.aviso.findMany({
    where: {
      ativo: true,
      dataInicio: { lte: agora },
      dataFim: { gte: agora },
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
    where: { ativo: true },
    select: {
      id: true,
      nome: true,
      dataNascimento: true,
      fotoUrl: true,
    },
  });

  const slides = [
    ...avisos.map(a => ({
      tipo: 'aviso' as const,
      data: {
        id: a.id,
        titulo: a.titulo,
        descricao: a.descricao,
        imagemUrl: a.imagemUrl,
      },
    })),
    ...membros.map(m => ({
      tipo: 'aniversario' as const,
      data: {
        id: m.id,
        nome: m.nome,
        dataNascimento: m.dataNascimento.toISOString(),
        fotoUrl: m.fotoUrl,
      },
    })),
  ];

  if (slides.length === 0) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: '2rem',
        fontFamily: 'sans-serif',
      }}>
        Sem avisos no momento
      </div>
    );
  }

  return <DisplayClient slides={slides} />;
}