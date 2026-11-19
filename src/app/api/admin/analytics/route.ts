import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken } from '@/lib/auth';
import { getAnalyticsSummary, clearAnalytics, restoreAnalytics } from '@/lib/analytics';

export async function GET(request: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session')?.value;
  const isAuthenticated = await verifyAdminToken(token);

  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const range = (searchParams.get('range') || 'all') as 'today' | '7d' | '30d' | 'all';

  const summary = await getAnalyticsSummary(range);
  return NextResponse.json(summary);
}

export async function POST(request: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session')?.value;
  const isAuthenticated = await verifyAdminToken(token);

  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
  }

  try {
    const { events } = await request.json();
    if (Array.isArray(events)) {
      await restoreAnalytics(events);
      return NextResponse.json({ ok: true, count: events.length, message: 'Analytics restored successfully.' });
    }
    return NextResponse.json({ error: 'Invalid events array format.' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Failed to process analytics restore payload.' }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session')?.value;
  const isAuthenticated = await verifyAdminToken(token);

  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
  }

  await clearAnalytics();
  return NextResponse.json({ ok: true, message: 'Analytics data reset successfully.' });
}
