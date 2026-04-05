'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type SlideAviso = {
  tipo: 'aviso';
  data: {
    id: number;
    titulo: string;
    descricao: string | null;
    imagemUrl: string;
  };
};

type SlideAniversarioTipo = {
  tipo: 'aniversario';
  data: {
    id: number;
    nome: string;
    dataNascimento: string;
    fotoUrl: string | null;
  };
};

type MembroSemana = {
  id: number;
  nome: string;
  fotoUrl: string | null;
  dataNascimento: string;
  aniversarioEm: string;
};

type SlideAniversariosSemana = {
  tipo: 'aniversarios-semana';
  data: MembroSemana[];
};

type Slide = SlideAviso | SlideAniversarioTipo | SlideAniversariosSemana;

type Props = { slug: string };

// ─── Constantes ───────────────────────────────────────────────────────────────

const INTERVALO_SLIDE_MS = 8000;
const INTERVALO_FETCH_MS = 60000;
const BALOES = ['🎈', '🎉', '🎊', '🎀', '🎁', '✨', '🌟', '💛', '💜', '💙', '❤️', '🧡'];

const MESES = [
  'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
  'jul', 'ago', 'set', 'out', 'nov', 'dez',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizarYYYYMMDD(iso: string): string {
  return iso.slice(0, 10);
}

function formatarData(iso: string): string {
  const ymd = normalizarYYYYMMDD(iso);
  const [, mesStr, diaStr] = ymd.split('-');
  const dia = parseInt(diaStr, 10);
  const mes = parseInt(mesStr, 10) - 1;
  return `${dia} de ${MESES[mes]}`;
}

function ehHoje(iso: string): boolean {
  const ymd = normalizarYYYYMMDD(iso);
  const mmdd = ymd.slice(5);
  const hoje = new Date();
  const mesHoje = String(hoje.getMonth() + 1).padStart(2, '0');
  const diaHoje = String(hoje.getDate()).padStart(2, '0');
  return mmdd === `${mesHoje}-${diaHoje}`;
}

// ─── Expansão de slides ───────────────────────────────────────────────────────

function expandirSlides(slidesApi: Slide[]): Slide[] {
  const resultado: Slide[] = [];

  for (const slide of slidesApi) {
    if (slide.tipo === 'aniversarios-semana') {
      const hoje = slide.data.filter((m) => ehHoje(m.aniversarioEm));

      for (const membro of hoje) {
        resultado.push({
          tipo: 'aniversario',
          data: {
            id: membro.id,
            nome: membro.nome,
            dataNascimento: membro.dataNascimento,
            fotoUrl: membro.fotoUrl,
          },
        });
      }

      resultado.push(slide);
    } else {
      resultado.push(slide);
    }
  }

  return resultado;
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function Balao({ emoji, style }: { emoji: string; style: React.CSSProperties }) {
  return (
    <div className="absolute animate-bounce select-none pointer-events-none" style={style}>
      {emoji}
    </div>
  );
}

function Confetes() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-3 opacity-80 animate-ping"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: ['#facc15', '#f472b6', '#818cf8', '#34d399', '#fb923c'][i % 5],
            animationDelay: `${(Math.random() * 3).toFixed(2)}s`,
            animationDuration: `${(1.5 + Math.random() * 2).toFixed(2)}s`,
            borderRadius: '2px',
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
}

function BarraProgresso({ duracao }: { duracao: number }) {
  const [progresso, setProgresso] = useState(0);
  const inicio = useRef(Date.now());

  useEffect(() => {
    setProgresso(0);
    inicio.current = Date.now();
    const interval = setInterval(() => {
      const pct = Math.min(((Date.now() - inicio.current) / duracao) * 100, 100);
      setProgresso(pct);
    }, 50);
    return () => clearInterval(interval);
  }, [duracao]);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30">
      <div className="h-full bg-white transition-none" style={{ width: `${progresso}%` }} />
    </div>
  );
}

// ─── Slide individual HOJE ────────────────────────────────────────────────────

function SlideAniversario({ nome, fotoUrl }: { nome: string; fotoUrl: string | null }) {
  const baloesRef = useRef(
    Array.from({ length: 18 }, (_, i) => ({
      emoji: BALOES[i % BALOES.length],
      style: {
        left: `${5 + Math.random() * 85}%`,
        top: `${5 + Math.random() * 75}%`,
        animationDelay: `${(Math.random() * 2).toFixed(2)}s`,
        animationDuration: `${(1.2 + Math.random() * 1.5).toFixed(2)}s`,
        fontSize: `${2 + Math.random() * 2}rem`,
        opacity: 0.85,
      }

