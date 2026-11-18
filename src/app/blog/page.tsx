import React from 'react';
import type { Metadata } from 'next';
import { getSortedPosts } from '@/lib/keystatic';
import { BlogHeader } from '@/components/blog/BlogHeader';
import { BlogCatalog, PostCardData } from '@/components/blog/BlogCatalog';
import { NewsletterBox } from '@/components/blog/NewsletterBox';

export const metadata: Metadata = {
  title: 'Blog & Technical Writings | Sai Srikar B',
  description:
    'Deep dives on autonomous AI agents, defensible LLM architectures, prompt injection defense, local RAG pipelines, and cybersecurity by Sai Srikar B.',
  openGraph: {
    title: 'Blog & Technical Writings | Sai Srikar B',
    description:
      'Deep dives on autonomous AI agents, defensible LLM architectures, prompt injection defense, and local RAG pipelines.',
    type: 'website',
    url: 'https://saisrikar.in/blog',
  },
};

export default async function BlogPage() {
  const posts = await getSortedPosts();

  const formattedPosts: PostCardData[] = posts.map((p) => ({
    slug: p.slug,
    title: p.entry.title,
    publishedAt: p.entry.publishedAt,
    summary: p.entry.summary,
    category: p.entry.category,
    tags: p.entry.tags,
  }));

  return (
    <div className="min-h-screen bg-[#09090D] text-gray-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      <BlogHeader />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full space-y-12">
        {/* Blog Hero Intro */}
        <section className="space-y-4">
          <h1 className="text-3xl sm:text-5xl font-display font-semibold text-white tracking-tight leading-tight">
            Engineering Logs &amp; Architecture Notes
          </h1>

          <p className="text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed font-normal">
            First-principles write-ups on building autonomous AI agents, hardening LLM
            pipelines against prompt injection, and deploying offline local RAG architectures.
          </p>
        </section>

        {/* Catalog of Articles */}
        <section>
          <BlogCatalog posts={formattedPosts} />
        </section>

        {/* Newsletter Callout */}
        <section className="pt-6">
          <NewsletterBox />
        </section>
      </main>

      <footer className="border-t border-white/5 py-8 text-center text-xs font-mono text-gray-500">
        <p>© {new Date().getFullYear()} Sai Srikar B · saisrikar.in/blog</p>
      </footer>
    </div>
  );
}
