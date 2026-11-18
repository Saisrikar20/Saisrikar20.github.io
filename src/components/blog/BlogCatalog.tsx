'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Calendar, Tag, ArrowRight, Search, Clock } from 'lucide-react';

export interface PostCardData {
  slug: string;
  title: string;
  publishedAt: string | null;
  summary: string;
  category: string;
  tags: readonly string[];
}

interface BlogCatalogProps {
  posts: PostCardData[];
}

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All Articles',
  'ai-security': 'AI Security & Defense',
  'autonomous-agents': 'Autonomous Agents',
  'local-rag': 'Local RAG & LLMs',
  cybersecurity: 'Cybersecurity',
  engineering: 'Engineering Insights',
};

export const BlogCatalog: React.FC<BlogCatalogProps> = ({ posts }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['all', ...Array.from(set)];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === 'all' || post.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.summary.toLowerCase().includes(query) ||
        post.tags.some((t) => t.toLowerCase().includes(query));
      return matchesCategory && matchesQuery;
    });
  }, [posts, selectedCategory, searchQuery]);

  return (
    <div className="space-y-10">
      {/* Search & Category Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                    : 'bg-white/[0.03] hover:bg-white/[0.08] text-gray-400 hover:text-white border border-white/5'
                }`}
              >
                {CATEGORY_LABELS[cat] || cat}
              </button>
            );
          })}
        </div>

        {/* Instant Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Search articles or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-white placeholder-gray-500 text-xs font-mono focus:outline-none focus:border-emerald-500/40 transition-colors"
          />
        </div>
      </div>

      {/* Post Grid / List */}
      {filteredPosts.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-white/5 bg-white/[0.01]">
          <p className="text-gray-400 font-mono text-sm">
            No articles found matching your criteria.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="mt-3 text-xs font-mono text-emerald-400 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredPosts.map((post) => (
            <article
              key={post.slug}
              className="group relative rounded-2xl border border-white/10 bg-[#111217]/70 hover:bg-[#151720] hover:border-emerald-500/30 transition-all duration-200 p-6 sm:p-7 shadow-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-gray-400 mb-3">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                    {CATEGORY_LABELS[post.category] || post.category}
                  </span>
                  {post.publishedAt && (
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <Calendar size={13} />
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </time>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-gray-500 text-[11px]">
                  <Clock size={12} />
                  <span>~4 min read</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-semibold text-white group-hover:text-emerald-400 transition-colors tracking-tight">
                <Link href={`/blog/${post.slug}`}>
                  <span className="absolute inset-0 z-0" />
                  {post.title}
                </Link>
              </h2>

              <p className="mt-2.5 text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
                {post.summary}
              </p>

              {/* Tags and CTA */}
              <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.04] text-[11px] font-mono text-gray-400"
                    >
                      <Tag size={10} className="text-gray-500" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-medium group-hover:translate-x-1 transition-transform">
                  <span>Read Article</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
