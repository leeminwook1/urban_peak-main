"use client";

import { useState } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import PageHero from "@/components/ui/PageHero";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <PageHero
        pageKey="contact"
        defaultTitle={"함께 만들고 싶은\n장면이 있나요?"}
        defaultSubtitle="다양한 방식의 협업에 열려 있습니다."
        labelLeft="Contact"
        labelRight="협업 제안"
      />

      <AnimatedSection className="px-6 pb-[170px] pt-[90px]">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 md:grid-cols-[1fr_1.4fr]">
          {/* 좌측 정보 카드 */}
          <div className="-rotate-[0.6deg] border border-black bg-[#81F211] px-7 pb-9 pt-8 transition-transform duration-300 hover:rotate-0">
            <p className="text-base font-semibold leading-[1.95] text-black">
              공연, 전시, 클래스, 사진 등 다양한 협업 형태를 검토합니다. 먼저 간단히 소개해주세요.
            </p>
            <div className="mt-8 border-t border-dashed border-black pt-[18px]">
              <span className="text-[10px] font-extrabold tracking-[0.2em] text-black">EMAIL</span>
              <p className="mt-2">
                <a
                  href="mailto:contact@urbanpeak.kr"
                  data-magnet
                  className="text-[clamp(19px,1.9vw,26px)] font-extrabold tracking-[-0.035em] text-black"
                >
                  contact@urbanpeak.kr
                </a>
              </p>
            </div>
            <div className="mt-[22px] border-t border-dashed border-black pt-[18px]">
              <span className="text-[10px] font-extrabold tracking-[0.2em] text-black">SCOPE</span>
              <p className="mt-2 text-sm font-bold text-black">공연 · 전시 · 클래스 · 사진</p>
            </div>
            <div className="mt-9 text-right">
              <span className="anim-spin-slow inline-block text-[56px] leading-none text-black" style={{ animationDuration: "12s" }} aria-hidden="true">
                ✳
              </span>
            </div>
          </div>

          {/* 우측 폼 카드 */}
          <div className="rotate-[0.4deg] border border-black bg-white px-[30px] pb-[38px] pt-8 transition-transform duration-300 hover:rotate-0">
            {submitted ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                <span className="anim-spin-slow inline-block text-4xl text-[#81F211]">✳</span>
                <p className="mt-5 text-2xl font-extrabold tracking-[-0.04em] text-black">감사합니다.</p>
                <p className="mt-2 text-sm text-[#666666]">곧 연락드리겠습니다.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-[26px]">
                <div>
                  <label htmlFor="name" className="block text-[10px] font-extrabold tracking-[0.2em] text-black">
                    이름 / NAME
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="홍길동"
                    className="mt-[9px] w-full border border-black bg-[#F5F5F5] px-[15px] py-3.5 text-[17px] text-black outline-none transition-colors placeholder:text-black/25 focus:bg-white focus:shadow-[3px_3px_0_#81F211]"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-[10px] font-extrabold tracking-[0.2em] text-black">
                    이메일 / EMAIL
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="hello@example.com"
                    className="mt-[9px] w-full border border-black bg-[#F5F5F5] px-[15px] py-3.5 text-[17px] text-black outline-none transition-colors placeholder:text-black/25 focus:bg-white focus:shadow-[3px_3px_0_#81F211]"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-[10px] font-extrabold tracking-[0.2em] text-black">
                    메시지 / MESSAGE
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="협업하고 싶은 내용을 자유롭게 적어주세요."
                    className="mt-[9px] w-full resize-none border border-black bg-[#F5F5F5] px-[15px] py-3.5 text-[17px] leading-[1.7] text-black outline-none transition-colors placeholder:text-black/25 focus:bg-white focus:shadow-[3px_3px_0_#81F211]"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    data-magnet
                    data-magnetic
                    className="inline-block border border-black bg-[#81F211] px-[46px] py-[17px] text-[13px] font-extrabold tracking-[0.08em] text-black shadow-[4px_4px_0_#000] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                  >
                    보내기 →
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
