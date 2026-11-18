import React from 'react';
import type { Metadata } from 'next';
import {
  getProjects,
  getSkills,
  getEducation,
  getCertifications,
  getAbout,
  getSettings,
} from '@/lib/keystatic';
import { XIcon } from '@/components/ui/BrandIcons';
import { Navbar } from '@/components/ui/Navbar';

export const metadata: Metadata = {
  title: 'Sai Srikar | AI & Data Science Web Portfolio',
  description:
    'Portfolio of Sai Srikar, AI & Data Science student at Rajalakshmi Engineering College specializing in Cybersecurity.',
};

export const revalidate = 0; // Ensures immediate updates when Keystatic saves content

function getProjectIcon(slug: string): string {
  const s = slug.toLowerCase();
  if (s.includes('devs') || s.includes('p2p')) return 'graduation-cap';
  if (s.includes('hackmentor') || s.includes('guardrail')) return 'shield-alert';
  if (s.includes('docmind') || s.includes('rag') || s.includes('doc')) return 'file-text';
  if (s.includes('shield') || s.includes('security') || s.includes('forensic')) return 'shield-check';
  if (s.includes('risonanza') || s.includes('voice') || s.includes('emotion') || s.includes('audio')) return 'mic';
  if (s.includes('ml') || s.includes('pipeline')) return 'brain';
  return 'code-2';
}

function getSkillIcon(category: string): string {
  const c = category.toLowerCase();
  if (c.includes('language')) return 'terminal';
  if (c.includes('framework')) return 'layers';
  if (c.includes('security')) return 'shield-check';
  if (c.includes('tool') || c.includes('database')) return 'wrench';
  return 'cpu';
}

