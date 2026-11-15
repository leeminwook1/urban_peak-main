"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useEffect } from "react";
import { motion } from "framer-motion";

export interface ModalProject {
  id: number | string;
  tag: string;
  title: string;
  category: string;
  description: string;
  symbol_url: string;
  thumbnail_url?: string | null;
  gallery_images?: string | null;
  display_order: number;
}

/** "· 키: 값" / "· 항목" / "섹션:" / 일반 문단으로 자동 구분해 스타일링한다. */
function FormattedDescription({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: React.ReactNode[] = [];

  lines.forEach((raw, i) => {
    const line = raw.trim();

    if (!line) {
      blocks.push(<div key={i} className="h-4" />);
      return;
    }

    const bulletMatch = line.match(/^[·・•\-]\s*(.*)$/);
    if (bulletMatch) {
      const rest = bulletMatch[1].trim();
      // "기획 의도:" 처럼 값 없이 콜론으로 끝나면 섹션 헤딩
      if (/^[^:]{1,24}:$/.test(rest)) {
        blocks.push(
          <p key={i} className="mt-5 flex items-center gap-2 text-[13px] font-extrabold tracking-[0.06em] text-black first:mt-0">
            <span className="inline-block bg-[#81F211] px-1.5 py-0.5 leading-none">✳</span>
            {rest.slice(0, -1)}
          </p>,
        );
        return;
      }
      // "장소: 서울 야외 및 스튜디오" → 키 볼드
      const kv = rest.match(/^([^:]{1,24}):\s+(.+)$/);
      if (kv) {
        blocks.push(
          <p key={i} className="flex gap-2 py-[3px] text-sm leading-[1.8] text-[#666666]">
            <span className="mt-[11px] h-[5px] w-[5px] flex-shrink-0 bg-black" aria-hidden="true" />
            <span>
              <span className="font-bold text-black">{kv[1]}</span>
              <span className="px-1 text-black/30">—</span>
              {kv[2]}
            </span>
          </p>,
        );
        return;
      }
      blocks.push(
        <p key={i} className="flex gap-2 py-[3px] text-sm leading-[1.8] text-[#666666]">
          <span className="mt-[11px] h-[5px] w-[5px] flex-shrink-0 bg-black" aria-hidden="true" />
          <span>{rest}</span>
        </p>,
      );
      return;
    }

    // 값 없는 "Core Question" 류 짧은 라벨 (영문/짧은 구, 콜론으로 끝나거나 20자 이내 + 다음 줄 존재)
    if (/^[^:]{1,24}:$/.test(line)) {
      blocks.push(
        <p key={i} className="mt-5 flex items-center gap-2 text-[13px] font-extrabold tracking-[0.06em] text-black first:mt-0">
          <span className="inline-block bg-[#81F211] px-1.5 py-0.5 leading-none">✳</span>
          {line.slice(0, -1)}
        </p>,
      );
      return;
    }

    blocks.push(
      <p key={i} className="py-[3px] text-sm leading-[1.85] text-[#666666]">
        {line}
      </p>,
    );
  });

  return <div>{blocks}</div>;
}

export default function ProjectModal({
  project,
  onClose,
}: {
  project: ModalProject | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!project) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  if (!project) return null;

  let galleryImages: string[] = [];
  try {
    galleryImages = JSON.parse(project.gallery_images || "[]");
  } catch {
    galleryImages = [];
  }

  const hasThumbnail = !!project.thumbnail_url;

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
        {/* 상단 점선 스트립 */}
        <span className="dash-strip absolute left-0 right-0 top-0 z-20 h-2" aria-hidden="true" />

        {/* 닫기 — 스크롤해도 따라오는 sticky */}
        <div className="pointer-events-none sticky top-0 z-30 flex justify-end">
          <button
            onClick={onClose}
            className="pointer-events-auto m-4 border border-black bg-[#81F211] p-2 text-black shadow-[3px_3px_0_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            aria-label="닫기"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* 헤더 */}
        {hasThumbnail ? (
          <div className="relative -mt-[60px] h-72 border-b border-black bg-black">
            <Image
              src={project.thumbnail_url!}
              alt={project.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className="absolute bottom-0 w-full p-7">
              <span className="inline-block -rotate-[1.5deg] border border-black bg-[#81F211] px-2.5 py-1 text-[10px] font-extrabold tracking-[0.18em] text-black">
                {project.tag}
              </span>
              <h2 className="mt-3 text-[clamp(24px,4.5vw,34px)] font-extrabold leading-[1.08] tracking-[-0.045em] text-white">
                {project.title}
              </h2>
            </div>
          </div>
        ) : (
          <div className="hatch-bg relative -mt-[60px] overflow-hidden border-b border-black bg-[#F5F5F5]">
            <span
              className="anim-spin-reverse absolute -bottom-8 -right-6 text-[110px] leading-none text-[#81F211] opacity-70"
              aria-hidden="true"
            >
              ✳
            </span>
            <div className="relative p-7 pt-[64px]">
              <span className="inline-block -rotate-[1.5deg] border border-black bg-[#81F211] px-2.5 py-1 text-[10px] font-extrabold tracking-[0.18em] text-black">
                {project.tag}
              </span>
              <h2 className="mt-3 max-w-[85%] text-[clamp(24px,4.5vw,34px)] font-extrabold leading-[1.08] tracking-[-0.045em] text-black">
                {project.title}
              </h2>
            </div>
          </div>
        )}

        {/* 카테고리 바 */}
        <div className="flex items-center justify-between gap-4 border-b border-dashed border-black bg-white px-7 py-3">
          <p className="font-mono text-[10px] font-extrabold tracking-[0.2em] text-[#666666]">
            {project.category}
          </p>
          <span className="anim-spin-slow inline-block text-sm leading-none text-[#81F211]" aria-hidden="true">
            ✳
          </span>
        </div>

        {/* 내용 */}
        <div className="p-7">
          <FormattedDescription text={project.description} />

          {/* 갤러리 */}
          {galleryImages.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center gap-2.5">
                <span className="inline-block border border-black bg-[#81F211] px-2 py-1 text-[10px] font-extrabold tracking-[0.2em] text-black">
                  GALLERY
                </span>
                <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-[#666666]">
                  {String(galleryImages.length).padStart(2, "0")} CUTS
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {galleryImages.map((url, idx) => (
                  <div
                    key={idx}
                    className="group relative aspect-[4/3] overflow-hidden border border-black"
                  >
                    <Image
                      src={url}
                      alt={`${project.title} gallery ${idx + 1}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute left-2 top-2 bg-black px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-[0.14em] text-[#81F211]">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="flex items-center justify-between border-t border-dashed border-black px-7 py-3.5">
          <span className="font-mono text-[10px] font-extrabold tracking-[0.2em] text-[#666666]">
            URBAN PEAK · PROJECT
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
