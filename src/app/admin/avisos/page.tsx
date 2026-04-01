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

    if (!res.ok) {
      console.error('Erro ao buscar avisos:', res.status);
      setAvisos([]);
      return;
    }

    const text = await res.text();
    if (!text) {
      setAvisos([]);
      return;
    }

    const data = JSON.parse(text);
    setAvisos(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error('Erro ao carregar avisos:', err);
    setAvisos([]);
  }
}

  function handleImagemChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setImagemFile(null);
      setImagemPreview(null);
      return;
    }
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

      // 1) upload da imagem
      const formData = new FormData();
      formData.append('file', imagemFile);
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!uploadRes.ok) throw new Error('Falha ao enviar imagem');
      const { url: imagemUrl } = await uploadRes.json();

      // 2) salvar aviso no banco
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

  return (
    <div className="min-h-screen bg-zinc-100 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* FORMULÁRIO */}
        <div className="bg-white rounded-xl shadow p-6 md:p-8">
          <h1 className="text-2xl font-bold mb-6 text-zinc-800">
            Cadastro de Avisos
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
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Título
              </label>
              <input
                type="text"
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Descrição
              </label>
              <textarea
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
                rows={3}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Data início
                </label>
                <input
                  type="datetime-local"
                  value={dataInicio}
                  onChange={e => setDataInicio(e.target.value)}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Data fim
                </label>
                <input
                  type="datetime-local"
                  value={dataFim}
                  onChange={e => setDataFim(e.target.value)}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Ordem
                </label>
                <input
                  type="number"
                  value={ordem}
                  onChange={e => setOrdem(Number(e.target.value))}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
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

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Imagem do aviso
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImagemChange}
                className="text-sm"
              />
              {imagemPreview && (
                <img
                  src={imagemPreview}
                  alt="Pré-visualização"
                  className="mt-2 max-h-40 rounded-lg border border-zinc-200"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={loadingSalvar}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {loadingSalvar ? 'Salvando...' : 'Salvar aviso'}
            </button>
          </form>
        </div>

        {/* LISTA DE AVISOS */}
        <div className="bg-white rounded-xl shadow p-6 md:p-8">
          <h2 className="text-xl font-bold mb-4 text-zinc-800">
            Avisos cadastrados
          </h2>

          {avisos.length === 0 && (
            <p className="text-sm text-zinc-500">Nenhum aviso cadastrado.</p>
          )}

          <ul className="space-y-3">
            {avisos.map(aviso => (
              <li
                key={aviso.id}
                className="flex gap-3 items-center border border-zinc-200 rounded-lg p-3"
              >
                <div className="w-28 h-20 bg-zinc-100 rounded-lg overflow-hidden flex-shrink-0">
                  {aviso.imagemUrl && (
                    <img
                      src={aviso.imagemUrl}
                      alt={aviso.titulo}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-zinc-800">
                    {aviso.titulo}{' '}
                    {!aviso.ativo && (
                      <span className="text-xs text-red-500 font-normal">
                        (inativo)
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {new Date(aviso.dataInicio).toLocaleString('pt-BR')} →{' '}
                    {new Date(aviso.dataFim).toLocaleString('pt-BR')}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    ordem {aviso.ordem}
                  </p>
                  {aviso.descricao && (
                    <p className="text-xs text-zinc-600 mt-1 truncate">
                      {aviso.descricao}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleDeletar(aviso.id)}
                  disabled={deletandoId === aviso.id}
                  className="flex-shrink-0 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  {deletandoId === aviso.id ? 'Excluindo...' : 'Excluir'}
                </button>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}