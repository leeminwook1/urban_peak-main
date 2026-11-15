import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function POST() {
  try {
    const sql = getDB();

    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        tag TEXT NOT NULL,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        symbol_url TEXT NOT NULL DEFAULT '/images/logos/symbol-orange.png',
        image_url TEXT,
        display_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS team_members (
        id SERIAL PRIMARY KEY,
        role TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        display_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    const ep = await sql`SELECT COUNT(*) as count FROM projects` as Array<{ count: string }>;
    if (Number(ep[0].count) === 0) {
      await sql`
        INSERT INTO projects (tag, title, category, description, symbol_url, display_order) VALUES
        ('기획안 01', 'Signal from Small Stages', 'LIVE CURATION / PILOT FORMAT', '작은 공간에서 다시 시작하는 인디 공연 시리즈. 사라진 소극장의 감도를 현재의 동선으로 다시 번역합니다.', '/images/logos/symbol-orange.png', 0),
        ('기획안 02', 'Urban Peak Night Shift', 'NIGHT PROGRAM / SEASONAL SHOWCASE', '음악, 퍼포먼스, 대화가 느슨하게 이어지는 야간형 큐레이션 포맷. 도시적인 긴장감과 취향의 밀도를 담습니다.', '/images/logos/symbol-teal.png', 1),
        ('기획안 03', 'Open Scene Casting', 'CREATIVE CASTING / OPEN CALL CONCEPT', '새로운 팀과 실험적인 무대를 연결하는 프로젝트. 다양한 장르가 자연스럽게 섞이는 구조를 지향합니다.', '/images/logos/symbol-black.png', 2)
      `;
    }

    const et = await sql`SELECT COUNT(*) as count FROM team_members` as Array<{ count: string }>;
    if (Number(et[0].count) === 0) {
      await sql`
        INSERT INTO team_members (role, name, description, display_order) VALUES
        ('CREATIVE DIRECTOR', '김선우', '공간과 무대 흐름을 설계하며 어반피크의 전체 톤을 이끕니다.', 0),
        ('VISUAL PLANNER', '이하린', '시각 장면과 아카이브 방향을 잡아 프로젝트에 밀도를 더합니다.', 1),
        ('CASTING CURATOR', '박지오', '아티스트와 팀을 연결해 프로젝트마다 새로운 조합을 만듭니다.', 2)
      `;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
