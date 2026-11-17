import { NextResponse, type NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/admin-api';
import { deleteInquiry, updateInquiry } from '@/lib/inquiries';

type Ctx = { params: Promise<{ id: string }> };

/** PATCH { read: boolean } marks an inquiry read or unread. */
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const { id } = await params;
  const body = (await req.json().catch(() => null)) as { read?: unknown } | null;
  if (typeof body?.read !== 'boolean')
    return NextResponse.json({ error: '요청 형식이 올바르지 않습니다.' }, { status: 400 });
  const readAt = body.read ? new Date().toISOString() : null;
  return (await updateInquiry(id, { readAt }))
    ? NextResponse.json({ readAt })
    : NextResponse.json({ error: '문의를 찾을 수 없습니다.' }, { status: 404 });
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const { id } = await params;
  return (await deleteInquiry(id))
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ error: '문의를 찾을 수 없습니다.' }, { status: 404 });
}
