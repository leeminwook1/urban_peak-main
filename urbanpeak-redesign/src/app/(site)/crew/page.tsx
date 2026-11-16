import PageBanner from '@/components/PageBanner';
import { SectionLabel, Leadership, CrewList, ContactCTA } from '@/components/Sections';
export const metadata = { title: 'Crew' };
export default function Crew() {
  return (
    <>
      <PageBanner
        label="OUR CREW"
        title={
          <>
            장면 뒤에,
            <br />
            사람이 있습니다.
          </>
        }
        copy="각자의 분야에서 시작해 하나의 경험을 완성합니다."
        frame="06"
      />
      <nav className="crew-page-nav">
        <a href="#leadership">Leadership ↓</a>
        <a href="/studio#capabilities">Capabilities ↗</a>
        <a href="#crew">Crew ↓</a>
      </nav>
      <div id="leadership">
        <Leadership photos />
      </div>
      <section className="section" id="crew">
        <SectionLabel n="02">CREW</SectionLabel>
        <h2>함께하는 크루</h2>
        <p className="page-intro">
          기획, 글, 디자인, 영상, 음악, 음향, 공연, 목소리, 사진.
          <br />
          프로젝트에 따라 필요한 분야가 함께합니다.
        </p>
        <CrewList />
      </section>
      <ContactCTA />
    </>
  );
}
