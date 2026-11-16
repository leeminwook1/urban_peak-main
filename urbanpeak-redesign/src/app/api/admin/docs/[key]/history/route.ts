import { NextResponse, type NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/admin-api';
import { normalizeDoc } from '@/lib/normalize';
import { seed } from '@/lib/seed';
import { listVersions, readVersion } from '@/lib/store';
import { isDocKey } from '@/lib/types';

type Ctx = { params: Promise<{ key: string }> };

/** GET → saved versions (newest first) plus the bundled default; GET ?id=… → that version's data. */
export async function GET(req: NextRequest, { params }: Ctx) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const { key } = await params;
  if (!isDocKey(key)) return NextResponse.json({ error: '알 수 없는 문서입니다.' }, { status: 404 });
  const id = req.nextUrl.searchParams.get('id');
  try {
    if (id === 'seed') return NextResponse.json({ data: seed[key] });
    if (id) {
      const data = await readVersion(key, id);
      return data
        ? NextResponse.json({ data: normalizeDoc(key, data) })
        : NextResponse.json({ error: '해당 버전을 찾을 수 없습니다.' }, { status: 404 });
    }
    return NextResponse.json({ versions: [...(await listVersions(key)), { id: 'seed', savedAt: null }] });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: '저장 이력을 읽지 못했습니다.' }, { status: 500 });
  }
}
