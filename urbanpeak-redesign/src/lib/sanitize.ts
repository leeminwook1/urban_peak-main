import type {Capability,DocKey,Docs,Goods,Merchandise,Person,Project,SiteContent,Step} from './types';

/* Coerces admin input into the stored shape. Throws a Korean message on invalid data. */

class InvalidDoc extends Error {}
export const isInvalidDoc=(e:unknown):e is InvalidDoc=>e instanceof InvalidDoc;
const fail=(message:string):never=>{throw new InvalidDoc(message)};

type Obj=Record<string,unknown>;
const obj=(v:unknown,where:string):Obj=>(v&&typeof v==='object'&&!Array.isArray(v)?v as Obj:fail(`${where} 형식이 올바르지 않습니다.`));
const arr=(v:unknown,where:string):unknown[]=>(Array.isArray(v)?v:fail(`${where} 목록 형식이 올바르지 않습니다.`));
const str=(v:unknown,max=20000)=>(typeof v==='string'?v:v==null?'':String(v)).slice(0,max).trim();
const url=(v:unknown)=>{const s=str(v,2000);return /^(https:\/\/|\/)/.test(s)?s:''};
const urls=(v:unknown,where:string)=>arr(v??[],where).map(url).filter(Boolean);
const id=(v:unknown,where:string)=>{const n=Number(v);return Number.isInteger(n)&&n>0?n:fail(`${where}의 번호가 올바르지 않습니다.`)};

/** "2026.08.17" → ISO date, anything else → null. */
export function sortDateOf(date:string):string|null{
  const m=/^(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})$/.exec(date.trim());
  return m?new Date(Date.UTC(+m[1],+m[2]-1,+m[3])).toISOString():null;
}

function project(v:unknown,i:number):Project{
  const p=obj(v,`프로젝트 ${i+1}`);
  const title=str(p.title,200)||fail(`프로젝트 ${i+1}의 제목을 입력해 주세요.`);
  const info=Object.fromEntries(Object.entries(obj(p.info??{},`${title} 상세 정보`)).map(([k,val])=>[str(k,100),str(val)]).filter(([k,val])=>k&&val));
  const date=str(p.date,60);
  return {id:id(p.id,title),title,format:str(p.format,40),status:str(p.status,40),date,sortDate:sortDateOf(date),intro:str(p.intro,2000),images:urls(p.images,`${title} 이미지`),info,note:str(p.note,1000),raw:str(p.raw,50000)};
}

function content(v:unknown):SiteContent{
  const c=obj(v,'콘텐츠');
  const person=(x:unknown,i:number):Person=>{const o=obj(x,`리더십 ${i+1}`);return {name:str(o.name,80)||fail(`리더십 ${i+1}의 이름을 입력해 주세요.`),role:str(o.role,120),subtitle:str(o.subtitle,120),desc:str(o.desc,1000)}};
  const step=(x:unknown,i:number):Step=>{const o=obj(x,`항목 ${i+1}`);return {name:str(o.name,120)||fail(`${i+1}번째 항목의 이름을 입력해 주세요.`),desc:str(o.desc,1000)}};
  const capability=(x:unknown,i:number):Capability=>{const o=obj(x,`역량 ${i+1}`);return {name:str(o.name,120)||fail(`역량 ${i+1}의 이름을 입력해 주세요.`),parts:arr(o.parts,`역량 ${i+1} 파트`).map(step)}};
  return {
    intro:str(c.intro,2000),
    homeProjects:arr(c.homeProjects,'홈 대표 프로젝트').map(x=>id(x,'홈 대표 프로젝트')).slice(0,5),
    leadership:arr(c.leadership,'리더십').map(person),
    capabilities:arr(c.capabilities,'역량').map(capability),
    process:arr(c.process,'작업 방식').map(step),
  };
}

function merchandise(v:unknown):Merchandise{
  const m=obj(v,'굿즈');
  const goods=(x:unknown,i:number):Goods=>{const g=obj(x,`굿즈 ${i+1}`);return {id:id(g.id,`굿즈 ${i+1}`),name:str(g.name,200)||fail(`굿즈 ${i+1}의 이름을 입력해 주세요.`),description:str(g.description,10000),images:urls(g.images,`굿즈 ${i+1} 이미지`)}};
  return {title:str(m.title,200),subtitle:str(m.subtitle,500),banner:url(m.banner),goods:arr(m.goods,'굿즈').map(goods)};
}

const unique=(ids:number[],what:string)=>{if(new Set(ids).size!==ids.length)fail(`${what} 번호가 중복되었습니다.`)};

export function sanitizeDoc<K extends DocKey>(key:K,value:unknown):Docs[K]{
  if(key==='projects'){const list=arr(value,'프로젝트').map(project);unique(list.map(p=>p.id),'프로젝트');return list as Docs[K]}
  if(key==='content')return content(value) as Docs[K];
  const m=merchandise(value);unique(m.goods.map(g=>g.id),'굿즈');return m as Docs[K];
}
