"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * 시안F 전역 인터랙션: 스크롤 진행 바 + 커스텀 커서(트레일/매그넷/호버 프리뷰).
 * 커서 효과는 데스크톱(pointer: fine)에서만 동작한다.
 */
export default function DesignEffects() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  const progressRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);
  const trail1Ref = useRef<HTMLDivElement>(null);
  const trail2Ref = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const previewLabelRef = useRef<HTMLSpanElement>(null);
  const previewImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!progressRef.current) return;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isAdmin) return;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reducedMotion) return;

    const dot = dotRef.current;
    const mark = markRef.current;
    const t1 = trail1Ref.current;
    const t2 = trail2Ref.current;
    const preview = previewRef.current;
    const previewLabel = previewLabelRef.current;
    const previewImg = previewImgRef.current;
    if (!dot || !t1 || !t2 || !preview) return;

    [dot, t1, t2].forEach((el) => (el.style.display = "flex"));

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    const pts = [
      { el: dot, k: 0.22, x, y },
      { el: t1, k: 0.12, x, y },
      { el: t2, k: 0.07, x, y },
      { el: preview, k: 0.085, x, y },
    ];

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const t = target.closest?.("[data-preview],[data-magnet],a,button") as HTMLElement | null;
      const slot = t?.getAttribute("data-preview") ?? null;
      if (slot !== null) {
        dot.style.width = "0px";
        dot.style.height = "0px";
        dot.style.marginLeft = "0px";
        dot.style.marginTop = "0px";
        if (mark) mark.style.fontSize = "0";
        preview.style.opacity = "1";
        if (previewLabel) previewLabel.textContent = slot;
        const img = t?.getAttribute("data-preview-img") ?? "";
        if (previewImg) {
          if (img) {
            previewImg.src = img;
            previewImg.style.display = "block";
          } else {
            previewImg.style.display = "none";
          }
        }
      } else if (t) {
        dot.style.width = "60px";
        dot.style.height = "60px";
        dot.style.marginLeft = "-30px";
        dot.style.marginTop = "-30px";
        if (mark) mark.style.fontSize = "25px";
        preview.style.opacity = "0";
      } else {
        dot.style.width = "20px";
        dot.style.height = "20px";
        dot.style.marginLeft = "-10px";
        dot.style.marginTop = "-10px";
        if (mark) mark.style.fontSize = "0";
        preview.style.opacity = "0";
      }
    };

    const onMagnet = (e: MouseEvent) => {
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        const d = Math.hypot(mx, my);
        if (d < 130) {
          const f = (1 - d / 130) * 0.35;
          el.style.translate = `${mx * f}px ${my * f}px`;
        } else {
          el.style.translate = "0px 0px";
        }
      });
    };

    let raf = 0;
    const loop = () => {
      pts.forEach((p) => {
        p.x += (x - p.x) * p.k;
        p.y += (y - p.y) * p.k;
        if (p.el === preview) {
          p.el.style.transform = `translate(${p.x}px,${p.y}px) rotate(${(x - p.x) * 0.045}deg)`;
        } else {
          p.el.style.transform = `translate(${p.x}px,${p.y}px)`;
        }
      });
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mousemove", onMagnet);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousemove", onMagnet);
      cancelAnimationFrame(raf);
    };
  }, [isAdmin]);

  if (isAdmin) return null;

  return (
    <>
      {/* 스크롤 진행 바 */}
      <div
        ref={progressRef}
        className="fixed left-0 top-0 z-[220] h-[5px] w-0 border-b border-black bg-[#81F211]"
      />
      {/* 커서 */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[212] -ml-[10px] -mt-[10px] hidden h-5 w-5 items-center justify-center rounded-full border border-black bg-[#81F211]"
        style={{ transition: "width .26s cubic-bezier(.2,.85,.2,1), height .26s cubic-bezier(.2,.85,.2,1), margin .26s cubic-bezier(.2,.85,.2,1)" }}
      >
        <span ref={markRef} className="anim-spin-slow leading-none text-black" style={{ fontSize: 0 }}>
          ✳
        </span>
      </div>
      <div
        ref={trail1Ref}
        className="pointer-events-none fixed left-0 top-0 z-[211] -ml-[5px] -mt-[5px] hidden h-[10px] w-[10px] rounded-full border border-black bg-white"
      />
      <div
        ref={trail2Ref}
        className="pointer-events-none fixed left-0 top-0 z-[210] -ml-[3px] -mt-[3px] hidden h-[6px] w-[6px] rounded-full bg-black"
      />
      {/* 호버 프리뷰 카드 */}
      <div
        ref={previewRef}
        className="pointer-events-none fixed left-0 top-0 z-[205] -ml-[160px] -mt-[130px] w-80 opacity-0"
        style={{ transition: "opacity .24s ease" }}
      >
        <div className="placeholder-stripes relative aspect-[3/2] overflow-hidden border border-black shadow-[8px_8px_0_#81F211]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={previewImgRef} alt="" className="absolute inset-0 hidden h-full w-full object-cover" />
          <div className="absolute left-0 top-0 z-10 bg-black px-2.5 py-[5px] text-[10px] font-extrabold tracking-[0.16em] text-[#81F211]">
            NOW LOOKING
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              ref={previewLabelRef}
              className="font-mono text-[11px] font-bold tracking-[0.16em] text-[#666666]"
            />
          </div>
        </div>
      </div>
    </>
  );
}
