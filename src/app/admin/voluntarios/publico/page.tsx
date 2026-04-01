'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

interface Area {
  id: number;
  nome: string;
}

interface Voluntario {
  id: number;
  nome: string;
  areaId: number;
  area: Area;
  dons: string | null;
  telefone: string;
  email: string | null;
  disponivel: boolean;
}

export default function VoluntariosPublicoPage() {
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [termoPesquisa, setTermoPesquisa] = useState('');

async function carregar() {
  const res = await fetch('/api/publico/voluntarios');
  if (!res.ok) {
    setVoluntarios([]);
    return;
  }
  const dados: Voluntario[] = await res.json();
  setVoluntarios(dados); // já vem filtrado só com disponivel: true
}

  useEffect(() => {
    carregar();
  }, []);

  const voluntariosFiltrados = useMemo(() => {
    const termo = termoPesquisa.trim().toLowerCase();
    if (!termo) return voluntarios;

    return voluntarios.filter(v => {
      return (
        v.nome.toLowerCase().includes(termo) ||
        v.area.nome.toLowerCase().includes(termo) ||
        (v.dons && v.dons.toLowerCase().includes(termo)) ||
        v.telefone.includes(termo) ||
        (v.email && v.email.toLowerCase().includes(termo))
      );
    });
  }, [voluntarios, termoPesquisa]);

  return (
    <div className="min-h-screen bg-zinc-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-zinc-800">
            Voluntários
          </h1>
          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-zinc-700"
          >
            ← Início
          </Link>
        </div>

        {/* Campo de Pesquisa */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Pesquisar por nome, área, dons, telefone ou e-mail..."
            value={termoPesquisa}
            onChange={(e) => setTermoPesquisa(e.target.value)}
            className="w-full border border-zinc-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Lista */}
        <div className="bg-white rounded-xl shadow divide-y divide-zinc-100">
          {voluntariosFiltrados.length === 0 ? (
            <p className="text-zinc-400 text-sm text-center py-6">
              Nenhum voluntário encontrado.
            </p>
          ) : (
            voluntariosFiltrados.map((v) => (
              <div
                key={v.id}
                className="px-4 py-3 flex items-start justify-between gap-3"
              >
                <div>
                  <p className="font-semibold text-zinc-800">{v.nome}</p>
                  <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1 bg-green-100 text-green-700">
                    {v.area.nome}
                  </span>
                  {v.dons && (
                    <p className="text-zinc-500 text-sm mt-1">
                      Dons: {v.dons}
                    </p>
                  )}
                  <p className="text-zinc-500 text-xs mt-1">
                    {v.telefone}
                  </p>
                  {v.email && (
                    <p className="text-zinc-500 text-xs">E-mail: {v.email}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}