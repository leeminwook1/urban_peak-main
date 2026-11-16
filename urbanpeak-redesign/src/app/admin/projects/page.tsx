"use client";

import {useMemo,useState} from 'react';
import {ImageList,Loading,PageHead,SaveBar,Select,TextArea,TextInput,ToastView,move,removeAt,replaceAt,useDoc} from '@/components/admin/kit';
import {PROJECT_FORMATS,PROJECT_INFO_KEYS,PROJECT_STATUSES,type Project} from '@/lib/types';

const blank=(id:number):Project=>({id,title:'새 프로젝트',format:'Sessions',status:'예정',date:'',sortDate:null,intro:'',images:[],info:{},note:'',raw:''});
const toInput=(date:string)=>{const m=/^(\d{4})\.(\d{1,2})\.(\d{1,2})$/.exec(date.trim());return m?`${m[1]}-${m[2].padStart(2,'0')}-${m[3].padStart(2,'0')}`:''};
const fromInput=(v:string)=>v?v.replaceAll('-','.'):'';
const sortKey=(p:Project)=>{const m=/^(\d{4})\.(\d{1,2})\.(\d{1,2})$/.exec(p.date.trim());return m?Date.UTC(+m[1],+m[2]-1,+m[3]):Infinity};

export default function ProjectsAdmin(){
  const doc=useDoc('projects');
  const [selected,setSelected]=useState<number|null>(null);
  const [query,setQuery]=useState('');
  const list=doc.data??[];
  const current=list.find(p=>p.id===selected)??list[0];
  const index=current?list.indexOf(current):-1;

  const filtered=useMemo(()=>{
    const q=query.trim().toLowerCase();
    return list.map((p,i)=>({p,i})).filter(({p})=>!q||[p.title,p.intro,p.format,p.status,p.date].some(s=>s.toLowerCase().includes(q)));
  },[list,query]);

  if(!doc.data)return <><PageHead title="프로젝트"/><Loading error={doc.error} onRetry={doc.reload}/></>;

  const set=(patch:Partial<Project>)=>doc.update(l=>replaceAt(l,index,{...l[index],...patch}));
  const add=()=>{const id=Math.max(0,...list.map(p=>p.id))+1;doc.update(l=>[blank(id),...l]);setSelected(id)};
  const remove=()=>{if(!current||!confirm(`'${current.title}' 프로젝트를 삭제할까요?\n저장하기 전까지는 되돌릴 수 있습니다.`))return;const next=removeAt(list,index);doc.update(next);setSelected(next[Math.min(index,next.length-1)]?.id??null)};
  const sortByDate=()=>{if(confirm('날짜가 최신인 순서로 다시 정렬할까요? (날짜 미정은 맨 위)'))doc.update(l=>[...l].sort((a,b)=>sortKey(b)-sortKey(a)))};

  const infoRows=current?Object.entries(current.info):[];
  const setInfo=(rows:[string,string][])=>set({info:Object.fromEntries(rows)});
  const missingKeys=PROJECT_INFO_KEYS.filter(k=>!current||!(k in current.info));

  return <>
    <PageHead title="프로젝트" desc="목록 순서가 사이트의 프로젝트 순서입니다. 홈에 보일 5개는 ‘홈 · 스튜디오 · 크루’에서 고릅니다.">
      <button className="adm-btn" onClick={sortByDate}>날짜순 정렬</button>
      <button className="adm-btn is-primary" onClick={add}>+ 새 프로젝트</button>
    </PageHead>

    <div className="adm-split">
      <div className="adm-list">
        <input className="adm-search" type="search" placeholder="제목·소개·상태 검색" value={query} onChange={e=>setQuery(e.target.value)} aria-label="프로젝트 검색"/>
        <ol>
          {filtered.map(({p,i})=><li key={p.id} className={p.id===current?.id?'is-active':''}>
            <button type="button" className="adm-list-item" onClick={()=>setSelected(p.id)}>
              {p.images[0]?<img src={p.images[0]} alt=""/>:<span className="adm-thumb-empty">이미지 없음</span>}
              <span><strong>{p.title||'(제목 없음)'}</strong><small>{p.format} · {p.date||'날짜 미정'} · {p.status}</small></span>
            </button>
            {!query&&<div className="adm-order">
              <button type="button" onClick={()=>doc.update(l=>move(l,i,i-1))} disabled={i===0} aria-label={`${p.title} 위로`}>↑</button>
              <button type="button" onClick={()=>doc.update(l=>move(l,i,i+1))} disabled={i===list.length-1} aria-label={`${p.title} 아래로`}>↓</button>
            </div>}
          </li>)}
          {!filtered.length&&<li className="adm-list-empty">검색 결과가 없습니다.</li>}
        </ol>
      </div>

      {current?<div className="adm-editor" key={current.id}>
        <div className="adm-editor-head">
          <span className="adm-pill">#{current.id}</span>
          <a className="adm-link" href={`/projects/${current.id}`} target="_blank" rel="noreferrer">사이트에서 보기 ↗</a>
          <button type="button" className="adm-btn is-danger" onClick={remove}>삭제</button>
        </div>

        <section className="adm-panel">
          <h2>기본 정보</h2>
          <div className="adm-grid">
            <TextInput label="제목" required wide value={current.title} onChange={title=>set({title})}/>
            <Select label="형식" value={current.format} options={PROJECT_FORMATS} onChange={format=>set({format})}/>
            <Select label="진행 상태" value={current.status} options={PROJECT_STATUSES} onChange={status=>set({status})}/>
            <TextInput label="날짜" value={current.date} onChange={date=>set({date})} placeholder="2026.08.17" hint="날짜가 정해지지 않았다면 ‘진행일 확인 중’처럼 적어도 됩니다."/>
            <div className="adm-field"><label htmlFor="pick-date">달력에서 고르기</label><input id="pick-date" type="date" value={toInput(current.date)} onChange={e=>set({date:fromInput(e.target.value)})}/></div>
            <TextArea label="한 줄 소개" value={current.intro} onChange={intro=>set({intro})} rows={2} hint="목록 카드와 상세 페이지 맨 위에 보입니다."/>
            <TextArea label="안내 메모 (선택)" value={current.note} onChange={note=>set({note})} rows={1} hint="상세 페이지 소개 아래 작은 글씨로 보입니다. 예: 날짜 확인 중 안내"/>
          </div>
        </section>

        <section className="adm-panel">
          <h2>이미지 <small>{current.images.length}장 · 첫 번째가 대표 이미지</small></h2>
          <ImageList value={current.images} onChange={images=>set({images})} onError={m=>doc.toast.show(m,'error')}/>
        </section>

        <section className="adm-panel">
          <h2>상세 정보 <small>상세 페이지 항목</small></h2>
          <div className="adm-kv">
            {infoRows.map(([k,v],i)=><div key={i} className="adm-kv-row">
              <input value={k} onChange={e=>setInfo(replaceAt(infoRows,i,[e.target.value,v]))} aria-label="항목 이름" list="info-keys"/>
              <textarea value={v} rows={Math.min(8,Math.max(1,v.split('\n').length))} onChange={e=>setInfo(replaceAt(infoRows,i,[k,e.target.value]))} aria-label={`${k} 내용`}/>
              <button type="button" className="adm-icon is-danger" onClick={()=>setInfo(removeAt(infoRows,i))} aria-label={`${k} 삭제`}>×</button>
            </div>)}
            <datalist id="info-keys">{PROJECT_INFO_KEYS.map(k=><option key={k} value={k}/>)}</datalist>
          </div>
          <div className="adm-chips">
            {missingKeys.map(k=><button key={k} type="button" onClick={()=>setInfo([...infoRows,[k,'']])}>+ {k}</button>)}
            <button type="button" onClick={()=>setInfo([...infoRows,['새 항목 '+(infoRows.length+1),'']])}>+ 직접 입력</button>
          </div>
        </section>

        <details className="adm-panel adm-fold">
          <summary>원문 자료 <small>상세 페이지 ‘기존 프로젝트 자료 전체 보기’</small></summary>
          <TextArea label="원문" value={current.raw} onChange={raw=>set({raw})} rows={8}/>
        </details>
      </div>:<div className="adm-empty">프로젝트가 없습니다. ‘+ 새 프로젝트’로 추가하세요.</div>}
    </div>

    <SaveBar dirty={doc.dirty} saving={doc.saving} onSave={doc.save} onReset={doc.reload}/>
    <ToastView toast={doc.toast.toast}/>
  </>;
}
