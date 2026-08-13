"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/story", label: "Story" },
  { href: "/projects", label: "Projects" },
  { href: "/merchandise", label: "Merchandise" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed left-0 right-0 top-[5px] z-50 border-b border-black bg-white">
      <div className="flex h-[58px] items-center justify-between gap-6 px-5 md:px-6">
        <Link href="/" className="flex flex-shrink-0 items-center gap-3.5" data-magnet>
          <Image
            src="/images/logos/logo-horizontal.png"
            alt="urban peak"
            width={130}
            height={26}
            className="h-[18px] w-auto"
            priority
          />
          <span className="anim-spin-slow inline-block text-base leading-none text-[#81F211]" aria-hidden="true">
            ✳
          </span>
        </Link>

        <div className="hidden items-center gap-[18px] md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-magnet
              className={`whitespace-nowrap px-1.5 py-0.5 text-xs font-extrabold uppercase tracking-[0.16em] transition-colors hover:bg-[#81F211] hover:text-black ${
                pathname === link.href ? "bg-[#81F211] text-black" : "text-[#666666]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <Link
            href="/contact"
            data-magnet
            data-magnetic
            className="inline-block whitespace-nowrap border border-black bg-[#81F211] px-[18px] py-[9px] text-xs font-extrabold tracking-[0.1em] text-black shadow-[3px_3px_0_#000] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
          >
            협업 제안
          </Link>
        </div>

        <button
          type="button"
          className="border border-black p-2 text-black md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-black bg-white px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2.5 text-sm font-extrabold uppercase tracking-[0.14em] ${
                  pathname === link.href ? "bg-[#81F211] text-black" : "text-[#666666]"
                }`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 border-t border-dashed border-black pt-3">
              <Link
                href="/contact"
                className="block border border-black bg-[#81F211] py-2.5 text-center text-sm font-extrabold tracking-[0.08em] text-black shadow-[3px_3px_0_#000]"
                onClick={() => setOpen(false)}
              >
                협업 제안
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
