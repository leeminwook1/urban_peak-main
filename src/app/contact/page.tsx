"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero-gradient relative flex min-h-[40vh] flex-col overflow-hidden">
        {/* top edge bar */}
        <div className="flex items-center justify-between px-8 pt-6 md:px-14 lg:px-20">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1a1a1a]/35">
            Contact
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1a1a1a]/35">
            협업 제안
          </span>
        </div>

        {/* animated top rule */}
        <motion.div
          className="mx-8 mt-3 h-px origin-left bg-[#1a1a1a]/10 md:mx-14 lg:mx-20"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, ease }}
        />

        {/* main content */}
        <div className="flex flex-1 flex-col justify-center px-8 py-14 md:px-14 md:py-20 lg:px-20">
          <motion.h1
            className="text-[2.6rem] font-bold leading-[1.08] tracking-[-0.035em] text-[#111] md:text-[3.6rem] lg:text-[4.5rem]"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.15 }}
          >
            함께 만들고
            <br />
            싶은 장면이
            <br />
            있나요?
          </motion.h1>

          <motion.p
            className="mt-5 text-[14px] text-[#6b6b6b]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.35 }}
          >
            다양한 방식의 협업을 열려 있습니다.
          </motion.p>
        </div>

        {/* animated bottom rule */}
        <motion.div
          className="mx-8 mb-0 h-px origin-left bg-[#1a1a1a]/10 md:mx-14 lg:mx-20"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, ease, delay: 0.3 }}
        />
      </section>

      {/* ── Form section ─────────────────────────────────── */}
      <AnimatedSection className="px-8 py-16 md:px-14 md:py-24 lg:px-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 md:grid-cols-[1fr_1.4fr]">
          {/* left column — info panel */}
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1a1a1a]/40">
              문의하기
            </span>
            <div className="mt-3 h-px w-8 bg-[#1a1a1a]/20" />
            <p className="mt-5 max-w-xs text-[14px] leading-[1.9] text-[#6b6b6b]">
              공연, 전시, 클래스, 사진 등 다양한 협업 형태를 검토합니다. 먼저
              간단히 소개해주세요.
            </p>

            <div className="mt-8">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#1a1a1a]/40">
                Email
              </span>
              <p className="mt-1 text-[14px] text-[#1a1a1a]">
                contact@urbanpeak.kr
              </p>
            </div>

            <div className="mt-8 h-px bg-[#1a1a1a]/10" />

            <p className="mt-6 text-[11px] tracking-widest text-[#1a1a1a]/30">
              공연 &middot; 전시 &middot; 클래스 &middot; 사진
            </p>
          </div>

          {/* right column — form */}
          <div>
            {submitted ? (
              <div className="flex min-h-[320px] items-center justify-center">
                <div className="text-center">
                  <p className="text-lg font-bold text-[#1a1a1a]">
                    감사합니다.
                  </p>
                  <p className="mt-2 text-sm text-[#6b6b6b]">
                    곧 연락드리겠습니다.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#1a1a1a]/50"
                  >
                    이름
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full border-b border-[#1a1a1a]/20 bg-transparent px-0 py-3 text-[15px] text-[#111] outline-none transition-colors placeholder:text-[#1a1a1a]/25 focus:border-[#1a1a1a]/60"
                    placeholder="홍길동"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#1a1a1a]/50"
                  >
                    이메일
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full border-b border-[#1a1a1a]/20 bg-transparent px-0 py-3 text-[15px] text-[#111] outline-none transition-colors placeholder:text-[#1a1a1a]/25 focus:border-[#1a1a1a]/60"
                    placeholder="hello@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#1a1a1a]/50"
                  >
                    메시지
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="w-full resize-none border-b border-[#1a1a1a]/20 bg-transparent px-0 py-3 text-[15px] leading-relaxed text-[#111] outline-none transition-colors placeholder:text-[#1a1a1a]/25 focus:border-[#1a1a1a]/60"
                    placeholder="협업하고 싶은 내용을 자유롭게 적어주세요."
                  />
                </div>

                <button
                  type="submit"
                  className="mt-10 rounded-full bg-[#1a1a1a] px-8 py-3.5 text-[13px] font-medium text-white transition-all hover:bg-[#2e2e2e]"
                >
                  보내기
                </button>
              </form>
            )}
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
