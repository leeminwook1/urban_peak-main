"use client";

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect,useRef,useState} from 'react';
import content from '@/lib/content.json';

export function Header(){
  const path=usePathname();
  const [open,setOpen]=useState(false);
  const [scrolled,setScrolled]=useState(false);
  const [hidden,setHidden]=useState(false);
  const [drawer,setDrawer]=useState(false);
  const drawerRef=useRef<HTMLElement>(null);
  const trigger=useRef<HTMLButtonElement>(null);
  const close=useRef<HTMLButtonElement>(null);
  const previous=useRef(0);
  useEffect(()=>{
    const scroll=()=>{const y=window.scrollY;setScrolled(y>80);setHidden(y>120&&y>previous.current+2);previous.current=y};
    scroll();window.addEventListener('scroll',scroll,{passive:true});return()=>window.removeEventListener('scroll',scroll);
  },[]);
  useEffect(()=>{setOpen(false);setDrawer(false);setHidden(false)},[path]);
  useEffect(()=>{
    if(!drawer&&!open)return;
    const oldOverflow=document.body.style.overflow;
    if(drawer)document.body.style.overflow='hidden';
    if(drawer)close.current?.focus();
    const key=(e:KeyboardEvent)=>{
      if(e.key==='Escape'){setOpen(false);setDrawer(false);trigger.current?.focus()}
      if(drawer&&e.key==='Tab'){
        const items=drawerRef.current?.querySelectorAll<HTMLElement>('button,a[href]');
        if(!items?.length)return;
        const first=items[0],last=items[items.length-1];
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
        if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
      }
    };
    window.addEventListener('keydown',key);
    return()=>{document.body.style.overflow=oldOverflow;window.removeEventListener('keydown',key)};
  },[drawer,open]);
  const hero=['/','/studio','/crew','/projects','/contact'].includes(path)&&!scrolled;
  return <>
    <header className={`wd-header ${hero?'is-over-hero':''} ${scrolled?'is-scrolled':''} ${hidden&&!open?'is-hidden':''} ${open?'is-open':''}`}>
      <nav className="wd-nav-left" aria-label="스튜디오와 프로젝트">
        <button onClick={()=>setOpen(!open)} aria-expanded={open} aria-controls="studio-menu">Studio <span>+</span></button>
        <Link href="/projects" aria-current={path.startsWith('/projects')?'page':undefined}>Projects</Link>
      </nav>
      <Link href="/" className="wd-header-logo" aria-label="Urban Peak 홈"><img src="/images/logos/logo-brand.png" alt="urban peak" width="990" height="248"/></Link>
      <nav className="wd-nav-right" aria-label="크루와 문의"><Link href="/crew">Crew</Link><Link href="/contact">Contact ↗</Link></nav>
      <button className="wd-mobile-menu" onClick={()=>setOpen(!open)} aria-expanded={open} aria-controls="studio-menu">{open?'Close −':'Menu +'}</button>
      {open&&<div className="wd-mega-menu" id="studio-menu"><div className="mega-photo"><img src="/images/frames/hero-03-scene.jpg" alt="어반피크 쇼릴의 무대 장면"/></div><nav aria-label="전체 메뉴"><Link href="/studio">Studio <span>01 ↗</span></Link><Link href="/projects">Projects <span>02 ↗</span></Link><Link href="/crew">Crew <span>03 ↗</span></Link><Link href="/contact">Contact <span>04 ↗</span></Link><p>서로 다른 창작이 하나의 장면으로.</p></nav><button className="mega-close" onClick={()=>setOpen(false)} aria-label="전체 메뉴 닫기">Close ×</button></div>}
    </header>
    <button ref={trigger} tabIndex={path==='/'&&!scrolled?-1:0} aria-hidden={path==='/'&&!scrolled} className={`work-tab ${path==='/'&&!scrolled?'is-concealed':''}`} onClick={()=>{setDrawer(true);setOpen(false)}} aria-expanded={drawer} aria-controls="work-drawer">How we work <span>+</span></button>
    {drawer&&<div className="work-overlay" onClick={()=>{setDrawer(false);trigger.current?.focus()}}><aside ref={drawerRef} id="work-drawer" role="dialog" aria-modal="true" aria-labelledby="work-title" onClick={e=>e.stopPropagation()}><button ref={close} className="work-close" onClick={()=>{setDrawer(false);trigger.current?.focus()}}>Close ×</button><h2 id="work-title">HOW WE WORK</h2><div className="work-steps">{content.process.map(([name,desc],i)=><div key={name}><h3>{i+1}. {name}</h3><p>{desc}</p></div>)}</div><Link href="/contact" onClick={()=>setDrawer(false)}>함께 만들 장면 이야기하기 ↗</Link></aside></div>}
  </>;
}

export function Footer(){return <footer className="wd-footer">
  <div className="wd-footer-grid"><div><span className="eyebrow">PROJECT ENQUIRIES</span><a href="mailto:urbanpeak2020@gmail.com">urbanpeak2020@gmail.com</a><Link href="/contact">협업 문의하기 ↗</Link></div><div><span className="eyebrow">EXPLORE</span><Link href="/studio">Studio</Link><Link href="/projects">Projects</Link><Link href="/crew">Crew</Link><Link href="/merchandise">Merchandise</Link></div><div><span className="eyebrow">CULTURE, CONNECTED.</span><p>공연·행사 기획과 연출<br/>참여형 문화 프로그램 공동기획<br/>디자인·영상·음악·사진을 연결한 콘텐츠 제작</p><Link href="/projects" className="footer-film"><img src="/images/frames/hero-05-scene.jpg" alt="어반피크 영상 촬영 장면" loading="lazy"/><span>Discover our projects ↗</span></Link></div></div>
  <div className="wd-footer-brand"><Link href="/" aria-label="Urban Peak 홈"><img src="/images/logos/logo-brand.png" alt="urban peak" width="990" height="248"/></Link><p>새로운 장면을 만드는 문화기획 스튜디오</p></div>
  <div className="footer-bottom"><span>© {new Date().getFullYear()} URBAN PEAK</span><span>어반피크(URBANPEAK) · 대표자: 진하림 · 사업자등록번호: 487-18-02651</span><a href="#main">BACK TO TOP ↑</a></div>
</footer>}
