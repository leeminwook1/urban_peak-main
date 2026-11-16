import { neon } from '@neondatabase/serverless';
import { promises as fs } from 'fs';
import path from 'path';
import type { DocKey } from './types';

/* Editable site documents, their preview drafts and save history.
   - DATABASE_URL set: tables `site_documents` and `site_document_versions` (new tables; the live site's are untouched).
   - Otherwise: JSON files in CONTENT_STORAGE_DIR (default .private/content), for local development. */

export type StoreMode = 'database' | 'local-file';
export type Stored = { data: unknown; updatedAt: string };
export type Version = { id: string; savedAt: string };

const HISTORY_LIMIT = 30;
export const draftKey = (key: DocKey) => `draft:${key}`;

export const storeMode = (): StoreMode => (process.env.DATABASE_URL ? 'database' : 'local-file');
const dir = () => process.env.CONTENT_STORAGE_DIR || path.join(process.cwd(), '.private', 'content');
const fileOf = (key: string) => path.join(dir(), key.replace(':', '-') + '.json');
const historyDir = (key: string) => path.join(dir(), 'history', key);
const sql = () => neon(process.env.DATABASE_URL!);
const iso = (v: unknown) => new Date(v as string).toISOString();

let tables: Promise<unknown> | null = null;
function ensureTables() {
  tables ??= (async () => {
    await sql()`CREATE TABLE IF NOT EXISTS site_documents (key text PRIMARY KEY, data jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now())`;
    await sql()`CREATE TABLE IF NOT EXISTS site_document_versions (id bigserial PRIMARY KEY, key text NOT NULL, data jsonb NOT NULL, saved_at timestamptz NOT NULL DEFAULT now())`;
    await sql()`CREATE INDEX IF NOT EXISTS site_document_versions_key ON site_document_versions (key, saved_at DESC)`;
  })().catch(e => {
    tables = null;
    throw e;
  });
  return tables;
}

async function writeFileAtomic(file: string, data: unknown) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file + '.tmp', JSON.stringify(data, null, 2), 'utf8');
  await fs.rename(file + '.tmp', file);
}

export async function readStored(key: string): Promise<Stored | null> {
  if (storeMode() === 'database') {
    await ensureTables();
    const rows = (await sql()`SELECT data, updated_at FROM site_documents WHERE key=${key}`) as {
      data: unknown;
      updated_at: unknown;
    }[];
    return rows[0] ? { data: rows[0].data, updatedAt: iso(rows[0].updated_at) } : null;
  }
  try {
    const file = fileOf(key);
    const [text, stat] = await Promise.all([fs.readFile(file, 'utf8'), fs.stat(file)]);
    return { data: JSON.parse(text), updatedAt: stat.mtime.toISOString() };
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw e;
  }
}

/** Saves a document. Published documents (not drafts) also get a history entry. */
export async function writeStored(key: string, data: unknown, { history = false } = {}): Promise<string> {
  if (storeMode() === 'database') {
    await ensureTables();
    const json = JSON.stringify(data);
    const rows =
      (await sql()`INSERT INTO site_documents (key, data, updated_at) VALUES (${key}, ${json}::jsonb, now())
      ON CONFLICT (key) DO UPDATE SET data=EXCLUDED.data, updated_at=now() RETURNING updated_at`) as {
        updated_at: unknown;
      }[];
    if (history) {
      await sql()`INSERT INTO site_document_versions (key, data) VALUES (${key}, ${json}::jsonb)`;
      await sql()`DELETE FROM site_document_versions WHERE key=${key} AND id NOT IN
        (SELECT id FROM site_document_versions WHERE key=${key} ORDER BY saved_at DESC LIMIT ${HISTORY_LIMIT})`;
    }
    return iso(rows[0].updated_at);
  }
  const file = fileOf(key);
  await writeFileAtomic(file, data);
  const updatedAt = (await fs.stat(file)).mtime.toISOString();
  if (history) {
    const hdir = historyDir(key);
    await writeFileAtomic(path.join(hdir, updatedAt.replace(/[:.]/g, '-') + '.json'), data);
    const old = (await fs.readdir(hdir))
      .filter(f => f.endsWith('.json'))
      .sort()
      .reverse()
      .slice(HISTORY_LIMIT);
    await Promise.all(old.map(f => fs.unlink(path.join(hdir, f))));
  }
  return updatedAt;
}

export async function listVersions(key: string): Promise<Version[]> {
  if (storeMode() === 'database') {
    await ensureTables();
    const rows =
      (await sql()`SELECT id, saved_at FROM site_document_versions WHERE key=${key} ORDER BY saved_at DESC LIMIT ${HISTORY_LIMIT}`) as {
        id: unknown;
        saved_at: unknown;
      }[];
    return rows.map(r => ({ id: String(r.id), savedAt: iso(r.saved_at) }));
  }
  try {
    const files = (await fs.readdir(historyDir(key)))
      .filter(f => f.endsWith('.json'))
      .sort()
      .reverse();
    return files.map(f => {
      const [date, time] = f.replace('.json', '').split('T');
      const [h, m, sec, ms] = time.replace('Z', '').split('-');
      return { id: f.replace('.json', ''), savedAt: `${date}T${h}:${m}:${sec}.${ms}Z` };
    });
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw e;
  }
}

export async function readVersion(key: string, id: string): Promise<unknown | null> {
  if (storeMode() === 'database') {
    if (!/^\d+$/.test(id)) return null;
    await ensureTables();
    const rows = (await sql()`SELECT data FROM site_document_versions WHERE key=${key} AND id=${id}`) as {
      data: unknown;
    }[];
    return rows[0]?.data ?? null;
  }
  if (!/^[\w-]+$/.test(id)) return null;
  try {
    return JSON.parse(await fs.readFile(path.join(historyDir(key), id + '.json'), 'utf8'));
  } catch {
    return null;
  }
}
