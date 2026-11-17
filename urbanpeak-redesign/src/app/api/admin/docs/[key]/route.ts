import { NextResponse, type NextRequest } from 'next/server';
import { revalidateTag } from 'next/cache';
import { requireAdmin } from '@/lib/admin-api';
import { SITE_TAG } from '@/lib/data';
import { normalizeDoc } from '@/lib/normalize';
import { isInvalidDoc, sanitizeDoc } from '@/lib/sanitize';
import { seed } from '@/lib/seed';
import { readStored, storeMode, writeStored } from '@/lib/store';
import { isDocKey } from '@/lib/types';

type Ctx = { params: Promise<{ key: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const { key } = await params;
  if (!isDocKey(key)) return NextResponse.json({ error: '알 수 없는 문서입니다.' }, { status: 404 });
  try {
    const stored = await readStored(key);
    return NextResponse.json({
      data: normalizeDoc(key, stored?.data ?? seed[key]),
      updatedAt: stored?.updatedAt ?? null,
      mode: storeMode(),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: '저장소를 읽지 못했습니다. DATABASE_URL 설정을 확인해 주세요.' },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const { key } = await params;
  if (!isDocKey(key)) return NextResponse.json({ error: '알 수 없는 문서입니다.' }, { status: 404 });
  const body = (await req.json().catch(() => null)) as {
    data?: unknown;
    baseUpdatedAt?: string | null;
  } | null;
  if (!body) return NextResponse.json({ error: '요청 형식이 올바르지 않습니다.' }, { status: 400 });
  try {
    const data = sanitizeDoc(key, body.data);
    const current = await readStored(key);
    if ((current?.updatedAt ?? null) !== (body.baseUpdatedAt ?? null))
      return NextResponse.json(
        { error: '다른 곳에서 먼저 저장된 내용이 있습니다. 새로고침한 뒤 다시 수정해 주세요.' },
        { status: 409 },
      );
    const updatedAt = await writeStored(key, data, { history: true });
    revalidateTag(SITE_TAG);
    return NextResponse.json({ data, updatedAt });
  } catch (e) {
    if (isInvalidDoc(e)) return NextResponse.json({ error: e.message }, { status: 400 });
    console.error(e);
    const readOnly = storeMode() === 'local-file' && process.env.NODE_ENV === 'production';
    return NextResponse.json(
      {
        error: readOnly
          ? '배포 환경에서는 DATABASE_URL이 있어야 저장할 수 있습니다.'
          : '저장에 실패했습니다.',
      },
      { status: 500 },
    );
  }
}
