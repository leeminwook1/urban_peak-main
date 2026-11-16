import { NextResponse, type NextRequest } from 'next/server';
import { draftMode } from 'next/headers';

/** Ends preview for this browser. Public on purpose: it only removes the preview cookie. */
export async function GET(req: NextRequest) {
  (await draftMode()).disable();
  const back = req.nextUrl.searchParams.get('to') ?? '/';
  return NextResponse.redirect(new URL(/^\/(?!\/)/.test(back) ? back : '/', req.url));
}
