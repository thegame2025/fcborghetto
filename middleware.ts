import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Continua normalmente senza modifiche
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