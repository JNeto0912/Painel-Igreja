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
        const username = credentials?.username as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!username || !password) return null;

        // Busca na tabela Usuario
        const usuario = await prisma.usuario.findUnique({
          where: { login: username.trim() },
        });

        if (!usuario) return null;

        // Bloqueia se não estiver aprovado
        if (!usuario.aprovado) return null;

        // Verifica senha com bcrypt
        const ok = await bcrypt.compare(password, usuario.senha);
        if (!ok) return null;

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