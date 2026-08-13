"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ProjectModal, { ModalProject } from "@/components/ui/ProjectModal";
import Stamp from "@/components/ui/Stamp";
import Marquee from "@/components/ui/Marquee";
import HeroVideoLoop from "@/components/ui/HeroVideoLoop";
import { defaultProjects, defaultTeamMembers } from "@/lib/data";

interface Project { id: number | string; tag: string; title: string; category: string; description: string; symbol_url: string; thumbnail_url?: string | null; gallery_images?: string | null; display_order: number; status?: string; }
interface TeamMember { id: number | string; role: string; name: string; description: string; profile_image?: string | null; display_order: number; }
interface MerchandiseItem { id: number | string; name: string; description: string; image_url: string | null; images: string | null; display_order: number; }

const TICKER_WORDS = ["NOW BOOKING", "SEOUL 2019—", "공연 · 기록 · 전시 · 클래스", "OPEN CALL", "CULTURE PLANNING", "꼭대기에서 만나요"];

const TILT_CLASSES = [
  "-rotate-[1.4deg]",
  "rotate-[1.1deg]",
  "-rotate-[0.8deg]",
  "rotate-[1.5deg]",
  "-rotate-1",
  "rotate-[0.7deg]",
];

function CharLine({ text, outline = false, startDelay = 0, trailing }: { text: string; outline?: boolean; startDelay?: number; trailing?: React.ReactNode }) {
  const chars = Array.from(text);
  return (
    <div className="overflow-hidden pb-[0.08em]">
      <div className="flex flex-wrap items-center gap-x-[0.02em]">
        {chars.map((ch, i) => (
          <span
            key={i}
            className={`char-anim text-[clamp(34px,5.5vw,84px)] font-extrabold leading-[0.98] tracking-[-0.06em] ${outline ? "text-outline" : "text-black"}`}
            style={{ animationDelay: `${startDelay + i * 0.05}s` }}
          >
            {ch === " " ? " " : ch}
          </span>
        ))}
        {trailing}
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100vh-63px)] flex-col justify-center overflow-hidden border-b border-black bg-[#F5F5F5] px-6 pb-28 pt-24 md:pt-20">
      <HeroVideoLoop />
      <div className="hatch-bg-anim absolute inset-0" aria-hidden="true" />
      <div className="lime-glow absolute inset-0" aria-hidden="true" />

      {/* 원형 회전 텍스트 */}
      <div className="anim-spin-slow absolute right-9 top-8 hidden h-[120px] w-[120px] md:block" style={{ animationDuration: "18s" }} aria-hidden="true">
        <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
          <defs>
            <path id="circ" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
          </defs>
          <text style={{ fontSize: "10.5px", fontWeight: 800, letterSpacing: "0.22em", fill: "#000" }}>
            <textPath href="#circ">URBAN PEAK · CULTURE · SEOUL · 2019 — </textPath>
          </text>
        </svg>
      </div>
      <div className="anim-spin-reverse absolute right-[78px] top-[76px] hidden text-4xl leading-none text-[#81F211] md:block" aria-hidden="true">✳</div>

      {/* 떠다니는 심볼 */}
      <Image src="/images/logos/symbol-orange.png" alt="" width={58} height={58} className="anim-floaty absolute left-[36%] top-[8%] z-0 h-[58px] w-auto" aria-hidden="true" />
      <Image src="/images/logos/symbol-teal.png" alt="" width={46} height={46} className="anim-floaty absolute right-[27%] top-[13%] z-0 h-[46px] w-auto" style={{ animationDuration: "6.5s" }} aria-hidden="true" />

      <div className="relative z-10 mx-auto w-full max-w-[1400px]">
        <CharLine text="새로운 장면을" />
        <CharLine text="만드는" startDelay={0.35} />
        <CharLine
          text="문화 기획 스튜디오"
          outline
          startDelay={0.5}
          trailing={
            <span className="char-anim ml-[0.08em] text-[clamp(24px,3.6vw,56px)] leading-none text-[#81F211]" style={{ animationDelay: "1s" }}>
              <span className="anim-spin-slow inline-block">✳</span>
            </span>
          }
        />

        <div className="mt-10 flex flex-wrap items-end justify-between gap-8">
          <AnimatedSection>
            <p className="max-w-[440px] text-[15px] font-semibold leading-[1.85] tracking-[-0.02em] text-black md:text-base">
              다양한 방식의 콘텐츠로 공연과 기록, 창작을 넘나들며<br />
              도시의 취향들을 연결해{" "}
              <span className="inline-block -rotate-[1.5deg] border border-black bg-[#81F211] px-2">장면</span>
              으로 만듭니다.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/projects"
                data-magnet
                data-magnetic
                className="inline-block border border-black bg-black px-9 py-[17px] text-[13px] font-extrabold tracking-[0.08em] text-[#81F211]"
              >
                프로젝트 보기
              </Link>
              <Link
                href="/story"
                data-magnet
                data-magnetic
                className="inline-block border border-black bg-white px-9 py-[17px] text-[13px] font-extrabold tracking-[0.08em] text-black shadow-[4px_4px_0_#81F211] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
              >
                어반피크 이야기
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* 하단 바 */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-dashed border-black bg-white px-6 py-[13px]">
        <span className="font-mono text-[11px] font-extrabold tracking-[0.2em] text-[#666666]">
          공연 · 기록 · 전시 · 클래스
        </span>
        <span className="anim-wave inline-block font-mono text-[11px] font-extrabold tracking-[0.2em] text-black">
          SCROLL ↓
        </span>
      </div>
    </section>
  );
}

