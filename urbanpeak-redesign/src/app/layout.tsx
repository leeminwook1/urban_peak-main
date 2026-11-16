import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||'https://urbanpeak.co.kr'),title:{default:'Urban Peak — 새로운 장면을 만드는 문화기획 스튜디오',template:'%s | Urban Peak'},description:'공연과 콘텐츠, 참여형 프로그램을 함께 기획하고 제작하며, 그 과정을 기록합니다.',icons:{icon:'/icon.png'},openGraph:{images:['/images/og.jpg']}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="ko"><body>{children}</body></html>}
