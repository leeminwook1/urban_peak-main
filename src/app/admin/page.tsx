"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const ADMIN_PASSWORD = "ydp12000";
const AUTH_KEY = "adminAuth";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(AUTH_KEY);
      if (stored === ADMIN_PASSWORD) {
        setAuthenticated(true);
      }
    }
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, password);
      setAuthenticated(true);
      setError("");
    } else {
      setError("비밀번호가 올바르지 않습니다.");
    }
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-xl border border-[#e5e0d8] bg-white p-8 shadow-sm"
        >
          <h1 className="mb-6 text-xl font-semibold text-[#1a1a1a]">
            Admin Login
          </h1>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-[#6b6b6b]"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 w-full rounded-lg border border-[#e5e0d8] bg-[#faf8f5] px-4 py-2.5 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#e8521a]"
            placeholder="비밀번호를 입력하세요"
            autoFocus
          />
          {error && (
            <p className="mb-3 text-sm text-red-500">{error}</p>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-[#1a1a2e] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1a1a2e]/90"
          >
            로그인
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-8 text-2xl font-semibold text-[#1a1a1a]">Dashboard</h1>
      <div className="grid gap-6 sm:grid-cols-2">
        <Link
          href="/admin/projects"
          className="group rounded-xl border border-[#e5e0d8] bg-white p-8 transition-all hover:border-[#e8521a]/40 hover:shadow-md"
        >
          <h2 className="mb-2 text-lg font-semibold text-[#1a1a1a] group-hover:text-[#e8521a]">
            프로젝트 관리
          </h2>
          <p className="text-sm text-[#6b6b6b]">
            프로젝트를 추가, 수정, 삭제합니다.
          </p>
        </Link>
        <Link
          href="/admin/team"
          className="group rounded-xl border border-[#e5e0d8] bg-white p-8 transition-all hover:border-[#e8521a]/40 hover:shadow-md"
        >
          <h2 className="mb-2 text-lg font-semibold text-[#1a1a1a] group-hover:text-[#e8521a]">
            팀원 관리
          </h2>
          <p className="text-sm text-[#6b6b6b]">
            팀원 정보를 추가, 수정, 삭제합니다.
          </p>
        </Link>
      </div>
    </div>
  );
}
