import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function GET() {
  try {
    const sql = getDB();
    const items = await sql`SELECT * FROM merchandise ORDER BY display_order ASC`;
    return NextResponse.json(items);
  } catch (error) {
    console.error('DB error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sql = getDB();
    const { name, description, image_url, images, section_id, display_order } = await req.json();
    const result = await sql`
      INSERT INTO merchandise (name, description, image_url, images, section_id, display_order)
      VALUES (${name}, ${description}, ${image_url ?? null}, ${images ?? '[]'}, ${section_id ?? null}, ${display_order ?? 0})
      RETURNING *
    ` as Array<Record<string, unknown>>;
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
