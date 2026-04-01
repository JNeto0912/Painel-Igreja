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
    include: { igreja: true },
  });

  if (!usuario) redirect('/login?erro=1');
  if (!usuario.aprovado) redirect('/login?erro=pendente');

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
  if (!senhaCorreta) redirect('/login?erro=1');

  const cookieStore = await cookies();

  cookieStore.set('auth', '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
    path: '/',
  });

  cookieStore.set('igrejaId', String(usuario.igrejaId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
    path: '/',
  });

  // NOVO: se é admin global
  cookieStore.set('isAdmin', String(usuario.admin), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
    path: '/',
  });

  redirect('/admin');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('auth');
  cookieStore.delete('igrejaId');
  cookieStore.delete('isAdmin');
  redirect('/login');
}