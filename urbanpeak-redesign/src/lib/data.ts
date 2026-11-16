import {unstable_cache} from 'next/cache';
import {seed} from './seed';
import {readStored} from './store';
import type {DocKey,Docs} from './types';

/* Public read path. Cached under the `site` tag; admin saves revalidate it.
   Any storage failure falls back to the bundled data so the site always renders. */

export const SITE_TAG='site';

async function load<K extends DocKey>(key:K):Promise<Docs[K]>{
  // Failures are caught outside the cache so a fallback is never cached.
  try{return await unstable_cache(async()=>(await readStored(key))?.data??seed[key],['site-doc',key],{tags:[SITE_TAG]})()}
  catch(e){console.error(`[content] ${key} 읽기 실패, 기본 데이터 사용`,e);return seed[key]}
}

export const getProjects=()=>load('projects');
export const getContent=()=>load('content');
export const getMerchandise=()=>load('merchandise');
export async function getProject(id:number){return (await getProjects()).find(p=>p.id===id)}
export async function getHomeProjects(){
  const [projects,content]=await Promise.all([getProjects(),getContent()]);
  return content.homeProjects.map(id=>projects.find(p=>p.id===id)).filter(p=>p!==undefined);
}
