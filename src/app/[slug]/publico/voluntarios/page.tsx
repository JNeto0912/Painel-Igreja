'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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
  const params = useParams();
  const slug = params?.slug as string;

  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [loading, setLoading] = useState(true);

  async function carregar() {
    try {
      setLoading(true);
      const res = await fetch(`/api/publico/voluntarios?slug=${encodeURIComponent(slug)}`);
      if (!res.ok) {
        setVoluntarios([]);
        return;
      }
      const dados: Voluntario[] = await res.json();
      setVoluntarios(dados); // já vem filtrado com disponivel: true e pela igreja (slug)
    } catch {
      setVoluntarios([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!slug) return;
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

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
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-white">Voluntários</h1>
          <Link
            href={`/${slug}`}
            className="text-sm text-slate-400 hover:text-slate-200"
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
            onChange={e => setTermoPesquisa(e.target.value)}
            className="w-full border border-slate-700 bg-slate-900 text-slate-100 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Lista */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl shadow divide-y divide-slate-800">
          {loading ? (
            <p className="text-slate-400 text-sm text-center py-6">
              Carregando voluntários...
            </p>
          ) : voluntariosFiltrados.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-6">
              Nenhum voluntário encontrado.
            </p>
          ) : (
            voluntariosFiltrados.map(v => (
              <div
                key={v.id}
                className="px-4 py-3 flex items-start justify-between gap-3"
              >
                <div>
                  <p className="font-semibold text-slate-100">{v.nome}</p>
                  <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-full mt-1 bg-emerald-900/70 text-emerald-300 border border-emerald-700/60">
                    {v.area.nome}
                  </span>
                  {v.dons && (
                    <p className="text-slate-400 text-xs mt-1">
                      Dons: {v.dons}
                    </p>
                  )}
                  <p className="text-slate-400 text-xs mt-1">
                    {v.telefone}
                  </p>
                  {v.email && (
                    <p className="text-slate-500 text-xs">
                      E-mail: {v.email}
                    </p>
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