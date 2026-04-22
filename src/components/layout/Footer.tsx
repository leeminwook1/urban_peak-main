import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-[#e5e0d8] bg-[#f0ebe3]">
      {/* thin top rule — full width */}
      <div className="px-8 py-12 md:px-14 lg:px-20">
        {/* Row 1: logo + nav */}
        <div className="flex items-start justify-between">
          <Image
            src="/images/logos/logo-horizontal.png"
            alt="urban peak"
            width={110}
            height={22}
            className="h-5 w-auto opacity-50"
          />
          <nav className="flex items-center gap-8">
            <Link
              href="/story"
              className="text-[13px] text-[#6b6b6b] transition-colors hover:text-[#111]"
            >
              Story
            </Link>
            <Link
              href="/projects"
              className="text-[13px] text-[#6b6b6b] transition-colors hover:text-[#111]"
            >
              Projects
            </Link>
            <Link
              href="/contact"
              className="text-[13px] text-[#6b6b6b] transition-colors hover:text-[#111]"
            >
              Contact
            </Link>
          </nav>
        </div>

        {/* middle rule */}
        <div className="mt-10 h-px bg-[#1a1a1a]/10" />

        {/* Row 2: tagline + copyright */}
        <div className="mt-6 flex items-end justify-between">
          <p className="text-[12px] tracking-wide text-[#1a1a1a]/35">
            새로운 장면을 만드는 문화 기획 스튜디오
          </p>
          <p className="text-[11px] text-[#1a1a1a]/30">
            &copy; 2025 Urban Peak
          </p>
        </div>
      </div>
    </footer>
  );
}
