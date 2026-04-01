'use client';

import { useEffect, useState } from 'react';

type Membro = {
  id: number;
  nome: string;
  dataNascimento: string;
  fotoUrl: string | null;
  ativo: boolean;
};

// Utilitário de data com fuso São Paulo
function formatarDataBR(data: Date | string) {
  return new Date(data).toLocaleDateString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function AdminMembrosPage() {
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [ativo, setAtivo] = useState(true);
  const [membros, setMembros] = useState<Membro[]>([]);
  const [loadingSalvar, setLoadingSalvar] = useState(false);
  const [deletandoId, setDeletandoId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    carregarMembros();
  }, []);

  async function carregarMembros() {
    try {
      const res = await fetch('/api/membros');
      if (!res.ok) { setMembros([]); return; }
      const text = await res.text();
      if (!text) { setMembros([]); return; }
      const data = JSON.parse(text);
      setMembros(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao carregar membros:', err);
      setMembros([]);
    }
  }

  function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) { setFotoFile(null); setFotoPreview(null); return; }
    setFotoFile(file);
    setFotoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!nome || !dataNascimento) {
      setError('Preencha nome e data de nascimento.');
      return;
    }

    try {
      setLoadingSalvar(true);
      let fotoUrl: string | null = null;

      if (fotoFile) {
        const formData = new FormData();
        formData.append('file', fotoFile);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        if (!uploadRes.ok) throw new Error('Falha ao enviar foto');
        const uploadData = await uploadRes.json();
        fotoUrl = uploadData.url;
      }

      const res = await fetch('/api/membros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, dataNascimento, fotoUrl, ativo }),
      });
      if (!res.ok) throw new Error('Falha ao salvar membro');

      setSuccess('Membro cadastrado com sucesso!');
      setNome('');
      setDataNascimento('');
      setFotoFile(null);
      setFotoPreview(null);
      setAtivo(true);
      await carregarMembros();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar membro');
    } finally {
      setLoadingSalvar(false);
    }
  }

  async function handleDeletar(id: number) {
    if (!window.confirm('Tem certeza que deseja excluir este membro?')) return;
    try {
      setDeletandoId(id);
      const res = await fetch(`/api/membros/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Falha ao excluir membro');
      setMembros(prev => prev.filter(m => m.id !== id));
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir membro');
    } finally {
      setDeletandoId(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">👥 Membros</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Cadastre e gerencie os membros da sua igreja
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
            Novo membro
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
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Nome
              </label>
              <input
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Nome completo do membro"
                className="w-full rounded-lg bg-slate-950/70 border border-slate-700 text-slate-50 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-500 transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Data de nascimento
                </label>
                <input
                  type="date"
                  value={dataNascimento}
                  onChange={e => setDataNascimento(e.target.value)}
                  className="w-full rounded-lg bg-slate-950/70 border border-slate-700 text-slate-50 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                />
              </div>

              <div className="flex items-center gap-3 md:mt-7">
                <div className="relative inline-flex items-center">
                  <input
                    id="ativo"
                    type="checkbox"
                    checked={ativo}
                    onChange={e => setAtivo(e.target.checked)}
                    className="h-4 w-4 cursor-pointer accent-emerald-500"
                  />
                </div>
                <label htmlFor="ativo" className="text-sm text-slate-300 cursor-pointer">
                  Membro ativo
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Foto <span className="text-slate-500 font-normal">(opcional)</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFotoChange}
                className="text-sm text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-700 file:text-slate-200 hover:file:bg-slate-600 file:cursor-pointer"
              />
              {fotoPreview && (
                <img
                  src={fotoPreview}
                  alt="Pré-visualização"
                  className="mt-3 h-24 w-24 object-cover rounded-full border-2 border-emerald-500/40 shadow-lg"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={loadingSalvar}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:bg-emerald-900 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-emerald-900/30"
            >
              {loadingSalvar ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Salvando...
                </>
              ) : (
                <>
                  <span>💾</span>
                  Salvar membro
                </>
              )}
            </button>
          </form>
        </div>

        {/* LISTAGEM */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl shadow-xl shadow-black/30 p-6 md:p-8">
          <h2 className="text-base font-semibold text-slate-200 mb-5">
            Membros cadastrados{' '}
            {membros.length > 0 && (
              <span className="ml-1 text-xs font-normal bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                {membros.length}
              </span>
            )}
          </h2>

          {membros.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-500">
              <span className="text-4xl mb-3">👥</span>
              <p className="text-sm">Nenhum membro cadastrado ainda.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {membros.map(membro => (
                <li
                  key={membro.id}
                  className="flex gap-4 items-center bg-slate-800/50 border border-slate-700/60 rounded-xl p-3.5 hover:border-slate-600 transition-colors"
                >
                  {/* Foto */}
                  <div className="w-14 h-14 rounded-full bg-slate-700 overflow-hidden flex-shrink-0 flex items-center justify-center border-2 border-slate-600">
                    {membro.fotoUrl ? (
                      <img
                        src={membro.fotoUrl}
                        alt={membro.nome}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">👤</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-100">
                      {membro.nome}{' '}
                      {!membro.ativo && (
                        <span className="ml-1 text-[10px] font-normal bg-red-900/60 text-red-300 border border-red-700/50 px-1.5 py-0.5 rounded-full">
                          inativo
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      🎂 Nascimento: {formatarDataBR(membro.dataNascimento)}
                    </p>
                  </div>

                  {/* Botão excluir */}
                  <button
                    onClick={() => handleDeletar(membro.id)}
                    disabled={deletandoId === membro.id}
                    className="flex-shrink-0 px-3 py-1.5 bg-red-600/80 hover:bg-red-600 disabled:bg-red-900 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    {deletandoId === membro.id ? '...' : 'Excluir'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}