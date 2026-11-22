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

const DEFAULT_PROJECTS = [
  {
    slug: 'devs-p2p',
    entry: {
      title: 'DEVs P2P',
      description:
        'Open-source peer-to-peer technical learning platform for DEVS REC with structured roadmaps across 5 engineering domains, interactive 3D mentor directory, curated resource library, and local progress tracking.',
      tagline: 'Web Platform & Community',
      techStack: ['TypeScript', 'React 19', 'Tailwind v4', 'Three.js', 'DEVS REC'],
      liveUrl: 'https://learn.devsrec.com/',
      sourceUrl: 'https://github.com/Saisrikar20/DEVs-P2P',
      featured: true,
      order: 1,
    },
  },
  {
    slug: 'hackmentor-ai',
    entry: {
      title: 'HackMentor AI',
      description:
        'AI-powered evaluation engine accelerating hackathon scoring throughput by ~40% across 15+ judging panels. Engineered security guardrails blocking prompt injection attacks with 0 breaches across 30+ adversarial vectors.',
      tagline: 'AI Security & Guardrails',
      techStack: ['Python', 'AI Security', 'Prompt Defense', 'Guardrails', 'DEVS REC'],
      liveUrl: '',
      sourceUrl: 'https://github.com/Saisrikar20',
      featured: true,
      order: 2,
    },
  },
  {
    slug: 'docmind',
    entry: {
      title: 'DocMind',
      description:
        'Decoupled Document AI & local RAG platform ensuring 100% on-premises data isolation with sub-second retrieval. Adaptive dual-engine routing between Ollama and cloud APIs cuts inferencing costs by ~60%.',
      tagline: 'Offline Local RAG',
      techStack: ['Python', 'Docling', 'ChromaDB', 'RAG', 'Streamlit', 'PyTorch'],
      liveUrl: '',
      sourceUrl: 'https://github.com/Saisrikar20/DocMind',
      featured: true,
      order: 3,
    },
  },
  {
    slug: 'mailshield-ai',
    entry: {
      title: 'MailShield AI',
      description:
        'AI-powered email threat detection & forensic intelligence platform built for SIH 2026. Features an 8-stage security pipeline with deterministic threat scoring, IP geolocation, investigation graph visualization, and an AI Copilot for SOC analysts.',
      tagline: 'Threat Detection & Forensics',
      techStack: ['Python', 'FastAPI', 'React', 'OAuth 2.0', 'Forensics', 'SIH 2026'],
      liveUrl: '',
      sourceUrl: 'https://github.com/Saisrikar20/MailShield-AI',
      featured: true,
      order: 4,
    },
  },
  {
    slug: 'risonanza',
    entry: {
      title: 'Voice Emotion Recognition (Risonanza)',
      description:
        'Real-time speech emotion classifier with sub-300ms audio inference and ~85% accuracy across 6 emotional states. Built and deployed under 24-hour hackathon constraints with Librosa MFCC and Scikit-learn.',
      tagline: 'Audio ML & Signal Processing',
      techStack: ['Python', 'Librosa', 'Streamlit', 'Scikit-learn'],
      liveUrl: 'https://risonanza.streamlit.app/',
      sourceUrl: 'https://github.com/Saisrikar20',
      featured: true,
      order: 5,
    },
  },
  {
    slug: 'ml-projects-portfolio',
    entry: {
      title: 'ML Pipelines Portfolio',
      description:
        'First-principles ML implementations: Sonar rock-vs-mine classifier (90.5% test accuracy) and Pima diabetes prediction with strict zero data-leakage cross-validation pipelines.',
      tagline: 'First-Principles ML',
      techStack: ['Python', 'Scikit-learn', 'ML Pipelines', 'SVM', 'GridSearchCV'],
      liveUrl: '',
      sourceUrl: 'https://github.com/Saisrikar20/ml-projects-portfolio',
      featured: true,
      order: 6,
    },
  },
];

const DEFAULT_SKILLS = [
  {
    slug: 'languages',
    entry: {
      category: 'Languages',
      skills: ['Python', 'TypeScript', 'Java', 'C', 'SQL', 'PL/SQL'],
      order: 1,
    },
  },
  {
    slug: 'frameworks',
    entry: {
      category: 'Frameworks & Libraries',
      skills: [
        'Next.js',
        'React',
        'FastAPI',
        'Flask',
        'Streamlit',
        'Tailwind CSS',
        'Scikit-learn',
        'Librosa',
        'NumPy',
        'Pandas',
        'Matplotlib',
        'LangChain',
        'PyTorch',
      ],
      order: 2,
    },
  },
  {
    slug: 'security',
    entry: {
      category: 'Security',
      skills: ['Metasploit', 'Kali Linux', 'Wireshark', 'Nmap', 'Prompt Defense', 'Air-Gapped RAG'],
      order: 3,
    },
  },
  {
    slug: 'tools',
    entry: {
      category: 'Tools & Databases',
      skills: ['PostgreSQL', 'SQLite', 'Git', 'GitHub', 'Docker', 'Ollama', 'ChromaDB', 'Bash', 'VirtualBox', 'Linux', 'VS Code'],
      order: 4,
    },
  },
];

