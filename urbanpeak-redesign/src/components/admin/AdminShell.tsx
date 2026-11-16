"use client";

import Link from 'next/link';
import {usePathname} from 'next/navigation';

const NAV=[
  {href:'/admin',label:'대시보드'},
  {href:'/admin/projects',label:'프로젝트'},
  {href:'/admin/content',label:'홈 · 스튜디오 · 크루'},
  {href:'/admin/merchandise',label:'굿즈'},
];

export default function AdminShell({children}:{children:React.ReactNode}){
  const path=usePathname();
  if(path==='/admin/login')return <div className="adm adm-bare">{children}</div>;
  const logout=async()=>{await fetch('/api/admin/logout',{method:'POST'});location.href='/admin/login'};
  return <div className="adm">
    <aside className="adm-side">
      <Link href="/admin" className="adm-logo"><img src="/images/logos/logo-brand.png" alt="urban peak" width="990" height="248"/><span>관리자</span></Link>
      <nav aria-label="관리 메뉴">{NAV.map(n=><Link key={n.href} href={n.href} aria-current={(n.href==='/admin'?path===n.href:path.startsWith(n.href))?'page':undefined}>{n.label}</Link>)}</nav>
      <div className="adm-side-foot">
        <a href="/" target="_blank" rel="noreferrer">사이트 보기 ↗</a>
        <button type="button" onClick={logout}>로그아웃</button>
      </div>
    </aside>
    <div className="adm-main">{children}</div>
  </div>;
}