function ProjectRow({ project, index, onClick }: { project: Project; index: number; onClick: () => void }) {
  const num = String(index + 1).padStart(2, "0");
  return (
    <div
      onClick={onClick}
      data-preview={project.category || project.title}
      data-preview-img={project.thumbnail_url || ""}
      className="group grid cursor-pointer grid-cols-[48px_1fr] items-center gap-4 border-b border-dashed border-black py-8 transition-all duration-300 hover:bg-[#81F211] hover:pl-6 md:grid-cols-[96px_1fr_220px_110px] md:gap-7 md:py-[34px]"
    >
      <span className="text-outline-thin text-3xl font-extrabold leading-none tracking-[-0.06em] md:text-[44px]">
        {num}
      </span>
      <div>
        <h3 className="text-[clamp(26px,3.6vw,52px)] font-extrabold leading-[1.04] tracking-[-0.055em] text-black">
          {project.title}
        </h3>
        <p className="mt-3 line-clamp-2 max-w-[640px] text-sm leading-[1.85] text-[#666666] group-hover:text-black/70">
          {project.description}
        </p>
      </div>
      <p className="hidden text-[10px] font-extrabold tracking-[0.2em] text-[#666666] group-hover:text-black/60 md:block">
        {project.category}
      </p>
      <span className="hidden justify-self-end border border-black px-2.5 py-1.5 text-xs font-extrabold tracking-[0.08em] text-black md:inline-block">
        {project.tag}
      </span>
    </div>
  );
}

function EmptyRows({ message }: { message: string }) {
  return (
    <div className="mt-9 border border-dashed border-black p-14 text-center">
      <span className="anim-spin-slow inline-block text-3xl text-[#81F211]">✳</span>
      <p className="mt-3.5 text-sm font-semibold text-[#666666]">{message}</p>
    </div>
  );
}

