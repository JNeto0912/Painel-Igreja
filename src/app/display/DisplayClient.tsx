'use client';

import { useEffect, useState, useCallback } from 'react';

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
        <div className="w-full h-full flex flex-col">
          {/* Imagem ocupa toda a tela */}
          <div className="relative flex-1">
            <img
              src={slide.data.imagemUrl}
              alt={slide.data.titulo}
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>

          {/* Rodapé com título e descrição */}
          {(slide.data.titulo || slide.data.descricao) && (
            <div className="w-full bg-black/70 backdrop-blur-sm px-10 py-6 text-center">
              <h1 className="text-4xl font-bold leading-tight">
                {slide.data.titulo}
              </h1>
              {slide.data.descricao && (
                <p className="text-xl text-gray-300 mt-2">
                  {slide.data.descricao}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {slide.tipo === 'aniversario' && (
        <div className="w-full h-full flex flex-col items-center justify-center gap-8 p-10">
          {slide.data.fotoUrl ? (
            <img
              src={slide.data.fotoUrl}
              alt={slide.data.nome}
              className="w-56 h-56 rounded-full object-cover border-4 border-yellow-400 shadow-2xl"
            />
          ) : (
            <div className="w-56 h-56 rounded-full bg-yellow-400 flex items-center justify-center text-black text-8xl">
              🎂
            </div>
          )}
          <h1 className="text-6xl font-bold text-yellow-400 text-center">
            Feliz Aniversário!
          </h1>
          <p className="text-4xl font-semibold text-center">
            {slide.data.nome}
          </p>
        </div>
      )}

      {/* Indicador de slides (bolinhas) */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === atual ? 'bg-white w-6' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}