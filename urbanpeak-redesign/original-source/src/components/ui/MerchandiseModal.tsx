"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export interface ModalMerchandise {
  id: number | string;
  name: string;
  description: string;
  image_url: string | null;
  images: string | null;
}

/**
 * 한 줄짜리 상품 설명을 구조화한다.
 * "Product Detail", "[세탁 및 취급 주의사항]", "S 사이즈:" 같은 마커를
 * 기준으로 줄을 나눠 섹션/불릿으로 렌더링한다.
 */
function preprocess(raw: string): string {
  let t = raw.replace(/\r/g, "").trim();
  t = t
    .replace(/\s*Product Detail\s*\(제품 사양\)\s*/g, "\n[제품 사양]\n")
    .replace(/\s*사이즈 가이드\s*\(단면 cm 기준\)\s*/g, "\n[사이즈 가이드 · 단면 cm]\n")
    .replace(/\s*\[([^\]\n]{2,30})\]\s*/g, "\n[$1]\n")
    .replace(/\s+(S|M|L|XL|2XL|3XL)\s*사이즈:\s*/g, "\n• $1 — ")
    .replace(/(?<![A-Za-z0-9•—])\s+(소재|색상|사이즈|핏|디테일|구성|재질|크기|무게):\s*/g, "\n• $1 — ")
    .replace(/\s*측정 방법에 따라/g, "\n측정 방법에 따라");
  return t;
}

function FormattedGoodsDescription({ text }: { text: string }) {
  const lines = preprocess(text)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <div>
      {lines.map((line, i) => {
        // [섹션 헤딩]
        const section = line.match(/^\[(.+)\]$/);
        if (section) {
          return (
            <p key={i} className="mb-2 mt-6 flex items-center gap-2 text-[13px] font-extrabold tracking-[0.06em] text-black first:mt-0">
              <span className="inline-block bg-[#81F211] px-1.5 py-0.5 leading-none">✳</span>
              {section[1]}
            </p>
          );
        }
        // • 키 — 값 불릿
        const bullet = line.match(/^•\s*(.+?)\s*—\s*(.+)$/);
        if (bullet) {
          return (
            <p key={i} className="flex gap-2 py-[3px] text-sm leading-[1.8] text-[#666666]">
              <span className="mt-[10px] h-[5px] w-[5px] flex-shrink-0 bg-black" aria-hidden="true" />
              <span>
                <span className="font-bold text-black">{bullet[1]}</span>
                <span className="px-1 text-black/30">—</span>
                {bullet[2]}
              </span>
            </p>
          );
        }
        // 첫 줄의 "인용구" — 리드 문장
        if (i === 0 && /^["“]/.test(line)) {
          const m = line.match(/^["“](.+?)["”]\s*(.*)$/);
          if (m) {
            return (
              <div key={i}>
                <p className="text-[17px] font-extrabold leading-[1.7] tracking-[-0.03em] text-black">
                  <span className="bg-[#81F211]/60 box-decoration-clone px-1">{m[1]}</span>
                </p>
                {m[2] && <p className="mt-3 text-sm leading-[1.85] text-[#666666]">{m[2]}</p>}
              </div>
            );
          }
        }
        return (
          <p key={i} className="py-[3px] text-sm leading-[1.85] text-[#666666]">
            {line}
          </p>
        );
      })}
    </div>
  );
}

export default function MerchandiseModal({
  item,
  onClose,
}: {
  item: ModalMerchandise | null;
  onClose: () => void;
}) {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    setSlideIndex(0);
    if (!item) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [item, onClose]);

  if (!item) return null;

  let images: string[] = [];
  try {
    images = JSON.parse(item.images || "[]");
  } catch {
    images = [];
  }
  if (images.length === 0 && item.image_url) images = [item.image_url];

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 px-4 py-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.2, 0.85, 0.25, 1] }}
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-black bg-white shadow-[10px_10px_0_#81F211]"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="dash-strip absolute left-0 right-0 top-0 z-20 h-2" aria-hidden="true" />

        {/* 닫기 — sticky */}
        <div className="pointer-events-none sticky top-0 z-30 flex justify-end">
          <button
            onClick={onClose}
            className="pointer-events-auto m-4 border border-black bg-[#81F211] p-2 text-black shadow-[3px_3px_0_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            aria-label="닫기"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* 이미지 슬라이더 */}
        <div className="placeholder-stripes relative -mt-[60px] aspect-[4/3] border-b border-black">
          {images.length > 0 ? (
            <>
              <Image src={images[slideIndex]} alt={item.name} fill className="object-cover" />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSlideIndex((i) => (i - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 border border-black bg-white p-2 text-black shadow-[2px_2px_0_#000] transition-all hover:bg-[#81F211]"
                    aria-label="이전 이미지"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6" /></svg>
                  </button>
                  <button
                    onClick={() => setSlideIndex((i) => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 border border-black bg-white p-2 text-black shadow-[2px_2px_0_#000] transition-all hover:bg-[#81F211]"
                    aria-label="다음 이미지"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
                  </button>
                  <span className="absolute bottom-3 left-3 bg-black px-2 py-1 font-mono text-[10px] font-bold tracking-[0.14em] text-[#81F211]">
                    {String(slideIndex + 1).padStart(2, "0")}/{String(images.length).padStart(2, "0")}
                  </span>
                </>
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="font-mono text-[11px] font-bold tracking-[0.16em] text-[#666666]">이미지 없음</span>
            </div>
          )}
        </div>

        {/* 타이틀 */}
        <div className="border-b border-dashed border-black px-7 py-5">
          <span className="inline-block -rotate-[1.5deg] border border-black bg-[#81F211] px-2.5 py-1 text-[10px] font-extrabold tracking-[0.18em] text-black">
            GOODS
          </span>
          <h2 className="mt-3 text-[clamp(22px,4vw,30px)] font-extrabold leading-[1.1] tracking-[-0.04em] text-black">
            {item.name}
          </h2>
        </div>

        {/* 설명 */}
        <div className="p-7">
          <FormattedGoodsDescription text={item.description} />
        </div>

        {/* 푸터 */}
        <div className="flex items-center justify-between border-t border-dashed border-black px-7 py-3.5">
          <span className="font-mono text-[10px] font-extrabold tracking-[0.2em] text-[#666666]">
            URBAN PEAK · GOODS
          </span>
          <button
            onClick={onClose}
            className="text-[11px] font-extrabold tracking-[0.12em] text-black underline decoration-[#81F211] decoration-2 underline-offset-4 hover:decoration-black"
          >
            닫기 ESC
          </button>
        </div>
      </motion.div>
    </div>
  );
}
