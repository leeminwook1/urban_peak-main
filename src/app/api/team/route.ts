import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function GET() {
  try {
    const sql = getDB();
    const members = await sql`SELECT * FROM team_members ORDER BY display_order ASC`;
    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sql = getDB();
    const { role, name, description, profile_image, display_order } = await req.json();
    const result = await sql`
      INSERT INTO team_members (role, name, description, profile_image, display_order)
      VALUES (${role}, ${name}, ${description}, ${profile_image ?? null}, ${display_order ?? 0})
      RETURNING *
    ` as Array<Record<string, unknown>>;
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
