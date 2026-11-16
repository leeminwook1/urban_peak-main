import Motion from '@/components/Motion';
import { Header, Footer } from '@/components/Shell';
import { getContent, isPreview } from '@/lib/data';
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [content, preview] = await Promise.all([getContent(), isPreview()]);
  return (
    <>
      {preview && (
        <div className="preview-bar" role="status">
          <span>미리보기 중 · 아직 저장하지 않은 내용입니다</span>
          <a href="/api/preview/exit">미리보기 종료</a>
        </div>
      )}
      <a className="skip" href="#main">
        본문으로 바로가기
      </a>
      <Motion />
      <Header process={content.process} />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
