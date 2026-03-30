import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verifica se o cookie de sessão do NextAuth existe
  const sessionToken =
    request.cookies.get('next-auth.session-token')?.value ||
    request.cookies.get('__Secure-next-auth.session-token')?.value;

  // Se tentar acessar /admin sem token, redireciona para /login
  if (pathname.startsWith('/admin') && !sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Se já tem token e tenta acessar /login, redireciona para /admin
  if (pathname === '/login' && sessionToken) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};