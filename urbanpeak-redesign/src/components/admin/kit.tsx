"use client";

import {useCallback,useEffect,useId,useRef,useState} from 'react';
import {resizeImage} from '@/lib/resizeImage';
import type {DocKey,Docs} from '@/lib/types';

/* ---------- data ---------- */

type DocState<K extends DocKey>={data:Docs[K]|null;updatedAt:string|null;mode:string;error:string};

/** Loads one document, tracks unsaved edits, saves with a conflict check, warns before leaving. */
export function useDoc<K extends DocKey>(key:K){
  const [state,setState]=useState<DocState<K>>({data:null,updatedAt:null,mode:'',error:''});
  const [dirty,setDirty]=useState(false);
  const [saving,setSaving]=useState(false);
  const toast=useToast();

  const load=useCallback(async()=>{
    const res=await fetch(`/api/admin/docs/${key}`,{cache:'no-store'});
    const body=await res.json().catch(()=>({error:'응답을 읽지 못했습니다.'}));
    if(res.status===401){location.href='/admin/login?next='+encodeURIComponent(location.pathname);return}
    setState(res.ok?{data:body.data,updatedAt:body.updatedAt,mode:body.mode,error:''}:{data:null,updatedAt:null,mode:'',error:body.error});
    setDirty(false);
  },[key]);
  useEffect(()=>{load()},[load]);

  const update=useCallback((next:Docs[K]|((prev:Docs[K])=>Docs[K]))=>{
    setState(s=>s.data===null?s:{...s,data:typeof next==='function'?(next as (p:Docs[K])=>Docs[K])(s.data):next});
    setDirty(true);
  },[]);

  const save=useCallback(async()=>{
    if(!state.data||saving)return false;
    setSaving(true);
    try{
      const res=await fetch(`/api/admin/docs/${key}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({data:state.data,baseUpdatedAt:state.updatedAt})});
      const body=await res.json().catch(()=>({error:'응답을 읽지 못했습니다.'}));
      if(!res.ok){toast.show(body.error||'저장에 실패했습니다.','error');return false}
      setState(s=>({...s,data:body.data,updatedAt:body.updatedAt}));
      setDirty(false);
      toast.show('저장했습니다. 사이트에 바로 반영됩니다.','ok');
      return true;
    }catch{toast.show('네트워크 오류로 저장하지 못했습니다.','error');return false}
    finally{setSaving(false)}
  },[key,state.data,state.updatedAt,saving,toast]);

  useEffect(()=>{
    if(!dirty)return;
    const warn=(e:BeforeUnloadEvent)=>{e.preventDefault()};
    window.addEventListener('beforeunload',warn);
    return()=>window.removeEventListener('beforeunload',warn);
  },[dirty]);

  useEffect(()=>{
    const key=(e:KeyboardEvent)=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'){e.preventDefault();if(dirty)save()}};
    window.addEventListener('keydown',key);
    return()=>window.removeEventListener('keydown',key);
  },[dirty,save]);

  return {...state,update,save,saving,dirty,reload:load,toast};
}

/* ---------- toast ---------- */

type Toast={text:string;tone:'ok'|'error'}|null;
export function useToast(){
  const [toast,setToast]=useState<Toast>(null);
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const show=useCallback((text:string,tone:'ok'|'error'='ok')=>{
    setToast({text,tone});
    if(timer.current)clearTimeout(timer.current);
    timer.current=setTimeout(()=>setToast(null),tone==='error'?6000:3000);
  },[]);
  return {toast,show};
}
export function ToastView({toast}:{toast:Toast}){
  return <div className="adm-toast-wrap" role="status" aria-live="polite">{toast&&<div className={`adm-toast is-${toast.tone}`}>{toast.text}</div>}</div>;
}

/* ---------- layout pieces ---------- */

export function PageHead({title,desc,children}:{title:string;desc?:string;children?:React.ReactNode}){
  return <header className="adm-page-head"><div><h1>{title}</h1>{desc&&<p>{desc}</p>}</div>{children&&<div className="adm-head-actions">{children}</div>}</header>;
}

export function SaveBar({dirty,saving,onSave,onReset}:{dirty:boolean;saving:boolean;onSave:()=>void;onReset:()=>void}){
  return <div className={`adm-savebar ${dirty?'is-dirty':''}`}>
    <span>{saving?'저장 중…':dirty?'저장하지 않은 변경 사항이 있습니다.':'모든 변경 사항이 저장되었습니다.'}</span>
    <div>
      {dirty&&<button type="button" className="adm-btn is-ghost" onClick={()=>{if(confirm('저장하지 않은 변경 사항을 버릴까요?'))onReset()}} disabled={saving}>되돌리기</button>}
      <button type="button" className="adm-btn is-primary" onClick={onSave} disabled={!dirty||saving}>{saving?'저장 중…':'저장하기'} <kbd>Ctrl S</kbd></button>
    </div>
  </div>;
}

export function Loading({error,onRetry}:{error:string;onRetry:()=>void}){
  return error?<div className="adm-empty is-error"><p>{error}</p><button className="adm-btn" onClick={onRetry}>다시 시도</button></div>:<div className="adm-empty">불러오는 중…</div>;
}

/* ---------- fields ---------- */

export function Field({label,hint,children,wide}:{label:string;hint?:string;children:(id:string)=>React.ReactNode;wide?:boolean}){
  const id=useId();
  return <div className={`adm-field ${wide?'is-wide':''}`}><label htmlFor={id}>{label}</label>{children(id)}{hint&&<small>{hint}</small>}</div>;
}

export function TextInput({label,value,onChange,hint,placeholder,wide,required}:{label:string;value:string;onChange:(v:string)=>void;hint?:string;placeholder?:string;wide?:boolean;required?:boolean}){
  return <Field label={label+(required?' *':'')} hint={hint} wide={wide}>{id=><input id={id} value={value} placeholder={placeholder} onChange={e=>onChange(e.target.value)}/>}</Field>;
}

export function TextArea({label,value,onChange,hint,placeholder,rows=3,wide=true}:{label:string;value:string;onChange:(v:string)=>void;hint?:string;placeholder?:string;rows?:number;wide?:boolean}){
  const ref=useRef<HTMLTextAreaElement>(null);
  useEffect(()=>{const el=ref.current;if(!el)return;el.style.height='auto';el.style.height=Math.max(el.scrollHeight+2,rows*26)+'px'},[value,rows]);
  return <Field label={label} hint={hint} wide={wide}>{id=><textarea ref={ref} id={id} value={value} rows={rows} placeholder={placeholder} onChange={e=>onChange(e.target.value)}/>}</Field>;
}

export function Select({label,value,options,onChange,hint}:{label:string;value:string;options:readonly string[];onChange:(v:string)=>void;hint?:string}){
  const list=options.includes(value)||!value?options:[value,...options];
  return <Field label={label} hint={hint}>{id=><select id={id} value={value} onChange={e=>onChange(e.target.value)}>{list.map(o=><option key={o} value={o}>{o}</option>)}</select>}</Field>;
}

/* ---------- list helpers ---------- */

export const move=<T,>(list:T[],from:number,to:number)=>{if(to<0||to>=list.length)return list;const next=[...list];const [item]=next.splice(from,1);next.splice(to,0,item);return next};
export const replaceAt=<T,>(list:T[],index:number,item:T)=>list.map((x,i)=>i===index?item:x);
export const removeAt=<T,>(list:T[],index:number)=>list.filter((_,i)=>i!==index);

export function RowTools({index,count,onMove,onRemove,label}:{index:number;count:number;onMove:(to:number)=>void;onRemove:()=>void;label:string}){
  return <div className="adm-row-tools">
    <button type="button" onClick={()=>onMove(index-1)} disabled={index===0} aria-label={`${label} 위로`} title="위로">↑</button>
    <button type="button" onClick={()=>onMove(index+1)} disabled={index===count-1} aria-label={`${label} 아래로`} title="아래로">↓</button>
    <button type="button" className="is-danger" onClick={()=>{if(confirm(`${label}을(를) 삭제할까요?`))onRemove()}} aria-label={`${label} 삭제`} title="삭제">×</button>
  </div>;
}

/* ---------- images ---------- */

async function upload(file:File){
  const body=new FormData();
  body.append('file',await resizeImage(file,2400,2400,0.86));
  const res=await fetch('/api/admin/upload',{method:'POST',body});
  const data=await res.json().catch(()=>({error:'업로드 응답을 읽지 못했습니다.'}));
  if(!res.ok)throw new Error(data.error||'업로드에 실패했습니다.');
  return data.url as string;
}

/** Upload (button or drag & drop), reorder, set cover, remove. The first image is the cover. */
export function ImageList({value,onChange,onError,max,label='이미지'}:{value:string[];onChange:(v:string[])=>void;onError:(msg:string)=>void;max?:number;label?:string}){
  const [busy,setBusy]=useState(0);
  const [over,setOver]=useState(false);
  const input=useRef<HTMLInputElement>(null);
  const latest=useRef(value);latest.current=value;

  async function add(files:FileList|File[]){
    const list=[...files].filter(f=>f.type.startsWith('image/'));
    if(!list.length)return;
    const room=max?Math.max(0,max-latest.current.length):list.length;
    if(!room){onError(`${label}는 최대 ${max}장까지 올릴 수 있습니다.`);return}
    setBusy(n=>n+Math.min(room,list.length));
    for(const file of list.slice(0,room)){
      try{const url=await upload(file);onChange(max===1?[url]:[...latest.current,url]);latest.current=max===1?[url]:[...latest.current,url]}
      catch(e){onError(`${file.name}: ${e instanceof Error?e.message:'업로드 실패'}`)}
      finally{setBusy(n=>n-1)}
    }
  }

  return <div className={`adm-images ${over?'is-over':''}`}
    onDragOver={e=>{e.preventDefault();setOver(true)}} onDragLeave={()=>setOver(false)}
    onDrop={e=>{e.preventDefault();setOver(false);add(e.dataTransfer.files)}}>
    <div className="adm-image-grid">
      {value.map((src,i)=><figure key={src+i} className="adm-image">
        <img src={src} alt=""/>
        {i===0&&max!==1&&<span className="adm-badge">대표</span>}
        <div className="adm-image-tools">
          {max!==1&&<><button type="button" onClick={()=>onChange(move(value,i,i-1))} disabled={i===0} title="앞으로" aria-label="앞으로">←</button>
          <button type="button" onClick={()=>onChange(move(value,i,i+1))} disabled={i===value.length-1} title="뒤로" aria-label="뒤로">→</button>
          {i>0&&<button type="button" onClick={()=>onChange(move(value,i,0))} title="대표 이미지로">대표로</button>}</>}
          <button type="button" className="is-danger" onClick={()=>onChange(removeAt(value,i))} title="삭제" aria-label="삭제">×</button>
        </div>
      </figure>)}
      {Array.from({length:busy},(_,i)=><div key={'busy'+i} className="adm-image is-busy">올리는 중…</div>)}
      {(!max||value.length+busy<max)&&<button type="button" className="adm-image-add" onClick={()=>input.current?.click()}>
        <strong>+ {label} 추가</strong><span>클릭하거나 파일을 끌어다 놓으세요</span>
      </button>}
    </div>
    <input ref={input} type="file" accept="image/*" multiple={max!==1} hidden onChange={e=>{if(e.target.files)add(e.target.files);e.target.value=''}}/>
  </div>;
}
