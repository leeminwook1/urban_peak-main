import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <header className="hand-line-b bg-black">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 font-mono text-sm font-extrabold tracking-[0.18em] text-white hover:text-[#81F211]"
          >
            <span className="anim-spin-slow inline-block leading-none text-[#81F211]" aria-hidden="true">✳</span>
            URBAN PEAK ADMIN
          </Link>
          <nav className="hidden items-center gap-1.5 md:flex">
            <Link href="/admin/pages" className="px-3 py-1.5 text-xs font-extrabold tracking-[0.1em] text-white/70 transition-colors hover:bg-[#81F211] hover:text-black">페이지 설정</Link>
            <Link href="/admin/projects" className="px-3 py-1.5 text-xs font-extrabold tracking-[0.1em] text-white/70 transition-colors hover:bg-[#81F211] hover:text-black">프로젝트</Link>
            <Link href="/admin/team" className="px-3 py-1.5 text-xs font-extrabold tracking-[0.1em] text-white/70 transition-colors hover:bg-[#81F211] hover:text-black">팀원</Link>
            <Link href="/admin/merchandise" className="px-3 py-1.5 text-xs font-extrabold tracking-[0.1em] text-white/70 transition-colors hover:bg-[#81F211] hover:text-black">굿즈</Link>
          </nav>
          <Link
            href="/"
            className="border border-[#81F211] bg-black px-3.5 py-1.5 text-xs font-extrabold tracking-[0.1em] text-[#81F211] transition-colors hover:bg-[#81F211] hover:text-black"
          >
            사이트 보기 →
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
