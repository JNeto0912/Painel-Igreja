// src/app/admin/voluntarios/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Area {
  id: number;
  nome: string;
}

interface Voluntario {
  id: number;
  nome: string;
  areaId: number;
  area: Area;
  dons: string | null;
  telefone: string;
  email: string | null;
  disponivel: boolean; // Manter este campo para futura validação
}

export default function VoluntariosAdminPage() {
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [form, setForm] = useState({
    nome: '',
    areaId: '',
    dons: '',
    telefone: '',
    email: '',
  });
  const [editandoId, setEditandoId] = useState<number | null>(null);

  async function carregarDados() {
    const [vRes, aRes] = await Promise.all([
      fetch('/api/voluntarios'),
      fetch('/api/voluntario-areas'),
    ]);
    setVoluntarios(await vRes.json());
    setAreas(await aRes.json());
  }

  useEffect(() => {
    carregarDados();
  }, []); // O useEffect com array vazio executa apenas uma vez ao montar o componente. <sources>[1,2,3,4,5,6,7]</sources>

  async function salvarVoluntario() {
    if (!form.nome || !form.areaId || !form.telefone) {
      alert('Preencha nome, área e telefone.');
      return;
    }

    const method = editandoId ? 'PUT' : 'POST';
    const url = editandoId ? `/api/voluntarios/${editandoId}` : '/api/voluntarios';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: form.nome,
        areaId: Number(form.areaId),
        dons: form.dons || null,
        telefone: form.telefone,
        email: form.email || null,
        disponivel: true, // Ou false, dependendo da lógica inicial de validação
      }),
    });

    if (res.ok) {
      setForm({ nome: '', areaId: '', dons: '', telefone: '', email: '' });
      setEditandoId(null);
      carregarDados(); // Recarrega a lista após salvar
    } else {
      alert('Erro ao salvar voluntário.');
    }
  }

  async function excluirVoluntario(id: number) {
    if (!confirm('Tem certeza que deseja excluir este voluntário?')) return;
    await fetch(`/api/voluntarios/${id}`, { method: 'DELETE' });
    carregarDados(); // Recarrega a lista após excluir
  }

  function editarVoluntario(v: Voluntario) {
    setEditandoId(v.id);
    setForm({
      nome: v.nome,
      areaId: String(v.areaId),
      dons: v.dons || '',
      telefone: v.telefone,
      email: v.email || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola para o topo para o formulário
  }

  // Função para alternar a disponibilidade (validação)
  async function toggleDisponibilidade(voluntario: Voluntario) {
    const res = await fetch(`/api/voluntarios/${voluntario.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...voluntario, // Mantém os outros dados
        disponivel: !voluntario.disponivel, // Inverte o status
      }),
    });

    if (res.ok) {
      carregarDados(); // Recarrega a lista para mostrar a mudança
    } else {
      alert('Erro ao atualizar status do voluntário.');
    }
  }

  return (
    <div className="min-h-screen bg-zinc-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-zinc-800">Administrar Voluntários</h1>
          <Link href="/admin" className="text-sm text-zinc-500 hover:text-zinc-700">
            ← Voltar para Admin
          </Link>
        </div>

        {/* Formulário de Adição/Edição (para administradores) */}
        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <h2 className="font-semibold text-zinc-700 mb-4">
            {editandoId ? 'Editar voluntário' : 'Adicionar novo voluntário (Admin)'}
          </h2>
          <div className="grid grid-cols-1 gap-3">
            <input
              type="text"
              placeholder="Nome completo"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className="border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={form.areaId}
              onChange={(e) => setForm({ ...form, areaId: e.target.value })}
              className="border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione a área</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nome}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Dons ou habilidades (opcional)"
              value={form.dons}
              onChange={(e) => setForm({ ...form, dons: e.target.value })}
              className="border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Telefone"
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
              className="border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="E-mail (opcional)"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={salvarVoluntario}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors"
            >
              {editandoId ? 'Salvar alterações' : 'Adicionar'}
            </button>
            {editandoId && (
              <button
                onClick={() => {
                  setEditandoId(null);
                  setForm({ nome: '', areaId: '', dons: '', telefone: '', email: '' });
                }}
                className="text-zinc-500 hover:text-zinc-700 text-sm px-3"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>

        {/* Lista de Voluntários (para administradores) */}
        <div className="bg-white rounded-xl shadow divide-y divide-zinc-100">
          {voluntarios.length === 0 ? (
            <p className="text-zinc-400 text-sm text-center py-6">
              Nenhum voluntário cadastrado ainda.
            </p>
          ) : (
            voluntarios.map((v) => (
              <div key={v.id} className="px-4 py-3 flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-zinc-800">{v.nome}</p>
                  <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${v.disponivel ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {v.area.nome} {v.disponivel ? '(Ativo)' : '(Pendente)'}
                  </span>
                  {v.dons && (
                    <p className="text-zinc-500 text-sm mt-1">Dons: {v.dons}</p>
                  )}
                  <p className="text-zinc-500 text-xs mt-1">{v.telefone}</p>
                  {v.email && (
                    <p className="text-zinc-500 text-xs">{v.email}</p>
                  )}
                </div>
                <div className="flex gap-3 shrink-0 items-center">
                  <button
                    onClick={() => toggleDisponibilidade(v)}
                    className={`text-sm ${v.disponivel ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'}`}
                  >
                    {v.disponivel ? 'Desativar' : 'Ativar'}
                  </button>
                  <button
                    onClick={() => editarVoluntario(v)}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => excluirVoluntario(v.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}