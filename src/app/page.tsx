"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ProjectModal, { ModalProject } from "@/components/ui/ProjectModal";
import { defaultProjects, defaultTeamMembers } from "@/lib/data";

interface Project { id: number | string; tag: string; title: string; category: string; description: string; symbol_url: string; thumbnail_url?: string | null; gallery_images?: string | null; display_order: number; }
interface TeamMember { id: number | string; role: string; name: string; description: string; profile_image?: string | null; display_order: number; }

function PillTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-[#d4cfc8] bg-white/50 px-3.5 py-1 text-[11px] font-medium uppercase tracking-widest text-[#8a8a8a]">
      {children}
    </span>
  );
}

function HeroSection() {
  return (
    <section className="hero-gradient relative flex min-h-screen flex-col overflow-hidden">
      {/* Top edge bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="flex items-center justify-between px-8 pt-8 md:px-14 lg:px-20"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1a1a1a]/35">
          문화 기획 스튜디오
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1a1a1a]/35">
          Seoul · 2019—
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
      <div className="relative flex flex-1 items-center px-8 md:px-14 lg:px-20">
        {/* Symbol — desktop right side */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.4, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 md:right-14 lg:right-20 lg:block"
          aria-hidden="true"
        >
          <Image
            src="/images/logos/symbol-orange.png"
            alt=""
            width={440}
            height={440}
            className="h-[300px] w-[300px] object-contain opacity-[0.22] xl:h-[380px] xl:w-[380px]"
          />
        </motion.div>

        {/* Left: text block */}
        <div className="relative z-10 w-full py-16 md:py-24 lg:max-w-[60%]">
          {/* Logo mark */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Image
              src="/images/logos/logo-horizontal.png"
              alt="Urban Peak"
              width={120}
              height={24}
              className="h-[22px] w-auto opacity-55"
              priority
            />
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mt-8 text-[2.8rem] font-bold leading-[1.08] text-[#111] md:text-[3.8rem] lg:text-[5rem] xl:text-[5.8rem]"
            style={{ letterSpacing: "-0.035em" }}
          >
            새로운 장면을<br />만드는<br />문화 기획 스튜디오
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
            다양한 방식의 콘텐츠로 공연과 기록, 창작을 넘나들며<br className="hidden sm:block" />
            도시의 취향들을 연결해 장면으로 만듭니다.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-9 flex items-center gap-3"
          >
            <Link
              href="/projects"
              className="rounded-full bg-[#1a1a1a] px-7 py-3.5 text-[13px] font-medium text-white transition-all duration-200 hover:bg-[#2e2e2e]"
            >
              프로젝트 보기
            </Link>
            <Link
              href="/story"
              className="rounded-full border border-[#1a1a1a]/18 px-7 py-3.5 text-[13px] font-medium text-[#1a1a1a] transition-all duration-200 hover:border-[#1a1a1a]/35 hover:bg-white/50"
            >
              어반피크 이야기
            </Link>
          </motion.div>
        </div>

        {/* Vertical label — far right, desktop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="pointer-events-none absolute bottom-12 right-8 hidden md:right-14 lg:right-6 lg:block"
          aria-hidden="true"
        >
          <span
            className="block text-[9px] font-semibold uppercase tracking-[0.32em] text-[#1a1a1a]/22"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            Urban Peak · Culture Studio
          </span>
        </motion.div>
      </div>

      {/* Bottom rule */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.1, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mx-8 h-px origin-left bg-[#1a1a1a]/10 md:mx-14 lg:mx-20"
      />

      {/* Bottom bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="flex items-center justify-between px-8 pb-7 pt-4 md:px-14 lg:px-20"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1a1a1a]/30">
          공연 · 기록 · 전시 · 클래스
        </span>
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1a1a1a]/30"
        >
          <span>스크롤</span>
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
            <path d="M1.5 3L4.5 6L7.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  return (
    <div
      className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
      onClick={onClick}
    >
      {/* Dark top */}
      <div className="relative flex h-48 items-end justify-between bg-[#1a1a2e] p-6">
        {project.thumbnail_url && (
          <Image
            src={project.thumbnail_url}
            alt={project.title}
            fill
            className="object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-[#1a1a2e]/60 to-transparent" />
        <div className="relative z-10 flex-1">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/35">
            {project.tag}
          </span>
          <h3 className="mt-1.5 text-lg font-bold leading-snug text-white">
            {project.title}
          </h3>
        </div>
        {!project.thumbnail_url && (
          <Image
            src={project.symbol_url}
            alt={project.title}
            width={60}
            height={60}
            className="relative z-10 ml-4 h-12 w-12 flex-shrink-0 opacity-75 transition-opacity group-hover:opacity-95"
          />
        )}
      </div>
      {/* White bottom */}
      <div className="flex h-[180px] flex-col p-6">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a0a0a0]">
          {project.category}
        </p>
        <div className="relative mt-3 flex-1 overflow-hidden">
          <p className="line-clamp-4 text-[13px] leading-relaxed text-[#6b6b6b]">
            {project.description}
          </p>
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent" />
        </div>
        <span className="mt-auto inline-flex items-center gap-1 text-[13px] font-medium text-[#1a1a1a] opacity-60 transition-opacity group-hover:opacity-100">
          자세히 보기
          <span aria-hidden="true">&rarr;</span>
        </span>
      </div>
    </div>
  );
}

function ProjectsSection({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);
  const displayed = projects.slice(0, 3);

  return (
    <section className="px-5 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <AnimatedSection>
          <PillTag>진행 프로젝트</PillTag>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#1a1a1a] md:text-3xl">
            어반피크가 함께 하는 프로젝트
          </h2>
        </AnimatedSection>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {displayed.map((project, index) => (
            <AnimatedSection key={project.id} delay={index * 0.08}>
              <ProjectCard project={project} onClick={() => setSelected(project)} />
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.25} className="mt-8 text-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#1a1a1a] opacity-50 transition-opacity hover:opacity-90"
          >
            모든 프로젝트 보기
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </AnimatedSection>
      </div>

      <ProjectModal project={selected as ModalProject | null} onClose={() => setSelected(null)} />
    </section>
  );
}

function TeamSection({ members }: { members: TeamMember[] }) {
  return (
    <section className="px-5 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <AnimatedSection>
          <PillTag>Team</PillTag>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#1a1a1a] md:text-3xl">
            어반피크를 만드는 사람들
          </h2>
        </AnimatedSection>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {members.map((member, index) => (
            <AnimatedSection key={member.id} delay={index * 0.08}>
              <div className="rounded-2xl bg-white p-8 shadow-sm">
                {member.profile_image && (
                  <img 
                    src={member.profile_image} 
                    alt={member.name} 
                    className="mx-auto mb-4 h-20 w-20 rounded-full object-cover"
                  />
                )}
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a0a0a0]">
                  {member.role}
                </p>
                <h3 className="mt-2 text-2xl font-bold text-[#1a1a1a]">
                  {member.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#6b6b6b]">
                  {member.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.2} className="mt-8">
          <Link
            href="/story"
            className="inline-flex items-center gap-1 text-[13px] font-medium text-[#1a1a1a] opacity-50 transition-opacity hover:opacity-90"
          >
            팀 이야기 더 보기
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}

function ContactCTA() {
  return (
    <section className="px-5 pb-24 md:pb-32">
      <div className="mx-auto max-w-6xl">
        <AnimatedSection>
          <div className="rounded-3xl bg-[#1a1a2e] px-8 py-16 text-center md:py-20">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
              Contact
            </p>
            <h2 className="mt-4 text-2xl font-bold text-white md:text-3xl">
              함께 만들고 싶은 장면이 있나요?
            </h2>
            <p className="mt-3 text-sm text-white/50">
              다양한 방식의 협업을 열려 있습니다.
            </p>
            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-block rounded-full bg-white px-8 py-3 text-[13px] font-medium text-[#1a1a2e] transition-opacity hover:opacity-85"
              >
                협업 제안하기
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>(defaultProjects as Project[]);
  const [members, setMembers] = useState<TeamMember[]>(defaultTeamMembers as TeamMember[]);

  useEffect(() => {
    fetch("/api/projects").then(r => r.json()).then(d => { if (Array.isArray(d) && d.length > 0) setProjects(d); }).catch(() => {});
    fetch("/api/team").then(r => r.json()).then(d => { if (Array.isArray(d) && d.length > 0) setMembers(d); }).catch(() => {});
  }, []);

  return (
    <>
      <HeroSection />
      <ProjectsSection projects={projects} />
      <TeamSection members={members} />
      <ContactCTA />
    </>
  );
}
