import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sql = getDB();
    const { id } = await params;
    const { tag, title, category, description, symbol_url, thumbnail_url, gallery_images, display_order } = await req.json();
    const result = await sql`
      UPDATE projects SET tag=${tag}, title=${title}, category=${category},
        description=${description}, symbol_url=${symbol_url},
        thumbnail_url=${thumbnail_url ?? null}, gallery_images=${gallery_images ?? '[]'}, display_order=${display_order ?? 0}
      WHERE id=${id} RETURNING *
    ` as Array<Record<string, unknown>>;
    if (result.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('DB error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sql = getDB();
    const { id } = await params;
    await sql`DELETE FROM projects WHERE id=${id}`;
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('DB error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
