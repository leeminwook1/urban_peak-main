import projectsJson from './projects.json';
import contentJson from './content.json';
import goodsJson from '../../source-data/merchandise.json';
import sectionsJson from '../../source-data/merchandise-sections.json';
import assetMapJson from '../../source-data/asset-map.json';
import type {Docs} from './types';

/* Bundled defaults. Used until the admin saves a document for the first time. */

const subtitles:Record<string,string>={Hannah:'대표 · 크리에이티브 디렉터',Jin:'제작 운영 총괄'};
const notes:Record<number,string>={8:'기존 자료의 날짜가 2026.06.13 / 2026.05.23으로 달라 실제 진행일을 확인 중입니다.'};
const assets=assetMapJson as Record<string,string>;

export const seed:Docs={
  projects:projectsJson.map(p=>({
    id:p.id,title:p.title,format:p.format,status:p.status,date:p.date,
    sortDate:p.sortDate??null,intro:p.intro,images:p.images,raw:p.raw,
    info:Object.fromEntries(Object.entries(p.info as Record<string,string|undefined>).filter((e):e is [string,string]=>typeof e[1]==='string')),
    note:notes[p.id]??'',
  })),
  content:{
    intro:contentJson.intro,
    homeProjects:[9,8,7,4,5],
    leadership:contentJson.leadership.map(([name,role,desc])=>({name,role,subtitle:subtitles[name]??'',desc})),
    capabilities:contentJson.capabilities.map(c=>({name:c.name,parts:c.parts.map(([name,desc])=>({name,desc}))})),
    process:contentJson.process.map(([name,desc])=>({name,desc})),
  },
  merchandise:{
    title:sectionsJson[0]?.title??'',
    subtitle:sectionsJson[0]?.subtitle??'',
    banner:assets[sectionsJson[0]?.banner_image??'']??'',
    goods:goodsJson.map(g=>({id:g.id,name:g.name,description:g.description,images:(JSON.parse(g.images) as string[]).map(u=>assets[u]).filter(Boolean)})),
  },
};
