'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { loginAction } from '@/lib/actions';

function LoginForm() {
  const searchParams = useSearchParams();
  const erro = searchParams.get('erro');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 px-4">
      <div className="w-full max-w-md">

        {/* Logo / Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img
              src="/uploads/resolult.png"
              alt="Logotipo"
              className="h-16 w-auto object-contain drop-shadow-xl"
            />
          </div>
          <h1 className="text-2xl font-semibold text-white">
            Painel da Igreja
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Acesse para gerenciar avisos, membros e ministérios.
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl shadow-2xl shadow-black/50 p-7 backdrop-blur-md">
          <form action={loginAction} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Usuário
              </label>
              <input
                type="text"
                name="username"
                className="w-full rounded-lg bg-slate-950/70 border border-slate-700 text-slate-50 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-500 transition"
                placeholder="seu usuário"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Senha
              </label>
              <input
                type="password"
                name="password"
                className="w-full rounded-lg bg-slate-950/70 border border-slate-700 text-slate-50 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-500 transition"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            {erro === '1' && (
              <div className="flex items-center gap-2 bg-red-950/50 border border-red-700/60 rounded-lg px-4 py-2.5">
                <span className="text-red-400 text-base">⚠️</span>
                <p className="text-red-400 text-sm">
                  Usuário ou senha inválidos.
                </p>
              </div>
            )}

            {erro === 'pendente' && (
              <div className="flex items-start gap-2 bg-yellow-950/40 border border-yellow-600/50 rounded-lg px-4 py-3">
                <span className="text-yellow-400 text-base mt-0.5">🕐</span>
                <p className="text-yellow-300 text-sm">
                  Seu cadastro ainda está aguardando aprovação do administrador.
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-semibold py-2.5 mt-1 transition-colors shadow-lg shadow-blue-900/30"
            >
              Entrar
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-slate-800 text-center">
            <a
              href="/cadastro"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Não tem acesso? Solicite seu cadastro →
            </a>
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] text-slate-600">
          Acesso restrito à liderança da igreja.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}