import { SectionLabel } from '@/components/Sections';
import ContactForm from './form';
export const metadata = { title: 'Contact' };
// Inquiries need durable storage. Locally they go to .private/inquiries; on Vercel that disk is
// temporary, so the form stays off until DATABASE_URL is set.
const formReady = Boolean(process.env.DATABASE_URL) || !process.env.VERCEL;

export default function Contact() {
  return (
    <div className="wd-contact-page">
      <div className="contact-background" aria-hidden="true" />
      <section className="section page-title">
        <SectionLabel n="01">CONTACT</SectionLabel>
        <h1>
          함께 만들고 싶은
          <br />
          장면이 있나요?
        </h1>
        <p className="page-intro">새로운 가능성을 함께 만들어갈 파트너를 찾습니다.</p>
      </section>
      <section className="section contact-layout">
        <aside className="contact-info">
          <span className="eyebrow">LET’S TALK</span>
          <a href="mailto:urbanpeak2020@gmail.com">urbanpeak2020@gmail.com ↗</a>
          <p>
            다양한 방식의 협업에 열려 있습니다.
            <br />
            만들고 싶은 경험을 들려주세요.
          </p>
          <ul>
            <li>공연·행사 기획과 연출</li>
            <li>참여형 문화 프로그램 공동기획</li>
            <li>디자인·영상·음악·사진을 연결한 콘텐츠 제작</li>
          </ul>
        </aside>
        <div>
          <p className="delivery-note">
            {formReady
              ? '남겨주신 문의는 담당자가 확인한 뒤 이메일로 답변드립니다.'
              : '문의 양식은 준비 중입니다. 문의는 위 이메일로 보내 주세요.'}
          </p>
          <ContactForm disabled={!formReady} />
        </div>
      </section>
    </div>
  );
}
