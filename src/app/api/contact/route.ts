import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { saveInquiry, updateInquiry, type Inquiry } from "@/lib/inquiries";
import { sendInquiryMail } from "@/lib/inquiry-mail";

export const runtime = "nodejs";

/* Contact form: validate, store the inquiry (admin inbox), then email a notice (best effort). */
export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== req.headers.get("host"))
    return NextResponse.json({ error: "허용되지 않은 요청입니다." }, { status: 403 });

  const raw = await req.text().catch(() => "");
  if (raw.length > 22000) return NextResponse.json({ error: "문의 내용이 너무 깁니다." }, { status: 413 });
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "입력 내용을 확인해 주세요." }, { status: 400 });
  }
  const field = (k: string) => (typeof body?.[k] === "string" ? (body[k] as string).trim() : "");
  if (field("website")) return NextResponse.json({ error: "자동 요청은 허용되지 않습니다." }, { status: 400 });

  const name = field("name");
  const email = field("email");
  const message = field("message");
  if (!name || name.length > 100 || !/^\S+@\S+\.\S+$/.test(email) || email.length > 254 || !message || message.length > 10000)
    return NextResponse.json({ error: "이름, 이메일, 메시지를 확인해 주세요." }, { status: 400 });

  const inquiry: Inquiry = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    name,
    email,
    organization: "",
    type: "",
    schedule: "",
    place: "",
    budget: "",
    reference: "",
    message,
    source: "live",
    readAt: null,
    mailStatus: "pending",
    mailError: "",
  };
  try {
    await saveInquiry(inquiry);
  } catch (e) {
    console.error("[contact] 문의 저장 실패", e);
    return NextResponse.json(
      { error: "문의를 접수하지 못했습니다. 잠시 후 다시 시도하거나 이메일로 문의해 주세요." },
      { status: 503 },
    );
  }
  // The inquiry is safe from here on; mail is best effort and its result is recorded for the admin inbox.
  const mail = await sendInquiryMail(inquiry, new URL("/admin/inquiries", req.url).toString());
  await updateInquiry(inquiry.id, { mailStatus: mail.status, mailError: mail.error }).catch((e) =>
    console.error("[contact] 발송 상태 기록 실패", e),
  );
  return NextResponse.json({ id: inquiry.id, stored: true }, { status: 201 });
}
