import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Sprawdź, czy użytkownik próbuje wejść na ścieżkę zaczynającą się od /Admin
  if (url.pathname.startsWith('/Admin')) {
    
    // Pobieranie sesji/tokenu/roli z ciasteczek (Cookies)
    const userRole = request.cookies.get('user_role')?.value; // Dostosuj nazwę cookie do swojego projektu
    const token = request.cookies.get('auth_token')?.value;

    // Jeśli brak tokenu lub rola nie jest adminem, cofnij do logowania
    if (!token || userRole !== 'admin') {
      url.pathname = '/Auth';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Konfiguracja, dla jakich ścieżek middleware ma się uruchamiać
export const config = {
  matcher: ['/Admin/:path*'],
};