"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ProjectModal, { ModalProject } from "@/components/ui/ProjectModal";
import { defaultProjects } from "@/lib/data";

interface Project {
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

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(
    defaultProjects as Project[],
  );
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d) && d.length > 0) setProjects(d);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero-gradient relative flex min-h-[45vh] flex-col overflow-hidden">
        {/* top edge bar */}
        <div className="flex items-center justify-between px-8 pt-6 md:px-14 lg:px-20">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1a1a1a]/35">
            Projects
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1a1a1a]/35">
            진행 프로젝트
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
            어반피크가 함께 하는
            <br />
            프로젝트
          </motion.h1>

          <motion.p
            className="mt-5 text-[14px] text-[#6b6b6b]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.35 }}
          >
            어반피크가 기획하는 독립 문화 프로젝트
          </motion.p>

          {/* short accent rule */}
          <motion.div
            className="mt-7 h-px w-10 origin-left bg-[#1a1a1a]/30"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease, delay: 0.55 }}
          />
        </div>

        {/* animated bottom rule */}
        <motion.div
          className="mx-8 mb-0 h-px origin-left bg-[#1a1a1a]/10 md:mx-14 lg:mx-20"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, ease, delay: 0.3 }}
        />
      </section>

      {/* ── Project cards ────────────────────────────────── */}
      <section className="px-8 py-16 md:px-14 md:py-24 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <AnimatedSection key={project.id} delay={index * 0.08}>
                <div
                  className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  onClick={() => setSelected(project)}
                >
                  {/* dark top panel */}
                  <div className="relative flex h-56 flex-col justify-between bg-[#1a1a2e] p-7">
                    {project.thumbnail_url && (
                      <Image
                        src={project.thumbnail_url}
                        alt={project.title}
                        fill
                        className="object-cover opacity-60"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-[#1a1a2e]/60 to-transparent" />
                    <span className="relative z-10 text-[10px] font-semibold uppercase tracking-widest text-white/30">
                      {project.tag}
                    </span>
                    <div className="relative z-10 flex items-end justify-between">
                      <h2 className="text-xl font-bold leading-snug text-white">
                        {project.title}
                      </h2>
                      {!project.thumbnail_url && (
                        <Image
                          src={project.symbol_url}
                          alt={project.title}
                          width={56}
                          height={56}
                          className="ml-4 h-14 w-14 flex-shrink-0 opacity-70 transition-opacity group-hover:opacity-90"
                        />
                      )}
                    </div>
                  </div>

                  {/* white bottom panel */}
                  <div className="flex h-[200px] flex-col p-7">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a0a0a0]">
                      {project.category}
                    </p>
                    <div className="mt-3 h-px w-8 bg-[#1a1a1a]/15" />
                    <div className="relative mt-3 flex-1 overflow-hidden">
                      <p className="line-clamp-5 text-[13px] leading-[1.8] text-[#6b6b6b]">
                        {project.description}
                      </p>
                      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
                    </div>
                    <span className="mt-auto inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-widest text-[#1a1a1a]/40 transition-colors group-hover:text-[#1a1a1a]/80">
                      자세히 보기
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <ProjectModal
        project={selected as ModalProject | null}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
