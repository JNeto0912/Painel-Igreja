'use client';

import { useEffect, useState } from 'react';

type Aviso = {
  id: number;
  titulo: string;
  descricao: string | null;
  imagemUrl: string;
  dataInicio: string;
  dataFim: string;
  ordem: number;
  ativo: boolean;
};

// Utilitários de data com fuso São Paulo
function formatarDataHoraBR(data: Date | string) {
  return new Date(data).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Converte Date/ISO para string "YYYY-MM-DDTHH:mm" para input datetime-local
function toInputDateTimeLocal(value: Date | string) {
  const d = new Date(value);
  const sp = new Date(d.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${sp.getFullYear()}-${pad(sp.getMonth() + 1)}-${pad(sp.getDate())}T${pad(sp.getHours())}:${pad(sp.getMinutes())}`;
}

export default function AdminAvisosPage() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [ordem, setOrdem] = useState(0);
  const [ativo, setAtivo] = useState(true);
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [loadingSalvar, setLoadingSalvar] = useState(false);
  const [deletandoId, setDeletandoId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    carregarAvisos();
  }, []);

  async function carregarAvisos() {
    try {
      const res = await fetch('/api/avisos');
      if (!res.ok) { setAvisos([]); return; }
      const text = await res.text();
      if (!text) { setAvisos([]); return; }
      const data = JSON.parse(text);
      setAvisos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao carregar avisos:', err);
      setAvisos([]);
    }
  }

  function handleImagemChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) { setImagemFile(null); setImagemPreview(null); return; }
    setImagemFile(file);
    setImagemPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!titulo || !dataInicio || !dataFim) {
      setError('Preencha título, data início e data fim.');
      return;
    }
    if (!imagemFile) {
      setError('Selecione uma imagem para o aviso.');
      return;
    }

    try {
      setLoadingSalvar(true);

      const formData = new FormData();
      formData.append('file', imagemFile);
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!uploadRes.ok) throw new Error('Falha ao enviar imagem');
      const { url: imagemUrl } = await uploadRes.json();

      const res = await fetch('/api/avisos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo,
          descricao,
          imagemUrl,
          dataInicio,
          dataFim,
          ordem,
          ativo,
        }),
      });
      if (!res.ok) throw new Error('Falha ao salvar aviso');

      setSuccess('Aviso cadastrado com sucesso!');
      setTitulo('');
      setDescricao('');
      setDataInicio('');
      setDataFim('');
      setOrdem(0);
      setAtivo(true);
      setImagemFile(null);
      setImagemPreview(null);
      await carregarAvisos();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar aviso');
    } finally {
      setLoadingSalvar(false);
    }
  }

  async function handleDeletar(id: number) {
    if (!window.confirm('Tem certeza que deseja excluir este aviso?')) return;
    try {
      setDeletandoId(id);
      const res = await fetch(`/api/avisos/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Falha ao excluir aviso');
      setAvisos(prev => prev.filter(a => a.id !== id));
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir aviso');
    } finally {
      setDeletandoId(null);
    }
  }

  // Classifica o status do aviso para exibir badge
  function statusAviso(aviso: Aviso) {
    if (!aviso.ativo) return 'inativo';
    const agora = new Date();
    const inicio = new Date(aviso.dataInicio);
    const fim = new Date(aviso.dataFim);
    if (agora < inicio) return 'agendado';
    if (agora > fim) return 'encerrado';
    return 'ativo';
  }

  const badgeStatus = {
    ativo: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50',
    agendado: 'bg-sky-900/60 text-sky-300 border-sky-700/50',
    encerrado: 'bg-zinc-800 text-zinc-400 border-zinc-600/50',
    inativo: 'bg-red-900/60 text-red-300 border-red-700/50',
  };

  const labelStatus = {
    ativo: '● ativo',
    agendado: '◷ agendado',
    encerrado: '✕ encerrado',
    inativo: '○ inativo',
  };

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">📢 Avisos</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Cadastre e gerencie os avisos exibidos no display
            </p>
          </div>
          <a
            href="/admin"
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            ← Voltar ao painel
          </a>
        </div>

        {/* FORMULÁRIO */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl shadow-xl shadow-black/30 p-6 md:p-8">
          <h2 className="text-base font-semibold text-slate-200 mb-5">
            Novo aviso
          </h2>

          {error && (
            <div className="mb-4 flex items-center gap-2 text-sm text-red-400 bg-red-950/50 border border-red-700/60 rounded-lg px-4 py-3">
              <span>⚠️</span>
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 flex items-center gap-2 text-sm text-emerald-400 bg-emerald-950/50 border border-emerald-700/60 rounded-lg px-4 py-3">
              <span>✅</span>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Título
              </label>
              <input
                type="text"
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                placeholder="Ex: Culto especial domingo às 18h"
                className="w-full rounded-lg bg-slate-950/70 border border-slate-700 text-slate-50 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-500 transition"
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Descrição <span className="text-slate-500 font-normal">(opcional)</span>
              </label>
              <textarea
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
                rows={3}
                placeholder="Detalhes sobre o aviso..."
                className="w-full rounded-lg bg-slate-950/70 border border-slate-700 text-slate-50 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-500 transition resize-none"
              />
            </div>

            {/* Datas e Ordem */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Data início
                </label>
                <input
                  type="datetime-local"
                  value={dataInicio}
                  onChange={e => setDataInicio(e.target.value)}
                  className="w-full rounded-lg bg-slate-950/70 border border-slate-700 text-slate-50 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Data fim
                </label>
                <input
                  type="datetime-local"
                  value={dataFim}
                  onChange={e => setDataFim(e.target.value)}
                  className="w-full rounded-lg bg-slate-950/70 border border-slate-700 text-slate-50 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Ordem
                </label>
                <input
                  type="number"
                  value={ordem}
                  onChange={e => setOrdem(Number(e.target.value))}
                  className="w-full rounded-lg bg-slate-950/70 border border-slate-700 text-slate-50 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>

            {/* Ativo */}
            <div className="flex items-center gap-3">
              <input
                id="ativo"
                type="checkbox"
                checked={ativo}
                onChange={e => setAtivo(e.target.checked)}
                className="h-4 w-4 cursor-pointer accent-blue-500"
              />
              <label htmlFor="ativo" className="text-sm text-slate-300 cursor-pointer">
                Aviso ativo
              </label>
            </div>

            {/* Imagem */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Imagem do aviso
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImagemChange}
                className="text-sm text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-700 file:text-slate-200 hover:file:bg-slate-600 file:cursor-pointer"
              />
              {imagemPreview && (
                <img
                  src={imagemPreview}
                  alt="Pré-visualização"
                  className="mt-3 max-h-40 rounded-xl border border-slate-700 shadow-lg"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={loadingSalvar}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:bg-blue-900 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-blue-900/30"
            >
              {loadingSalvar ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Salvando...
                </>
              ) : (
                <>
                  <span>💾</span>
                  Salvar aviso
                </>
              )}
            </button>
          </form>
        </div>

        {/* LISTA DE AVISOS */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl shadow-xl shadow-black/30 p-6 md:p-8">
          <h2 className="text-base font-semibold text-slate-200 mb-5">
            Avisos cadastrados{' '}
            {avisos.length > 0 && (
              <span className="ml-1 text-xs font-normal bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                {avisos.length}
              </span>
            )}
          </h2>

          {avisos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-500">
              <span className="text-4xl mb-3">📢</span>
              <p className="text-sm">Nenhum aviso cadastrado ainda.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {avisos.map(aviso => {
                const status = statusAviso(aviso);
                return (
                  <li
                    key={aviso.id}
                    className="flex gap-4 items-center bg-slate-800/50 border border-slate-700/60 rounded-xl p-3.5 hover:border-slate-600 transition-colors"
                  >
                    {/* Imagem */}
                    <div className="w-28 h-20 bg-slate-700 rounded-lg overflow-hidden flex-shrink-0">
                      {aviso.imagemUrl && (
                        <img
                          src={aviso.imagemUrl}
                          alt={aviso.titulo}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm text-slate-100">
                          {aviso.titulo}
                        </p>
                        <span
                          className={`text-[10px] font-medium border px-1.5 py-0.5 rounded-full ${badgeStatus[status]}`}
                        >
                          {labelStatus[status]}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 mt-1">
                        🗓 {formatarDataHoraBR(aviso.dataInicio)} → {formatarDataHoraBR(aviso.dataFim)}
                      </p>

                      <p className="text-xs text-slate-500 mt-0.5">
                        ordem {aviso.ordem}
                      </p>

                      {aviso.descricao && (
                        <p className="text-xs text-slate-400 mt-1 truncate">
                          {aviso.descricao}
                        </p>
                      )}
                    </div>

                    {/* Botão excluir */}
                    <button
                      onClick={() => handleDeletar(aviso.id)}
                      disabled={deletandoId === aviso.id}
                      className="flex-shrink-0 px-3 py-1.5 bg-red-600/80 hover:bg-red-600 disabled:bg-red-900 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      {deletandoId === aviso.id ? '...' : 'Excluir'}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}