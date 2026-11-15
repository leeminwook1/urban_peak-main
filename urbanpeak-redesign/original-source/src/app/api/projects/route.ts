import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function GET() {
  try {
    const sql = getDB();
    const projects = await sql`SELECT * FROM projects ORDER BY display_order ASC`;
    return NextResponse.json(projects);
  } catch (error) {
    console.error('DB error:', error);
    return NextResponse.json({ error: 'Database error.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sql = getDB();
    const { tag, title, category, description, symbol_url, thumbnail_url, gallery_images, display_order, status } = await req.json();
    const result = await sql`
      INSERT INTO projects (tag, title, category, description, symbol_url, thumbnail_url, gallery_images, display_order, status)
      VALUES (${tag}, ${title}, ${category}, ${description}, ${symbol_url ?? '/images/logos/symbol-orange.png'}, ${thumbnail_url ?? null}, ${gallery_images ?? '[]'}, ${display_order ?? 0}, ${status ?? 'upcoming'})
      RETURNING *
    ` as Array<Record<string, unknown>>;
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
