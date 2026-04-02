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

type SlideAniversario = {
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

type Slide = SlideAviso | SlideAniversario | SlideAniversariosSemana;

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

function formatarData(isoString: string) {
  const data = new Date(isoString);
  return `${data.getUTCDate()} de ${MESES[data.getUTCMonth()]}`;
}

function ehHoje(isoString: string) {
  const data = new Date(isoString);
  const hoje = new Date();
  return (
    data.getUTCDate() === hoje.getDate() &&
    data.getUTCMonth() === hoje.getMonth()
  );
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function Balao({ emoji, style }: { emoji: string; style: React.CSSProperties }) {
  return (
    <div
      className="absolute animate-bounce select-none pointer-events-none"
      style={style}
    >
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
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
      <div className="h-full bg-white transition-none" style={{ width: `${progresso}%` }} />
    </div>
  );
}

// ─── Slide individual de aniversário (HOJE) ───────────────────────────────────

function SlideAniversario({ nome, fotoUrl }: { nome: string; fotoUrl: string | null }) {
  const baloes = Array.from({ length: 18 }, (_, i) => ({
    emoji: BALOES[i % BALOES.length],
    style: {
      left: `${Math.random() * 90}%`,
      top: `${Math.random() * 80}%`,
      animationDelay: `${(Math.random() * 2).toFixed(2)}s`,
      animationDuration: `${(1.2 + Math.random() * 1.5).toFixed(2)}s`,
      fontSize: `${2 + Math.random() * 2}rem`,
      opacity: 0.85,
    } as React.CSSProperties,
  }));

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-purple-900 via-pink-800 to-yellow-700">
      {baloes.map((b, i) => <Balao key={i} emoji={b.emoji} style={b.style} />)}
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

// ─── Slide COLETIVO dos próximos 7 dias ──────────────────────────────────────

function SlideAniversariosSemana({ membros }: { membros: MembroSemana[] }) {
  const baloesFundo = Array.from({ length: 12 }, (_, i) => ({
    emoji: BALOES[i % BALOES.length],
    style: {
      left: `${Math.random() * 95}%`,
      top: `${Math.random() * 90}%`,
      animationDelay: `${(Math.random() * 2).toFixed(2)}s`,
      animationDuration: `${(1.5 + Math.random() * 2).toFixed(2)}s`,
      fontSize: `${1.5 + Math.random() * 1.5}rem`,
      opacity: 0.3,
    } as React.CSSProperties,
  }));

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 px-8 py-10">
      {baloesFundo.map((b, i) => <Balao key={i} emoji={b.emoji} style={b.style} />)}

      <div className="relative z-10 text-center mb-8">
        <p className="text-3xl mb-1">🎂</p>
        <h1 className="text-4xl font-extrabold text-white tracking-wide drop-shadow-lg">
          Aniversariantes da Semana
        </h1>
        <p className="text-purple-300 text-lg mt-1">Próximos 7 dias</p>
      </div>

      <div
        className="relative z-10 w-full max-w-4xl grid gap-4"
        style={{
          gridTemplateColumns:
            membros.length === 1
              ? '1fr'
              : membros.length === 2
              ? '1fr 1fr'
              : membros.length <= 4
              ? '1fr 1fr'
              : '1fr 1fr 1fr',
        }}
      >
        {membros.map((m) => {
          const isHoje = ehHoje(m.aniversarioEm);
          return (
            <div
              key={m.id}
              className={`flex items-center gap-4 rounded-2xl px-5 py-4 backdrop-blur-sm transition-all ${
                isHoje
                  ? 'bg-yellow-400/20 border-2 border-yellow-300 shadow-yellow-400/30 shadow-lg'
                  : 'bg-white/10 border border-white/20'
              }`}
            >
              {m.fotoUrl ? (
                <img
                  src={m.fotoUrl}
                  alt={m.nome}
                  className={`rounded-full object-cover shrink-0 ${
                    isHoje
                      ? 'w-16 h-16 border-2 border-yellow-300'
                      : 'w-14 h-14 border border-white/30'
                  }`}
                />
              ) : (
                <div
                  className={`rounded-full flex items-center justify-center shrink-0 text-3xl ${
                    isHoje ? 'w-16 h-16 bg-yellow-400/40' : 'w-14 h-14 bg-white/10'
                  }`}
                >
                  🎂
                </div>
              )}

              <div className="flex flex-col min-w-0">
                <span className={`font-bold truncate ${isHoje ? 'text-yellow-200 text-xl' : 'text-white text-lg'}`}>
                  {m.nome}
                </span>
                <span className={`text-sm mt-0.5 ${isHoje ? 'text-yellow-300 font-semibold' : 'text-purple-300'}`}>
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

  // Ref para acessar slides e atual dentro do interval sem re-criar o timer
  const slidesRef = useRef<Slide[]>([]);
  const atualRef = useRef(0);

  // Mantém as refs sempre atualizadas
  useEffect(() => {
    slidesRef.current = slides;
  }, [slides]);

  useEffect(() => {
    atualRef.current = atual;
  }, [atual]);

  const fetchSlides = useCallback(async () => {
    try {
      const res = await fetch(`/api/display/${slug}`);
      if (!res.ok) return;
      const data = await res.json();
      if (!Array.isArray(data)) return;

      setSlides(prev => {
        // Só atualiza se o conteúdo realmente mudou, evitando reset desnecessário
        const prevStr = JSON.stringify(prev);
        const nextStr = JSON.stringify(data);
        if (prevStr === nextStr) return prev;
        return data;
      });
    } catch (error) {
      console.error('Erro ao buscar slides:', error);
    }
  }, [slug]);

  // Fetch inicial + polling a cada 60s
  useEffect(() => {
    fetchSlides();
    const interval = setInterval(fetchSlides, INTERVALO_FETCH_MS);
    return () => clearInterval(interval);
  }, [fetchSlides]);

  // Timer de avanço de slide — criado UMA vez, usa ref para ler slides atual
  useEffect(() => {
    const interval = setInterval(() => {
      const total = slidesRef.current.length;
      if (total === 0) return;
      setAtual(prev => (prev + 1) % total);
    }, INTERVALO_SLIDE_MS);
    return () => clearInterval(interval);
  }, []); // <- sem dependências: timer criado apenas uma vez

  if (slides.length === 0) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-black text-white text-2xl cursor-none">
        Nenhum aviso no momento.
      </div>
    );
  }

  const slide = slides[atual] ?? slides[0];

  return (
    <div className="relative w-screen h-screen bg-black text-white overflow-hidden cursor-none">

      {slide.tipo === 'aviso' && (
        <img
          src={slide.data.imagemUrl}
          alt={slide.data.titulo}
          className="absolute inset-0 w-full h-full object-contain"
        />
      )}

      {slide.tipo === 'aniversario' && (
        <SlideAniversario
          nome={slide.data.nome}
          fotoUrl={slide.data.fotoUrl}
        />
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