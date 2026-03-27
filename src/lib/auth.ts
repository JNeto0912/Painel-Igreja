import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

const USUARIO = process.env.ADMIN_USER ?? 'admin';
const SENHA_HASH = process.env.ADMIN_PASSWORD_HASH ?? '';

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
        if (username !== USUARIO) return null;
        if (!SENHA_HASH) return null;

        const ok = await bcrypt.compare(password, SENHA_HASH);
        if (!ok) return null;

        return {
          id: '1',
          name: username,
        };
      },
    }),
  ],
  pages: {
    signIn: '/login', // usamos nossa página custom
  },
});