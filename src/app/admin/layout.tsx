import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <header className="bg-[#1a1a2e] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="text-lg font-semibold tracking-wide hover:opacity-80">
            Urban Peak Admin
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <Link href="/admin/pages" className="rounded-lg px-3 py-1.5 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white">페이지 설정</Link>
            <Link href="/admin/projects" className="rounded-lg px-3 py-1.5 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white">프로젝트</Link>
            <Link href="/admin/team" className="rounded-lg px-3 py-1.5 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white">팀원</Link>
            <Link href="/admin/merchandise" className="rounded-lg px-3 py-1.5 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white">굿즈</Link>
          </nav>
          <Link
            href="/"
            className="text-sm text-white/50 transition-colors hover:text-white"
          >
            사이트 보기 →
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
