'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Usuario {
  id: number;
  login: string;
  telefone: string;
  aprovado: boolean;
  admin: boolean;
  criadoEm: string;
}

export default function UsuariosAdminPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvandoId, setSalvandoId] = useState<number | null>(null);
  const [erro, setErro] = useState('');

  async function carregar() {
    setCarregando(true);
    setErro('');
    try {
      const res = await fetch('/api/usuarios');
      const data = await res.json();
      setUsuarios(data);
    } catch {
      setErro('Não foi possível carregar usuários.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function atualizarUsuario(id: number, data: Partial<Usuario>) {
    setSalvandoId(id);
    setErro('');
    try {
      const res = await fetch(`/api/usuarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || 'Erro ao salvar');
      }

      await carregar();
    } catch (e) {
      setErro(
        e instanceof Error ? e.message : 'Não foi possível atualizar.'
      );
    } finally {
      setSalvandoId(null);
    }
  }

  async function excluirUsuario(id: number) {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
    setSalvandoId(id);
    setErro('');
    try {
      const res = await fetch(`/api/usuarios/${id}`, { method: 'DELETE' });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || 'Erro ao excluir');
      }

      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (e) {
      setErro(
        e instanceof Error ? e.message : 'Não foi possível excluir.'
      );
    } finally {
      setSalvandoId(null);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-zinc-800">
            Usuários do Painel
          </h1>
          <Link
            href="/admin"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            ← Voltar ao painel
          </Link>
        </div>

        <p className="text-zinc-500 text-sm mb-4">
          Aprove cadastros e defina quem tem acesso de administrador.
        </p>

        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
            {erro}
          </div>
        )}

        {carregando ? (
          <p className="text-zinc-400 text-sm">Carregando usuários...</p>
        ) : usuarios.length === 0 ? (
          <p className="text-zinc-400 text-sm">
            Nenhum usuário cadastrado até o momento.
          </p>
        ) : (
          <div className="bg-white rounded-xl shadow divide-y divide-zinc-100">
            {usuarios.map((u) => (
              <div
                key={u.id}
                className="px-4 py-3 flex items-center justify-between gap-3"
              >
                <div>
                  <p className="font-semibold text-zinc-800">{u.login}</p>
                  <p className="text-xs text-zinc-500">{u.telefone}</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Cadastrado em{' '}
                    {new Date(u.criadoEm).toLocaleString('pt-BR', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1 text-xs text-zinc-700">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={u.aprovado}
                        disabled={salvandoId === u.id}
                        onChange={(e) =>
                          atualizarUsuario(u.id, { aprovado: e.target.checked })
                        }
                      />
                      Aprovado
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={u.admin}
                        disabled={salvandoId === u.id}
                        onChange={(e) =>
                          atualizarUsuario(u.id, { admin: e.target.checked })
                        }
                      />
                      Admin
                    </label>
                  </div>

                  <button
                    onClick={() => excluirUsuario(u.id)}
                    disabled={salvandoId === u.id}
                    className="text-xs text-red-500 hover:text-red-700 disabled:opacity-40"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {salvandoId !== null && (
          <p className="text-xs text-zinc-400 mt-3">Salvando alterações...</p>
        )}
      </div>
    </div>
  );
}