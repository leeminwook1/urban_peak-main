"use client";

import Link from "next/link";
import Stamp from "@/components/ui/Stamp";
import SketchIcon, { SketchIconKind } from "@/components/ui/SketchIcon";

const MENUS: Array<{ href: string; icon: SketchIconKind; title: string; desc: string }> = [
  { href: "/admin/inquiries", icon: "writing", title: "문의함", desc: "Contact 페이지로 들어온 문의를 확인하고 답장합니다." },
  { href: "/admin/projects", icon: "stage", title: "프로젝트 관리", desc: "프로젝트를 추가, 수정, 삭제합니다." },
  { href: "/admin/team", icon: "person", title: "팀원 관리", desc: "팀원 정보를 추가, 수정, 삭제합니다." },
  { href: "/admin/merchandise", icon: "design", title: "굿즈 관리", desc: "굿즈 상품을 추가, 수정, 삭제합니다." },
  { href: "/admin/pages", icon: "writing", title: "페이지 설정", desc: "각 페이지 배너 이미지와 타이틀을 수정합니다." },
];

export default function AdminPage() {
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
