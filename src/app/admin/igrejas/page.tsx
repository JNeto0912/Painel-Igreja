'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Igreja = {
  id: number;
  nome: string;
  endereco?: string | null;
  cidade?: string | null;
  estado?: string | null;   // era 'uf', agora é 'estado'
  cep?: string | null;
  telefone?: string | null;
  email?: string | null;
  ativo?: boolean;
};

export default function AdminIgrejasPage() {
  const [igrejas, setIgrejas] = useState<Igreja[]>([]);
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cep, setCep] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [erro, setErro] = useState('');
  const [msg, setMsg] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function carregar() {
    setCarregando(true);
    try {
      const res = await fetch('/api/igrejas');
      const data = await res.json();
      setIgrejas(Array.isArray(data) ? data : []);
    } catch {
      setErro('Erro ao carregar igrejas.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function limparForm() {
    setNome('');
    setEndereco('');
    setCidade('');
    setEstado('');
    setCep('');
    setTelefone('');
    setEmail('');
    setEditandoId(null);
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setMsg('');

    if (!nome.trim()) {
      setErro('Nome da igreja é obrigatório.');
      return;
    }

    try {
      const method = editandoId ? 'PUT' : 'POST';
      const res = await fetch('/api/igrejas', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editandoId,
          nome,
          endereco,
          cidade,
          estado,
          cep,
          telefone,
          email,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErro(data.error || 'Erro ao salvar igreja.');
        return;
      }

      setMsg(editandoId ? 'Igreja atualizada com sucesso.' : 'Igreja criada com sucesso.');
      limparForm();
      carregar();
    } catch {
      setErro('Erro ao salvar igreja.');
    }
  }

  function handleEditar(i: Igreja) {
    setEditandoId(i.id);
    setNome(i.nome);
    setEndereco(i.endereco || '');
    setCidade(i.cidade || '');
    setEstado(i.estado || '');
    setCep(i.cep || '');
    setTelefone(i.telefone || '');
    setEmail(i.email || '');
    setErro('');
    setMsg('');
  }

  async function handleExcluir(id: number) {
    if (!confirm('Tem certeza que deseja excluir esta igreja?')) return;
    setErro('');
    setMsg('');

    try {
      const res = await fetch('/api/igrejas', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErro(data.error || 'Erro ao excluir igreja.');
        return;
      }

      setMsg('Igreja excluída.');
      carregar();
    } catch {
      setErro('Erro ao excluir igreja.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="w-full flex justify-between items-center px-6 py-4 bg-white shadow-sm">
        <h1 className="text-xl font-semibold text-gray-800">
          Administrar Igrejas
        </h1>
        <Link href="/admin" className="text-sm text-blue-600 hover:underline">
          ← Voltar para Admin
        </Link>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 space-y-6">
        {/* FORMULÁRIO */}
        <section className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">
            {editandoId ? 'Editar igreja' : 'Adicionar nova igreja'}
          </h2>

          {erro && <p className="text-sm text-red-600">{erro}</p>}
          {msg && <p className="text-sm text-green-600">{msg}</p>}

          <form onSubmit={handleSalvar} className="grid gap-3 md:grid-cols-2">
            {/* Nome */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome *
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Endereço */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Endereço
              </label>
              <input
                type="text"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Cidade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cidade
              </label>
              <input
                type="text"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado (UF)
              </label>
              <input
                type="text"
                value={estado}
                onChange={(e) => setEstado(e.target.value.toUpperCase())}
                maxLength={2}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* CEP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CEP
              </label>
              <input
                type="text"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Botões */}
            <div className="md:col-span-2 flex items-center gap-3 mt-1">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg text-sm transition"
              >
                {editandoId ? 'Salvar alterações' : 'Adicionar igreja'}
              </button>
              {editandoId && (
                <button
                  type="button"
                  onClick={limparForm}
                  className="text-sm text-gray-500 hover:text-gray-800"
                >
                  Cancelar edição
                </button>
              )}
            </div>
          </form>
        </section>

        {/* LISTA */}
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="font-semibold text-gray-800 mb-4">
            Igrejas cadastradas
          </h2>

          {carregando && (
            <p className="text-sm text-zinc-500">Carregando igrejas...</p>
          )}

          {!carregando && igrejas.length === 0 && (
            <p className="text-sm text-zinc-500">Nenhuma igreja cadastrada.</p>
          )}

          <ul className="divide-y divide-gray-100">
            {igrejas.map((i) => (
              <li
                key={i.id}
                className="flex flex-col md:flex-row md:items-center justify-between py-3 gap-2"
              >
                <div>
                  <p className="font-medium text-gray-800">{i.nome}</p>
                  <p className="text-xs text-zinc-500">
                    {[i.endereco, i.cidade, i.estado, i.cep]
                      .filter(Boolean)
                      .join(' - ')}
                  </p>
                  {(i.telefone || i.email) && (
                    <p className="text-xs text-zinc-400">
                      {[i.telefone, i.email].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditar(i)}
                    className="text-xs px-3 py-1 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-800"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleExcluir(i.id)}
                    className="text-xs px-3 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700"
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}