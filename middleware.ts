import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some(p => pathname.startsWith(p));

  // Las rutas públicas no necesitan verificación
  // Nota: el token vive en RAM del cliente, el middleware solo protege
  // navegación directa por URL — la protección real está en los layouts cliente
  if (isPublic) {
    return NextResponse.next();
  }

  // Para rutas protegidas, Next.js middleware actúa como primera línea.
  // La verificación real del token ocurre en AuthGuard del lado cliente.
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
