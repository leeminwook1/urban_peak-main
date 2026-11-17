import type { DocKey, Docs } from './types';

/* Lenient read-time fill-in for fields added after a document was first saved.
   Never throws: anything missing gets an empty default so older documents keep rendering. */

type Obj = Record<string, unknown>;
const o = (v: unknown): Obj => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Obj) : {});
const a = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const s = (v: unknown) => (typeof v === 'string' ? v : '');
const alts = (v: unknown) =>
  Object.fromEntries(Object.entries(o(v)).filter((e): e is [string, string] => typeof e[1] === 'string'));

export function normalizeDoc<K extends DocKey>(key: K, value: unknown): Docs[K] {
  if (key === 'projects')
    return a(value).map(x => {
      const p = o(x);
      return {
        ...p,
        images: a(p.images).filter(i => typeof i === 'string'),
        imageAlts: alts(p.imageAlts),
        info: o(p.info),
        note: s(p.note),
        raw: s(p.raw),
        sortDate: typeof p.sortDate === 'string' ? p.sortDate : null,
      };
    }) as Docs[K];
  if (key === 'content') {
    const c = o(value);
    return {
      ...c,
      intro: s(c.intro),
      homeProjects: a(c.homeProjects).filter(n => typeof n === 'number'),
      leadership: a(c.leadership).map(x => ({ subtitle: '', photo: '', ...o(x) })),
      crew: a(c.crew).map(x => ({ field: '', desc: '', photo: '', ...o(x) })),
      capabilities: a(c.capabilities).map(x => ({ ...o(x), parts: a(o(x).parts) })),
      process: a(c.process),
    } as Docs[K];
  }
  const m = o(value);
  return {
    ...m,
    title: s(m.title),
    subtitle: s(m.subtitle),
    banner: s(m.banner),
    goods: a(m.goods).map(x => ({ ...o(x), images: a(o(x).images), imageAlts: alts(o(x).imageAlts) })),
  } as Docs[K];
}
