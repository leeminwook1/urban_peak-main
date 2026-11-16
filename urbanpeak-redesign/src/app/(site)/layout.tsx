import Motion from '@/components/Motion';import {Header,Footer} from '@/components/Shell';import {getContent} from '@/lib/data';
export default async function SiteLayout({children}:{children:React.ReactNode}){const content=await getContent();return <><a className="skip" href="#main">본문으로 바로가기</a><Motion/><Header process={content.process}/><main id="main">{children}</main><Footer/></>}
