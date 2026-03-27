'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

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

type Slide = SlideAviso | SlideAniversario;

const INTERVALO_SLIDE_MS = 8000;
const INTERVALO_FETCH_MS = 60000;

const BALOES = ['🎈', '🎉', '🎊', '🎀', '🎁', '✨', '🌟', '💛', '💜', '💙', '❤️', '🧡'];

function Balao({ emoji, style }: { emoji: string; style: React.CSSProperties }) {
  return (
    <div className="absolute text-5xl animate-bounce select-none pointer-events-none" style={style}>
      {emoji}
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
      const elapsed = Date.now() - inicio.current;
      const pct = Math.min((elapsed / duracao) * 100, 100);
      setProgresso(pct);
    }, 50);

    return () => clearInterval(interval);
  }, [duracao]);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
      <div
        className="h-full bg-white transition-none"
        style={{ width: `${progresso}%` }}
      />
    </div>
  );
}

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
      {/* Balões espalhados */}
      {baloes.map((b, i) => (
        <Balao key={i} emoji={b.emoji} style={b.style} />
      ))}

      {/* Confete animado (CSS puro) */}
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

      {/* Conteúdo central */}
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

export default function DisplayClient() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [atual, setAtual] = useState(0);

  const fetchSlides = useCallback(async () => {
    try {
      const res = await fetch('/api/slides');
      const data: Slide[] = await res.json();
      setSlides(data);
    } catch (error) {
      console.error('Erro ao buscar slides:', error);
    }
  }, []);

  useEffect(() => {
    fetchSlides();
    const interval = setInterval(fetchSlides, INTERVALO_FETCH_MS);
    return () => clearInterval(interval);
  }, [fetchSlides]);

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setAtual((prev) => (prev + 1) % slides.length);
    }, INTERVALO_SLIDE_MS);
    return () => clearInterval(interval);
  }, [slides]);

  if (slides.length === 0) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-black text-white text-2xl cursor-none">
        Nenhum aviso no momento.
      </div>
    );
  }

  const slide = slides[atual];

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

      {/* Bolinhas indicadoras */}
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

      {/* Barra de progresso */}
      <BarraProgresso key={atual} duracao={INTERVALO_SLIDE_MS} />
    </div>
  );
}