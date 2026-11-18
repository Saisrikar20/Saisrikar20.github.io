import { createReader } from '@keystatic/core/reader';
import config from '@/keystatic.config';

export const reader = createReader(process.cwd(), config);

export interface BlogPostItem {
  slug: string;
  entry: {
    title: string;
    publishedAt: string | null;
    summary: string;
    category: 'ai-security' | 'autonomous-agents' | 'local-rag' | 'cybersecurity' | 'engineering';
    tags: readonly string[];
    coverImage: string | null;
    content: () => Promise<any>;
  };
}

export async function getSortedPosts(): Promise<BlogPostItem[]> {
  try {
    const posts = await reader.collections.posts.all();
    return (posts as BlogPostItem[]).sort((a: BlogPostItem, b: BlogPostItem) => {
      const dateA = a.entry.publishedAt ? new Date(a.entry.publishedAt).getTime() : 0;
      const dateB = b.entry.publishedAt ? new Date(b.entry.publishedAt).getTime() : 0;
      return dateB - dateA;
    });
  } catch (err) {
    console.error('Error fetching blog posts from Keystatic:', err);
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  try {
    return await reader.collections.posts.read(slug);
  } catch (err) {
    console.error(`Error reading post with slug ${slug}:`, err);
    return null;
  }
}

export async function getProjects() {
  try {
    const projects = await reader.collections.projects.all();
    return projects.sort((a, b) => (a.entry.order || 0) - (b.entry.order || 0));
  } catch (err) {
    console.error('Error reading projects from Keystatic:', err);
    return [];
  }
}

export async function getSkills() {
  try {
    const skills = await reader.collections.skills.all();
    return skills.sort((a, b) => (a.entry.order || 0) - (b.entry.order || 0));
  } catch (err) {
    console.error('Error reading skills from Keystatic:', err);
    return [];
  }
}

export async function getEducation() {
  try {
    const education = await reader.collections.education.all();
    return education.sort((a, b) => (a.entry.order || 0) - (b.entry.order || 0));
  } catch (err) {
    console.error('Error reading education from Keystatic:', err);
    return [];
  }
}

export async function getCertifications() {
  try {
    const certs = await reader.collections.certifications.all();
    return certs.sort((a, b) => (a.entry.order || 0) - (b.entry.order || 0));
  } catch (err) {
    console.error('Error reading certifications from Keystatic:', err);
    return [];
  }
}

export async function getAbout() {
  try {
    return await reader.singletons.about.read();
  } catch (err) {
    console.error('Error reading about singleton from Keystatic:', err);
    return null;
  }
}

export async function getSettings() {
  try {
    return await reader.singletons.settings.read();
  } catch (err) {
    console.error('Error reading settings singleton from Keystatic:', err);
    return null;
  }
}
