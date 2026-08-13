import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sql = getDB();
    const { id } = await params;
    const { title, subtitle, banner_image, display_order } = await req.json();
    const result = await sql`
      UPDATE merchandise_sections SET title=${title}, subtitle=${subtitle ?? null},
        banner_image=${banner_image ?? null}, display_order=${display_order ?? 0}
      WHERE id=${id} RETURNING *
    ` as Array<Record<string, unknown>>;
    if (result.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sql = getDB();
    const { id } = await params;
    await sql`DELETE FROM merchandise WHERE section_id=${id}`;
    await sql`DELETE FROM merchandise_sections WHERE id=${id}`;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
