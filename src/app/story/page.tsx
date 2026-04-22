"use client";

import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";

const timeline = [
  {
    num: "01",
    title: "우리가 만든 첫 시작",
    desc: "좋아하는 것들을 계속 이어가기 위해 작은 공연을 직접 만들기 시작했습니다.",
  },
  {
    num: "02",
    title: "경계를 넘어가다",
    desc: "공연은 기록으로, 기록은 전시로, 전시는 또 다른 창작과 클래스로 이어지며 하나의 흐름을 만들어갔습니다.",
  },
  {
    num: "03",
    title: "지금의 어반피크",
    desc: "어반피크는 다양한 취향을 가진 사람들이 감도 높은 문화를 즐기고, 창작자와 퍼포머가 자신의 작업을 선보일 수 있는 기회를 만드는 문화 기획 스튜디오입니다.",
  },
];

const principles = [
  {
    title: "Refined Energy",
    desc: "제한된 환경과 자원 안에서도 불필요한 요소를 덜어내고 꼭 필요한 선택에 집중해 작은 차이로도 깊은 인상을 남깁니다.",
  },
  {
    title: "Connected Diversity",
    desc: "서로 다른 취향과 역할이 자연스럽게 연결될 수 있도록 다양한 사람과 콘텐츠를 하나의 경험으로 엮어냅니다.",
  },
  {
    title: "Sustainable Experience",
    desc: "단발성 이벤트에 그치지 않고 기록과 전시, 클래스와 공연까지 이어지는 지속 가능한 흐름을 만듭니다.",
  },
];

const keywords = ["크리에이티브", "공연", "전시", "클래스", "다양성", "협업", "실험", "커뮤니티", "라이프스타일", "콘텐츠기획", "문화경험"];

const howWeWork = [
  {
    title: "Mood",
    desc: "프로젝트의 시작은 콘텐츠의 아이덴티티를 정의하는 것에서 출발합니다. 단순한 콘셉트 설정을 넘어 전달하고자 하는 메시지와 감정의 결, 전체 분위기까지 구체화해 경험의 방향을 설정합니다.",
  },
  {
    title: "Space",
    desc: "정의된 아이덴티티가 실제 경험으로 이어질 수 있도록 공간과 동선을 설계합니다. 구성과 흐름을 통해 자연스럽게 몰입하고 체감할 수 있는 입체적인 경험을 만들어냅니다.",
  },
  {
    title: "Cast",
    desc: "콘텐츠의 결에 맞는 창작자 혹은 퍼포머를 구성합니다. 단순한 섭외를 넘어, 각자의 개성과 역할이 하나의 방향 안에서 유기적으로 연결되도록 설계합니다.",
  },
  {
    title: "Archive",
    desc: "경험이 끝난 이후까지 고려합니다. 사진, 영상, 기록 방식을 함께 기획해 프로젝트가 다시 확장되고 이어질 수 있는 형태로 남깁니다.",
  },
];

