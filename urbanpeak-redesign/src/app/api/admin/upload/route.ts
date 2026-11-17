import { NextResponse, type NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/admin-api';

const MAX_BYTES = 10 * 1024 * 1024;
const TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
};

export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const file = (await req.formData().catch(() => null))?.get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
  const ext = TYPES[file.type];
  if (!ext)
    return NextResponse.json(
      { error: 'JPG, PNG, WebP, GIF, AVIF 이미지만 올릴 수 있습니다.' },
      { status: 400 },
    );
  if (file.size > MAX_BYTES)
    return NextResponse.json({ error: '이미지는 10MB 이하만 올릴 수 있습니다.' }, { status: 400 });
  const base =
    file.name
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'image';
  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import('@vercel/blob');
      const blob = await put(`uploads/${base}.${ext}`, file, {
        access: 'public',
        addRandomSuffix: true,
        contentType: file.type,
      });
      return NextResponse.json({ url: blob.url });
    }
    // public/ is only served as it was at build time, so local files work in development only.
    if (process.env.NODE_ENV === 'production')
      return NextResponse.json(
        { error: '이미지 업로드에는 BLOB_READ_WRITE_TOKEN 설정이 필요합니다.' },
        { status: 503 },
      );
    const { writeFile, mkdir } = await import('fs/promises');
    const { join } = await import('path');
    const dir = join(process.cwd(), 'public', 'uploads');
    await mkdir(dir, { recursive: true });
    const name = `${Date.now().toString(36)}-${base}.${ext}`;
    await writeFile(join(dir, name), Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ url: `/uploads/${name}` });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: '업로드에 실패했습니다.' }, { status: 500 });
  }
}
