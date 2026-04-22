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
          <span className="text-lg font-semibold tracking-wide">
            Urban Peak Admin
          </span>
          <Link
            href="/"
            className="text-sm text-white/70 transition-colors hover:text-white"
          >
            &larr; 사이트로 돌아가기
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
