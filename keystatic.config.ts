import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage:
    process.env.NODE_ENV === 'production' && process.env.KEYSTATIC_GITHUB_CLIENT_ID
      ? {
          kind: 'github',
          repo: 'Saisrikar20/Saisrikar20.github.io',
        }
      : {
          kind: 'local',
        },
  collections: {
    // 1. Blog Posts Collection
    posts: collection({
      label: 'Blog Posts',
      slugField: 'title',
      path: 'content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        publishedAt: fields.date({
          label: 'Published Date',
          defaultValue: { kind: 'today' },
        }),
        summary: fields.text({
          label: 'Summary / Excerpt',
          multiline: true,
        }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'AI Security & Defense', value: 'ai-security' },
            { label: 'Autonomous Agents', value: 'autonomous-agents' },
            { label: 'Local RAG & LLMs', value: 'local-rag' },
            { label: 'Cybersecurity', value: 'cybersecurity' },
            { label: 'Engineering Insights', value: 'engineering' },
          ],
          defaultValue: 'ai-security',
        }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: (props) => props.value,
        }),
        coverImage: fields.text({
          label: 'Cover Image URL / Path (optional)',
        }),
        content: fields.markdoc({
          label: 'Post Content',
        }),
      },
    }),

    // 2. Projects Collection (Selected Work)
    projects: collection({
      label: 'Projects (Selected Work)',
      slugField: 'title',
      path: 'content/projects/*',
      schema: {
        title: fields.slug({ name: { label: 'Project Name' } }),
        description: fields.text({
          label: 'Description',
          multiline: true,
        }),
        tagline: fields.text({
          label: 'Domain / Category Pill (e.g. AI Security, Local RAG, Web Platform)',
        }),
        techStack: fields.array(fields.text({ label: 'Technology / Tool' }), {
          label: 'Tech Stack Pills',
          itemLabel: (props) => props.value,
        }),
        liveUrl: fields.text({
          label: 'Live Site URL (optional)',
        }),
        sourceUrl: fields.text({
          label: 'Source Code / GitHub URL (optional)',
        }),
        featured: fields.checkbox({
          label: 'Featured Project',
          defaultValue: true,
        }),
        order: fields.integer({
          label: 'Display Order (1, 2, 3...)',
          defaultValue: 1,
        }),
      },
    }),

    // 3. Technical Skills Quadrants
    skills: collection({
      label: 'Skills Quadrants',
      slugField: 'category',
      path: 'content/skills/*',
      schema: {
        category: fields.slug({ name: { label: 'Category Name (e.g. Languages, Frameworks, Security, Tools)' } }),
        skills: fields.array(fields.text({ label: 'Skill Name' }), {
          label: 'Skills in this Category',
          itemLabel: (props) => props.value,
        }),
        order: fields.integer({
          label: 'Display Order',
          defaultValue: 1,
        }),
      },
    }),

    // 4. Education & Background
    education: collection({
      label: 'Education & Academics',
      slugField: 'degree',
      path: 'content/education/*',
      schema: {
        degree: fields.slug({ name: { label: 'Degree / Examination' } }),
        institution: fields.text({
          label: 'Institution / Board Name',
        }),
        period: fields.text({
          label: 'Time Period (e.g. 2025 – Present)',
        }),
        score: fields.text({
          label: 'Score / Distinction Badge (e.g. SGPA 8.98 / 10, 100% CS Centum)',
        }),
        description: fields.text({
          label: 'Details / Description',
          multiline: true,
        }),
        order: fields.integer({
          label: 'Display Order',
          defaultValue: 1,
        }),
      },
    }),

    // 5. Certifications & Accreditations
    certifications: collection({
      label: 'Certifications & Credentials',
      slugField: 'title',
      path: 'content/certifications/*',
      schema: {
        title: fields.slug({ name: { label: 'Certificate Title' } }),
        issuer: fields.text({
          label: 'Issuing Organization (e.g. Google / Coursera, IBM)',
        }),
        date: fields.text({
          label: 'Date (e.g. Aug 2025)',
        }),
        description: fields.text({
          label: 'Description / Scope',
          multiline: true,
        }),
        credentialUrl: fields.text({
          label: 'Credential Verification URL (optional)',
        }),
        order: fields.integer({
          label: 'Display Order',
          defaultValue: 1,
        }),
      },
    }),
  },
  singletons: {
    // 6. Contact & Global Settings
    settings: singleton({
      label: 'Contact & Social Links',
      path: 'content/settings',
      schema: {
        name: fields.text({ label: 'Full Name', defaultValue: 'Sai Srikar B' }),
        title: fields.text({
          label: 'Title / Subtitle',
          defaultValue: 'AI & Data Science Student · Cybersecurity Honours',
        }),
        heroEyebrow: fields.text({
          label: 'Hero Eyebrow Text',
          defaultValue: 'AI & Data Science Student',
        }),
        heroHeading: fields.text({
          label: 'Hero Main Heading',
          defaultValue: "Hi, I'm Sai Srikar",
        }),
        heroSubtitle: fields.text({
          label: 'Hero Subtitle Description',
          multiline: true,
          defaultValue:
            'AI & Data Science undergraduate with a specialization in Cybersecurity, focused on building intelligent and secure systems.',
        }),
        email: fields.text({ label: 'Contact Email', defaultValue: 'saisrikarB@outlook.com' }),
        githubUrl: fields.text({ label: 'GitHub URL', defaultValue: 'https://github.com/Saisrikar20' }),
        linkedinUrl: fields.text({ label: 'LinkedIn URL', defaultValue: 'https://www.linkedin.com/in/sai-srikar-b-54b1b8359/' }),
        xUrl: fields.text({ label: 'X URL', defaultValue: 'https://x.com/saisrikar07' }),
        instagramUrl: fields.text({ label: 'Instagram URL', defaultValue: 'https://www.instagram.com/__saisrikar__/' }),
      },
    }),

    // 7. About Me Singleton
    about: singleton({
      label: 'About Me Section',
      path: 'content/about',
      schema: {
        headline: fields.text({ label: 'Section Title', defaultValue: 'About Me' }),
        paragraph1: fields.text({
          label: 'First Paragraph',
          multiline: true,
          defaultValue:
            "I'm a B.Tech student specializing in AI & Data Science (Honours in Cybersecurity), curious about how intelligent systems learn, adapt, and scale. I build precise, efficient solutions grounded in strong technical fundamentals.",
        }),
        paragraph2: fields.text({
          label: 'Second Paragraph',
          multiline: true,
          defaultValue:
            'Curious about the intersection of machine learning, cybersecurity, and intelligent software architecture — focused on building reliable, secure systems that perform dependably under real-world conditions.',
        }),
        basedIn: fields.text({ label: 'Based In Location', defaultValue: 'Chennai, IN' }),
        studying: fields.text({ label: 'Studying', defaultValue: 'AI & Data Science, Cybersecurity Honours' }),
        focus: fields.text({ label: 'Core Focus', defaultValue: 'AI & Secure Systems' }),
      },
    }),
  },
});
