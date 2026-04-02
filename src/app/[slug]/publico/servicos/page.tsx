'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Tipo {
  id: number;
  nome: string;
}

interface Servico {
  id: number;
  nome: string;
  tipoId: number;
  tipo: Tipo;
  descricao: string | null;
  telefone: string;
  ativo: boolean;
}

export default function ServicosPublicoPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [servicos, setServicos] = useState<Servico[]>([]);
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [loading, setLoading] = useState(true);

  async function carregar() {
    try {
      setLoading(true);
      const res = await fetch(`/api/publico/servicos?slug=${encodeURIComponent(slug)}`);
      if (!res.ok) {
        setServicos([]);
        return;
      }
      const dados: Servico[] = await res.json();
      setServicos(dados); // já vem filtrado com ativo: true e pela igreja (slug)
    } catch {
      setServicos([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!slug) return;
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const servicosFiltrados = useMemo(() => {
    const termo = termoPesquisa.trim().toLowerCase();
    if (!termo) return servicos;

    return servicos.filter(s => {
      return (
        s.nome.toLowerCase().includes(termo) ||
        s.tipo.nome.toLowerCase().includes(termo) ||
        (s.descricao && s.descricao.toLowerCase().includes(termo)) ||
        s.telefone.includes(termo)
      );
    });
  }, [servicos, termoPesquisa]);

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-white">
            Serviços dos Irmãos
          </h1>
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
            placeholder="Pesquisar por nome, tipo, descrição ou telefone..."
            value={termoPesquisa}
            onChange={e => setTermoPesquisa(e.target.value)}
            className="w-full border border-slate-700 bg-slate-900 text-slate-100 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Lista */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl shadow divide-y divide-slate-800">
          {loading ? (
            <p className="text-slate-400 text-sm text-center py-6">
              Carregando serviços...
            </p>
          ) : servicosFiltrados.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-6">
              Nenhum serviço encontrado.
            </p>
          ) : (
            servicosFiltrados.map(s => (
              <div
                key={s.id}
                className="px-4 py-3 flex items-start justify-between gap-3"
              >
                <div>
                  <p className="font-semibold text-slate-100 text-sm">
                    {s.nome}
                  </p>
                  <p className="text-purple-300 text-[11px] font-medium mt-0.5">
                    {s.tipo.nome}
                  </p>
                  {s.descricao && (
                    <p className="text-slate-400 text-xs mt-0.5">
                      {s.descricao}
                    </p>
                  )}
                  <p className="text-slate-500 text-xs mt-0.5">
                    {s.telefone}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}