'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

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
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [termoPesquisa, setTermoPesquisa] = useState('');

  async function carregar() {
    const res = await fetch('/api/servicos');
    const dados: Servico[] = await res.json();
    // se quiser exibir só ativos:
    setServicos(dados.filter(s => s.ativo));
  }

  useEffect(() => {
    carregar();
  }, []);

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
    <div className="min-h-screen bg-zinc-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-zinc-800">
            Serviços dos Irmãos
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
            placeholder="Pesquisar por nome, tipo, descrição ou telefone..."
            value={termoPesquisa}
            onChange={(e) => setTermoPesquisa(e.target.value)}
            className="w-full border border-zinc-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Lista */}
        <div className="bg-white rounded-xl shadow divide-y divide-zinc-100">
          {servicosFiltrados.length === 0 ? (
            <p className="text-zinc-400 text-sm text-center py-6">
              Nenhum serviço encontrado.
            </p>
          ) : (
            servicosFiltrados.map((s) => (
              <div
                key={s.id}
                className="px-4 py-3 flex items-start justify-between gap-3"
              >
                <div>
                  <p className="font-semibold text-zinc-800 text-sm">
                    {s.nome}
                  </p>
                  <p className="text-purple-600 text-xs font-medium">
                    {s.tipo.nome}
                  </p>
                  {s.descricao && (
                    <p className="text-zinc-500 text-xs mt-0.5">
                      {s.descricao}
                    </p>
                  )}
                  <p className="text-zinc-400 text-xs mt-0.5">
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