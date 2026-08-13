/** 시안F 마퀴 밴드 — dark(검정 배경, ✳ 구분) / light(흰 배경, 모노 타이포) */
export default function Marquee({
  items,
  variant = "dark",
}: {
  items: string[];
  variant?: "dark" | "light";
}) {
  const dark = variant === "dark";
  const half = (
    <div className="flex w-max flex-shrink-0 items-center gap-6 pr-6 md:gap-7 md:pr-7">
      {items.map((w, i) =>
        dark ? (
          <span
            key={i}
            className="flex items-center gap-6 whitespace-nowrap text-[clamp(17px,2vw,28px)] font-extrabold tracking-[-0.02em] text-white md:gap-7"
          >
            {w}
            <span className="anim-spin-slow inline-block text-[#81F211]">✳</span>
          </span>
        ) : (
          <span
            key={i}
            className="flex items-center gap-6 whitespace-nowrap font-mono text-[clamp(14px,1.4vw,19px)] font-extrabold tracking-[0.06em] text-black"
          >
            {w}
            <span className="text-[#81F211]">/</span>
          </span>
        ),
      )}
    </div>
  );

  return (
    <section
      className={
        dark
          ? "overflow-hidden border-b border-black bg-black py-[13px]"
          : "overflow-hidden border-b border-t border-black bg-white py-[11px]"
      }
    >
      <div className={`flex w-max ${dark ? "anim-marq" : "anim-marq-r"}`}>
        {half}
        {half}
      </div>
    </section>
  );
}
