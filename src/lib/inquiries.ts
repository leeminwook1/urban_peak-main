import { neon } from '@neondatabase/serverless';
import { promises as fs } from 'fs';
import path from 'path';

/* Contact inquiries. Stored before any email is attempted, so nothing is lost if mail fails.
   - DATABASE_URL set: table `inquiries` (same schema as the live site, so records carry over).
   - Otherwise: JSON files in CONTACT_STORAGE_DIR (default .private/inquiries), for local development. */

export type MailStatus = 'pending' | 'sent' | 'failed' | 'skipped';
export type Inquiry = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  organization: string;
  type: string;
  schedule: string;
  place: string;
  budget: string;
  reference: string;
  message: string;
  source: string;
  readAt: string | null;
  mailStatus: MailStatus;
  mailError: string;
};
export const INQUIRY_FIELDS = [
  'name',
  'email',
  'organization',
  'type',
  'schedule',
  'place',
  'budget',
  'reference',
  'message',
] as const;

const useDb = () => Boolean(process.env.DATABASE_URL);
const dir = () => process.env.CONTACT_STORAGE_DIR || path.join(process.cwd(), '.private', 'inquiries');
const sql = () => neon(process.env.DATABASE_URL!);
const iso = (v: unknown) => (v ? new Date(v as string).toISOString() : null);

let table: Promise<unknown> | null = null;
function ensureTable() {
  table ??= sql()`CREATE TABLE IF NOT EXISTS inquiries (
      id text PRIMARY KEY, created_at timestamptz NOT NULL DEFAULT now(),
      name text NOT NULL, email text NOT NULL, organization text NOT NULL DEFAULT '', type text NOT NULL DEFAULT '',
      schedule text NOT NULL DEFAULT '', place text NOT NULL DEFAULT '', budget text NOT NULL DEFAULT '',
      reference text NOT NULL DEFAULT '', message text NOT NULL, source text NOT NULL DEFAULT '',
      read_at timestamptz, mail_status text NOT NULL DEFAULT 'pending', mail_error text NOT NULL DEFAULT '')`.catch(
    e => {
      table = null;
      throw e;
    },
  );
  return table;
}

type Row = Record<string, unknown>;
const fromRow = (r: Row): Inquiry => ({
  id: String(r.id),
  createdAt: iso(r.created_at)!,
  name: String(r.name ?? ''),
  email: String(r.email ?? ''),
  organization: String(r.organization ?? ''),
  type: String(r.type ?? ''),
  schedule: String(r.schedule ?? ''),
  place: String(r.place ?? ''),
  budget: String(r.budget ?? ''),
  reference: String(r.reference ?? ''),
  message: String(r.message ?? ''),
  source: String(r.source ?? ''),
  readAt: iso(r.read_at),
  mailStatus: (r.mail_status as MailStatus) ?? 'pending',
  mailError: String(r.mail_error ?? ''),
});

/** Older local files were saved as { id, createdAt, data: {...}, status }. */
const fromFile = (raw: Row): Inquiry => {
  if ('data' in raw && raw.data && typeof raw.data === 'object') {
    const d = raw.data as Row;
    return fromRow({
      ...d,
      id: raw.id,
      created_at: raw.createdAt,
      source: 'redesign',
      mail_status: raw.status === 'provider_accepted' ? 'sent' : 'skipped',
    });
  }
  return raw as unknown as Inquiry;
};

const fileOf = (id: string) => path.join(dir(), id + '.json');
const safeId = (id: string) => /^[\w-]{1,64}$/.test(id);

export async function saveInquiry(i: Inquiry) {
  if (useDb()) {
    await ensureTable();
    await sql()`INSERT INTO inquiries (id, created_at, name, email, organization, type, schedule, place, budget, reference, message, source, mail_status)
      VALUES (${i.id}, ${i.createdAt}, ${i.name}, ${i.email}, ${i.organization}, ${i.type}, ${i.schedule}, ${i.place}, ${i.budget}, ${i.reference}, ${i.message}, ${i.source}, ${i.mailStatus})`;
    return;
  }
  await fs.mkdir(dir(), { recursive: true, mode: 0o700 });
  await fs.writeFile(fileOf(i.id), JSON.stringify(i, null, 2), { flag: 'wx', mode: 0o600 });
}

export async function updateInquiry(
  id: string,
  patch: Partial<Pick<Inquiry, 'readAt' | 'mailStatus' | 'mailError'>>,
) {
  if (!safeId(id)) return false;
  if (useDb()) {
    await ensureTable();
    const rows = (await sql()`UPDATE inquiries SET
        read_at = CASE WHEN ${'readAt' in patch} THEN ${patch.readAt ?? null}::timestamptz ELSE read_at END,
        mail_status = COALESCE(${patch.mailStatus ?? null}, mail_status),
        mail_error = COALESCE(${patch.mailError ?? null}, mail_error)
      WHERE id = ${id} RETURNING id`) as Row[];
    return rows.length > 0;
  }
  try {
    const current = fromFile(JSON.parse(await fs.readFile(fileOf(id), 'utf8')));
    await fs.writeFile(fileOf(id), JSON.stringify({ ...current, ...patch }, null, 2), { mode: 0o600 });
    return true;
  } catch {
    return false;
  }
}

export async function listInquiries(): Promise<Inquiry[]> {
  if (useDb()) {
    await ensureTable();
    return ((await sql()`SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 500`) as Row[]).map(fromRow);
  }
  try {
    const files = (await fs.readdir(dir())).filter(f => f.endsWith('.json'));
    const all = await Promise.all(
      files.map(async f => fromFile(JSON.parse(await fs.readFile(path.join(dir(), f), 'utf8')))),
    );
    return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw e;
  }
}

export async function deleteInquiry(id: string) {
  if (!safeId(id)) return false;
  if (useDb()) {
    await ensureTable();
    return ((await sql()`DELETE FROM inquiries WHERE id = ${id} RETURNING id`) as Row[]).length > 0;
  }
  try {
    await fs.unlink(fileOf(id));
    return true;
  } catch {
    return false;
  }
}
