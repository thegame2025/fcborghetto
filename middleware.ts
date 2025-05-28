import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Consenti sempre l'accesso a queste pagine senza autenticazione
  if (pathname === '/admin/login' || pathname === '/admin/initialize' || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Verifica l'autenticazione per le pagine admin
  if (pathname.startsWith('/admin')) {
    const session = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Redirect alla pagina di login se non autenticato
    if (!session) {
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(url);
    }
  }
  
  // Continua normalmente per tutte le altre route
  return NextResponse.next();
}

// Configura il matcher per escludere i percorsi di autenticazione
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api/auth (NextAuth.js paths)
     * 2. /api/setup (Setup API)
     * 3. /_next (Next.js internals)
     * 4. /_static (Static files)
     * 5. /_vercel (Vercel internals)
     * 6. /favicon.ico, /sitemap.xml, /robots.txt (Static files)
     */
    '/((?!api/auth|api/setup|_next|_static|_vercel|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}; 