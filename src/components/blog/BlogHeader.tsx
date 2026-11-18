import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Terminal, Sparkles } from 'lucide-react';

export const BlogHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#09090D]/85 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/[0.05]"
          >
            <ArrowLeft size={14} />
            <span>Portfolio</span>
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <Link
            href="/blog"
            className="flex items-center gap-2.5 text-sm sm:text-base font-semibold text-white tracking-tight group"
          >
            <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
              <BookOpen size={16} />
            </span>
            <span className="font-display">Sai Srikar · Blog</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/#contact"
            className="text-xs font-mono font-medium px-3.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-all"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </header>
  );
};
