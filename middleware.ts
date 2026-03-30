import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const auth = request.cookies.get('auth')?.value;
  const { pathname } = request.nextUrl;

  // Bloqueia acesso ao /admin se não tiver cookie auth
  if (pathname.startsWith('/admin') && auth !== '1') {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Se já está logado e tenta ir para /login, manda para /admin
  if (pathname === '/login' && auth === '1') {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};