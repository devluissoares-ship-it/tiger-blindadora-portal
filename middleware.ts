import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAdminLoggedIn = request.cookies.get('admin_session');
  const { pathname } = request.nextUrl;

  // 1. Proteção: Redireciona para o login se não houver sessão ativa
  if (pathname.startsWith('/admin') && !isAdminLoggedIn) {
    const loginUrl = new URL('/login', request.url);
    // Opcional: Adicionar um parâmetro 'from' para redirecionar de volta após o login
    loginUrl.searchParams.set('from', pathname); 
    return NextResponse.redirect(loginUrl);
  }

  // 2. Conveniência: Redireciona para o dashboard se já logado
  if (pathname === '/login' && isAdminLoggedIn) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // matcher otimizado para evitar processamento desnecessário
  matcher: ['/admin/:path*', '/login'],
};