// src/lib/auth.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Usuário', type: 'text' },
        password: { label: 'Senha', type: 'password' },
      },
      authorize: async (credentials) => {
        console.log('--- Tentativa de Login ---');
        const username = credentials?.username as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!username || !password) {
          console.log('Login ou senha não fornecidos.');
          return null;
        }

        console.log(`Tentando login para: ${username}`);
        const usuario = await prisma.usuario.findUnique({
          where: { login: username.trim() },
        });

        if (!usuario) {
          console.log('Usuário não encontrado.');
          return null;
        }

        console.log(`Usuário encontrado: ${usuario.login}`);
        if (!usuario.aprovado) {
          console.log('Usuário não aprovado.');
          return null;
        }

        const ok = await bcrypt.compare(password, usuario.senha);
        if (!ok) {
          console.log('Senha incorreta.');
          return null;
        }

        console.log('Login bem-sucedido!');
        return {
          id: String(usuario.id),
          name: usuario.login,
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
});