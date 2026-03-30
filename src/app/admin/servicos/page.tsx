'use client';

import { useEffect, useState } from 'react';
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

export default function ServicosAdminPage() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [tipos, setTipos] = useState<Tipo[]>([]);
  const [form, setForm] = useState({
    nome: '',
    tipoId: '',
    descricao: '',
    telefone: '',
  });
  const [editandoId, setEditandoId] = useState<number | null>(null);

  async function carregar() {
    const [sRes, tRes] = await Promise.all([
      fetch('/api/servicos'),
      fetch('/api/tipos'),
    ]);
    setServicos(await sRes.json());
    setTipos(await tRes.json());
  }

  useEffect(() => {
    carregar();
  }, []);

  async function salvar() {
    if (!form.nome || !form.tipoId || !form.telefone) {
      alert('Preencha nome, tipo e telefone.');
      return;
    }

    const method = editandoId ? 'PUT' : 'POST';
    const url = editandoId ? `/api/servicos/${editandoId}` : '/api/servicos';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: form.nome,
        tipoId: Number(form.tipoId),
        descricao: form.descricao || null,
        telefone: form.telefone,
      }),
    });

    if (res.ok) {
      setForm({ nome: '', tipoId: '', descricao: '', telefone: '' });
      setEditandoId(null);
      carregar();
    }
  }

  async function excluir(id: number) {
    if (!confirm('Excluir este serviço?')) return;
    await fetch(`/api/servicos/${id}`, { method: 'DELETE' });
    carregar();
  }

  function editar(s: Servico) {
    setEditandoId(s.id);
    setForm({
      nome: s.nome,
      tipoId: String(s.tipoId),
      descricao: s.descricao || '',
      telefone: s.telefone,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen bg-zinc-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-zinc-800">Serviços dos Irmãos</h1>
          <Link href="/admin" className="text-sm text-zinc-500 hover:text-zinc-700">
            ← Voltar
          </Link>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <h2 className="font-semibold text-zinc-700 mb-4">
            {editandoId ? 'Editando serviço' : 'Novo serviço'}
          </h2>
          <div className="grid grid-cols-1 gap-3">
            <input
              type="text"
              placeholder="Nome da pessoa"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className="border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <select
              value={form.tipoId}
              onChange={(e) => setForm({ ...form, tipoId: e.target.value })}
              className="border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Selecione o tipo de serviço</option>
              {tipos.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Telefone / WhatsApp"
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
              className="border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <textarea
              placeholder="Descrição (opcional)"
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              rows={2}
              className="border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={salvar}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors"
            >
              {editandoId ? 'Salvar alterações' : 'Adicionar'}
            </button>
            {editandoId && (
              <button
                onClick={() => {
                  setEditandoId(null);
                  setForm({ nome: '', tipoId: '', descricao: '', telefone: '' });
                }}
                className="text-zinc-500 hover:text-zinc-700 text-sm px-3"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>

        {/* Lista */}
        <div className="bg-white rounded-xl shadow divide-y divide-zinc-100">
          {servicos.length === 0 && (
            <p className="text-zinc-400 text-sm text-center py-6">
              Nenhum serviço cadastrado ainda.
            </p>
          )}
          {servicos.map((s) => (
            <div key={s.id} className="px-4 py-3 flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-zinc-800 text-sm">{s.nome}</p>
                <p className="text-purple-600 text-xs font-medium">{s.tipo.nome}</p>
                {s.descricao && (
                  <p className="text-zinc-500 text-xs mt-0.5">{s.descricao}</p>
                )}
                <p className="text-zinc-400 text-xs mt-0.5">{s.telefone}</p>
              </div>
              <div className="flex gap-3 shrink-0">
                <button
                  onClick={() => editar(s)}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => excluir(s.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}