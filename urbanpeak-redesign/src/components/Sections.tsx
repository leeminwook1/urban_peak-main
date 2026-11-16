import Link from 'next/link';
import { getContent } from '@/lib/data';
export function SectionLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="section-label">
      <span>{n}</span>
      <span>{children}</span>
    </div>
  );
}
export async function Capabilities() {
  const content = await getContent();
  return (
    <section className="section" id="capabilities">
      <SectionLabel n="02">OUR CAPABILITIES</SectionLabel>
      <div className="section-heading">
        <h2>
          다른 분야,
          <br />
          하나의 방향.
        </h2>
        <p>
          기획 · 창작 · 제작 · 현장 운영 · 기록까지.
          <br />
          프로젝트에 필요한 역량을 연결합니다.
        </p>
      </div>
      <div className="capabilities">
        {content.capabilities.map((c, i) => (
          <div className="capability" key={c.name}>
            <span className="eyebrow">0{i + 1}</span>
            <h3>{c.name}</h3>
            <div>
              {c.parts.map(({ name, desc }) => (
                <div className="part" key={name}>
                  <h4>{name}</h4>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="note">아카이빙과 연감 제작은 영상 · 문예 · 디자인 파트가 함께 만듭니다.</p>
    </section>
  );
}
export async function Process() {
  const content = await getContent();
  return (
    <section className="section process-section">
      <SectionLabel n="03">HOW WE WORK</SectionLabel>
      <h2>장면이 만들어지는 과정</h2>
      <div className="process">
        {content.process.map(({ name, desc }, i) => (
          <div key={name}>
            <span className="eyebrow">
              0{i + 1} <span aria-hidden="true">{i < 4 ? '→' : ''}</span>
            </span>
            <h3>{name}</h3>
            <p>{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
export async function Leadership({ short = false, photos = false }: { short?: boolean; photos?: boolean }) {
  const content = await getContent();
  return (
    <section className="section">
      <SectionLabel n={short ? '04' : '01'}>{short ? 'THE PEOPLE BEHIND THE SCENES' : 'LEADERSHIP'}</SectionLabel>
      <div className="section-heading">
        <h2>함께 만드는 사람들.</h2>
        {short && (
          <Link className="text-link" href="/crew">
            Meet our crew ↗
          </Link>
        )}
      </div>
      <div className={`leadership ${photos ? 'has-photos' : ''}`}>
        {content.leadership.map(({ name, role, subtitle, desc, photo }) => (
          <div key={name}>
            {photos && <Portrait src={photo} name={name} />}
            <h3>{name}</h3>
            <p className="role">
              {role}
              {subtitle && <small>{subtitle}</small>}
            </p>
            <p>{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
/** Profile photo, or a branded placeholder with the initial when none is uploaded. */
export function Portrait({ src, name }: { src: string; name: string }) {
  return (
    <div className={`portrait ${src ? '' : 'is-empty'}`}>
      {src ? <img src={src} alt={name} loading="lazy" /> : <span aria-hidden="true">{name.slice(0, 1)}</span>}
    </div>
  );
}
export async function CrewList() {
  const { crew } = await getContent();
  if (!crew.length)
    return <p className="note">개별 크루의 프로필은 확인된 자료를 바탕으로 순차적으로 소개합니다.</p>;
  return (
    <ul className="crew-grid">
      {crew.map(({ name, field, desc, photo }, i) => (
        <li key={name + i}>
          <Portrait src={photo} name={name} />
          <h3>{name}</h3>
          {field && <p className="crew-field">{field}</p>}
          {desc && <p>{desc}</p>}
        </li>
      ))}
    </ul>
  );
}
export function ContactCTA() {
  return (
    <section className="section contact-cta">
      <span className="eyebrow">NEXT SCENE, TOGETHER</span>
      <h2>
        함께 만들고 싶은
        <br />
        장면이 있나요?
      </h2>
      <Link className="text-link" href="/contact">
        프로젝트 이야기하기 <span>↗</span>
      </Link>
    </section>
  );
}
