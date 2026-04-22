"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/story", label: "Story" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-[#e5e0d8] bg-[#f0ebe3]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/images/logos/logo-horizontal.png"
            alt="urban peak"
            width={130}
            height={26}
            className="h-6 w-auto"
            priority
          />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href
                  ? "text-sm font-medium text-[#1a1a1a]"
                  : "text-sm text-[#8a8a8a] transition-colors hover:text-[#1a1a1a]"
              }
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <Link
            href="/contact"
            className="rounded-full bg-[#1a1a1a] px-5 py-2 text-xs font-medium text-white transition-opacity hover:opacity-80"
          >
            협업 제안
          </Link>
        </div>

        <button
          type="button"
          className="p-2 text-[#1a1a1a] md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[#e5e0d8] bg-[#f0ebe3] px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  pathname === link.href
                    ? "rounded-xl px-4 py-2.5 text-sm font-medium text-[#1a1a1a] bg-white/60"
                    : "rounded-xl px-4 py-2.5 text-sm text-[#6b6b6b] hover:text-[#1a1a1a]"
                }
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 border-t border-[#e5e0d8] pt-3">
              <Link
                href="/contact"
                className="block rounded-full bg-[#1a1a1a] py-2.5 text-center text-sm font-medium text-white"
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
