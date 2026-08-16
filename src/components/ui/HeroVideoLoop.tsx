"use client";

import { useEffect, useRef, useState } from "react";

const VIDEOS = Array.from(
  { length: 12 },
  (_, i) => `/videos/hero-${String(i + 1).padStart(2, "0")}.mp4`,
);
const SWITCH_MS = 5000;

function shuffled(exclude?: number) {
  const a = VIDEOS.map((_, i) => i);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  if (exclude !== undefined && a[0] === exclude) a.push(a.shift()!);
  return a;
}

/**
 * 히어로 배경 영상 루프 — 셔플된 순서로 4초마다 크로스페이드 전환.
 * 두 개의 video 레이어를 번갈아 사용하고, 대기 레이어에 다음 영상을 미리 로드한다.
 */
export default function HeroVideoLoop() {
  const [mounted, setMounted] = useState(false);
  const [slots, setSlots] = useState<[number, number]>([0, 1]);
  const [front, setFront] = useState(0);
  const videoRefs = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)];
  const queueRef = useRef<number[]>([]);
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const queue = shuffled();
    const first = queue.shift()!;
    queueRef.current = queue;
    setSlots([first, queue[0]]);
    setFront(0);
    setMounted(true);
  }, []);

  // 앞 레이어가 바뀔 때마다 재생 보장
  useEffect(() => {
    if (!mounted) return;
    const v = videoRefs[front].current;
    if (!v) return;
    if (reducedRef.current) {
      v.pause();
      return;
    }
    v.currentTime = 0;
    v.play().catch(() => {});
    // 뒤로 간 레이어는 페이드가 끝난 뒤 정지
    const back = videoRefs[1 - front].current;
    const t = setTimeout(() => back?.pause(), 800);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, front, slots]);

  useEffect(() => {
    if (!mounted || reducedRef.current) return;
    const id = setInterval(() => {
      setFront((f) => {
        const oldFront = f;
        const queue = queueRef.current;
        const next = queue.shift()!; // 대기 레이어에 이미 로드되어 있는 영상
        if (queue.length < 1) queueRef.current = queue.concat(shuffled(next));
        const upcoming = queueRef.current[0];
        // 이전 앞 레이어를 다음 영상 프리로드 슬롯으로 전환
        setSlots((s) => {
          const ns: [number, number] = [...s];
          ns[oldFront] = upcoming;
          return ns;
        });
        return 1 - f;
      });
    }, SWITCH_MS);
    return () => clearInterval(id);
  }, [mounted]);

  return (
    <>
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {mounted &&
          ([0, 1] as const).map((layer) => (
            <video
              key={layer}
              ref={videoRefs[layer]}
              src={VIDEOS[slots[layer]]}
              muted
              playsInline
              loop
              preload="auto"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                front === layer ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        {/* 라이트 오버레이 — 영상이 메인, 텍스트 가독성은 하단 그라데이션으로 보조 */}
        <div className="absolute inset-0 bg-white/35" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/55 to-transparent" />
      </div>

      {/* 라이브 배지 — 현재 재생 중인 영상 번호 */}
      <div className="absolute left-6 top-7 z-20 flex -rotate-[1.5deg] items-center gap-2 border border-black bg-white px-3 py-[7px] font-mono text-[11px] font-extrabold tracking-[0.2em] text-black">
        <span className="anim-blink inline-block h-[7px] w-[7px] rounded-full border border-black bg-[#81F211]" />
        OUR PROJECT {String(slots[front] + 1).padStart(2, "0")}/{String(VIDEOS.length).padStart(2, "0")}
      </div>
    </>
  );
}
