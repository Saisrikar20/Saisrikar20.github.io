import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Intercept all Keystatic CMS routes and internal Keystatic API calls
  if (pathname.startsWith('/keystatic') || pathname.startsWith('/api/keystatic')) {
    const adminToken = request.cookies.get('admin_session')?.value;
    const isValid = await verifyAdminToken(adminToken);

    if (!isValid) {
      if (pathname.startsWith('/api/keystatic')) {
        return NextResponse.json(
          { error: 'Unauthorized: Admin authentication required.' },
          { status: 401 }
        );
      }

      // Redirect unauthenticated visitors to /admin login wall
      const loginUrl = new URL('/admin', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/keystatic', '/keystatic/:path*', '/api/keystatic', '/api/keystatic/:path*'],
};
