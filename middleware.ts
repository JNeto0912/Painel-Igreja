import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server'; // <-- Esta linha é a importante

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const auth = request.cookies.get('auth')?.value;

  if (pathname.startsWith('/admin') && !auth) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (pathname === '/login' && auth) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}