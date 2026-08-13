"use client";

import { useState } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ProjectModal, { ModalProject } from "@/components/ui/ProjectModal";
import PageHero, { PageSetting } from "@/components/ui/PageHero";
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
  status?: string;
}

export default function ProjectsClient({
  initialProjects,
  setting,
}: {
  initialProjects: Project[];
  setting: PageSetting | null;
}) {
  const projects = initialProjects.length > 0 ? initialProjects : (defaultProjects as Project[]);
  const [selected, setSelected] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const upcomingProjects = projects.filter(p => !p.status || p.status === "upcoming");
  const pastProjects = projects.filter(p => p.status === "past");
  const displayedProjects = activeTab === "upcoming" ? upcomingProjects : pastProjects;

  return (
    <>
      <PageHero
        setting={setting}
        defaultTitle={"어반피크가 함께 하는\n프로젝트"}
        defaultSubtitle="어반피크가 기획하는 독립 문화 프로젝트"
        labelLeft="Projects"
        labelRight="진행 프로젝트"
      />

      <section className="px-6 pb-[130px] pt-20">
        <div className="mx-auto max-w-[1400px]">
          {/* 탭 */}
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setActiveTab("upcoming")}
              data-magnet
              className={`border border-black px-[22px] py-2.5 text-xs font-extrabold tracking-[0.1em] text-black transition-colors ${activeTab === "upcoming" ? "bg-[#81F211]" : "bg-white"}`}
            >
              진행 예정 · 현재 ({upcomingProjects.length})
            </button>
            <button
              onClick={() => setActiveTab("past")}
              data-magnet
              className={`border border-black px-[22px] py-2.5 text-xs font-extrabold tracking-[0.1em] text-black transition-colors ${activeTab === "past" ? "bg-[#81F211]" : "bg-white"}`}
            >
              지난 프로젝트 ({pastProjects.length})
            </button>
          </div>
          <p className="mt-[18px] hidden font-mono text-[13px] text-[#666666] md:block">
            HOVER A ROW — 장면이 따라옵니다
          </p>

          {displayedProjects.length === 0 ? (
            <div className="mt-8 border border-dashed border-black p-16 text-center">
              <span className="anim-spin-slow inline-block text-3xl text-[#81F211]">✳</span>
              <p className="mt-3.5 text-sm font-semibold text-[#666666]">
                {activeTab === "upcoming" ? "진행 예정 프로젝트가 없습니다." : "지난 프로젝트가 없습니다."}
              </p>
            </div>
          ) : (
            <div className="hand-line-t mt-8">
              {displayedProjects.map((project, index) => (
                <AnimatedSection key={project.id} delay={index * 0.06}>
                  <div
                    onClick={() => setSelected(project)}
                    data-preview={project.category || project.title}
                    data-preview-img={project.thumbnail_url || ""}
                    className="group grid cursor-pointer grid-cols-[48px_1fr] items-center gap-4 border-b border-dashed border-black py-9 transition-all duration-300 hover:bg-[#81F211] hover:pl-6 md:grid-cols-[96px_1fr_220px_110px] md:gap-7"
                  >
                    <span className="text-outline-thin text-3xl font-extrabold leading-none tracking-[-0.06em] md:text-[44px]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-[clamp(26px,3.8vw,56px)] font-extrabold leading-[1.02] tracking-[-0.055em] text-black">
                        {project.title}
                      </h3>
                      <p className="mt-3.5 line-clamp-3 max-w-[660px] text-[15px] leading-[1.9] text-[#666666] group-hover:text-black/70">
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
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      <ProjectModal
        project={selected as ModalProject | null}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
