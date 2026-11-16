import {neon} from '@neondatabase/serverless';
import {promises as fs} from 'fs';
import path from 'path';
import type {DocKey,Docs} from './types';

/* Editable site documents.
   - DATABASE_URL set: one row per document in `site_documents` (a new table; the live site's tables are untouched).
   - Otherwise: JSON files in CONTENT_STORAGE_DIR (default .private/content), for local development. */

export type StoreMode='database'|'local-file';
export type Stored<K extends DocKey>={data:Docs[K];updatedAt:string};

export const storeMode=():StoreMode=>process.env.DATABASE_URL?'database':'local-file';
const dir=()=>process.env.CONTENT_STORAGE_DIR||path.join(process.cwd(),'.private','content');
const sql=()=>neon(process.env.DATABASE_URL!);
const iso=(v:unknown)=>new Date(v as string).toISOString();

let table:Promise<unknown>|null=null;
function ensureTable(){
  table??=sql()`CREATE TABLE IF NOT EXISTS site_documents (key text PRIMARY KEY, data jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now())`.catch(e=>{table=null;throw e});
  return table;
}

export async function readStored<K extends DocKey>(key:K):Promise<Stored<K>|null>{
  if(storeMode()==='database'){
    await ensureTable();
    const rows=await sql()`SELECT data, updated_at FROM site_documents WHERE key=${key}` as {data:Docs[K];updated_at:unknown}[];
    return rows[0]?{data:rows[0].data,updatedAt:iso(rows[0].updated_at)}:null;
  }
  const file=path.join(dir(),key+'.json');
  try{
    const [text,stat]=await Promise.all([fs.readFile(file,'utf8'),fs.stat(file)]);
    return {data:JSON.parse(text),updatedAt:stat.mtime.toISOString()};
  }catch(e){
    if((e as NodeJS.ErrnoException).code==='ENOENT')return null;
    throw e;
  }
}

export async function writeStored<K extends DocKey>(key:K,data:Docs[K]):Promise<string>{
  if(storeMode()==='database'){
    await ensureTable();
    const rows=await sql()`INSERT INTO site_documents (key, data, updated_at) VALUES (${key}, ${JSON.stringify(data)}::jsonb, now())
      ON CONFLICT (key) DO UPDATE SET data=EXCLUDED.data, updated_at=now() RETURNING updated_at` as {updated_at:unknown}[];
    return iso(rows[0].updated_at);
  }
  await fs.mkdir(dir(),{recursive:true});
  const file=path.join(dir(),key+'.json');
  await fs.writeFile(file+'.tmp',JSON.stringify(data,null,2),'utf8');
  await fs.rename(file+'.tmp',file);
  return (await fs.stat(file)).mtime.toISOString();
}
