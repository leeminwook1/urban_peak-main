"use client";

import Link from 'next/link';
import {useState} from 'react';
import projects from '@/lib/projects.json';
import content from '@/lib/content.json';

export function ProjectAccordion(){
  const [active,setActive]=useState(0);
  const selected=[9,8,7,4,5].map(id=>projects.find(p=>p.id===id)!);
  return <section className="wd-projects" id="selected-projects">
    <div className="wd-section-heading" data-reveal><span className="eyebrow">THE SCENES WE CREATE</span><h2>OUR PROJECTS</h2><Link href="/projects">모든 프로젝트 보기 ↗</Link></div>
    <div className="project-sticky-scene" data-scroll-scene aria-label="주요 프로젝트">
      <div className="project-sticky-frame">
        <div className="project-logo-marquee" aria-hidden="true"><div className="project-logo-track">{[0,1].map(group=><div className="project-logo-group" key={group}>{[0,1].map(item=><img key={item} src="/images/logos/logo-brand.png" alt=""/>)}</div>)}</div></div>
        {selected.map((p,i)=><Link key={p.id} className={`project-sticky-card project-sticky-card-${i===0?3:i===2?1:i+1}`} href={'/projects/'+p.id} aria-label={`${p.title} 프로젝트 보기`}>
          <img src={p.images[0]} alt="" loading="lazy"/>
          <span className="project-sticky-info"><strong>{p.title}</strong><span>{p.format} · {p.date}</span><span>{p.intro}</span><small>{p.status==='확인 중'?'진행 상태 확인 중':p.status}</small><span>View project ↗</span></span>
        </Link>)}
      </div>
    </div>
    <div className="project-accordion" aria-label="주요 프로젝트">
      {selected.map((p,i)=><article key={p.id} className={`accordion-card ${i===active?'is-active':''}`} onMouseEnter={()=>setActive(i)} onFocusCapture={()=>setActive(i)}>
        <img src={p.images[0]} alt={p.title+' 프로젝트 기록'} loading="lazy"/>
        <div className="accordion-shade"/>
        <button className="accordion-select" aria-expanded={i===active} aria-controls={'project-panel-'+p.id} onClick={()=>setActive(i)}><span className="accordion-number">0{i+1}</span><span className="accordion-name">{p.title}</span><span className="sr-only"> 펼치기</span></button>
        <div className="accordion-content" id={'project-panel-'+p.id} inert={i!==active}>
          <Link className="accordion-detail" href={'/projects/'+p.id}>View project <span>↗</span></Link>
          <div><div className="accordion-meta"><span>{p.format}</span><span>{p.date}</span></div><p>{p.intro}</p><small>{p.status==='확인 중'?'진행 상태 확인 중':p.status}</small></div>
        </div>
      </article>)}
    </div>
    <div className="accordion-tabs" aria-label="프로젝트 선택">{selected.map((p,i)=><button key={p.id} aria-pressed={active===i} onClick={()=>setActive(i)} aria-label={p.title+' 선택'}>0{i+1}</button>)}</div>
  </section>;
}

export function StudioScenes(){
  const frames=['/images/frames/hero-01-scene.jpg','/images/imported/6ec4529c3c6f1467.jpg','/images/imported/fcaeb8a953397fd3.jpeg','/images/frames/hero-03-scene.jpg','/images/imported/d14028f61c2e67cf.jpg'];
  return <>
    <section className="studio-panorama" data-scroll-scene aria-label="스튜디오 소개">
      <div className="panorama-pin">
        <img className="panorama-back" src="/images/frames/hero-03-scene.jpg" alt="어반피크 영상 속 무대 공간" loading="lazy"/>
        <div className="panorama-inset"><img src="/images/frames/hero-05-scene.jpg" alt="어반피크 영상 촬영 장면" loading="lazy"/></div>
        <div className="panorama-wash"/>
        <h2>OUR STUDIO</h2>
        <div className="panorama-copy"><span className="eyebrow">DIFFERENT DISCIPLINES.<br/>ONE DIRECTION.</span><p>{content.intro}</p><Link href="/studio">Explore the studio ↗</Link></div>
        <div className="panorama-reveal" aria-hidden="true">
          {Array.from({length:5},(_,i)=><div className="panorama-slice" key={i}><img src="/images/frames/hero-06-scene.jpg" alt=""/></div>)}
        </div>
      </div>
    </section>
    <section className="capability-journey" data-scroll-scene id="home-capabilities" aria-labelledby="journey-title">
      <div className="journey-pin">
        <img className="journey-background" src="/images/frames/hero-06-scene.jpg" alt="어반피크 영상 기록에서 추출한 작업 현장" loading="lazy"/>
        <div className="journey-tint"/>
        <div className="journey-heading"><h2 id="journey-title">OUR CAPABILITIES</h2><span>SCROLL TO DISCOVER →</span></div>
        <div className="journey-track">
          {content.capabilities.map((c,i)=><article className="journey-card" key={c.name}>
            <img src={frames[i]} alt="어반피크 프로젝트와 영상 기록 장면" loading="lazy"/>
            <div className="journey-card-shade"/>
            <div className="journey-card-top"><span className="eyebrow">0{i+1} / 05</span><h3>{c.name}</h3></div>
            <div className="journey-card-parts">{c.parts.map(([name,desc])=><div key={name}><h4>{name}</h4><p>{desc}</p></div>)}</div>
            <Link className="journey-link" href="/crew#capabilities">역량 자세히 보기 ↗</Link>
          </article>)}
        </div>
        <span className="journey-caption">VIDEO STILLS / URBAN PEAK</span>
        <div className="journey-finale" aria-label="어반피크의 작업 장면">
          <img src="/images/imported/d14028f61c2e67cf.jpg" alt="어반피크 사진 프로젝트 기록 장면" loading="lazy"/>
          <div className="finale-copy"><span className="eyebrow">FROM MOMENT TO MEMORY</span><p>서로 다른 창작이<br/>하나의 장면으로.</p></div>
        </div>
      </div>
    </section>
  </>;
}

export function ProcessJourney(){
  return <section className="wd-process" id="home-process">
    <div className="wd-process-title" data-reveal><span className="eyebrow">FROM THE FIRST IDEA TO THE LAST FRAME</span><h2>IDEA — SCENE</h2></div>
    <div className="wd-process-layout">
      <div className="wd-process-intro" data-reveal><span className="eyebrow">HOW WE WORK</span><h3>하나의 방향이<br/>경험이 되기까지.</h3><p>기획 · 창작 · 제작 · 현장 운영 · 기록까지 연결합니다.</p><Link href="/studio">작업 방식 알아보기 ↗</Link></div>
      <div className="wd-process-route">{content.process.map(([name,desc],i)=><div className="route-step" key={name} data-reveal><span className="route-point"/><span className="eyebrow">0{i+1}</span><h3>{name}</h3><p>{desc}</p></div>)}</div>
    </div>
  </section>;
}
