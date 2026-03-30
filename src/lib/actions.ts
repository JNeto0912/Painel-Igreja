'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function loginAction(formData: FormData) {
  const login = formData.get('username') as string | null;
  const senha = formData.get('password') as string | null;

  if (!login || !senha) {
    redirect('/login?erro=1');
  }

  const usuario = await prisma.usuario.findUnique({
    where: { login: login.trim() },
  });

  if (!usuario) {
    redirect('/login?erro=1');
  }

  if (!usuario.aprovado) {
    redirect('/login?erro=pendente');
  }

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
  if (!senhaCorreta) {
    redirect('/login?erro=1');
  }

  const cookieStore = await cookies();
  // Aqui está bem simples: apenas marca que está autenticado
  cookieStore.set('auth', '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 8, // 8 horas
    path: '/',
  });

  redirect('/admin');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('auth');
  redirect('/login');
}