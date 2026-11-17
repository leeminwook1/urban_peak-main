import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { INQUIRY_FIELDS, saveInquiry, updateInquiry, type Inquiry } from '@/lib/inquiries';
import { sendInquiryMail } from '@/lib/inquiry-mail';
export const runtime = 'nodejs';
const types = ['', '프로젝트 의뢰', '공동기획', '크루 참여', '기타'];
export async function POST(req: NextRequest) {
  if (req.headers.get('origin') && new URL(req.headers.get('origin')!).host !== req.headers.get('host'))
    return NextResponse.json({ error: '허용되지 않은 요청입니다.' }, { status: 403 });
  if (Number(req.headers.get('content-length') || 0) > 24000)
    return NextResponse.json({ error: '문의 내용이 너무 깁니다.' }, { status: 413 });
  let body: Record<string, unknown>;
  try {
    const raw = await req.text();
    if (raw.length > 22000) return NextResponse.json({ error: '문의 내용이 너무 깁니다.' }, { status: 413 });
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: '입력 내용을 확인해 주세요.' }, { status: 400 });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body))
    return NextResponse.json({ error: '입력 내용을 확인해 주세요.' }, { status: 400 });
  const fields = [
    'name',
    'email',
    'organization',
    'type',
    'schedule',
    'place',
    'budget',
    'reference',
    'message',
    'website',
    'consent',
  ];
  const data: Record<string, string> = {};
  for (const f of fields) {
    if (body[f] !== undefined && typeof body[f] !== 'string')
      return NextResponse.json({ error: '입력 형식이 올바르지 않습니다.' }, { status: 400 });
    data[f] = String(body[f] || '').trim();
  }
  if (data.website) return NextResponse.json({ error: '자동 요청은 허용되지 않습니다.' }, { status: 400 });
  if (
    !data.name ||
    data.name.length > 100 ||
    !/^\S+@\S+\.\S+$/.test(data.email) ||
    data.email.length > 254 ||
    data.message.length < 10 ||
    data.message.length > 10000 ||
    data.consent !== 'yes' ||
    !types.includes(data.type) ||
    data.organization.length > 150 ||
    data.schedule.length > 200 ||
    data.place.length > 200 ||
    data.budget.length > 100 ||
    data.reference.length > 2000
  )
    return NextResponse.json(
      { error: '이름, 이메일, 문의 내용과 개인정보 동의를 확인해 주세요.' },
      { status: 400 },
    );
  if (data.reference) {
    try {
      const url = new URL(data.reference);
      if (!['https:', 'http:'].includes(url.protocol)) throw Error();
    } catch {
      return NextResponse.json(
        { error: '참고 링크는 http 또는 https 주소를 입력해 주세요.' },
        { status: 400 },
      );
    }
  }
  const inquiry: Inquiry = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...(Object.fromEntries(INQUIRY_FIELDS.map(f => [f, data[f]])) as Pick<
      Inquiry,
      (typeof INQUIRY_FIELDS)[number]
    >),
    source: 'redesign',
    readAt: null,
    mailStatus: 'pending',
    mailError: '',
  };
  try {
    await saveInquiry(inquiry);
  } catch (e) {
    console.error('[contact] 문의 저장 실패', e);
    return NextResponse.json(
      { error: '문의를 접수하지 못했습니다. 잠시 후 다시 시도하거나 이메일로 문의해 주세요.' },
      { status: 503 },
    );
  }
  // The inquiry is safe from here on; mail is best effort and its result is recorded for the admin inbox.
  const mail = await sendInquiryMail(inquiry, new URL('/admin/inquiries', req.url).toString());
  await updateInquiry(inquiry.id, { mailStatus: mail.status, mailError: mail.error }).catch(e =>
    console.error('[contact] 발송 상태 기록 실패', e),
  );
  return NextResponse.json(
    { id: inquiry.id, stored: true, delivered: mail.status === 'sent' },
    { status: 201 },
  );
}
