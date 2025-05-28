import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLoginRoute = request.nextUrl.pathname === '/admin/login';

  // Se è una rotta admin (escluso login) e non c'è una sessione, reindirizza al login
  if (isAdminRoute && !isLoginRoute && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Se è la rotta di login e c'è già una sessione, reindirizza alla dashboard
  if (isLoginRoute && token) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
}; 