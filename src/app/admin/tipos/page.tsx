'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Tipo {
  id: number;
  nome: string;
}

export default function TiposPage() {
  const [tipos, setTipos] = useState<Tipo[]>([]);
  const [nome, setNome] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editNome, setEditNome] = useState('');
  const [erro, setErro] = useState('');

  async function carregar() {
    const res = await fetch('/api/tipos');
    const data = await res.json();
    setTipos(data);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function adicionar() {
    if (!nome.trim()) return;
    setErro('');
    const res = await fetch('/api/tipos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome }),
    });
    if (res.ok) {
      setNome('');
      carregar();
    } else {
      const data = await res.json();
      setErro(data.error || 'Erro ao adicionar');
    }
  }

  async function salvarEdicao(id: number) {
    const res = await fetch(`/api/tipos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: editNome }),
    });
    if (res.ok) {
      setEditandoId(null);
      carregar();
    }
  }

  async function excluir(id: number) {
    if (!confirm('Excluir este tipo?')) return;
    const res = await fetch(`/api/tipos/${id}`, { method: 'DELETE' });
    if (res.ok) {
      carregar();
    } else {
      const data = await res.json();
      alert(data.error || 'Erro ao excluir');
    }
  }

  return (
    <div className="min-h-screen bg-zinc-100 p-6">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-zinc-800">Tipos de Serviço</h1>
          <Link
            href="/admin"
            className="text-sm text-zinc-500 hover:text-zinc-700"
          >
            ← Voltar
          </Link>
        </div>

        {/* Formulário de novo tipo */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <h2 className="font-semibold text-zinc-700 mb-3">Novo Tipo</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ex: Eletricista"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && adicionar()}
              className="flex-1 border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={adicionar}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Adicionar
            </button>
          </div>
          {erro && <p className="text-red-500 text-sm mt-2">{erro}</p>}
        </div>

        {/* Lista de tipos */}
        <div className="bg-white rounded-xl shadow divide-y divide-zinc-100">
          {tipos.length === 0 && (
            <p className="text-zinc-400 text-sm text-center py-6">
              Nenhum tipo cadastrado ainda.
            </p>
          )}
          {tipos.map((tipo) => (
            <div key={tipo.id} className="flex items-center gap-3 px-4 py-3">
              {editandoId === tipo.id ? (
                <>
                  <input
                    type="text"
                    value={editNome}
                    onChange={(e) => setEditNome(e.target.value)}
                    className="flex-1 border border-zinc-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={() => salvarEdicao(tipo.id)}
                    className="text-green-600 hover:text-green-800 text-sm font-semibold"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => setEditandoId(null)}
                    className="text-zinc-400 hover:text-zinc-600 text-sm"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-zinc-700 text-sm">{tipo.nome}</span>
                  <button
                    onClick={() => {
                      setEditandoId(tipo.id);
                      setEditNome(tipo.nome);
                    }}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => excluir(tipo.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Excluir
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}