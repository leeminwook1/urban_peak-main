import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySession } from '@/lib/auth';

const PUBLIC = ['/admin/login', '/api/admin/login'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ok = PUBLIC.includes(pathname) || (await verifySession(req.cookies.get(SESSION_COOKIE)?.value));
  if (ok) {
    const res = NextResponse.next();
    res.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return res;
  }
  if (pathname.startsWith('/api/'))
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  const url = req.nextUrl.clone();
  url.pathname = '/admin/login';
  url.search = '';
  url.searchParams.set('next', pathname);
  return NextResponse.redirect(url);
}

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] };
