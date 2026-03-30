'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Area {
  id: number;
  nome: string;
}

interface Voluntario {
  id: number;
  nome: string;
  area: Area;
  dons: string | null;
  telefone: string;
  email: string | null;
}

export default function PesquisaVoluntariosPage() {
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [busca, setBusca] = useState('');
  const [areaId, setAreaId] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    fetch('/api/voluntario-areas')
      .then((r) => r.json())
      .then(setAreas)
      .catch(() => setAreas([]));

    pesquisar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function pesquisar() {
    setCarregando(true);
    const params = new URLSearchParams();
    if (busca) params.set('nome', busca);
    if (areaId) params.set('areaId', areaId);

    const res = await fetch(`/api/voluntarios?${params.toString()}`);
    const data = await res.json();
    setVoluntarios(data);
    setCarregando(false);
  }

  function linkWhatsApp(telefone: string) {
    const digits = telefone.replace(/\D/g, '');
    return `https://wa.me/55${digits}`;
  }

  return (
    <div className="min-h-screen bg-zinc-100 p-6">
      <div className="max-w-2xl mx-auto">

        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold text-zinc-800">
            Voluntários da Igreja
          </h1>
          <Link
            href="/voluntarios/inscricao"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            Quero me voluntariar →
          </Link>
        </div>
        <p className="text-zinc-500 text-sm mb-4">
          Veja quem está disponível para servir com seus dons.
        </p>

        {/* Aviso */}
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 mb-6">
          <p className="text-yellow-800 font-semibold text-sm mb-2">
            ⚠️ Aviso importante
          </p>
          <p className="text-yellow-700 text-sm">
            Esta lista reúne irmãos que desejam se voluntariar em áreas da
            igreja. O contato é feito diretamente entre as partes, sem
            intermediação da liderança.
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col gap-3">
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && pesquisar()}
            className="border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <select
              value={areaId}
              onChange={(e) => setAreaId(e.target.value)}
              className="flex-1 border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas as áreas</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nome}
                </option>
              ))}
            </select>
            <button
              onClick={pesquisar}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors"
            >
              Buscar
            </button>
          </div>
        </div>

        {/* Resultados */}
        {carregando ? (
          <p className="text-center text-zinc-400 text-sm py-6">
            Carregando...
          </p>
        ) : voluntarios.length === 0 ? (
          <p className="text-center text-zinc-400 text-sm py-6">
            Nenhum voluntário encontrado.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {voluntarios.map((v) => (
              <div key={v.id} className="bg-white rounded-xl shadow px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-zinc-800">{v.nome}</p>
                    <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full mt-1">
                      {v.area.nome}
                    </span>
                    {v.dons && (
                      <p className="text-zinc-500 text-sm mt-2">
                        Dons: {v.dons}
                      </p>
                    )}
                    <p className="text-zinc-500 text-xs mt-1">{v.telefone}</p>
                    {v.email && (
                      <p className="text-zinc-500 text-xs">{v.email}</p>
                    )}
                  </div>
                  <a
                    href={linkWhatsApp(v.telefone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}