"use client";

import { useState } from "react";
import Stamp from "@/components/ui/Stamp";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    }).catch(() => null);
    if (res?.ok) {
      const next = new URLSearchParams(window.location.search).get("next");
      window.location.href = next && next.startsWith("/admin") ? next : "/admin";
      return;
    }
    const body = res ? await res.json().catch(() => ({})) : {};
    setError(body.error || "로그인하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    setBusy(false);
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="relative w-full max-w-sm border border-black bg-white p-8 shadow-[8px_8px_0_#81F211]"
      >
        <span className="dash-strip absolute -left-px -top-px right-[-1px] h-2" aria-hidden="true" />
        <Stamp>ADMIN</Stamp>
        <h1 className="mt-5 text-2xl font-extrabold tracking-[-0.04em] text-black">
          관리자 로그인
        </h1>
        <label
          htmlFor="password"
          className="mt-7 block text-[10px] font-extrabold tracking-[0.2em] text-black"
        >
          비밀번호 / PASSWORD
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full border border-black bg-[#F5F5F5] px-4 py-3 text-sm text-black outline-none transition-colors placeholder:text-black/25 focus:bg-white focus:shadow-[3px_3px_0_#81F211]"
          placeholder="비밀번호를 입력하세요"
          autoFocus
          required
        />
        {error && (
          <p className="mt-3 text-sm font-bold text-red-600" role="alert">{error}</p>
        )}
        <button
          type="submit"
          disabled={busy || !password}
          className="mt-6 w-full border border-black bg-[#81F211] px-4 py-3 text-sm font-extrabold tracking-[0.08em] text-black shadow-[4px_4px_0_#000] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:opacity-60"
        >
          {busy ? "확인 중…" : "로그인 →"}
        </button>
      </form>
    </div>
  );
}
