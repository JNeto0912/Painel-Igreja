// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas completamente públicas (sem login)
const publicRoutes = [
  '/login',
  '/cadastro',

];

// Rotas que exigem login (qualquer usuário aprovado)
const protectedRoutes = [
  '/admin',
  '/display',
  '/servicos',
  '/voluntarios',
];

// Rotas que só o admin global pode acessar
const adminOnlyRoutes = [
  '/admin/usuarios',
  '/admin/tipos-servico',
  '/admin/areas-voluntariado',
  '/admin/igrejas',
  '/quero-ser-voluntario',
  '/publico/servicos',
  '/publico/voluntarios',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const auth     = request.cookies.get('auth')?.value;
  const igrejaId = request.cookies.get('igrejaId')?.value;
  const isAdmin  = request.cookies.get('isAdmin')?.value === 'true';

  const isPublic = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/'),
  );

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/'),
  );

  const isAdminOnly = adminOnlyRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/'),
  );

  // 1) Rotas públicas
  if (isPublic) {
    // se já está logado e tentar acessar /login ou /cadastro → mandar pro /admin
    if (auth && igrejaId && (pathname === '/login' || pathname === '/cadastro')) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // 2) Rotas só de admin global
  if (isAdminOnly) {
    // se não está logado → login
    if (!auth || !igrejaId) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    // logado mas não é admin → manda pro painel normal
    if (!isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  // 3) Rotas protegidas (qualquer usuário logado)
  if (isProtected) {
    if (!auth || !igrejaId) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // 4) Outras rotas (ex: arquivos estáticos, páginas não listadas) → passa
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};