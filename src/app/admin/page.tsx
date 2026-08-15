"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Stamp from "@/components/ui/Stamp";
import SketchIcon, { SketchIconKind } from "@/components/ui/SketchIcon";

const ADMIN_PASSWORD = "ydp12000";
const AUTH_KEY = "adminAuth";

const MENUS: Array<{ href: string; icon: SketchIconKind; title: string; desc: string }> = [
  { href: "/admin/projects", icon: "stage", title: "프로젝트 관리", desc: "프로젝트를 추가, 수정, 삭제합니다." },
  { href: "/admin/team", icon: "person", title: "팀원 관리", desc: "팀원 정보를 추가, 수정, 삭제합니다." },
  { href: "/admin/merchandise", icon: "design", title: "굿즈 관리", desc: "굿즈 상품을 추가, 수정, 삭제합니다." },
  { href: "/admin/pages", icon: "writing", title: "페이지 설정", desc: "각 페이지 배너 이미지와 타이틀을 수정합니다." },
];

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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full border border-black bg-[#F5F5F5] px-4 py-3 text-sm text-black outline-none transition-colors placeholder:text-black/25 focus:bg-white focus:shadow-[3px_3px_0_#81F211]"
            placeholder="비밀번호를 입력하세요"
            autoFocus
          />
          {error && (
            <p className="mt-3 text-sm font-bold text-red-600">{error}</p>
          )}
          <button
            type="submit"
            className="mt-6 w-full border border-black bg-[#81F211] px-4 py-3 text-sm font-extrabold tracking-[0.08em] text-black shadow-[4px_4px_0_#000] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
          >
            로그인 →
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <Stamp>DASHBOARD</Stamp>
      <h1 className="mb-8 mt-5 text-3xl font-extrabold tracking-[-0.045em] text-black">
        무엇을 관리할까요?
      </h1>
      <div className="grid gap-5 sm:grid-cols-2">
        {MENUS.map((menu, i) => (
          <Link
            key={menu.href}
            href={menu.href}
            className={`group border border-black bg-white p-7 transition-all duration-300 hover:rotate-0 hover:-translate-y-1.5 hover:shadow-[6px_6px_0_#81F211] ${i % 2 === 0 ? "-rotate-[0.6deg]" : "rotate-[0.5deg]"}`}
          >
            <SketchIcon
              kind={menu.icon}
              className="h-12 w-12 -rotate-2 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
            />
            <h2 className="mt-4 text-xl font-extrabold tracking-[-0.03em] text-black">
              {menu.title}
            </h2>
            <div className="mt-3 border-t border-dashed border-black" />
            <p className="mt-3 text-sm text-[#666666]">{menu.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
