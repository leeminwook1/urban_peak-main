import { NextResponse, type NextRequest } from 'next/server';
import { draftMode } from 'next/headers';
import { requireAdmin } from '@/lib/admin-api';
import { isInvalidDoc, sanitizeDoc } from '@/lib/sanitize';
import { draftKey, writeStored } from '@/lib/store';
import { isDocKey } from '@/lib/types';

/** Stores the editor's unsaved data as a draft and turns on preview for this browser. */
export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const body = (await req.json().catch(() => null)) as { key?: string; data?: unknown; path?: string } | null;
  if (!body?.key || !isDocKey(body.key))
    return NextResponse.json({ error: '알 수 없는 문서입니다.' }, { status: 400 });
  try {
    await writeStored(draftKey(body.key), sanitizeDoc(body.key, body.data));
  } catch (e) {
    if (isInvalidDoc(e)) return NextResponse.json({ error: e.message }, { status: 400 });
    console.error(e);
    return NextResponse.json({ error: '미리보기를 준비하지 못했습니다.' }, { status: 500 });
  }
  (await draftMode()).enable();
  const path = typeof body.path === 'string' && /^\/(?!\/)/.test(body.path) ? body.path : '/';
  return NextResponse.json({ url: path });
}
