import { NextResponse, type NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/admin-api';
import { storeMode } from '@/lib/store';

export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  return NextResponse.json({
    mode: storeMode(),
    blob: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    deployed: process.env.NODE_ENV === 'production',
  });
}