export default async function HomePage() {
  const [projects, skills, education, certs, about, settings] = await Promise.all([
    getProjects(),
    getSkills(),
    getEducation(),
    getCertifications(),
    getAbout(),
    getSettings(),
  ]);

  const heroEyebrow = settings?.heroEyebrow || 'AI & Data Science Student';
  const heroHeading = settings?.heroHeading || "Hi, I'm Sai Srikar";
  const heroSubtitle =
    settings?.heroSubtitle ||
    'AI & Data Science undergraduate with a specialization in Cybersecurity, focused on building intelligent and secure systems.';

  const aboutHeadline = about?.headline || 'About Me';
  const aboutP1 =
    about?.paragraph1 ||
    "I'm a B.Tech student specializing in AI & Data Science (Honours in Cybersecurity), curious about how intelligent systems learn, adapt, and scale. I build precise, efficient solutions grounded in strong technical fundamentals.";
  const aboutP2 =
    about?.paragraph2 ||
    'Curious about the intersection of machine learning, cybersecurity, and intelligent software architecture — focused on building reliable, secure systems that perform dependably under real-world conditions.';
  const basedIn = about?.basedIn || 'Chennai, IN';
  const studying = about?.studying || 'AI & Data Science, Cybersecurity Honours';
  const focus = about?.focus || 'AI & Secure Systems';

  const email = settings?.email || 'saisrikarB@outlook.com';
  const githubUrl = settings?.githubUrl || 'https://github.com/Saisrikar20';
  const linkedinUrl = settings?.linkedinUrl || 'https://www.linkedin.com/in/sai-srikar-b-54b1b8359/';
  const xUrl = settings?.xUrl || 'https://x.com/saisrikar07';
  const instagramUrl = settings?.instagramUrl || 'https://www.instagram.com/__saisrikar__/';

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section id="home" className="hero">
          <div className="container hero-content">
            <span className="hero-eyebrow">{heroEyebrow}</span>
            <h1>
              {heroHeading.startsWith("Hi, I'm ") ? (
                <>
                  Hi, I&apos;m <span>{heroHeading.replace("Hi, I'm ", '')}</span>
                </>
              ) : (
                heroHeading
              )}
            </h1>
            <p>{heroSubtitle}</p>
            <div className="hero-actions">
              <a href="#projects" className="btn btn-primary hover-target">
                View My Work
              </a>
              <a href="#about" className="btn btn-outline hover-target">
                About Me
              </a>
            </div>
          </div>
          <a href="#about" className="scroll-indicator hover-target" aria-label="Scroll down">
            <i data-lucide="arrow-down"></i>
          </a>
        </section>

        {/* About Section */}
        <section id="about">
          <div className="container">
            <h2 className="section-title">{aboutHeadline}</h2>
            <div className="about-grid">
              <div className="about-text">
                <p>{aboutP1}</p>
                <p>{aboutP2}</p>
              </div>
              <div className="about-cards">
                <div className="info-card">
                  <div className="info-icon">
                    <i data-lucide="map-pin"></i>
                  </div>
                  <div className="info-content">
                    <h4>Based In</h4>
                    <p>{basedIn}</p>
                  </div>
                </div>
                <div className="info-card">
                  <div className="info-icon">
                    <i data-lucide="book-open"></i>
                  </div>
                  <div className="info-content">
                    <h4>Studying</h4>
                    <p>{studying}</p>
                  </div>
                </div>
                <div className="info-card">
                  <div className="info-icon">
                    <i data-lucide="code"></i>
                  </div>
                  <div className="info-content">
                    <h4>Focus</h4>
                    <p>{focus}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects">
          <div className="container">
            <h2 className="section-title">Selected Work</h2>
            <div className="projects-grid">
              {projects.map((project) => (
                <div key={project.slug} className="project-card hover-target">
                  <div className="project-title">
                    <h3>{project.entry.title}</h3>
                    <i data-lucide={getProjectIcon(project.slug)}></i>
                  </div>
                  <p className="project-desc">{project.entry.description}</p>

                  {/* Subprojects dropdown if ML Portfolio */}
                  {project.slug.includes('ml-projects') && (
                    <details className="subproject-dropdown">
                      <summary className="hover-target">
                        <span>Explore Projects (2)</span>
                        <i data-lucide="chevron-down" className="dropdown-icon"></i>
                      </summary>
                      <div className="subproject-content">
                        <div className="subproject-item">
                          <h5>
                            <i data-lucide="radar" style={{ width: 14, height: 14, color: 'var(--accent)' }}></i>{' '}
                            Sonar Rock-vs-Mine Classifier
                          </h5>
                          <p>
                            UCI Sonar dataset — iterated through 8 model versions from a broken baseline to a tuned SVM
                            (~83% CV / ~90.5% test accuracy).
                          </p>
                        </div>
                        <div className="subproject-item">
                          <h5>
                            <i data-lucide="activity" style={{ width: 14, height: 14, color: 'var(--accent)' }}></i>{' '}
                            Diabetes Prediction
                          </h5>
                          <p>
                            Pima Indians dataset — sklearn pipeline work, fixed data leakage, correct StandardScaler
                            placement inside pipelines, StratifiedKFold CV, GridSearchCV over SVM hyperparameters (~77%
                            CV accuracy).
                          </p>
                        </div>
                      </div>
                    </details>
                  )}

                  <div className="project-tech">
                    {project.entry.techStack.map((tech) => (
                      <span key={tech} className="tech-pill">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {(project.entry.liveUrl || project.entry.sourceUrl) && (
                    <div className="project-links">
                      {project.entry.liveUrl && (
                        <a
                          href={project.entry.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover-target"
                        >
                          <i data-lucide="external-link" style={{ width: 16, height: 16 }}></i> Live Site
                        </a>
                      )}
                      {project.entry.sourceUrl && (
                        <a
                          href={project.entry.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover-target"
                        >
                          <i className="bx bxl-github" style={{ fontSize: 16 }}></i> Source
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills">
          <div className="container">
            <h2 className="section-title">What I Work With</h2>
            <div className="skills-grid">
              {skills.map((skillGroup) => (
                <div key={skillGroup.slug} className="skill-quadrant">
                  <div className="skill-header">
                    <i data-lucide={getSkillIcon(skillGroup.entry.category)}></i>
                    <h3>{skillGroup.entry.category}</h3>
                  </div>
                  <div className="skill-tags">
                    {skillGroup.entry.skills.map((s) => (
                      <span key={s} className="skill-tag">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* What I'm Learning Now */}
            <h2 className="section-title" style={{ marginTop: '8rem' }}>
              What I&apos;m Learning Now
            </h2>
            <div className="learning-grid">
              <div className="learning-card hover-target">
                <div className="learning-icon pulse">
                  <i data-lucide="brain"></i>
                </div>
                <div className="learning-info">
                  <h4>ML Theory Deep-Dive</h4>
                  <p>
                    Building instinctive understanding of core ML (linear regression mechanics, gradient descent,
                    bias-variance tradeoff, cross-validation) through active recall, not memorization.
                  </p>
                </div>
              </div>
              <div className="learning-card hover-target">
                <div className="learning-icon pulse">
                  <i data-lucide="workflow"></i>
                </div>
                <div className="learning-info">
                  <h4>MLOps</h4>
                  <p>Model deployment, pipelines, and taking ML projects from notebook to production.</p>
                </div>
              </div>
              <div className="learning-card hover-target">
                <div className="learning-icon pulse">
                  <i data-lucide="cpu"></i>
                </div>
                <div className="learning-info">
                  <h4>AI Engineering</h4>
                  <p>
                    Working through the AI Engineering from Scratch curriculum, focused on agent engineering and AI
                    safety/security topics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Credentials Section */}
        <section id="certificates">
          <div className="container">
            <h2 className="section-title">Credentials</h2>
            <div className="certs-top">
              {certs.map((c) => (
                <div key={c.slug} className="cert-card">
                  <div className="cert-icon">
                    <i data-lucide="shield-check"></i>
                  </div>
                  <div className="cert-info">
                    <h4>{c.entry.title}</h4>
                    <p>
                      {c.entry.issuer}, {c.entry.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="marquee-container">
            <div className="marquee hover-target">
              <img
                src="/certs/Screenshot%202026-04-19%20152548.png"
                alt="Certification 2"
                className="cert-img"
                loading="lazy"
              />
              <img
                src="/certs/Screenshot%202026-04-19%20152652.png"
                alt="Certification 3"
                className="cert-img"
                loading="lazy"
              />
              <img
                src="/certs/Screenshot%202026-04-19%20152916.png"
                alt="Certification 4"
                className="cert-img"
                loading="lazy"
              />
              <img
                src="/certs/Screenshot%202026-04-19%20152940.png"
                alt="Certification 5"
                className="cert-img"
                loading="lazy"
              />
              <img
                src="/certs/Screenshot%202026-04-19%20153417.png"
                alt="Certification 6"
                className="cert-img"
                loading="lazy"
              />
              <img
                src="/certs/Screenshot%202026-04-19%20153450.png"
                alt="Certification 7"
                className="cert-img"
                loading="lazy"
              />
              {/* Duplicated for smooth infinite marquee */}
              <img
                src="/certs/Screenshot%202026-04-19%20152548.png"
                alt="Certification 2"
                className="cert-img"
                loading="lazy"
              />
              <img
                src="/certs/Screenshot%202026-04-19%20152652.png"
                alt="Certification 3"
                className="cert-img"
                loading="lazy"
              />
              <img
                src="/certs/Screenshot%202026-04-19%20152916.png"
                alt="Certification 4"
                className="cert-img"
                loading="lazy"
              />
              <img
                src="/certs/Screenshot%202026-04-19%20152940.png"
                alt="Certification 5"
                className="cert-img"
                loading="lazy"
              />
              <img
                src="/certs/Screenshot%202026-04-19%20153417.png"
                alt="Certification 6"
                className="cert-img"
                loading="lazy"
              />
              <img
                src="/certs/Screenshot%202026-04-19%20153450.png"
                alt="Certification 7"
                className="cert-img"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Education Timeline */}
        <section id="experience">
          <div className="container">
            <div className="timeline-header">
              <h2 className="section-title" style={{ marginBottom: 0 }}>
                Education
              </h2>
              <a href="/resume.pdf" className="btn btn-primary hover-target" target="_blank">
                Download Resume{' '}
                <i data-lucide="download" className="btn-icon" style={{ width: 18, height: 18 }}></i>
              </a>
            </div>

            <div className="timeline">
              {education.map((item, idx) => (
                <div key={item.slug} className={`timeline-item ${idx % 2 === 0 ? 'left' : 'right'}`}>
                  <div className="timeline-content hover-target">
                    <span className="timeline-badge badge-edu">EDUCATION</span>
                    <div className="timeline-date">{item.entry.period}</div>
                    <h3 className="timeline-title">{item.entry.degree}</h3>
                    {item.entry.institution && <h4 className="timeline-subtitle">{item.entry.institution}</h4>}
                    <p>{item.entry.description}</p>
                    {item.entry.score && (
                      <p>
                        <strong>{item.entry.score}</strong>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact">
          <div className="container">
            <div className="contact-section">
              <h2 className="section-title">Let&apos;s Build Something Together</h2>
              <p style={{ marginBottom: '2rem' }}>
                I&apos;m always open to discussing new projects, creative ideas, or opportunities. Feel free to connect
                with me directly on any of these platforms:
              </p>

              <div className="quick-links-grid">
                {email && (
                  <a href={`mailto:${email}`} className="quick-link-card hover-target">
                    <div className="ql-icon">
                      <i data-lucide="mail"></i>
                    </div>
                    <div className="ql-text">
                      <h4>Email</h4>
                      <span>{email}</span>
                    </div>
                  </a>
                )}
                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="quick-link-card hover-target"
                  >
                    <div className="ql-icon">
                      <i className="bx bxl-linkedin"></i>
                    </div>
                    <div className="ql-text">
                      <h4>LinkedIn</h4>
                      <span>Let&apos;s connect</span>
                    </div>
                  </a>
                )}
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="quick-link-card hover-target"
                  >
                    <div className="ql-icon">
                      <i className="bx bxl-github"></i>
                    </div>
                    <div className="ql-text">
                      <h4>GitHub</h4>
                      <span>Explore my code</span>
                    </div>
                  </a>
                )}
                {xUrl && (
                  <a href={xUrl} target="_blank" rel="noopener noreferrer" className="quick-link-card hover-target">
                    <div className="ql-icon">
                      <XIcon size={20} />
                    </div>
                    <div className="ql-text">
                      <h4>X</h4>
                      <span>@saisrikar07</span>
                    </div>
                  </a>
                )}
                {instagramUrl && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="quick-link-card hover-target"
                  >
                    <div className="ql-icon">
                      <i className="bx bxl-instagram"></i>
                    </div>
                    <div className="ql-text">
                      <h4>Instagram</h4>
                      <span>@__saisrikar__</span>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer>
        <div className="container footer-content" style={{ justifyContent: 'center' }}>
          <div className="footer-text">&copy; {new Date().getFullYear()} Sai Srikar. Built with care.</div>
        </div>
      </footer>
    </>
  );
}
