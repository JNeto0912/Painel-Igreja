// src/app/api/login/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // Importa a API de cookies do Next.js para o servidor

export async function POST(request: Request) {
  const body = await request.json();
  const { email, senha } = body;

  // --- Lógica de Validação de Credenciais ---
  // Aqui você faria a VERIFICAÇÃO REAL do usuário e senha no seu banco de dados.
  // Por enquanto, vamos usar uma validação simples para teste:
  const isValidUser = email === 'admin@teste.com' && senha === '123456';

  if (!isValidUser) {
    return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
  }

  // --- Se as credenciais são válidas, seta o cookie de autenticação ---
  cookies().set('auth', 'true', { // O valor 'true' é apenas um placeholder, pode ser um token JWT real
    path: '/',          // O cookie estará disponível em toda a aplicação
    httpOnly: true,     // Impede acesso via JavaScript no navegador (segurança)
    secure: process.env.NODE_ENV === 'production', // Apenas envia o cookie em HTTPS em produção
    maxAge: 60 * 60 * 24, // Expira em 24 horas (em segundos)
    sameSite: 'lax',    // Proteção contra CSRF
  });

  return NextResponse.json({ message: 'Login bem-sucedido' }, { status: 200 });
}