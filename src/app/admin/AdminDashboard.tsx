'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  LogOut,
  ExternalLink,
  BookOpen,
  Briefcase,
  Layers,
  GraduationCap,
  Award,
  User,
  Settings,
  ShieldCheck,
  Maximize2,
  BarChart3,
  Edit3,
} from 'lucide-react';
import { TrafficMonitor } from '@/components/admin/TrafficMonitor';
import { AdminThemeToggle } from '@/components/admin/AdminThemeToggle';

const SECTIONS = [
  { id: 'posts', label: 'Blog Posts', icon: BookOpen, path: '/keystatic/collection/posts' },
  { id: 'projects', label: 'Selected Work', icon: Briefcase, path: '/keystatic/collection/projects' },
  { id: 'skills', label: 'Skills Quadrants', icon: Layers, path: '/keystatic/collection/skills' },
  { id: 'education', label: 'Education', icon: GraduationCap, path: '/keystatic/collection/education' },
  { id: 'certifications', label: 'Certifications', icon: Award, path: '/keystatic/collection/certifications' },
  { id: 'about', label: 'About Me', icon: User, path: '/keystatic/singleton/about' },
  { id: 'settings', label: 'Contact & Socials', icon: Settings, path: '/keystatic/singleton/settings' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'traffic' | 'cms'>('traffic');
  const [currentFrameUrl, setCurrentFrameUrl] = useState('/keystatic');
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      window.location.href = '/admin';
    } catch {
      window.location.href = '/admin';
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#08080C] text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-200 overflow-x-hidden max-w-[100vw]">
      {/* Top Admin Navigation Header */}
      <header className="h-14 bg-white dark:bg-[#0F0F16] border-b border-gray-200 dark:border-gray-800/80 px-2.5 sm:px-4 flex items-center justify-between shrink-0 select-none transition-colors duration-200 w-full max-w-[100vw] overflow-hidden">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-8 h-8 rounded-full bg-[#D6544B]/15 border border-[#D6544B]/30 flex items-center justify-center text-[#D6544B] shrink-0">
            <ShieldCheck size={18} />
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white tracking-tight">Sai Srikar</span>
            <span className="hidden md:inline-flex text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#D6544B]/10 text-[#D6544B] border border-[#D6544B]/25 font-semibold">
              Admin Portal
            </span>
          </div>

          {/* Mode Switcher Pills */}
          <div className="hidden sm:flex items-center bg-gray-100 dark:bg-[#14141E] p-1 rounded-full border border-gray-200 dark:border-gray-800 ml-3">
            <button
              onClick={() => setActiveTab('traffic')}
              className={`flex items-center gap-1.5 px-3.5 py-1 text-xs rounded-full font-medium transition-all cursor-pointer border-0 ${
                activeTab === 'traffic'
                  ? 'bg-[#D6544B] text-white font-semibold shadow-[0_2px_10px_rgba(214,84,75,0.3)]'
                  : 'bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <BarChart3 size={13} />
              <span>Traffic & Analytics</span>
            </button>
            <button
              onClick={() => setActiveTab('cms')}
              className={`flex items-center gap-1.5 px-3.5 py-1 text-xs rounded-full font-medium transition-all cursor-pointer border-0 ${
                activeTab === 'cms'
                  ? 'bg-[#D6544B] text-white font-semibold shadow-[0_2px_10px_rgba(214,84,75,0.3)]'
                  : 'bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Edit3 size={13} />
              <span>CMS Content</span>
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Mobile Mode Switcher */}
          <div className="flex sm:hidden items-center bg-gray-100 dark:bg-[#14141E] p-0.5 rounded-full border border-gray-200 dark:border-gray-800">
            <button
              onClick={() => setActiveTab('traffic')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium transition-all border-0 ${
                activeTab === 'traffic'
                  ? 'bg-[#D6544B] text-white font-semibold shadow-sm shadow-[#D6544B]/30'
                  : 'bg-transparent text-gray-600 dark:text-gray-400'
              }`}
              title="Traffic Analytics"
            >
              <BarChart3 size={11} />
              <span>Traffic</span>
            </button>
            <button
              onClick={() => setActiveTab('cms')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium transition-all border-0 ${
                activeTab === 'cms'
                  ? 'bg-[#D6544B] text-white font-semibold shadow-sm shadow-[#D6544B]/30'
                  : 'bg-transparent text-gray-600 dark:text-gray-400'
              }`}
              title="CMS Editor"
            >
              <Edit3 size={11} />
              <span>CMS</span>
            </button>
          </div>

          {/* Theme Toggle Button */}
          <AdminThemeToggle />

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-[#D6544B] dark:hover:text-[#D6544B] p-1.5 sm:px-2.5 sm:py-1.5 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#14141C] hover:border-[#D6544B]/40 dark:hover:border-[#D6544B]/40 transition-all shadow-sm"
            title="Open Live Website"
          >
            <ExternalLink size={12} />
            <span className="hidden sm:inline">Live Site</span>
          </Link>

          {activeTab === 'cms' && (
            <a
              href={currentFrameUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-[#D6544B] dark:hover:text-[#D6544B] px-3.5 py-1.5 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#14141C] hover:border-[#D6544B]/40 dark:hover:border-[#D6544B]/40 transition-all shadow-sm"
              title="Open CMS in new fullscreen window"
            >
              <Maximize2 size={13} />
              <span>Fullscreen</span>
            </a>
          )}

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#D6544B] bg-[#D6544B]/10 hover:bg-[#D6544B] hover:text-white border border-[#D6544B]/30 hover:border-[#D6544B] p-1.5 sm:px-3.5 sm:py-1.5 rounded-full transition-all duration-200 cursor-pointer shadow-[0_2px_8px_rgba(214,84,75,0.15)] hover:shadow-[0_4px_12px_rgba(214,84,75,0.3)] disabled:opacity-50"
            title="Lock and Log Out"
          >
            <LogOut size={12} />
            <span className="hidden sm:inline">{loggingOut ? 'Locking...' : 'Lock / Log Out'}</span>
          </button>
        </div>
      </header>

      {/* Conditional Sub-navigation for CMS */}
      {activeTab === 'cms' && (
        <nav className="bg-gray-50 dark:bg-[#0B0B10] border-b border-gray-200 dark:border-gray-800/60 px-4 py-2 overflow-x-auto flex items-center gap-2 scrollbar-none shrink-0 transition-colors duration-200">
          <span className="text-[11px] font-mono text-gray-500 uppercase tracking-wider mr-1 shrink-0">
            Jump to:
          </span>
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = currentFrameUrl === sec.path;
            return (
              <button
                key={sec.id}
                onClick={() => setCurrentFrameUrl(sec.path)}
                className={`inline-flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full transition-all shrink-0 cursor-pointer font-medium ${
                  isActive
                    ? 'bg-[#D6544B] text-white font-semibold shadow-[0_2px_10px_rgba(214,84,75,0.25)]'
                    : 'bg-white dark:bg-[#14141C] text-gray-700 dark:text-gray-300 hover:text-[#D6544B] dark:hover:text-[#D6544B] border border-gray-200 dark:border-gray-800 hover:border-[#D6544B]/40 dark:hover:border-[#D6544B]/40 shadow-sm'
                }`}
              >
                <Icon size={13} />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full min-w-0 relative overflow-y-auto overflow-x-hidden">
        {activeTab === 'traffic' ? (
          <TrafficMonitor />
        ) : (
          <iframe
            key={currentFrameUrl}
            src={currentFrameUrl}
            title="Keystatic Admin Content Editor"
            className="w-full h-full border-0 absolute inset-0 bg-white dark:bg-[#0C0C12]"
          />
        )}
      </main>
    </div>
  );
}
