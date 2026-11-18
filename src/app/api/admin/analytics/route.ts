import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken } from '@/lib/auth';
import { getAnalyticsSummary } from '@/lib/analytics';

export async function GET(request: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session')?.value;
  const isAuthenticated = await verifyAdminToken(token);

  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const range = (searchParams.get('range') || 'all') as 'today' | '7d' | '30d' | 'all';

  const summary = getAnalyticsSummary(range);
  return NextResponse.json(summary);
}
