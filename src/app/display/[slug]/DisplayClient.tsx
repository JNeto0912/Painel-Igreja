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
  aniversarioEm: string; // "YYYY-MM-DD"
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

// recebe "YYYY-MM-DD" ou ISO; sempre reduz para "YYYY-MM-DD"
function normalizarYYYYMMDD(iso: string): string {
  return iso.slice(0, 10);
}

// "5 de abr"
function formatarData(iso: string): string {
  const ymd = normalizarYYYYMMDD(iso); // "YYYY-MM-DD"
  const [, mesStr, diaStr] = ymd.split('-');
  const dia = parseInt(diaStr, 10);
  const mes = parseInt(mesStr, 10) - 1;
  return `${dia} de ${MESES[mes]}`;
}

// compara apenas mês/dia com hoje
function ehHoje(iso: string): boolean {
  const ymd = normalizarYYYYMMDD(iso);
  const mmdd = ymd.slice(5); // "MM-DD"

  const hoje = new Date();
  const mesHoje = String(hoje.getMonth() + 1).padStart(2, '0');
  const diaHoje = String(hoje.getDate()).padStart(2, '0');
  const hojeMMDD = `${mesHoje}-${diaHoje}`;

  return mmdd === hojeMMDD;
}

// ─── Expansão de slides ──────────────────────────────────────────────────────

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

// ─── Slide individual HOJE ───────────────────────────────────────────────────

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
      } as React.CSSProperties,
    }))
  );

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-purple-900 via-pink-800 to-yellow-700">
      {baloesRef.current.map((b, i) => <Balao key={i} emoji={b.emoji} style={b.style} />)}
      <Confetes />
      <div className="relative z-10 flex flex-col items-center gap-6 text-center px-10">
        {fotoUrl ? (
          <img
            src={fotoUrl}
            alt={nome}
            className="w-48 h-48 rounded-full object-cover border-4 border-yellow-300 shadow-2xl"
          />
        ) : (
          <div className="w-48 h-48 rounded-full bg-yellow-400 flex items-center justify-center text-7xl shadow-2xl">
            🎂
          </div>
        )}
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl px-10 py-6">
          <p className="text-yellow-300 text-2xl font-semibold tracking-widest uppercase mb-2">
            Hoje é aniversário de
          </p>
          <h1 className="text-6xl font-extrabold text-white drop-shadow-lg leading-tight">
            {nome}
          </h1>
          <p className="text-4xl mt-4">🎂 Feliz Aniversário! 🎂</p>
        </div>
      </div>
    </div>
  );
}

// ─── Slide COLETIVO da semana ────────────────────────────────────────────────