const DEFAULT_EDUCATION = [
  {
    slug: 'btech-ai-ds',
    entry: {
      degree: 'B.Tech in Artificial Intelligence & Data Science',
      institution: 'Rajalakshmi Engineering College, Chennai',
      period: '2025 – Present',
      score: 'SGPA 8.98 / 10',
      description:
        'Pursuing a degree focused on AI, data science, and secure software development with Cybersecurity Honours.',
      order: 1,
    },
  },
  {
    slug: 'cbse-class-12',
    entry: {
      degree: 'Higher Secondary Education (CBSE Class 12)',
      institution: 'Velammal New Gen School, Chennai',
      period: '2023 – 2025',
      score: '472/500 (100% CS Centum)',
      description:
        'Scored 472/500 with prestigious academic distinction 100/100 Centum Award in Computer Science.',
      order: 2,
    },
  },
  {
    slug: 'cbse-class-10',
    entry: {
      degree: 'Secondary Education (CBSE Class 10)',
      institution: 'Central Board of Secondary Education',
      period: '2023',
      score: '457/500 (91.4%)',
      description:
        'Scored 457/500 with solid foundational mastery in science, mathematics, and analytical problem-solving.',
      order: 3,
    },
  },
];

const DEFAULT_CERTS = [
  {
    slug: 'google-cybersecurity',
    entry: {
      title: 'Google Cybersecurity Professional Certificate',
      issuer: 'Google / Coursera',
      date: 'Aug 2025',
      description: 'Comprehensive network security, incident detection, SIEM tools, and defensive architecture.',
      credentialUrl: '',
      order: 1,
    },
  },
  {
    slug: 'google-bit-build',
    entry: {
      title: 'Google Bit & Build',
      issuer: 'Google Developer Groups',
      date: 'Oct 2025',
      description: 'Technical hackathon and engineering build sprint credential with Google developer platforms.',
      credentialUrl: '',
      order: 2,
    },
  },
  {
    slug: 'ml-foundations-calculus',
    entry: {
      title: 'Machine Learning Foundations: Calculus',
      issuer: 'DeepLearning.AI / Coursera',
      date: 'Sep 2025',
      description: 'Multivariable calculus, gradient descent optimization, and loss function landscapes for neural networks.',
      credentialUrl: '',
      order: 3,
    },
  },
  {
    slug: 'intro-networking',
    entry: {
      title: 'Introduction to Networking',
      issuer: 'Cisco / Coursera',
      date: 'Aug 2025',
      description: 'IP addressing, subnetting, TCP/IP protocol suite, network routing, and packet flow analysis.',
      credentialUrl: '',
      order: 4,
    },
  },
];

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
    if (projects && projects.length > 0) {
      return projects.sort((a, b) => (a.entry.order || 0) - (b.entry.order || 0));
    }
    return DEFAULT_PROJECTS;
  } catch (err) {
    console.error('Error reading projects from Keystatic, using fallback:', err);
    return DEFAULT_PROJECTS;
  }
}

export async function getSkills() {
  try {
    const skills = await reader.collections.skills.all();
    if (skills && skills.length > 0) {
      return skills.sort((a, b) => (a.entry.order || 0) - (b.entry.order || 0));
    }
    return DEFAULT_SKILLS;
  } catch (err) {
    console.error('Error reading skills from Keystatic, using fallback:', err);
    return DEFAULT_SKILLS;
  }
}

export async function getEducation() {
  try {
    const education = await reader.collections.education.all();
    if (education && education.length > 0) {
      return education.sort((a, b) => (a.entry.order || 0) - (b.entry.order || 0));
    }
    return DEFAULT_EDUCATION;
  } catch (err) {
    console.error('Error reading education from Keystatic, using fallback:', err);
    return DEFAULT_EDUCATION;
  }
}

export async function getCertifications() {
  try {
    const certs = await reader.collections.certifications.all();
    if (certs && certs.length > 0) {
      return certs.sort((a, b) => (a.entry.order || 0) - (b.entry.order || 0));
    }
    return DEFAULT_CERTS;
  } catch (err) {
    console.error('Error reading certifications from Keystatic, using fallback:', err);
    return DEFAULT_CERTS;
  }
}

export async function getAbout() {
  try {
    const about = await reader.singletons.about.read();
    if (about) return about;
  } catch (err) {
    console.error('Error reading about singleton from Keystatic:', err);
  }
  return {
    headline: 'About Me',
    paragraph1:
      "I'm a B.Tech student specializing in AI & Data Science (Honours in Cybersecurity), curious about how intelligent systems learn, adapt, and scale. I build precise, efficient solutions grounded in strong technical fundamentals.",
    paragraph2:
      'Curious about the intersection of machine learning, cybersecurity, and intelligent software architecture — focused on building reliable, secure systems that perform dependably under real-world conditions.',
    basedIn: 'Chennai, IN',
    studying: 'AI & Data Science, Cybersecurity Honours',
    focus: 'AI & Secure Systems',
  };
}

export async function getSettings() {
  try {
    const settings = await reader.singletons.settings.read();
    if (settings) return settings;
  } catch (err) {
    console.error('Error reading settings singleton from Keystatic:', err);
  }
  return {
    heroEyebrow: 'AI & Data Science Student',
    heroHeading: "Hi, I'm Sai Srikar",
    heroSubtitle:
      'AI & Data Science undergraduate with a specialization in Cybersecurity, focused on building intelligent and secure systems.',
    email: 'saisrikarB@outlook.com',
    githubUrl: 'https://github.com/Saisrikar20',
    linkedinUrl: 'https://www.linkedin.com/in/sai-srikar-b-54b1b8359/',
    xUrl: 'https://x.com/saisrikar07',
    instagramUrl: 'https://www.instagram.com/__saisrikar__/',
  };
}
