"use client";

import { useState } from "react";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import PageHero, { PageSetting } from "@/components/ui/PageHero";
import Stamp from "@/components/ui/Stamp";
import MerchandiseModal, { ModalMerchandise } from "@/components/ui/MerchandiseModal";

interface Section {
  id: number;
  title: string;
  subtitle: string;
  banner_image: string | null;
  display_order: number;
}

interface MerchandiseItem {
  id: number;
  name: string;
  description: string;
  image_url: string | null;
  images: string | null;
  section_id: number | null;
  display_order: number;
}

const TILT_CLASSES = ["-rotate-[1.4deg]", "rotate-[1.1deg]", "-rotate-[0.8deg]", "rotate-[1.5deg]", "-rotate-1", "rotate-[0.7deg]"];

function MerchandiseCard({ item, index, onClick }: { item: MerchandiseItem; index: number; onClick: () => void }) {
  const [slideIndex, setSlideIndex] = useState(0);
  let images: string[] = [];
  try { images = JSON.parse(item.images || "[]"); } catch { images = []; }
  if (images.length === 0 && item.image_url) images = [item.image_url];

  return (
    <div
      onClick={onClick}
      className={`group flex h-full cursor-pointer flex-col border border-black bg-white px-3.5 pb-6 pt-3.5 transition-all duration-300 hover:rotate-0 hover:-translate-y-2 hover:shadow-[8px_8px_0_#81F211] ${TILT_CLASSES[index % TILT_CLASSES.length]}`}
    >
      <div className="placeholder-stripes relative aspect-square overflow-hidden border border-black">
        {images.length > 0 ? (
          <>
            <Image src={images[slideIndex]} alt={item.name} fill className="object-cover" />
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setSlideIndex(i => (i - 1 + images.length) % images.length); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 border border-black bg-white p-1.5 text-black hover:bg-[#81F211]"
                  aria-label="이전 이미지"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setSlideIndex(i => (i + 1) % images.length); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 border border-black bg-white p-1.5 text-black hover:bg-[#81F211]"
                  aria-label="다음 이미지"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
                </button>
                <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setSlideIndex(i); }}
                      className={`h-2 border border-black transition-all ${i === slideIndex ? "w-5 bg-[#81F211]" : "w-2 bg-white"}`}
                      aria-label={`이미지 ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-mono text-[11px] font-bold tracking-[0.16em] text-[#666666]">이미지 없음</span>
          </div>
        )}
      </div>
      <h3 className="mt-4 truncate text-lg font-extrabold tracking-[-0.03em] text-black">{item.name}</h3>
      {item.description && (
        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-[#666666]">{item.description}</p>
      )}
      <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[11px] font-extrabold tracking-[0.12em] text-black underline decoration-[#81F211] decoration-2 underline-offset-4 group-hover:decoration-black">
        자세히 보기 →
      </span>
    </div>
  );
}

export default function MerchandiseClient({
  sections,
  items,
  setting,
}: {
  sections: Section[];
  items: MerchandiseItem[];
  setting: PageSetting | null;
}) {
  const [selected, setSelected] = useState<MerchandiseItem | null>(null);

  const itemsBySection = (sectionId: number) =>
    items.filter(i => i.section_id === sectionId);

  const isEmpty = sections.length === 0 && items.length === 0;

  return (
    <>
      <PageHero
        setting={setting}
        defaultTitle={"어반피크의\n굿즈"}
        defaultSubtitle="어반피크의 감도를 담은 오브젝트"
        labelLeft="Merchandise"
        labelRight="어반피크 굿즈"
      />

      {isEmpty ? (
        <section className="px-6 pb-[170px] pt-[110px]">
          <AnimatedSection>
            <div className="relative mx-auto max-w-[800px] border border-black bg-[#F5F5F5] px-10 py-20 text-center">
              <span className="dash-strip absolute -left-px -top-px right-[-1px] h-2" aria-hidden="true" />
              <span className="anim-spin-slow inline-block text-[44px] leading-none text-[#81F211]" aria-hidden="true">✳</span>
              <div className="mt-[26px]">
                <Stamp>COMING SOON</Stamp>
              </div>
              <h2 className="mt-6 text-[clamp(30px,4vw,52px)] font-extrabold tracking-[-0.05em] text-black">
                준비 중입니다
              </h2>
              <p className="mt-4 text-[15px] leading-[1.9] text-[#666666]">
                어반피크의 감도를 담은 굿즈를 곧 선보일 예정입니다.
              </p>
            </div>
          </AnimatedSection>
        </section>
      ) : (
        <div className="pb-[100px]">
          {sections.map((section) => (
            <div key={section.id}>
              {/* 섹션 배너 */}
              <AnimatedSection>
                <div className="relative h-[320px] w-full overflow-hidden border-b border-black bg-black md:h-[420px]">
                  {section.banner_image && (
                    <Image src={section.banner_image} alt={section.title} fill className="object-cover opacity-70" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-10 md:p-16">
                    {section.subtitle && (
                      <span className="mb-3 w-fit border border-black bg-[#81F211] px-3 py-1.5 text-[10px] font-extrabold tracking-[0.2em] text-black">
                        {section.subtitle}
                      </span>
                    )}
                    <h2 className="text-[clamp(44px,7vw,110px)] font-extrabold leading-[0.98] tracking-[-0.06em] text-white">
                      {section.title}
                    </h2>
                  </div>
                </div>
              </AnimatedSection>

              {/* 상품 카드 */}
              {itemsBySection(section.id).length > 0 && (
                <section className="px-6 py-16">
                  <div className="mx-auto max-w-[1400px]">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {itemsBySection(section.id).map((item, index) => (
                        <AnimatedSection key={item.id} delay={index * 0.08} className="h-full">
                          <MerchandiseCard item={item} index={index} onClick={() => setSelected(item)} />
                        </AnimatedSection>
                      ))}
                    </div>
                  </div>
                </section>
              )}
            </div>
          ))}
        </div>
      )}

      <MerchandiseModal item={selected as ModalMerchandise | null} onClose={() => setSelected(null)} />
    </>
  );
}
