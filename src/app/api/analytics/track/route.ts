import { NextResponse } from 'next/server';
import { recordTrafficHit } from '@/lib/analytics';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const path = typeof body.path === 'string' ? body.path : '/';
    const referrer = typeof body.referrer === 'string' ? body.referrer : request.headers.get('referer');
    const userAgent = request.headers.get('user-agent');
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip');
    const country = request.headers.get('x-vercel-ip-country') || 'IN';

    await recordTrafficHit({
      path,
      referrer,
      userAgent,
      ip,
      country,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
