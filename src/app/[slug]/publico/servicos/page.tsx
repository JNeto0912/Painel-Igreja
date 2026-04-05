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
  const [erro, setErro] = useState<string | null>(null);

  async function carregar() {
    try {
      setLoading(true);
      setErro(null);

      // ✅ manda ?slug= que agora a API entende
      const res = await fetch(`/api/publico/servicos?slug=${encodeURIComponent(slug)}`);

      if (!res.ok) {
        setErro('Não foi possível carregar os serviços.');
        setServicos([]);
        return;
      }

      const dados: Servico[] = await res.json();
      setServicos(dados);
    } catch {
      setErro('Erro de conexão. Tente novamente.');
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

    return servicos.filter(s =>
      s.nome.toLowerCase().includes(termo) ||
      s.tipo.nome.toLowerCase().includes(termo) ||
      (s.descricao && s.descricao.toLowerCase().includes(termo)) ||
      s.telefone.includes(termo)
    );
  }, [servicos, termoPesquisa]);

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-2xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              🤝 Serviços dos Irmãos
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Igreja: <span className="text-slate-400">{slug}</span>
            </p>
          </div>
          <Link
            href={`/admin`}
            className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            ← Voltar
          </Link>
        </div>

        {/* PESQUISA */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Pesquisar por nome, tipo, descrição ou telefone..."
            value={termoPesquisa}
            onChange={e => setTermoPesquisa(e.target.value)}
            className="w-full border border-slate-700 bg-slate-900 text-slate-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-slate-500"
          />
        </div>

        {/* ERRO */}
        {erro && (
          <div className="mb-4 text-sm text-red-400 bg-red-950/50 border border-red-700/60 rounded-lg px-4 py-3">
            ⚠️ {erro}
          </div>
        )}

        {/* LISTA */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl shadow divide-y divide-slate-800">
          {loading ? (
            <p className="text-slate-400 text-sm text-center py-8">
              Carregando serviços...
            </p>
          ) : servicosFiltrados.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">
              Nenhum serviço encontrado.
            </p>
          ) : (
            servicosFiltrados.map(s => (
              <div
                key={s.id}
                className="px-4 py-4 flex items-start justify-between gap-3 hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-100 text-sm">
                    {s.nome}
                  </p>
                  <p className="text-purple-300 text-[11px] font-medium mt-0.5">
                    {s.tipo.nome}
                  </p>
                  {s.descricao && (
                    <p className="text-slate-400 text-xs mt-1">
                      {s.descricao}
                    </p>
                  )}
                  {s.telefone && (
                    <p className="text-slate-500 text-xs mt-1">
                      📞 {s.telefone}
                    </p>
                  )}
                </div>

                {/* Botão WhatsApp */}
                {s.telefone && (
                  <a
                    href={`https://wa.me/55${s.telefone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    <span>📱</span>
                    Zap
                  </a>
                )}
              </div>
            ))
          )}
        </div>

        {/* RODAPÉ */}
        {!loading && servicosFiltrados.length > 0 && (
          <p className="text-center text-xs text-slate-600 mt-4">
            {servicosFiltrados.length} serviço{servicosFiltrados.length !== 1 ? 's' : ''} encontrado{servicosFiltrados.length !== 1 ? 's' : ''}
          </p>
        )}

      </div>
    </div>
  );
}