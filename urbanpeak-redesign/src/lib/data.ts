import { unstable_cache } from 'next/cache';
import { draftMode } from 'next/headers';
import { normalizeDoc } from './normalize';
import { seed } from './seed';
import { draftKey, readStored } from './store';
import type { DocKey, Docs } from './types';

/* Public read path. Published documents are cached under the `site` tag; admin saves revalidate it.
   In preview (draft mode) an unsaved draft from the admin takes precedence, uncached.
   Any storage failure falls back to the bundled data so the site always renders. */

export const SITE_TAG = 'site';

async function published<K extends DocKey>(key: K): Promise<Docs[K]> {
  // Failures are caught outside the cache so a fallback is never cached.
  try {
    const data = await unstable_cache(
      async () => (await readStored(key))?.data ?? seed[key],
      ['site-doc', key],
      { tags: [SITE_TAG] },
    )();
    return normalizeDoc(key, data);
  } catch (e) {
    console.error(`[content] ${key} 읽기 실패, 기본 데이터 사용`, e);
    return seed[key];
  }
}

async function load<K extends DocKey>(key: K): Promise<Docs[K]> {
  if ((await draftMode()).isEnabled) {
    try {
      const draft = await readStored(draftKey(key));
      if (draft) return normalizeDoc(key, draft.data);
    } catch (e) {
      console.error(`[preview] ${key} 초안 읽기 실패`, e);
    }
  }
  return published(key);
}

/** Published projects only — safe at build time (generateStaticParams, sitemap). */
export const getPublishedProjects = () => published('projects');

export const getProjects = () => load('projects');
export const getContent = () => load('content');
export const getMerchandise = () => load('merchandise');
export async function getProject(id: number) {
  return (await getProjects()).find(p => p.id === id);
}
export async function getHomeProjects() {
  const [projects, content] = await Promise.all([getProjects(), getContent()]);
  return content.homeProjects.map(id => projects.find(p => p.id === id)).filter(p => p !== undefined);
}
export async function isPreview() {
  return (await draftMode()).isEnabled;
}
