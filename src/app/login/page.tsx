'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { loginAction } from '@/lib/actions';

function LoginForm() {
  const searchParams = useSearchParams();
  const erro = searchParams.get('erro');

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Painel da Igreja
        </h1>
        <form action={loginAction} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usuário
            </label>
            <input
              type="text"
              name="username"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              name="password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {erro === '1' && (
            <p className="text-red-500 text-sm text-center">
              Usuário ou senha inválidos.
            </p>
          )}
          {erro === 'pendente' && (
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
              <p className="text-yellow-700 text-sm text-center">
                Seu cadastro ainda está aguardando aprovação do administrador.
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Entrar
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/cadastro"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Não tem acesso? Solicite seu cadastro
          </a>
        </div>
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