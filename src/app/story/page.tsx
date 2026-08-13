"use client";

import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import PageHero from "@/components/ui/PageHero";
import Stamp from "@/components/ui/Stamp";

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

const TILT_CLASSES = ["-rotate-[1.4deg]", "rotate-[1.1deg]", "-rotate-[0.8deg]", "rotate-[1.5deg]"];

export default function StoryPage() {
  return (
    <>
      <PageHero
        pageKey="story"
        defaultTitle={"좋아하는 장면이\n사라졌을 때"}
        defaultSubtitle="인디 공연을 좋아하던 사람들이, 멈춰버린 씬을 다시 움직이기 위해 만든 팀."
        labelLeft="Story"
        labelRight="어반피크"
      />

      {/* 스토리 본문 */}
      <section className="px-6 py-24 md:py-[130px]">
        <div className="mx-auto max-w-[1000px]">
          <AnimatedSection>
            <p className="text-[clamp(24px,3.2vw,42px)] font-extrabold leading-[1.5] tracking-[-0.045em] text-black">
              좋아하던 순간이 사라졌을 때 익숙하게 찾던 공연과 무대는 더 이상{" "}
              <motion.span
                initial={{ backgroundSize: "0% 78%" }}
                whileInView={{ backgroundSize: "100% 78%" }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1], delay: 0.3 }}
                style={{
                  backgroundImage: "linear-gradient(#81F211,#81F211)",
                  backgroundPosition: "left center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                쉽게 마주할 수 없었습니다.
              </motion.span>
            </p>
            <p className="mt-10 text-[17px] leading-[2.05] text-[#666666]">
              그 자리에 남아 있던 건 여전히 음악을 좋아하는 사람들과 무언가를 만들고 싶었던 마음이었습니다.
              저희는 오래 기다릴 수 없었습니다. 멈춰버린 씬을 다시 움직이기 위해 직접 무대를 만들기 시작했습니다.
            </p>
            <p className="mt-7 text-[17px] leading-[2.05] text-[#666666]">
              그렇게 작은 공연에서 출발해 사진과 기록, 전시와 클래스까지 다양한 방식으로 경험을 확장해왔습니다.
              어반피크는 이렇게 시작되었습니다. 각자의 감도와 도시의 취향이 만나는 지점에서 우리는 지금도
              사람들이 다시 찾고 싶어지는 순간들을 만듭니다.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* 타임라인 */}
      <section className="px-6 pb-[110px]">
        <div className="mx-auto max-w-[1400px]">
          <Stamp>TIMELINE — 어반피크의 여정</Stamp>
          <div className="mt-8 border-t border-black">
            {timeline.map((item, i) => (
              <AnimatedSection key={item.num} delay={i * 0.1}>
                <div className="grid grid-cols-[48px_1fr] gap-4 border-b border-dashed border-black py-9 transition-colors hover:bg-[#F5F5F5] md:grid-cols-[96px_1fr_1.5fr] md:gap-7">
                  <span className="text-outline-thin text-3xl font-extrabold leading-none tracking-[-0.06em] md:text-[44px]">
                    {item.num}
                  </span>
                  <h3 className="text-[clamp(22px,2.6vw,32px)] font-extrabold leading-[1.2] tracking-[-0.045em] text-black">
                    {item.title}
                  </h3>
                  <p className="text-[15px] leading-[1.95] text-[#666666] max-md:col-span-2">
                    {item.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* 가치 */}
      <section className="border-t border-black bg-[#81F211] px-6 py-[100px]">
        <div className="mx-auto max-w-[1400px]">
          <Stamp variant="white">PRINCIPLES — 추구하는 가치</Stamp>
          <div className="mt-9 grid gap-[18px] md:grid-cols-3">
            {principles.map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.1}>
                <div
                  className={`border border-black bg-white px-[22px] pb-8 pt-[26px] transition-all duration-300 hover:rotate-0 hover:-translate-y-1.5 hover:shadow-[6px_6px_0_#000] ${TILT_CLASSES[i % TILT_CLASSES.length]}`}
                >
                  <h3 className="text-[clamp(22px,2.2vw,30px)] font-extrabold italic leading-[1.12] tracking-[-0.045em] text-black">
                    {item.title}
                  </h3>
                  <div className="mt-4 border-t border-dashed border-black" />
                  <p className="mt-3.5 text-sm leading-[1.9] text-[#666666]">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* 키워드 */}
      <section className="border-t border-black px-6 py-[100px]">
        <div className="mx-auto max-w-[1400px]">
          <Stamp>KEYWORDS</Stamp>
          <div className="mt-[30px] flex flex-wrap gap-2.5">
            {keywords.map((kw, i) => (
              <AnimatedSection key={kw} delay={i * 0.04}>
                <span
                  data-magnet
                  className="inline-block cursor-pointer border border-black px-5 py-2.5 text-[13px] font-bold text-black transition-all hover:bg-[#81F211] hover:shadow-[3px_3px_0_#000]"
                >
                  {kw}
                </span>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* 작업 방식 */}
      <section className="px-6 pb-[170px]">
        <div className="mx-auto max-w-[1400px]">
          <Stamp>HOW WE WORK — 작업 방식</Stamp>
          <div className="mt-8 grid gap-[18px] md:grid-cols-2">
            {howWeWork.map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.08}>
                <div
                  className={`border border-black bg-[#F5F5F5] px-6 pb-8 pt-[26px] transition-all duration-300 hover:rotate-0 hover:-translate-y-1.5 hover:shadow-[6px_6px_0_#81F211] ${TILT_CLASSES[i % TILT_CLASSES.length]}`}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="text-outline-thin text-[40px] font-extrabold leading-none tracking-[-0.05em]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="anim-spin-slow inline-block text-sm leading-none text-[#81F211]" style={{ animationDuration: "7s" }}>
                      ✳
                    </span>
                  </div>
                  <h3 className="mt-[18px] text-[clamp(24px,2.6vw,34px)] font-extrabold tracking-[-0.05em] text-black">
                    {item.title}
                  </h3>
                  <p className="mt-3.5 text-sm leading-[1.9] text-[#666666]">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
