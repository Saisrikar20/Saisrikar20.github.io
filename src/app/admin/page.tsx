import React from 'react';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { verifyAdminToken } from '@/lib/auth';
import LoginForm from './LoginForm';
import AdminDashboard from './AdminDashboard';

export const metadata: Metadata = {
  title: 'Admin Control Center | Sai Srikar',
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session')?.value;
  const isAuthenticated = await verifyAdminToken(token);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <AdminDashboard />;
}
