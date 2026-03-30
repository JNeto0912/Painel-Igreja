'use client';

import { useEffect, useState } from 'react';

interface Tipo {
  id: number;
  nome: string;
}

interface Servico {
  id: number;
  nome: string;
  tipo: Tipo;
  descricao: string | null;
  telefone: string;
}

export default function PesquisaServicosPage() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [tipos, setTipos] = useState<Tipo[]>([]);
  const [busca, setBusca] = useState('');
  const [tipoId, setTipoId] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    fetch('/api/tipos')
      .then((r) => r.json())
      .then(setTipos)
      .catch(() => setTipos([]));

    pesquisar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function pesquisar() {
    setCarregando(true);
    const params = new URLSearchParams();
    if (busca) params.set('nome', busca);
    if (tipoId) params.set('tipoId', tipoId);

    const res = await fetch(`/api/servicos?${params.toString()}`);
    const data = await res.json();
    setServicos(data);
    setCarregando(false);
  }

  function formatarTelefone(telefone: string) {
    const digits = telefone.replace(/\D/g, '');
    if (digits.length < 10) return telefone;
    if (digits.length === 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  function linkWhatsApp(telefone: string) {
    const digits = telefone.replace(/\D/g, '');
    return `https://wa.me/55${digits}`;
  }

  return (
    <div className="min-h-screen bg-zinc-100 p-6">
      <div className="max-w-2xl mx-auto">

        {/* Título */}
        <h1 className="text-2xl font-bold text-zinc-800 mb-1">
          Serviços dos Irmãos
        </h1>
        <p className="text-zinc-500 text-sm mb-4">
          Encontre profissionais da nossa comunidade.
        </p>

        {/* Aviso importante */}
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 mb-6">
          <p className="text-yellow-800 font-semibold text-sm mb-2">
            ⚠️ Aviso importante
          </p>
          <p className="text-yellow-700 text-sm mb-2">
            Esta lista tem o objetivo de divulgar serviços oferecidos por membros e
            frequentadores da igreja, facilitando o contato entre irmãos.
          </p>
          <p className="text-yellow-700 text-sm mb-2">
            A igreja não realiza intermediação, não recebe qualquer tipo de comissão
            e não se responsabiliza pela qualidade, prazos, valores ou resultados
            dos serviços prestados.
          </p>
          <p className="text-yellow-700 text-sm">
            Toda contratação é feita diretamente entre o irmão que contrata e o
            prestador de serviço, sendo de responsabilidade exclusiva das partes
            envolvidas.
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col gap-3">
          <input
            type="text"
            placeholder="Pesquisar por nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && pesquisar()}
            className="border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <div className="flex gap-2">
            <select
              value={tipoId}
              onChange={(e) => setTipoId(e.target.value)}
              className="flex-1 border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Todos os tipos</option>
              {tipos.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome}
                </option>
              ))}
            </select>
            <button
              onClick={pesquisar}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors"
            >
              Buscar
            </button>
          </div>
        </div>

        {/* Resultados */}
        {carregando ? (
          <p className="text-center text-zinc-400 text-sm py-6">Carregando...</p>
        ) : servicos.length === 0 ? (
          <p className="text-center text-zinc-400 text-sm py-6">
            Nenhum serviço encontrado.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {servicos.map((s) => (
              <div key={s.id} className="bg-white rounded-xl shadow px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-zinc-800">{s.nome}</p>
                    <span className="inline-block bg-purple-100 text-purple-700 text-xs font-medium px-2 py-0.5 rounded-full mt-1">
                      {s.tipo.nome}
                    </span>
                    {s.descricao && (
                      <p className="text-zinc-500 text-sm mt-2">{s.descricao}</p>
                    )}
                    <p className="text-zinc-500 text-xs mt-2">
                      {formatarTelefone(s.telefone)}
                    </p>
                  </div>
                  <a
                    href={linkWhatsApp(s.telefone)}
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