export default function StoryPage() {
  return (
    <>
      {/* Hero */}
      <section className="story-gradient relative flex min-h-[55vh] flex-col overflow-hidden">
        {/* Top edge bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="flex items-center justify-between px-8 pt-8 md:px-14 lg:px-20"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1a1a1a]/40">
            Story
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1a1a1a]/40">
            어반피크
          </span>
        </motion.div>

        {/* Top rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mx-8 mt-4 h-px origin-left bg-[#1a1a1a]/10 md:mx-14 lg:mx-20"
        />

        {/* Main content */}
        <div className="flex flex-1 items-center px-8 md:px-14 lg:px-20">
          <div className="w-full py-16 md:py-24">
            {/* Small label */}
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1a1a1a]/40"
            >
              Story
            </motion.span>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mt-6 text-[2.8rem] font-bold leading-[1.08] text-[#111] md:text-[3.8rem] lg:text-[5rem]"
              style={{ letterSpacing: "-0.035em" }}
            >
              좋아하는 장면이<br />사라졌을 때
            </motion.h1>

            {/* Short rule accent */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mt-8 h-px w-10 origin-left bg-[#1a1a1a]/30"
            />

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.75 }}
              className="mt-5 max-w-sm text-[14px] leading-[1.85] text-[#6b6b6b]"
            >
              인디 공연을 좋아하던 사람들이, 멈춰버린 씬을 다시 움직이기 위해 만든 팀.
              어반피크의 출발점은 새로운 장면을 연결하는 방식에서 시작됩니다.
            </motion.p>
          </div>
        </div>

        {/* Bottom rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mx-8 mb-8 h-px origin-left bg-[#1a1a1a]/10 md:mx-14 lg:mx-20"
        />
      </section>

      {/* Story text */}
      <section className="px-5 py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <AnimatedSection>
            <p className="border-l-2 border-[#1a1a1a]/15 pl-6 text-[1.05rem] leading-[2.2] text-[#4a4a4a]">
              좋아하던 순간이 사라졌을 때 익숙하게 찾던 공연과 무대는 더 이상 쉽게 마주할 수 없었습니다.
              그 자리에 남아 있던 건 여전히 음악을 좋아하는 사람들과 무언가를 만들고 싶었던 마음이었습니다.
            </p>
            <p className="mt-7 text-[15px] leading-[2] text-[#4a4a4a]">
              저희는 오래 기다릴 수 없었습니다.
              멈춰버린 씬을 다시 움직이기 위해 직접 무대를 만들기 시작했습니다.
              그렇게 작은 공연에서 출발해 사진과 기록, 전시와 클래스까지 다양한 방식으로 경험을 확장해왔습니다.
            </p>
            <p className="mt-7 text-[15px] leading-[2] text-[#4a4a4a]">
              어반피크는 이렇게 시작되었습니다.
              각자의 감도와 도시의 취향이 만나는 지점에서 우리는 지금도 사람들이 다시 찾고 싶어지는 순간들을 만듭니다.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-5 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <AnimatedSection>
            <div className="border-t border-[#1a1a1a]/10 pt-6">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1a1a1a]/40">
                Timeline
              </span>
              <h2
                className="mt-3 text-[1.6rem] font-bold leading-[1.15] text-[#111] md:text-[2rem]"
                style={{ letterSpacing: "-0.025em" }}
              >
                어반피크의 여정
              </h2>
            </div>
          </AnimatedSection>

          <div className="mt-10">
            {timeline.map((item, i) => (
              <AnimatedSection key={item.num} delay={i * 0.1}>
                <div
                  className={`grid grid-cols-[3rem_1fr] gap-x-8 gap-y-0 border-t border-[#1a1a1a]/10 py-8 md:grid-cols-[4rem_16rem_1fr]${
                    i === timeline.length - 1 ? " border-b border-[#1a1a1a]/10" : ""
                  }`}
                >
                  <span className="text-[11px] font-bold tracking-widest text-[#1a1a1a]/30">
                    {item.num}
                  </span>
                  <h3 className="text-[15px] font-bold text-[#111] max-md:col-span-1">
                    {item.title}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-[#6b6b6b] max-md:col-span-2 max-md:mt-2">
                    {item.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="px-5 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <AnimatedSection>
            <div className="border-t border-[#1a1a1a]/10 pt-6">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1a1a1a]/40">
                Principles
              </span>
              <h2
                className="mt-3 text-[1.6rem] font-bold leading-[1.15] text-[#111] md:text-[2rem]"
                style={{ letterSpacing: "-0.025em" }}
              >
                어반피크가 추구하는 가치
              </h2>
            </div>
          </AnimatedSection>

          <div className="mt-10">
            {principles.map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.1}>
                <div
                  className={`grid grid-cols-1 gap-8 border-t border-[#1a1a1a]/10 py-10 md:grid-cols-[1fr_1.8fr]${
                    i === principles.length - 1 ? " border-b border-[#1a1a1a]/10" : ""
                  }`}
                >
                  <h3 className="text-[1.4rem] font-bold italic text-[#111] md:text-[1.8rem]">
                    {item.title}
                  </h3>
                  <p className="max-w-xl text-[14px] leading-[1.9] text-[#6b6b6b]">
                    {item.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Keywords */}
      <section className="px-5 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <AnimatedSection>
            <div className="border-t border-[#1a1a1a]/10 pt-6">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1a1a1a]/40">
                Keywords
              </span>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {keywords.map((kw) => (
                <span
                  key={kw}
                  className="rounded-full border border-[#1a1a1a]/15 px-5 py-2 text-[13px] text-[#4a4a4a]"
                >
                  {kw}
                </span>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* How We Work */}
      <section className="px-5 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <AnimatedSection>
            <div className="border-t border-[#1a1a1a]/10 pt-6">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1a1a1a]/40">
                How We Work
              </span>
              <h2
                className="mt-3 text-[1.6rem] font-bold leading-[1.15] text-[#111] md:text-[2rem]"
                style={{ letterSpacing: "-0.025em" }}
              >
                우리의 작업 방식
              </h2>
            </div>
          </AnimatedSection>

          <div className="mt-10 grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
            {howWeWork.map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.08}>
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-[#1a1a1a]/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-[15px] font-bold text-[#111]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#6b6b6b]">
                    {item.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
