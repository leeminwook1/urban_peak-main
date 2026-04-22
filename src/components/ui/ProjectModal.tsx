"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useEffect } from "react";

export interface ModalProject {
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

export default function ProjectModal({
  project,
  onClose,
}: {
  project: ModalProject | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!project) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [project, onClose]);

  if (!project) return null;

  let galleryImages: string[] = [];
  try {
    galleryImages = JSON.parse(project.gallery_images || "[]");
  } catch {
    galleryImages = [];
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top panel */}
        <div className="relative h-64 bg-[#1a1a2e]">
          {project.thumbnail_url ? (
            <Image
              src={project.thumbnail_url}
              alt={project.title}
              fill
              className="object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-[#1a1a2e]/60 to-transparent" />
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/25"
          >
            <X size={16} />
          </button>
          <div className="absolute bottom-0 flex items-end justify-between w-full p-7">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
                {project.tag}
              </span>
              <h2 className="mt-1.5 text-2xl font-bold leading-snug text-white">
                {project.title}
              </h2>
            </div>
            {!project.thumbnail_url && (
              <Image
                src={project.symbol_url}
                alt=""
                width={56}
                height={56}
                className="h-14 w-14 flex-shrink-0 opacity-70"
              />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-7">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a0a0a0]">
            {project.category}
          </p>
          <div className="mt-3 h-px w-8 bg-[#1a1a1a]/15" />
          <p className="mt-4 whitespace-pre-wrap text-[14px] leading-[1.85] text-[#6b6b6b]">
            {project.description}
          </p>

          {/* Gallery Images */}
          {galleryImages.length > 0 && (
            <div className="mt-6">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[#a0a0a0]">
                Gallery
              </p>
              <div className="grid grid-cols-2 gap-3">
                {galleryImages.map((url, idx) => (
                  <div key={idx} className="relative aspect-[4/3] overflow-hidden rounded-lg">
                    <Image
                      src={url}
                      alt={`${project.title} gallery ${idx + 1}`}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
