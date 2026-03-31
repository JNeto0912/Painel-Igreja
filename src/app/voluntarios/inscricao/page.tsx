// src/app/voluntario/inscricao/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Area {
  id: number;
  nome: string;
}

export default function InscricaoVoluntarioPage() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [form, setForm] = useState({
    nome: '',
    areaId: '',
    dons: '',
    telefone: '',
    email: '',
  });
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregarAreas() {
      const res = await fetch('/api/voluntario-areas');
      setAreas(await res.json());
    }
    carregarAreas();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // Previne o recarregamento da página

    setMensagemSucesso(null);
    setMensagemErro(null);

    if (!form.nome || !form.areaId || !form.telefone) {
      setMensagemErro('Por favor, preencha seu nome, área de interesse e telefone.');
      return;
    }

    try {
      const res = await fetch('/api/voluntarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome,
          areaId: Number(form.areaId),
          dons: form.dons || null,
          telefone: form.telefone,
          email: form.email || null,
          // Futuramente, você pode adicionar um campo 'status: "pendente"' aqui
        }),
      });

      if (res.ok) {
        setMensagemSucesso('Sua inscrição foi enviada com sucesso! Agradecemos seu interesse.');
        setForm({ nome: '', areaId: '', dons: '', telefone: '', email: '' }); // Limpa o formulário
      } else {
        const errorData = await res.json();
        setMensagemErro(`Erro ao enviar inscrição: ${errorData.message || res.statusText}`);
      }
    } catch (error) {
      console.error('Erro na inscrição:', error);
      setMensagemErro('Ocorreu um erro inesperado. Tente novamente mais tarde.');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-indigo-800 mb-2">Seja um Voluntário!</h1>
          <p className="text-zinc-600">Preencha o formulário abaixo para se juntar à nossa equipe.</p>
        </div>

        {mensagemSucesso && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Sucesso!</strong>
            <span className="block sm:inline"> {mensagemSucesso}</span>
          </div>
        )}
        {mensagemErro && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Erro!</strong>
            <span className="block sm:inline"> {mensagemErro}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-zinc-700 mb-1">Nome Completo</label>
            <input
              type="text"
              id="nome"
              placeholder="Seu nome"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className="w-full border border-zinc-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="areaId" className="block text-sm font-medium text-zinc-700 mb-1">Área de Interesse</label>
            <select
              id="areaId"
              value={form.areaId}
              onChange={(e) => setForm({ ...form, areaId: e.target.value })}
              className="w-full border border-zinc-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              required
            >
              <option value="">Selecione uma área</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="dons" className="block text-sm font-medium text-zinc-700 mb-1">Dons ou Habilidades (opcional)</label>
            <textarea
              id="dons"
              placeholder="Ex: Tocar violão, fotografia, organização de eventos..."
              value={form.dons}
              onChange={(e) => setForm({ ...form, dons: e.target.value })}
              rows={3}
              className="w-full border border-zinc-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-y"
            ></textarea>
          </div>

          <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-zinc-700 mb-1">Telefone (com DDD)</label>
            <input
              type="text"
              id="telefone"
              placeholder="Ex: (99) 99999-9999"
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
              className="w-full border border-zinc-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1">E-mail (opcional)</label>
            <input
              type="email"
              id="email"
              placeholder="seu.email@exemplo.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-zinc-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg text-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Enviar Inscrição
          </button>
        </form>

        <p className="text-center text-zinc-500 text-xs mt-6">
          Ao se inscrever, você concorda com nossa política de privacidade.
        </p>
      </div>
    </div>
  );
}