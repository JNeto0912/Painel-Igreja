'use client';

import { useEffect, useState } from 'react';

type Membro = {
  id: number;
  nome: string;
  dataNascimento: string;
  fotoUrl: string | null;
  ativo: boolean;
};

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

    if (!res.ok) {
      console.error('Erro ao buscar membros:', res.status);
      setMembros([]);
      return;
    }

    const text = await res.text(); // lê como texto primeiro
    if (!text) {
      setMembros([]);
      return;
    }

    const data = JSON.parse(text); // só faz parse se tiver conteúdo
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
    <div className="min-h-screen bg-zinc-100 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow p-6 md:p-8">
          <h1 className="text-2xl font-bold mb-6 text-zinc-800">
            Cadastro de Membros
          </h1>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Nome</label>
              <input
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Data de nascimento
                </label>
                <input
                  type="date"
                  value={dataNascimento}
                  onChange={e => setDataNascimento(e.target.value)}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex items-center gap-2 md:mt-6">
                <input
                  id="ativo"
                  type="checkbox"
                  checked={ativo}
                  onChange={e => setAtivo(e.target.checked)}
                  className="h-4 w-4 cursor-pointer"
                />
                <label htmlFor="ativo" className="text-sm text-zinc-700 cursor-pointer">
                  Ativo
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Foto (opcional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFotoChange}
                className="text-sm"
              />
              {fotoPreview && (
                <img
                  src={fotoPreview}
                  alt="Pré-visualização"
                  className="mt-2 h-32 w-32 object-cover rounded-full border border-zinc-200"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={loadingSalvar}
              className="px-5 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {loadingSalvar ? 'Salvando...' : 'Salvar membro'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow p-6 md:p-8">
          <h2 className="text-xl font-bold mb-4 text-zinc-800">Membros cadastrados</h2>

          {membros.length === 0 && (
            <p className="text-sm text-zinc-500">Nenhum membro cadastrado.</p>
          )}

          <ul className="space-y-3">
            {membros.map(membro => (
              <li
                key={membro.id}
                className="flex gap-3 items-center border border-zinc-200 rounded-lg p-3"
              >
                <div className="w-16 h-16 rounded-full bg-zinc-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
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

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-zinc-800">
                    {membro.nome}{' '}
                    {!membro.ativo && (
                      <span className="text-xs text-red-500 font-normal">(inativo)</span>
                    )}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Nascimento:{' '}
                    {new Date(membro.dataNascimento).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                <button
                  onClick={() => handleDeletar(membro.id)}
                  disabled={deletandoId === membro.id}
                  className="flex-shrink-0 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  {deletandoId === membro.id ? 'Excluindo...' : 'Excluir'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}