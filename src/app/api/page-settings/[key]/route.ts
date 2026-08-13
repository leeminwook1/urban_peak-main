import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  try {
    const sql = getDB();
    const { key } = await params;
    const result = await sql`SELECT * FROM page_settings WHERE page_key=${key}` as Array<Record<string, unknown>>;
    if (result.length === 0) return NextResponse.json(null);
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json(null);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  try {
    const sql = getDB();
    const { key } = await params;
    const { title, subtitle, banner_image } = await req.json();
    const result = await sql`
      INSERT INTO page_settings (page_key, title, subtitle, banner_image, updated_at)
      VALUES (${key}, ${title}, ${subtitle ?? null}, ${banner_image ?? null}, NOW())
      ON CONFLICT (page_key) DO UPDATE
      SET title=${title}, subtitle=${subtitle ?? null}, banner_image=${banner_image ?? null}, updated_at=NOW()
      RETURNING *
    ` as Array<Record<string, unknown>>;
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
