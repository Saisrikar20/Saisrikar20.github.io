'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { AdminThemeToggle } from '@/components/admin/AdminThemeToggle';

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.refresh();
      } else {
        setError(data.error || 'Incorrect password.');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#07070A] text-gray-900 dark:text-gray-100 flex items-center justify-center p-4 font-sans transition-colors duration-200">
      <div className="w-full max-w-sm bg-white dark:bg-[#0E0E13] border border-gray-200 dark:border-gray-800/80 rounded-2xl p-7 shadow-lg dark:shadow-2xl transition-colors duration-200">
        {/* Header Controls: Back Link & Theme Toggle */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#D6544B] dark:text-gray-400 dark:hover:text-[#D6544B] px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-white/[0.03] hover:border-[#D6544B]/40 dark:hover:border-[#D6544B]/40 transition-all font-medium"
          >
            <ArrowLeft size={13} />
            <span>Back to site</span>
          </Link>

          <AdminThemeToggle />
        </div>

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Admin</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Authenticate to manage content</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                autoFocus
                required
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#14141C] border border-gray-200 dark:border-gray-800 rounded-full text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#D6544B] focus:ring-2 focus:ring-[#D6544B]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center bg-transparent border-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-5 bg-[#D6544B] hover:bg-[#BF433B] text-white font-semibold text-sm rounded-full transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-[0_4px_15px_rgba(214,84,75,0.25)] hover:shadow-[0_6px_20px_rgba(214,84,75,0.4)] hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              <span>Log In</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
