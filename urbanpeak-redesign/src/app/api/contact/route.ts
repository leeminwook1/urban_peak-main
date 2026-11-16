import { NextRequest, NextResponse } from 'next/server';
import { mkdir, open } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
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
  const dir = process.env.CONTACT_STORAGE_DIR || path.join(process.cwd(), '.private', 'inquiries');
  const id = randomUUID();
  const createdAt = new Date().toISOString();
  const configured = Boolean(
    process.env.RESEND_API_KEY && process.env.CONTACT_TO && process.env.CONTACT_FROM,
  );
  let delivered = false;
  let deliveryId: string | undefined;
  try {
    await mkdir(dir, { recursive: true, mode: 0o700 });
    const file = await open(path.join(dir, id + '.json'), 'wx', 0o600);
    await file.writeFile(JSON.stringify({ id, createdAt, data, status: 'stored' }, null, 2));
    await file.close();
    if (configured) {
      try {
        const text = Object.entries(data)
          .filter(([k]) => !['website', 'consent'].includes(k))
          .map(([k, v]) => `${k}: ${v}`)
          .join('\n\n');
        const r = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
            'Idempotency-Key': id,
          },
          body: JSON.stringify({
            from: process.env.CONTACT_FROM,
            to: [process.env.CONTACT_TO],
            reply_to: data.email,
            subject: `[Urban Peak] ${data.type || '문의'} — ${data.name}`,
            text,
          }),
          signal: AbortSignal.timeout(10000),
        });
        if (r.ok) {
          const result = await r.json();
          delivered = true;
          deliveryId = result.id;
        }
      } catch {
        /* Stored inquiry remains available when email delivery is unavailable. */
      }
    }
    const f = await open(path.join(dir, id + '.json'), 'w', 0o600);
    await f.writeFile(
      JSON.stringify(
        { id, createdAt, data, status: delivered ? 'provider_accepted' : 'stored', deliveryId },
        null,
        2,
      ),
    );
    await f.close();
    return NextResponse.json({ id, stored: true, delivered }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: '접수 상태를 확인할 수 없습니다. 이메일로 문의해 주세요.' },
      { status: 503 },
    );
  }
}
