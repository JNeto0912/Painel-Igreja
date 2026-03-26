'use client';

import { useEffect, useState } from 'react';

type AvisoData = {
  id: number;
  titulo: string;
  descricao: string | null;
  imagemUrl: string;
};

type MembroData = {
  id: number;
  nome: string;
  dataNascimento: string;
  fotoUrl: string | null;
};

type Slide =
  | { tipo: 'aviso'; data: AvisoData }
  | { tipo: 'aniversario'; data: MembroData };

type Props = {
  slides: Slide[];
};

const VERSICULO =
  '"Que o Senhor te abençoe e te guarde; que o Senhor faça resplandecer o seu rosto sobre ti." — Números 6:24-25';

export default function DisplayClient({ slides }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black font-sans text-3xl text-white">
        Sem avisos no momento
      </div>
    );
  }

  const slide = slides[index];

  if (slide.tipo === 'aviso') {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-black px-10 py-8 font-sans">
        <div className="mb-8 flex max-h-[65vh] max-w-[80%] items-center justify-center overflow-hidden rounded-2xl bg-zinc-900">
          <img
            src={slide.data.imagemUrl}
            alt={slide.data.titulo}
            className="h-full w-full object-contain"
          />
        </div>

        <h1 className="mb-2 text-center text-4xl font-bold text-white">
          {slide.data.titulo}
        </h1>

        {slide.data.descricao && (
          <p className="mx-auto max-w-3xl text-center text-xl text-zinc-300">
            {slide.data.descricao}
          </p>
        )}

        <div className="mt-8 flex gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === index
                  ? 'w-6 bg-blue-500'
                  : 'w-2 bg-zinc-500'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  // Slide de ANIVERSÁRIO
  const nascimento = new Date(slide.data.dataNascimento);
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }

  const dataFormatada = nascimento.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
  });

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_#f97316_0,_transparent_60%),_radial-gradient(circle_at_bottom,_#1d4ed8_0,_transparent_55%),_linear-gradient(135deg,_#1e3a8a_0%,_#4f46e5_40%,_#ec4899_100%)] px-10 py-8 font-sans">
      {/* CONFETES simples */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-3 w-1 rounded-full opacity-70"
            style={{
              backgroundColor: ['#facc15', '#22c55e', '#f97316', '#e11d48', '#38bdf8'][i % 5],
              left: `${(i * 17) % 100}%`,
              top: `${(i * 29) % 100}%`,
              transform: `rotate(${(i * 37) % 360}deg)`,
            }}
          />
        ))}
      </div>

      {/* BALÕES LADO ESQUERDO */}
      <div className="pointer-events-none absolute bottom-[-10%] left-[6%] flex h-64 w-32 flex-col items-center justify-between">
        <div className="h-28 w-24 rounded-full bg-[radial-gradient(circle_at_30%_20%,_#fff_0,_#f97316_40%,_#c2410c_100%)] shadow-2xl shadow-black/60" />
        <div className="h-24 w-20 rounded-full bg-[radial-gradient(circle_at_30%_20%,_#fff_0,_#22c55e_40%,_#15803d_100%)] shadow-2xl shadow-black/60" />
      </div>

      {/* BALÕES LADO DIREITO */}
      <div className="pointer-events-none absolute bottom-[-10%] right-[6%] flex h-64 w-32 flex-col items-center justify-between">
        <div className="h-24 w-20 rounded-full bg-[radial-gradient(circle_at_30%_20%,_#fff_0,_#38bdf8_40%,_#0369a1_100%)] shadow-2xl shadow-black/60" />
        <div className="h-28 w-24 rounded-full bg-[radial-gradient(circle_at_30%_20%,_#fff_0,_#e11d48_40%,_#9f1239_100%)] shadow-2xl shadow-black/60" />
      </div>

      {/* CARD PRINCIPAL */}
      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center rounded-3xl border border-slate-100/20 bg-slate-900/80 px-10 py-8 text-center shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
        {/* FOTO / ÍCONE */}
        <div className="mb-6 flex h-44 w-44 items-center justify-center overflow-hidden rounded-full border-4 border-yellow-300 bg-[radial-gradient(circle_at_30%_30%,_#fef9c3_0,_#facc15_45%,_#a16207_100%)] shadow-xl">
          {slide.data.fotoUrl ? (
            <img
              src={slide.data.fotoUrl}
              alt={slide.data.nome}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-6xl">🎉</span>
          )}
        </div>

        <p className="mb-2 text-sm font-semibold tracking-[0.25em] text-slate-200/80 uppercase">
          Feliz Aniversário
        </p>

        <h1 className="mb-1 text-4xl font-extrabold text-slate-50 md:text-5xl">
          {slide.data.nome}
        </h1>

        <p className="mb-4 text-xl text-amber-200">
          {idade} anos hoje 🎂
        </p>

        <p className="mb-6 text-sm text-slate-300">
          {dataFormatada}
        </p>

        {/* VERSÍCULO */}
        <div className="mt-2 max-w-2xl rounded-2xl bg-slate-800/60 px-6 py-4 text-slate-100 shadow-inner">
          <p className="text-lg italic leading-relaxed">
            {VERSICULO}
          </p>
        </div>
      </div>

      {/* INDICADOR DE SLIDES */}
      <div className="absolute bottom-8 flex gap-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all ${
              i === index
                ? 'w-7 bg-slate-50'
                : 'w-3 bg-slate-50/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}