import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sql = getDB();
    const { id } = await params;
    const { role, name, description, profile_image, display_order } = await req.json();
    const result = await sql`
      UPDATE team_members SET role=${role}, name=${name}, description=${description}, profile_image=${profile_image ?? null}, display_order=${display_order ?? 0}
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
    await sql`DELETE FROM team_members WHERE id=${id}`;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
