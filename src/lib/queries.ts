import { getDB } from "./db";

/* 서버 컴포넌트용 DB 조회 헬퍼 — 실패 시 빈 값으로 폴백해 페이지는 항상 뜬다.
   각 페이지 클라이언트 컴포넌트가 자체 인터페이스로 받으므로 any[]로 넘긴다. */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = any;

export async function fetchProjects(): Promise<Row[]> {
  try {
    const sql = getDB();
    return (await sql`SELECT * FROM projects ORDER BY display_order ASC`) as Row[];
  } catch {
    return [];
  }
}

export async function fetchTeamMembers(): Promise<Row[]> {
  try {
    const sql = getDB();
    return (await sql`SELECT * FROM team_members ORDER BY display_order ASC`) as Row[];
  } catch {
    return [];
  }
}

export async function fetchMerchandise(): Promise<Row[]> {
  try {
    const sql = getDB();
    return (await sql`SELECT * FROM merchandise ORDER BY display_order ASC`) as Row[];
  } catch {
    return [];
  }
}

export async function fetchMerchandiseSections(): Promise<Row[]> {
  try {
    const sql = getDB();
    return (await sql`SELECT * FROM merchandise_sections ORDER BY display_order ASC`) as Row[];
  } catch {
    return [];
  }
}

export async function fetchPageSetting(key: string): Promise<Row | null> {
  try {
    const sql = getDB();
    const rows = (await sql`SELECT * FROM page_settings WHERE page_key=${key}`) as Row[];
    return rows[0] ?? null;
  } catch {
    return null;
  }
}
