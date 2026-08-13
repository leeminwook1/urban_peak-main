"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Stamp from "@/components/ui/Stamp";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

interface PageSetting {
  title: string;
  subtitle: string;
  banner_image: string | null;
}

interface PageHeroProps {
  pageKey: string;
  defaultTitle: string;
  defaultSubtitle?: string;
  labelLeft: string;
  labelRight: string;
  minHeight?: string;
}

export default function PageHero({
  pageKey,
  defaultTitle,
  defaultSubtitle,
  labelLeft,
}: PageHeroProps) {
  const [setting, setSetting] = useState<PageSetting | null>(null);

  useEffect(() => {
    fetch(`/api/page-settings/${pageKey}`)
      .then(r => r.json())
      .then(d => { if (d) setSetting(d); })
      .catch(() => {});
  }, [pageKey]);

  const title = setting?.title || defaultTitle;
  const subtitle = setting?.subtitle || defaultSubtitle;
  const bannerImage = setting?.banner_image;
  const hasBanner = !!bannerImage;

  return (
    <section className="relative overflow-hidden border-b border-black bg-[#F5F5F5] px-6 pb-[90px] pt-[100px] md:pt-[110px]">
      {hasBanner ? (
        <>
          <Image src={bannerImage} alt={title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/45" />
        </>
      ) : (
        <div className="hatch-bg absolute inset-0" aria-hidden="true" />
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
