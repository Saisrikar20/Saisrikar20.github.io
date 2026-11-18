'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface NewsletterBoxProps {
  title?: string;
  description?: string;
  className?: string;
}

export const NewsletterBox: React.FC<NewsletterBoxProps> = ({
  title = 'Subscribe to the Engineering Newsletter',
  description = 'Get notified whenever I publish new write-ups on autonomous AI agents, defensive LLM systems, local RAG architectures, and cybersecurity.',
  className = '',
}) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setFeedback('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setFeedback('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setFeedback(data.message || 'Thanks for subscribing!');
        setEmail('');
      } else {
        setStatus('error');
        setFeedback(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setFeedback('Failed to connect to subscription service. Please try again.');
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#111217] to-[#09090D] p-6 sm:p-8 shadow-xl ${className}`}
    >
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-xl">
        <div className="flex items-center gap-2.5 text-xs font-mono uppercase tracking-wider text-emerald-400 mb-2">
          <Mail size={15} strokeWidth={1.5} />
          <span>Stay Updated</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
          {title}
        </h3>

        <p className="mt-2 text-sm text-gray-300 leading-relaxed font-normal">
          {description}
        </p>

        {status === 'success' ? (
          <div className="mt-5 flex items-center gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-medium">
            <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
            <span>{feedback}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition-all duration-150 disabled:opacity-50 shrink-0 shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  <span>Subscribing...</span>
                </>
              ) : (
                'Subscribe'
              )}
            </button>
          </form>
        )}

        {status === 'error' && (
          <div className="mt-3 flex items-center gap-2 text-xs text-rose-400 font-mono">
            <AlertCircle size={14} className="shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        <div className="mt-3 text-[11px] text-gray-500 font-mono">
          No spam, ever. Unsubscribe with one click anytime.
        </div>
      </div>
    </div>
  );
};