function SlideAniversariosSemana({ membros }: { membros: MembroSemana[] }) {
  const baloesFundoRef = useRef(
    Array.from({ length: 12 }, (_, i) => ({
      emoji: BALOES[i % BALOES.length],
      style: {
        left: `${3 + Math.random() * 90}%`,
        top: `${3 + Math.random() * 85}%`,
        animationDelay: `${(Math.random() * 2).toFixed(2)}s`,
        animationDuration: `${(1.5 + Math.random() * 2).toFixed(2)}s`,
        fontSize: `${1.8 + Math.random() * 1.8}rem`,
        opacity: 0.25,
      } as React.CSSProperties,
    }))
  );

  const membrosVisiveis = membros.slice(0, 9);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 px-10 py-12">
      {baloesFundoRef.current.map((b, i) => (
        <Balao key={i} emoji={b.emoji} style={b.style} />
      ))}

      <div className="relative z-10 text-center mb-10">
        <p className="text-4xl mb-2">🎂</p>
        <h1 className="text-5xl font-extrabold text-white tracking-wide drop-shadow-2xl">
          Aniversariantes da Semana
        </h1>
        <p className="text-purple-200 text-2xl mt-2">Próximos 7 dias</p>
      </div>

      <div
        className="relative z-10 w-full max-w-5xl grid gap-5"
        style={{
          gridTemplateColumns:
            membrosVisiveis.length <= 3
              ? '1fr'
              : membrosVisiveis.length <= 6
              ? '1fr 1fr'
              : '1fr 1fr 1fr',
        }}
      >
        {membrosVisiveis.map((m) => {
          const isHoje = ehHoje(m.aniversarioEm);
          return (
            <div
              key={m.id}
              className={`flex items-center gap-4 rounded-3xl px-6 py-5 backdrop-blur-md transition-all shadow-xl
                ${
                  isHoje
                    ? 'bg-yellow-400/25 border-2 border-yellow-300 shadow-yellow-400/40'
                    : 'bg-black/25 border border-white/20'
                }`}
            >
              {m.fotoUrl ? (
                <img
                  src={m.fotoUrl}
                  alt={m.nome}
                  className={`rounded-full object-cover shrink-0 ${
                    isHoje
                      ? 'w-20 h-20 border-2 border-yellow-300'
                      : 'w-16 h-16 border border-white/40'
                  }`}
                />
              ) : (
                <div
                  className={`rounded-full flex items-center justify-center shrink-0 text-4xl ${
                    isHoje ? 'w-20 h-20 bg-yellow-400/50' : 'w-16 h-16 bg-white/15'
                  }`}
                >
                  🎂
                </div>
              )}

              <div className="flex flex-col min-w-0">
                <span
                  className={`font-extrabold truncate ${
                    isHoje ? 'text-yellow-100 text-2xl' : 'text-white text-xl'
                  }`}
                >
                  {m.nome}
                </span>
                <span
                  className={`mt-1 ${
                    isHoje
                      ? 'text-yellow-200 text-lg font-semibold'
                      : 'text-purple-200 text-base'
                  }`}
                >
                  {isHoje ? '🎉 Hoje!' : formatarData(m.aniversarioEm)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function DisplayClient({ slug }: Props) {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [atual, setAtual] = useState(0);

  const slidesRef = useRef<Slide[]>([]);
  const atualRef = useRef(0);

  useEffect(() => { slidesRef.current = slides; }, [slides]);
  useEffect(() => { atualRef.current = atual; }, [atual]);

  const fetchSlides = useCallback(async () => {
    try {
      const res = await fetch(`/api/display/${slug}`);
      if (!res.ok) return;
      const data = await res.json();
      if (!Array.isArray(data)) return;

      const slidesExpandidos = expandirSlides(data);

      setSlides(prev => {
        if (JSON.stringify(prev) === JSON.stringify(slidesExpandidos)) return prev;
        return slidesExpandidos;
      });
    } catch (error) {
      console.error('Erro ao buscar slides:', error);
    }
  }, [slug]);

  useEffect(() => {
    fetchSlides();
    const interval = setInterval(fetchSlides, INTERVALO_FETCH_MS);
    return () => clearInterval(interval);
  }, [fetchSlides]);

  useEffect(() => {
    const interval = setInterval(() => {
      const total = slidesRef.current.length;
      if (total === 0) return;
      setAtual(prev => (prev + 1) % total);
    }, INTERVALO_SLIDE_MS);
    return () => clearInterval(interval);
  }, []);

  if (slides.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black text-white text-2xl cursor-none">
        Nenhum aviso no momento.
      </div>
    );
  }

  const slide = slides[atual] ?? slides[0];

  return (
    <div className="fixed inset-0 bg-black text-white cursor-none overflow-hidden">
      {slide.tipo === 'aviso' && (
        <img
          src={slide.data.imagemUrl}
          alt={slide.data.titulo}
          className="absolute inset-0 w-full h-full object-contain"
        />
      )}

      {slide.tipo === 'aniversario' && (
        <SlideAniversario nome={slide.data.nome} fotoUrl={slide.data.fotoUrl} />
      )}

      {slide.tipo === 'aniversarios-semana' && (
        <SlideAniversariosSemana membros={slide.data} />
      )}

      {slides.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === atual ? 'bg-white w-6' : 'bg-white/40 w-2'
              }`}
            />
          ))}
        </div>
      )}

      <BarraProgresso key={atual} duracao={INTERVALO_SLIDE_MS} />
    </div>
  );
}