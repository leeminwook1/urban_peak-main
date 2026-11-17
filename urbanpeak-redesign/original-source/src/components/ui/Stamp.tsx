"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/** 시안F 스탬프 배지 — 찍히는 듯한 등장 애니메이션 */
export default function Stamp({
  children,
  variant = "lime",
  className = "",
}: {
  children: ReactNode;
  variant?: "lime" | "white";
  className?: string;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 2.4, rotate: -14 }}
      whileInView={{ opacity: 1, scale: [2.4, 0.92, 1], rotate: [-14, 3, -2] }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, ease: [0.2, 0.85, 0.3, 1] }}
      className={`inline-block border border-black px-3.5 py-2 text-[11px] font-extrabold tracking-[0.18em] text-black ${
        variant === "lime" ? "bg-[#81F211]" : "bg-white"
      } ${className}`}
    >
      {children}
    </motion.span>
  );
}
