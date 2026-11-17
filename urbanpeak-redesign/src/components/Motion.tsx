'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Motion() {
  const pathname = usePathname();
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const dot = document.querySelector<HTMLElement>('.cursor-dot');
    const pointer = (event: PointerEvent) => {
      if (dot && event.pointerType === 'mouse') {
        dot.style.setProperty('--x', event.clientX + 'px');
        dot.style.setProperty('--y', event.clientY + 'px');
        dot.classList.add('visible');
      }
    };
    const leave = () => dot?.classList.remove('visible');
    window.addEventListener('pointermove', pointer, { passive: true });
    document.addEventListener('pointerleave', leave);
    let frame = 0;
    const scenes = [...document.querySelectorAll<HTMLElement>('[data-scroll-scene]')];
    const readings = [...document.querySelectorAll<HTMLElement>('[data-read]')];
    const reveals = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
    const update = () => {
      frame = 0;
      const h = window.innerHeight;
      scenes.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top > h || rect.bottom < 0) return;
        const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - h)));
        el.style.setProperty('--progress', media.matches ? '0' : String(progress));
      });
      readings.forEach(el => {
        const rect = el.getBoundingClientRect();
        const p = media.matches ? 1 : Math.max(0, Math.min(1, (h * 0.82 - rect.top) / (h * 0.55)));
        const words = el.querySelectorAll<HTMLElement>('[data-word]');
        words.forEach((word, i) => {
          word.style.opacity = String(Math.max(0.15, Math.min(1, p * words.length - i + 1)));
        });
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    reveals.forEach(el => {
      el.classList.add('reveal-ready');
      observer.observe(el);
    });
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    media.addEventListener('change', schedule);
    return () => {
      window.removeEventListener('pointermove', pointer);
      document.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      media.removeEventListener('change', schedule);
    };
  }, [pathname]);
  return (
    <>
      <div className="page-grid" aria-hidden="true">
        {Array.from({ length: 7 }, (_, i) => (
          <span key={i} />
        ))}
      </div>
      <div className="cursor-dot" aria-hidden="true" />
    </>
  );
}
