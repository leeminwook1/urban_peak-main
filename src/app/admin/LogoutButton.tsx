"use client";

import { usePathname } from "next/navigation";

export default function LogoutButton() {
  if (usePathname() === "/admin/login") return null;
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }
  return (
    <button
      type="button"
      onClick={logout}
      className="px-3 py-1.5 text-xs font-extrabold tracking-[0.1em] text-white/70 transition-colors hover:bg-[#81F211] hover:text-black"
    >
      로그아웃
    </button>
  );
}
