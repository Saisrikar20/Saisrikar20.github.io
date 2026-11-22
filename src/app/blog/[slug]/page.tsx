import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSortedPosts, getPostBySlug } from '@/lib/keystatic';
import { BlogHeader } from '@/components/blog/BlogHeader';
import { ArticleContent } from '@/components/blog/ArticleContent';
import { NewsletterBox } from '@/components/blog/NewsletterBox';
import { GithubIcon, LinkedinIcon, XIcon } from '@/components/ui/BrandIcons';
import { Calendar, Clock, Tag, ArrowLeft } from 'lucide-react';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = await getSortedPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return { title: 'Post Not Found | Sai Srikar B' };
  }

  return {
    title: `${post.title} | Sai Srikar B`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: post.publishedAt || undefined,
      authors: ['Sai Srikar B'],
      url: `https://saisrikar.in/blog/${params.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const content = await post.content();

  return (
    <div className="min-h-screen bg-[#09090D] text-gray-100 flex flex-col font-sans selection:bg-[#D6544B]/30 selection:text-white">
      <BlogHeader />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full space-y-8">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-[#D6544B] transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Back to All Articles</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="space-y-3 pb-6 border-b border-white/10">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-gray-400">
            <span className="px-2.5 py-0.5 rounded-md bg-[#D6544B]/10 text-[#D6544B] border border-[#D6544B]/20 font-medium">
              {post.category}
            </span>

            {post.publishedAt && (
              <span className="flex items-center gap-1.5 text-gray-400">
                <Calendar size={13} />
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </time>
              </span>
            )}

            <span className="flex items-center gap-1.5 text-gray-500">
              <Clock size={13} />
              <span>4 min read</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-semibold text-white tracking-tight leading-[1.12]">
            {post.title}
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed font-normal">
            {post.summary}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white/[0.04] border border-white/5 text-xs font-mono text-gray-400"
                >
                  <Tag size={11} className="text-gray-500" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Article Body */}
        <article className="pt-2">
          <ArticleContent contentNode={content.node} />
        </article>

        {/* Author Bio Card */}
        <div className="p-6 rounded-2xl border border-white/10 bg-[#111217] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="text-xs font-mono uppercase text-[#D6544B] tracking-wider">
              Written by
            </div>
            <div className="text-lg font-semibold text-white font-display">
              Sai Srikar B
            </div>
            <p className="text-sm text-gray-400 max-w-md">
              AI/ML Associate at DEVS REC &amp; B.Tech AI &amp; Data Science (Cybersecurity Honours). Building autonomous agents and defensible LLMs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Saisrikar20"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white transition-colors"
              title="GitHub"
            >
              <GithubIcon size={18} />
            </a>
            <a
              href="https://www.linkedin.com/in/sai-srikar-b-54b1b8359/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white transition-colors"
              title="LinkedIn"
            >
              <LinkedinIcon size={18} />
            </a>
            <a
              href="https://x.com/saisrikar07"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white transition-colors"
              title="X"
            >
              <XIcon size={16} />
            </a>
            <Link
              href="/#contact"
              className="px-3.5 py-2 rounded-xl bg-[#D6544B] hover:bg-[#BF433B] text-white text-xs font-mono font-medium transition-colors shadow-sm"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Newsletter Signup at Bottom of Article */}
        <section className="pt-4">
          <NewsletterBox
            title="Enjoyed this article?"
            description="Subscribe to get my latest deep dives on AI security, local RAG pipelines, and autonomous agent engineering sent straight to your inbox."
          />
        </section>
      </main>

      <footer className="border-t border-white/5 py-8 text-center text-xs font-mono text-gray-500">
        <p>© {new Date().getFullYear()} Sai Srikar B · saisrikar.in/blog</p>
      </footer>
    </div>
  );
}
