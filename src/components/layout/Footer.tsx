import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="hand-line-t bg-[#F5F5F5] px-6 py-[50px]">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-start justify-between gap-10">
        <div>
          <div className="flex items-center gap-3.5">
            <Image
              src="/images/logos/logo-horizontal.png"
              alt="urban peak"
              width={110}
              height={22}
              className="h-5 w-auto"
            />
            <span className="anim-spin-slow inline-block text-[15px] leading-none text-[#81F211]" aria-hidden="true">
              ✳
            </span>
          </div>
          <p className="mt-3.5 text-[13px] text-[#666666]">
            새로운 장면을 만드는 문화 기획 스튜디오
          </p>
          <p className="mt-[22px] font-mono text-[11px] tracking-[0.14em] text-[#666666]">
            &copy; 2026 URBAN PEAK
          </p>
        </div>

        <div className="flex gap-[52px]">
          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] font-extrabold tracking-[0.2em] text-black">PAGES</span>
            <Link href="/story" className="text-[13px] text-[#666666] hover:text-black" data-magnet>
              Story
            </Link>
            <Link href="/projects" className="text-[13px] text-[#666666] hover:text-black" data-magnet>
              Projects
            </Link>
            <Link href="/merchandise" className="text-[13px] text-[#666666] hover:text-black" data-magnet>
              Merchandise
            </Link>
            <Link href="/contact" className="text-[13px] text-[#666666] hover:text-black" data-magnet>
              Contact
            </Link>
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] font-extrabold tracking-[0.2em] text-black">CONTACT</span>
            <a
              href="mailto:urbanpeak2020@gmail.com"
              className="text-[13px] text-[#666666] hover:text-black"
              data-magnet
            >
              urbanpeak2020@gmail.com
            </a>
            <span className="text-[13px] text-[#666666]">@urbanpeak</span>
          </div>
        </div>
      </div>

      {/* 사업자 정보 */}
      <div className="mx-auto mt-10 max-w-[1400px] border-t border-dashed border-black pt-5">
        <p className="text-[12px] leading-[1.9] text-[#666666]">
          어반피크(URBANPEAK) · 대표자: 진하림 · 사업자등록번호: 487-18-02651
        </p>
      </div>
    </footer>
  );
}
