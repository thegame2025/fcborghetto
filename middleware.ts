import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Specifically exclude the initialize page from authentication
  if (pathname === '/admin/initialize') {
    console.log('Allowing access to initialize page');
    return NextResponse.next();
  }
  
  // Exclude login page from authentication
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }
  
  // Exclude API routes from authentication
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Only protect /admin/* routes
  if (pathname.startsWith('/admin')) {
    const session = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!session) {
      console.log('No session found, redirecting to login');
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

// Update the matcher to be very specific
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
  ],
}; 