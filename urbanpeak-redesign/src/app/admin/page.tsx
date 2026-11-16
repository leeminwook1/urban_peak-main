"use client";

import Link from 'next/link';
import {useEffect,useState} from 'react';
import {PageHead} from '@/components/admin/kit';

type Status={mode:'database'|'local-file';blob:boolean;deployed:boolean};
type Summary={projects?:number;home?:number;goods?:number;saved:Record<string,string|null>};

export default function Dashboard(){
  const [status,setStatus]=useState<Status|null>(null);
  const [summary,setSummary]=useState<Summary>({saved:{}});

  useEffect(()=>{
    fetch('/api/admin/status').then(r=>r.json()).then(setStatus).catch(()=>{});
    Promise.all(['projects','content','merchandise'].map(k=>fetch('/api/admin/docs/'+k).then(r=>r.json()))).then(([p,c,m])=>setSummary({
      projects:p.data?.length,home:c.data?.homeProjects?.length,goods:m.data?.goods?.length,
      saved:{projects:p.updatedAt,content:c.updatedAt,merchandise:m.updatedAt},
    })).catch(()=>{});
  },[]);

  const when=(iso?:string|null)=>iso?new Date(iso).toLocaleString('ko-KR',{dateStyle:'medium',timeStyle:'short'}):'아직 수정 전 (기본 데이터)';
  const cards=[
    {href:'/admin/projects',title:'프로젝트',desc:'프로젝트 추가 · 수정 · 순서 · 이미지',count:summary.projects!=null?`${summary.projects}개`:'',saved:summary.saved.projects},
    {href:'/admin/content',title:'홈 · 스튜디오 · 크루',desc:'소개 문구, 홈 대표 프로젝트, 리더십, 역량, 작업 방식',count:summary.home!=null?`홈 대표 ${summary.home}개`:'',saved:summary.saved.content},
    {href:'/admin/merchandise',title:'굿즈',desc:'굿즈 페이지 문구 · 배너 · 상품',count:summary.goods!=null?`${summary.goods}개`:'',saved:summary.saved.merchandise},
  ];

  return <>
    <PageHead title="대시보드" desc="수정할 항목을 선택하세요. 저장하면 사이트에 바로 반영됩니다."/>
    <div className="adm-cards">
      {cards.map(c=><Link key={c.href} href={c.href} className="adm-card">
        <div><h2>{c.title}</h2>{c.count&&<span className="adm-pill">{c.count}</span>}</div>
        <p>{c.desc}</p>
        <small>마지막 저장: {when(c.saved)}</small>
      </Link>)}
    </div>
    {status&&<section className="adm-panel">
      <h2>저장 환경</h2>
      <ul className="adm-status">
        <li className={status.mode==='database'?'is-ok':'is-warn'}>
          <strong>콘텐츠 저장소</strong>
          {status.mode==='database'?'데이터베이스에 저장합니다.':status.deployed?'DATABASE_URL이 없어 저장할 수 없습니다. 환경 변수를 설정해 주세요.':'로컬 파일(.private/content)에 저장합니다. 배포 사이트에서는 DATABASE_URL이 필요합니다.'}
        </li>
        <li className={status.blob?'is-ok':'is-warn'}>
          <strong>이미지 업로드</strong>
          {status.blob?'Vercel Blob에 업로드합니다.':status.deployed?'BLOB_READ_WRITE_TOKEN이 없어 업로드할 수 없습니다.':'로컬 폴더(public/uploads)에 저장합니다. 배포 사이트에서는 BLOB_READ_WRITE_TOKEN이 필요합니다.'}
        </li>
      </ul>
    </section>}
  </>;
}
