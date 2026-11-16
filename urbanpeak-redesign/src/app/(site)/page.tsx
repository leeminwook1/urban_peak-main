import Link from 'next/link';
import Hero from '@/components/Hero';
import { ProjectAccordion, StudioScenes, ProcessJourney } from '@/components/HomeExperience';
import { Leadership } from '@/components/Sections';
import { getContent, getHomeProjects } from '@/lib/data';

export default async function Home() {
  const [content, selected] = await Promise.all([getContent(), getHomeProjects()]);
  return (
    <div className="wd-home">
      <Hero />
      <section className="wd-intro" id="intro">
        <div className="wd-intro-main">
          <span className="editorial-label" data-reveal>
            Culture, connected.
          </span>
          <h1 data-read aria-label="새로운 장면을 만드는 문화기획 스튜디오">
            {'새로운 장면을 만드는 문화기획 스튜디오'.split(' ').map((word, i) => (
              <span data-word key={i}>
                {word}{' '}
              </span>
            ))}
          </h1>
        </div>
        <div className="wd-intro-description" data-reveal>
          <span className="eyebrow">OUR STUDIO</span>
          <div>
            <p>{content.intro}</p>
            <Link href="/studio">Discover Urban Peak ↗</Link>
          </div>
        </div>
      </section>
      <ProjectAccordion selected={selected} />
      <section className="wd-statement" data-reveal>
        <span className="editorial-label">Our direction</span>
        <p>서로 다른 창작이 하나의 장면으로.</p>
        <span className="eyebrow">URBAN PEAK — CULTURE & CREATIVE STUDIO</span>
      </section>
      <StudioScenes content={content} />
      <section className="wd-bridge">
        <div data-reveal>
          <span className="editorial-label">Beyond the moment</span>
          <p>
            공연과 콘텐츠, 참여형 프로그램을 함께 기획하고 제작하며,
            <br />그 과정을 기록합니다.
          </p>
        </div>
      </section>
      <ProcessJourney process={content.process} />
      <div className="wd-crew-summary" data-reveal>
        <Leadership short />
      </div>
      <section className="wd-final-cta" data-reveal>
        <span className="eyebrow">THE NEXT SCENE, TOGETHER</span>
        <h2>
          함께 만들고 싶은
          <br />
          장면이 있나요?
        </h2>
        <Link href="/contact">
          GET IN TOUCH <span>↗</span>
        </Link>
      </section>
    </div>
  );
}
