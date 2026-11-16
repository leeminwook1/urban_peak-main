"use client";

import {ImageList,Loading,PageHead,RowTools,SaveBar,TextArea,TextInput,ToastView,move,removeAt,replaceAt,useDoc} from '@/components/admin/kit';
import type {Goods} from '@/lib/types';

export default function MerchandiseAdmin(){
  const doc=useDoc('merchandise');
  if(!doc.data)return <><PageHead title="굿즈"/><Loading error={doc.error} onRetry={doc.reload}/></>;
  const m=doc.data;
  const set=(patch:Partial<typeof m>)=>doc.update(prev=>({...prev,...patch}));
  const setGoods=(i:number,g:Goods)=>set({goods:replaceAt(m.goods,i,g)});
  const onError=(msg:string)=>doc.toast.show(msg,'error');

  return <>
    <PageHead title="굿즈" desc="푸터의 Merchandise 페이지에 보이는 내용입니다.">
      <a className="adm-link" href="/merchandise" target="_blank" rel="noreferrer">사이트에서 보기 ↗</a>
    </PageHead>

    <section className="adm-panel">
      <h2>페이지 상단</h2>
      <div className="adm-grid">
        <TextInput label="배너 제목 (이미지 설명)" value={m.title} onChange={title=>set({title})}/>
        <TextInput label="부제" value={m.subtitle} onChange={subtitle=>set({subtitle})}/>
      </div>
      <h3 className="adm-label">배너 이미지</h3>
      <ImageList value={m.banner?[m.banner]:[]} max={1} label="배너" onChange={v=>set({banner:v[0]??''})} onError={onError}/>
    </section>

    <section className="adm-panel">
      <h2>상품 <small>{m.goods.length}개</small></h2>
      <div className="adm-rows">
        {m.goods.map((g,i)=><div className="adm-row-card" key={g.id}>
          <div>
            <div className="adm-grid">
              <TextInput label="상품 이름" required wide value={g.name} onChange={name=>setGoods(i,{...g,name})}/>
              <TextArea label="제품 정보" value={g.description} onChange={description=>setGoods(i,{...g,description})} rows={4}/>
            </div>
            <h3 className="adm-label">상품 이미지</h3>
            <ImageList value={g.images} onChange={images=>setGoods(i,{...g,images})} onError={onError}/>
          </div>
          <RowTools index={i} count={m.goods.length} label={g.name||'이 상품'} onMove={to=>set({goods:move(m.goods,i,to)})} onRemove={()=>set({goods:removeAt(m.goods,i)})}/>
        </div>)}
      </div>
      <button type="button" className="adm-btn" onClick={()=>set({goods:[...m.goods,{id:Math.max(0,...m.goods.map(g=>g.id))+1,name:'새 상품',description:'',images:[]}]})}>+ 상품 추가</button>
    </section>

    <SaveBar dirty={doc.dirty} saving={doc.saving} onSave={doc.save} onReset={doc.reload}/>
    <ToastView toast={doc.toast.toast}/>
  </>;
}
