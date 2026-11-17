"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Inquiry } from "@/lib/inquiries";

const MAIL: Record<string, string> = {
  sent: "메일 발송됨",
  failed: "메일 발송 실패",
  skipped: "메일 미설정",
  pending: "발송 대기",
};
const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("ko-KR", { dateStyle: "medium", timeStyle: "short" });

export default function InquiriesPage() {
  const [list, setList] = useState<Inquiry[] | null>(null);
  const [mail, setMail] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [onlyUnread, setOnlyUnread] = useState(false);

  const load = useCallback(async () => {
    setError("");
    const res = await fetch("/api/admin/inquiries", { cache: "no-store" });
    if (res.status === 401) {
      window.location.href = "/admin/login?next=/admin/inquiries";
      return;
    }
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return setError(body.error || "문의 목록을 읽지 못했습니다.");
    setList(body.inquiries);
    setMail(body.mail);
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const shown = useMemo(() => (list ?? []).filter((i) => !onlyUnread || !i.readAt), [list, onlyUnread]);
  const current = list?.find((i) => i.id === selected) ?? null;
  const unread = (list ?? []).filter((i) => !i.readAt).length;

  async function setRead(i: Inquiry, read: boolean) {
    const res = await fetch(`/api/admin/inquiries/${i.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    });
    const body = await res.json().catch(() => ({}));
    if (res.ok) setList((l) => l && l.map((x) => (x.id === i.id ? { ...x, readAt: body.readAt } : x)));
  }
  function open(i: Inquiry) {
    setSelected(i.id);
    if (!i.readAt) setRead(i, true);
  }
  async function remove(i: Inquiry) {
    if (!confirm(`${i.name}님의 문의를 삭제할까요? 삭제하면 되돌릴 수 없습니다.`)) return;
    const res = await fetch(`/api/admin/inquiries/${i.id}`, { method: "DELETE" });
    if (!res.ok) return alert("삭제하지 못했습니다.");
    setList((l) => l && l.filter((x) => x.id !== i.id));
    setSelected(null);
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-black">문의함</h1>
          <p className="mt-1 text-sm text-[#666666]">
            Contact 페이지로 들어온 문의입니다.{unread ? ` 읽지 않은 문의 ${unread}건.` : ""}
          </p>
        </div>
        <button
          onClick={load}
          className="border border-black bg-white px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-[#81F211]"
        >
          새로고침
        </button>
      </div>

      {!mail && (
        <p className="mb-5 border border-black bg-[#FFF6D6] px-4 py-3 text-sm text-black">
          메일 발송이 아직 설정되지 않았습니다. 문의는 이곳에 모두 저장되며, 설정 후에는 새 문의가 메일로도 전달됩니다.
        </p>
      )}
      {error && (
        <p className="mb-5 border border-red-600 px-4 py-3 text-sm font-bold text-red-600">
          {error}{" "}
          <button onClick={load} className="underline">
            다시 시도
          </button>
        </p>
      )}

      {list && (
        <div className="grid gap-5 md:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
          <div className={`border border-black bg-white ${current ? "hidden md:block" : ""}`}>
            <div className="flex gap-1 border-b border-black p-2">
              {[false, true].map((u) => (
                <button
                  key={String(u)}
                  onClick={() => setOnlyUnread(u)}
                  className={`px-3 py-1.5 text-sm font-bold ${onlyUnread === u ? "bg-black text-white" : "text-black hover:bg-[#F5F5F5]"}`}
                >
                  {u ? `안 읽음 ${unread}` : `전체 ${list.length}`}
                </button>
              ))}
            </div>
            <ul>
              {shown.map((i) => (
                <li key={i.id} className="border-b border-dashed border-black/30 last:border-0">
                  <button
                    onClick={() => open(i)}
                    className={`block w-full px-4 py-3 text-left transition-colors ${i.id === current?.id ? "bg-[#81F211]/40" : "hover:bg-[#F5F5F5]"}`}
                  >
                    <span className={`flex items-center gap-2 text-[15px] text-black ${i.readAt ? "font-medium" : "font-extrabold"}`}>
                      {!i.readAt && <span className="h-2 w-2 shrink-0 rounded-full bg-black" aria-label="안 읽음" />}
                      {i.name}
                    </span>
                    <span className="mt-0.5 block truncate text-sm text-[#444444]">{i.message}</span>
                    <span className="mt-0.5 block text-xs text-[#666666]">{formatDate(i.createdAt)}</span>
                  </button>
                </li>
              ))}
              {!shown.length && (
                <li className="px-4 py-10 text-center text-sm text-[#666666]">
                  {onlyUnread ? "읽지 않은 문의가 없습니다." : "아직 문의가 없습니다."}
                </li>
              )}
            </ul>
          </div>

          {current ? (
            <div className="border border-black bg-white p-6 shadow-[6px_6px_0_#81F211]">
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <button onClick={() => setSelected(null)} className="mr-auto text-sm font-bold text-black md:hidden">
                  ← 목록
                </button>
                <span className="border border-black px-2 py-0.5 text-xs font-bold text-black" title={current.mailError}>
                  {MAIL[current.mailStatus] ?? current.mailStatus}
                </span>
                <button
                  onClick={() => setRead(current, !current.readAt)}
                  className="px-2 py-1 text-sm font-bold text-black underline-offset-4 hover:underline"
                >
                  {current.readAt ? "안 읽음으로 표시" : "읽음으로 표시"}
                </button>
                <button
                  onClick={() => remove(current)}
                  className="border border-red-600 px-3 py-1 text-sm font-bold text-red-600 hover:bg-red-600 hover:text-white"
                >
                  삭제
                </button>
              </div>
              <h2 className="text-xl font-extrabold text-black">{current.name}</h2>
              <p className="mt-1 text-sm text-[#666666]">
                <a href={`mailto:${current.email}`} className="text-black underline">
                  {current.email}
                </a>{" "}
                · {formatDate(current.createdAt)}
              </p>
              <p className="mt-5 whitespace-pre-wrap break-words border border-black bg-[#F5F5F5] p-4 text-[15px] leading-relaxed text-black">
                {current.message}
              </p>
              <a
                href={`mailto:${current.email}?subject=${encodeURIComponent("Re: [어반피크] 문의 답변드립니다")}`}
                className="mt-5 inline-block border border-black bg-[#81F211] px-5 py-2.5 text-sm font-extrabold text-black shadow-[3px_3px_0_#000] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
              >
                메일로 답장하기 →
              </a>
              {current.mailStatus === "failed" && current.mailError && (
                <p className="mt-3 text-xs text-[#666666]">메일 발송 오류: {current.mailError}</p>
              )}
            </div>
          ) : (
            <div className="hidden border border-dashed border-black/40 p-10 text-center text-sm text-[#666666] md:block">
              왼쪽에서 문의를 선택하세요.
            </div>
          )}
        </div>
      )}
      {!list && !error && <p className="text-sm text-[#666666]">불러오는 중…</p>}
    </div>
  );
}
