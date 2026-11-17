import type { Inquiry, MailStatus } from './inquiries';

/* Sends a new-inquiry notice through Resend. Without RESEND_API_KEY it reports "skipped". */

const LABELS: [keyof Inquiry, string][] = [
  ['name', '이름'],
  ['email', '이메일'],
  ['organization', '소속'],
  ['type', '문의 유형'],
  ['schedule', '희망 일정'],
  ['place', '장소 · 규모'],
  ['budget', '예산 범위'],
  ['reference', '참고 링크'],
  ['message', '문의 내용'],
];
const esc = (s: string) =>
  s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const mailConfigured = () => Boolean(process.env.RESEND_API_KEY);

export async function sendInquiryMail(
  i: Inquiry,
  adminUrl: string,
): Promise<{ status: MailStatus; error: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { status: 'skipped', error: '' };
  const rows = LABELS.filter(([k]) => i[k]);
  const text = rows.map(([k, label]) => `${label}: ${i[k]}`).join('\n\n') + `\n\n관리자 문의함: ${adminUrl}`;
  const html = `<div style="font-family:Pretendard,Apple SD Gothic Neo,sans-serif;font-size:15px;line-height:1.7;color:#111">
<h2 style="font-size:18px;margin:0 0 16px">새 문의가 도착했습니다</h2>
<table style="border-collapse:collapse;width:100%;max-width:640px">${rows
    .map(
      ([k, label]) =>
        `<tr><th style="text-align:left;vertical-align:top;padding:8px 12px 8px 0;color:#555;font-weight:600;white-space:nowrap;border-top:1px solid #eee">${label}</th><td style="padding:8px 0;border-top:1px solid #eee;white-space:pre-wrap">${esc(String(i[k]))}</td></tr>`,
    )
    .join('')}</table>
<p style="margin-top:20px"><a href="${esc(adminUrl)}" style="color:#315fac">관리자 문의함에서 보기</a> · 이 메일에 바로 답장하면 문의자에게 전달됩니다.</p></div>`;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': i.id,
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || 'Urban Peak <onboarding@resend.dev>',
        to: [process.env.CONTACT_TO || 'urbanpeak2020@gmail.com'],
        reply_to: i.email,
        subject: `[어반피크 문의] ${i.type ? i.type + ' — ' : ''}${i.name}`,
        text,
        html,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (res.ok) return { status: 'sent', error: '' };
    const body = await res.json().catch(() => ({}));
    return { status: 'failed', error: String(body.message || `HTTP ${res.status}`).slice(0, 300) };
  } catch (e) {
    return { status: 'failed', error: e instanceof Error ? e.message.slice(0, 300) : '발송 오류' };
  }
}