function ProjectsSection({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const upcomingProjects = projects.filter((p) => !p.status || p.status === "upcoming");
  const pastProjects = projects.filter((p) => p.status === "past");
  const tabProjects = activeTab === "upcoming" ? upcomingProjects : pastProjects;

  return (
    <section className="px-6 py-24 md:py-[130px]">
      <div className="mx-auto max-w-[1400px]">
        <AnimatedSection>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Stamp>진행 프로젝트</Stamp>
              <h2 className="mt-[22px] text-[clamp(30px,4vw,54px)] font-extrabold tracking-[-0.05em] text-black">
                어반피크가 함께 하는 프로젝트
              </h2>
            </div>
            <Link
              href="/projects"
              data-magnet
              data-magnetic
              className="flex-shrink-0 border border-black px-5 py-3 text-xs font-extrabold tracking-[0.12em] text-black shadow-[3px_3px_0_#81F211] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
            >
              모든 프로젝트 →
            </Link>
          </div>

          {/* 탭 */}
          <div className="mt-8 flex gap-2.5">
            <button
              onClick={() => setActiveTab("upcoming")}
              data-magnet
              className={`border border-black px-[22px] py-2.5 text-xs font-extrabold tracking-[0.1em] text-black transition-colors ${activeTab === "upcoming" ? "bg-[#81F211]" : "bg-white"}`}
            >
              진행 예정 · 현재
            </button>
            <button
              onClick={() => setActiveTab("past")}
              data-magnet
              className={`border border-black px-[22px] py-2.5 text-xs font-extrabold tracking-[0.1em] text-black transition-colors ${activeTab === "past" ? "bg-[#81F211]" : "bg-white"}`}
            >
              지난 프로젝트
            </button>
          </div>
        </AnimatedSection>

        {tabProjects.length === 0 ? (
          <EmptyRows message={activeTab === "upcoming" ? "진행 예정 프로젝트가 없습니다." : "지난 프로젝트가 없습니다."} />
        ) : (
          <div className="mt-9 border-t border-black">
            {tabProjects.map((project, index) => (
              <ProjectRow key={project.id} project={project} index={index} onClick={() => setSelected(project)} />
            ))}
          </div>
        )}
      </div>

      <ProjectModal project={selected as ModalProject | null} onClose={() => setSelected(null)} />
    </section>
  );
}

function TeamSection({ members }: { members: TeamMember[] }) {
  return (
    <section id="team" className="border-t border-black bg-[#81F211] px-6 pb-[120px] pt-[110px]">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <AnimatedSection>
            <h2 className="text-[clamp(30px,4vw,54px)] font-extrabold leading-[1.02] tracking-[-0.05em] text-black">
              어반피크를<br />만드는 사람들
            </h2>
          </AnimatedSection>
          <Stamp variant="white">TEAM</Stamp>
        </div>

        <div className="mt-[54px] grid gap-6 md:grid-cols-3">
          {members.map((member, index) => (
            <AnimatedSection key={member.id} delay={index * 0.08} className="h-full">
              <div
                className={`group relative flex h-full cursor-default flex-col overflow-hidden border border-black bg-white p-6 pb-7 transition-all duration-300 hover:rotate-0 hover:-translate-y-2 hover:shadow-[8px_8px_0_#000] ${TILT_CLASSES[index % TILT_CLASSES.length]}`}
              >
                <span className="dash-strip absolute left-0 right-0 top-0 h-1.5" aria-hidden="true" />
                <div className="flex items-start justify-between gap-3">
                  <span className="text-outline-thin text-[64px] font-extrabold leading-none tracking-[-0.06em] transition-colors group-hover:text-[#81F211]" style={{ WebkitTextStroke: "1.5px #000" }}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-1 border border-black bg-[#81F211] px-2 py-1 text-right text-[9px] font-extrabold leading-relaxed tracking-[0.18em] text-black">
                    {member.role}
                  </span>
                </div>
                <h3 className="mt-7 text-[clamp(28px,2.8vw,38px)] font-extrabold tracking-[-0.05em] text-black">
                  {member.name}
                </h3>
                <div className="mt-3.5 border-t border-dashed border-black" />
                <p className="mt-3.5 flex-1 text-sm leading-[1.9] text-[#666666]">{member.description}</p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="font-mono text-[10px] font-extrabold tracking-[0.2em] text-[#666666]">
                    URBAN PEAK CREW
                  </span>
                  <span className="anim-spin-slow inline-block text-base leading-none text-[#81F211]" aria-hidden="true">
                    ✳
                  </span>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.2} className="mt-9">
          <Link
            href="/story"
            data-magnet
            className="border-b-2 border-black pb-1 text-[13px] font-extrabold tracking-[0.1em] text-black"
          >
            팀 이야기 더 보기 →
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}

function MerchandiseSection({ items }: { items: MerchandiseItem[] }) {
  return (
    <section className="border-t border-black px-6 py-24 md:py-[110px]">
      <div className="mx-auto max-w-[1400px]">
        <AnimatedSection>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Stamp>MERCHANDISE</Stamp>
              <h2 className="mt-[22px] text-[clamp(30px,4vw,54px)] font-extrabold tracking-[-0.05em] text-black">
                어반피크 굿즈
              </h2>
            </div>
            <Link
              href="/merchandise"
              data-magnet
              data-magnetic
              className="flex-shrink-0 border border-black px-5 py-3 text-xs font-extrabold tracking-[0.12em] text-black shadow-[3px_3px_0_#81F211] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
            >
              모든 굿즈 →
            </Link>
          </div>
        </AnimatedSection>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.slice(0, 3).map((item, index) => {
            let imgs: string[] = [];
            try { imgs = JSON.parse(item.images || "[]"); } catch { imgs = []; }
            if (imgs.length === 0 && item.image_url) imgs = [item.image_url];
            return (
              <AnimatedSection key={item.id} delay={index * 0.08}>
                <div
                  className={`border border-black bg-white px-3.5 pb-6 pt-3.5 transition-all duration-300 hover:rotate-0 hover:-translate-y-2 hover:shadow-[8px_8px_0_#81F211] ${TILT_CLASSES[index % TILT_CLASSES.length]}`}
                >
                  <div className="placeholder-stripes relative aspect-[4/3] overflow-hidden border border-black">
                    {imgs.length > 0 ? (
                      <Image src={imgs[0]} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="font-mono text-[11px] font-bold tracking-[0.16em] text-[#666666]">이미지 없음</span>
                      </div>
                    )}
                  </div>
                  <h3 className="mt-4 text-lg font-extrabold tracking-[-0.03em] text-black">{item.name}</h3>
                  {item.description && (
                    <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-[#666666]">{item.description}</p>
                  )}
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ContactCTA() {
  return (
    <section className="px-6 pb-[170px] pt-[110px]">
      <AnimatedSection>
        <div className="relative mx-auto max-w-[1000px] border border-black bg-[#F5F5F5] px-10 py-[72px] text-center">
          <span className="dash-strip absolute -left-px -top-px right-[-1px] h-2" aria-hidden="true" />
          <span className="anim-spin-reverse absolute right-[26px] top-[26px] text-[44px] leading-none text-[#81F211]" aria-hidden="true">✳</span>
          <Stamp>CONTACT</Stamp>
          <p className="mt-[34px] text-[clamp(32px,5.2vw,72px)] font-extrabold leading-[1.04] tracking-[-0.055em] text-black">
            함께 만들고 싶은<br />장면이 있나요?
          </p>
          <p className="mt-5 text-sm font-semibold text-[#666666]">다양한 방식의 협업에 열려 있습니다.</p>
          <div className="mt-8">
            <Link
              href="/contact"
              data-magnet
              data-magnetic
              className="inline-block border border-black bg-[#81F211] px-[42px] py-[18px] text-[13px] font-extrabold tracking-[0.08em] text-black shadow-[4px_4px_0_#000] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              협업 제안하기
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>(defaultProjects as Project[]);
  const [members, setMembers] = useState<TeamMember[]>(defaultTeamMembers as TeamMember[]);
  const [merchandise, setMerchandise] = useState<MerchandiseItem[]>([]);

  useEffect(() => {
    fetch("/api/projects").then(r => r.json()).then(d => { if (Array.isArray(d) && d.length > 0) setProjects(d); }).catch(() => {});
    fetch("/api/team").then(r => r.json()).then(d => { if (Array.isArray(d) && d.length > 0) setMembers(d); }).catch(() => {});
    fetch("/api/merchandise").then(r => r.json()).then(d => { if (Array.isArray(d) && d.length > 0) setMerchandise(d); }).catch(() => {});
  }, []);

  return (
    <>
      <HeroSection />
      <ProjectsSection projects={projects} />
      <TeamSection members={members} />
      <Marquee items={TICKER_WORDS} variant="light" />
      {merchandise.length > 0 && <MerchandiseSection items={merchandise} />}
      <ContactCTA />
    </>
  );
}
