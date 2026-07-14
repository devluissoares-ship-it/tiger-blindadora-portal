import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAdminLoggedIn = request.cookies.get('admin_session');
  const isLoginPage = request.nextUrl.pathname === '/login';

  // Se o admin não está logado e tenta acessar o admin, manda pro login
  if (!isAdminLoggedIn && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Se o admin já está logado e tenta acessar o login, manda pro dashboard
  if (isAdminLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};