import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function GET() {
  try {
    const sql = getDB();
    const sections = await sql`SELECT * FROM merchandise_sections ORDER BY display_order ASC`;
    return NextResponse.json(sections);
  } catch (error) {
    console.error('DB error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sql = getDB();
    const { title, subtitle, banner_image, display_order } = await req.json();
    const result = await sql`
      INSERT INTO merchandise_sections (title, subtitle, banner_image, display_order)
      VALUES (${title}, ${subtitle ?? null}, ${banner_image ?? null}, ${display_order ?? 0})
      RETURNING *
    ` as Array<Record<string, unknown>>;
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
