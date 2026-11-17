"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Stamp from "@/components/ui/Stamp";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export interface PageSetting {
  title?: string | null;
  subtitle?: string | null;
  banner_image?: string | null;
}

interface PageHeroProps {
  setting?: PageSetting | null;
  defaultTitle: string;
  defaultSubtitle?: string;
  labelLeft: string;
  labelRight?: string;
}

export default function PageHero({
  setting,
  defaultTitle,
  defaultSubtitle,
  labelLeft,
}: PageHeroProps) {
  const title = setting?.title || defaultTitle;
  const subtitle = setting?.subtitle || defaultSubtitle;
  const bannerImage = setting?.banner_image;
  const hasBanner = !!bannerImage;

  return (
    <section className="hand-line-b relative bg-[#F5F5F5] px-6 pb-[90px] pt-[100px] md:pt-[110px]">
      {hasBanner ? (
        <>
          <Image src={bannerImage!} alt={title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/45" />
        </>
      ) : (
        <>
          <div className="hatch-bg absolute inset-0" aria-hidden="true" />
          {/* 떠다니는 손그림 심볼 */}
          <Image
            src="/images/logos/symbol-orange.png"
            alt=""
            width={64}
            height={64}
            className="anim-floaty absolute right-[13%] top-[24%] z-0 h-14 w-auto md:h-16"
            aria-hidden="true"
          />
          <Image
            src="/images/logos/symbol-teal.png"
            alt=""
            width={48}
            height={48}
            className="anim-floaty absolute right-[6%] top-[52%] z-0 h-10 w-auto md:h-12"
            style={{ animationDuration: "6.5s" }}
            aria-hidden="true"
          />
          <span
            className="anim-spin-reverse absolute right-[22%] top-[58%] hidden text-3xl leading-none text-[#81F211] md:block"
            aria-hidden="true"
          >
            ✳
          </span>
        </>
      )}

      <div className="relative mx-auto max-w-[1400px]">
        <Stamp>{labelLeft.toUpperCase()}</Stamp>
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.1 }}
          className={`mt-6 whitespace-pre-line text-[clamp(44px,7.6vw,120px)] font-extrabold leading-[0.96] tracking-[-0.06em] ${hasBanner ? "text-white" : "text-black"}`}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.3 }}
            className={`mt-7 max-w-[560px] text-lg font-semibold leading-[1.85] ${hasBanner ? "text-white/85" : "text-black"}`}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
