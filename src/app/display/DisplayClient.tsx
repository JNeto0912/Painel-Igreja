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

const INTERVALO_SLIDE_MS = 8000;   // tempo em cada slide (8 segundos)
const INTERVALO_FETCH_MS = 60000;  // busca novos dados a cada 60 segundos

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

  // Busca inicial e intervalo de atualização
  useEffect(() => {
    fetchSlides();
    const interval = setInterval(fetchSlides, INTERVALO_FETCH_MS);
    return () => clearInterval(interval);
  }, [fetchSlides]);

  // Avança o slide automaticamente
  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setAtual((prev) => (prev + 1) % slides.length);
    }, INTERVALO_SLIDE_MS);
    return () => clearInterval(interval);
  }, [slides]);

  if (slides.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white text-2xl">
        Nenhum aviso no momento.
      </div>
    );
  }

  const slide = slides[atual];

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      {slide.tipo === 'aviso' && (
        <div className="flex flex-col items-center gap-6 p-10 max-w-4xl w-full">
          <img
            src={slide.data.imagemUrl}
            alt={slide.data.titulo}
            className="max-h-[60vh] object-contain rounded-xl"
          />
          <h1 className="text-4xl font-bold text-center">{slide.data.titulo}</h1>
          {slide.data.descricao && (
            <p className="text-xl text-center text-gray-300">{slide.data.descricao}</p>
          )}
        </div>
      )}

      {slide.tipo === 'aniversario' && (
        <div className="flex flex-col items-center gap-6 p-10">
          {slide.data.fotoUrl && (
            <img
              src={slide.data.fotoUrl}
              alt={slide.data.nome}
              className="w-48 h-48 rounded-full object-cover border-4 border-yellow-400"
            />
          )}
          <h1 className="text-5xl font-bold text-yellow-400">🎂 Feliz Aniversário!</h1>
          <p className="text-3xl font-semibold">{slide.data.nome}</p>
        </div>
      )}
    </div>
  );
}