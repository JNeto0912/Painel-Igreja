'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Igreja = { id: number; nome: string };

export default function CadastroPage() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [igrejas, setIgrejas] = useState<Igreja[]>([]);
  const [igrejaId, setIgrejaId] = useState<string>('');
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    fetch('/api/igrejas')
      .then((r) => r.json())
      .then((data: Igreja[]) => {
        if (Array.isArray(data)) {
          setIgrejas(data);
          if (data.length > 0) setIgrejaId(String(data[0].id));
        }
      })
      .catch(() => setIgrejas([]));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (!login.trim() || !senha || !telefone.trim() || !igrejaId) {
      setErro('Preencha todos os campos, incluindo a igreja.');
      return;
    }

    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setEnviando(true);
    try {
      const res = await fetch('/api/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login,
          senha,
          telefone,
          igrejaId: Number(igrejaId),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSucesso(data.mensagem);
        setLogin('');
        setSenha('');
        setTelefone('');
        setIgrejaId(igrejas.length > 0 ? String(igrejas[0].id) : '');
      } else {
        setErro(data.error || 'Erro ao enviar cadastro.');
      }
    } catch {
      setErro('Não foi possível enviar. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
          Solicitar Acesso
        </h1>
        <p className="text-zinc-500 text-sm text-center mb-6">
          Preencha os dados abaixo. O administrador irá liberar seu acesso.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Login *
            </label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Escolha um nome de usuário"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha *
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefone / WhatsApp *
            </label>
            <input
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="(DDD) 9 9999-9999"
            />
          </div>

          {/* CAMPO IGREJA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Igreja *
            </label>
            {igrejas.length === 0 ? (
              <p className="text-xs text-zinc-400">Carregando igrejas...</p>
            ) : (
              <select
                value={igrejaId}
                onChange={(e) => setIgrejaId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {igrejas.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.nome}
                  </option>
                ))}
              </select>
            )}
          </div>

          {erro && (
            <p className="text-red-500 text-sm">{erro}</p>
          )}
          {sucesso && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-700 text-sm">{sucesso}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2 rounded-lg transition"
          >
            {enviando ? 'Enviando...' : 'Solicitar acesso'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link
            href="/login"
            className="text-sm text-zinc-500 hover:text-zinc-800"
          >
            Já tenho acesso → Entrar
          </Link>
        </div>
      </div>
    </div>
  );
}