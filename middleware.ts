// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas que DEVEM exigir login
const protectedRoutes = [
  '/admin',
  '/voluntarios',
  '/display',
  '/servicos',
  // adicione outras aqui se quiser proteger mais
];

// Rotas que são públicas (sem login)
const publicRoutes = [
  '/login',
  '/cadastro',
  '/', // se você quiser deixar a home pública
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cookie de autenticação
  const auth = request.cookies.get('auth')?.value;

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/'),
  );

  const isPublic = publicRoutes.includes(pathname);

  // 1) Tentando acessar rota protegida SEM estar logado → manda pro login
  if (isProtected && !auth) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // 2) Se já está logado e tenta ir pra login/cadastro → manda para /admin
  if (isPublic && auth && pathname !== '/admin') {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  // segue normalmente
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};