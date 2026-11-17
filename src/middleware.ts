import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";

/* Admin pages and every API call that changes data require a signed admin session.
   Reading (GET) stays public because the site itself reads this data; the contact form posts publicly. */

const PUBLIC = ["/admin/login", "/api/admin/login", "/api/admin/logout"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isApi = pathname.startsWith("/api/");
  // Reading stays public for the site, except the admin API (inquiries contain personal data).
  const publicRead = isApi && req.method === "GET" && !pathname.startsWith("/api/admin/");
  if (PUBLIC.includes(pathname) || publicRead || pathname === "/api/contact") return NextResponse.next();
  if (await verifySession(req.cookies.get(SESSION_COOKIE)?.value)) return NextResponse.next();

  if (isApi) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = "";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/admin/:path*", "/api/:path*"] };
