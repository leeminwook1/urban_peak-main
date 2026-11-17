import { NextResponse, type NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/admin-api';
import { listInquiries } from '@/lib/inquiries';
import { mailConfigured } from '@/lib/inquiry-mail';

export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    return NextResponse.json({ inquiries: await listInquiries(), mail: mailConfigured() });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: '문의 목록을 읽지 못했습니다.' }, { status: 500 });
  }
}
