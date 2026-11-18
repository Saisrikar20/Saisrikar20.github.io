'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';

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
    <div className="min-h-screen bg-[#07070A] text-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm bg-[#0E0E13] border border-gray-800/80 rounded-2xl p-7 shadow-xl">
        {/* Back Link */}
        <div className="mb-5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Back to site</span>
          </Link>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white tracking-tight">Admin</h1>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-red-950/40 border border-red-800/40 text-red-300 text-xs">
            {error}
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
                className="w-full px-3.5 py-2.5 bg-[#14141C] border border-gray-800 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D6544B] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#D6544B] hover:bg-[#c44941] text-white font-medium text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm shadow-[#D6544B]/20"
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
