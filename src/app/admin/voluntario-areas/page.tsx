'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Area {
  id: number;
  nome: string;
}

export default function VoluntarioAreasPage() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editNome, setEditNome] = useState('');

  async function carregar() {
    const res = await fetch('/api/voluntario-areas');
    const data = await res.json();
    setAreas(data);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function adicionar() {
    if (!nome.trim()) return;
    setErro('');
    const res = await fetch('/api/voluntario-areas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome }),
    });

    if (res.ok) {
      setNome('');
      carregar();
    } else {
      const data = await res.json();
      setErro(data.error || 'Erro ao adicionar área');
    }
  }

  async function salvarEdicao(id: number) {
    if (!editNome.trim()) return;
    const res = await fetch(`/api/voluntario-areas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: editNome }),
    });

    if (res.ok) {
      setEditandoId(null);
      setEditNome('');
      carregar();
    }
  }

  async function excluir(id: number) {
    if (!confirm('Excluir esta área?')) return;

    const res = await fetch(`/api/voluntario-areas/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      carregar();
    } else {
      const data = await res.json();
      alert(data.error || 'Erro ao excluir área');
    }
  }

  return (
    <div className="min-h-screen bg-zinc-100 p-6">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-zinc-800">
            Áreas de Voluntariado
          </h1>
          <Link
            href="/admin"
            className="text-sm text-zinc-500 hover:text-zinc-700"
          >
            ← Voltar
          </Link>
        </div>

        {/* Formulário de nova área */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <h2 className="font-semibold text-zinc-700 mb-3">Nova área</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ex: Louvor, Infantil, Recepção..."
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && adicionar()}
              className="flex-1 border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={adicionar}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Adicionar
            </button>
          </div>
          {erro && <p className="text-red-500 text-sm mt-2">{erro}</p>}
        </div>

        {/* Lista de áreas */}
        <div className="bg-white rounded-xl shadow divide-y divide-zinc-100">
          {areas.length === 0 && (
            <p className="text-zinc-400 text-sm text-center py-6">
              Nenhuma área cadastrada ainda.
            </p>
          )}
          {areas.map((area) => (
            <div key={area.id} className="flex items-center gap-3 px-4 py-3">
              {editandoId === area.id ? (
                <>
                  <input
                    type="text"
                    value={editNome}
                    onChange={(e) => setEditNome(e.target.value)}
                    className="flex-1 border border-zinc-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => salvarEdicao(area.id)}
                    className="text-green-600 hover:text-green-800 text-sm font-semibold"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => {
                      setEditandoId(null);
                      setEditNome('');
                    }}
                    className="text-zinc-400 hover:text-zinc-600 text-sm"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-zinc-700 text-sm">
                    {area.nome}
                  </span>
                  <button
                    onClick={() => {
                      setEditandoId(area.id);
                      setEditNome(area.nome);
                    }}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => excluir(area.id)}
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