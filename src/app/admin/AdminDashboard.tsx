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
    <div className="min-h-screen bg-[#08080C] text-gray-100 flex flex-col font-sans">
      {/* Top Admin Navigation Header */}
      <header className="h-14 bg-[#0F0F16] border-b border-gray-800/80 px-4 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#D6544B]/15 border border-[#D6544B]/30 flex items-center justify-center text-[#D6544B]">
            <ShieldCheck size={18} />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-white tracking-tight">Sai Srikar</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-orange-500/10 text-[#D6544B] border border-[#D6544B]/20">
              Admin Portal
            </span>
          </div>

          {/* Mode Switcher Pills */}
          <div className="hidden sm:flex items-center bg-[#14141E] p-1 rounded-xl border border-gray-800 ml-3">
            <button
              onClick={() => setActiveTab('traffic')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === 'traffic'
                  ? 'bg-[#D6544B] text-white shadow-sm shadow-[#D6544B]/20'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <BarChart3 size={13} />
              <span>Traffic & Analytics</span>
            </button>
            <button
              onClick={() => setActiveTab('cms')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === 'cms'
                  ? 'bg-[#D6544B] text-white shadow-sm shadow-[#D6544B]/20'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Edit3 size={13} />
              <span>CMS Content</span>
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Mobile Mode Switcher */}
          <div className="flex sm:hidden items-center bg-[#14141E] p-1 rounded-xl border border-gray-800">
            <button
              onClick={() => setActiveTab('traffic')}
              className={`p-1.5 rounded-lg ${activeTab === 'traffic' ? 'bg-[#D6544B] text-white' : 'text-gray-400'}`}
              title="Traffic Analytics"
            >
              <BarChart3 size={14} />
            </button>
            <button
              onClick={() => setActiveTab('cms')}
              className={`p-1.5 rounded-lg ${activeTab === 'cms' ? 'bg-[#D6544B] text-white' : 'text-gray-400'}`}
              title="CMS Editor"
            >
              <Edit3 size={14} />
            </button>
          </div>

          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
          >
            <ExternalLink size={13} />
            <span>View Live Site</span>
          </Link>

          {activeTab === 'cms' && (
            <a
              href={currentFrameUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
              title="Open CMS in new fullscreen window"
            >
              <Maximize2 size={13} />
              <span>Fullscreen</span>
            </a>
          )}

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/50 border border-red-800/40 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut size={13} />
            <span>{loggingOut ? 'Locking...' : 'Lock / Log Out'}</span>
          </button>
        </div>
      </header>

      {/* Conditional Sub-navigation for CMS */}
      {activeTab === 'cms' && (
        <nav className="bg-[#0B0B10] border-b border-gray-800/60 px-4 py-2 overflow-x-auto flex items-center gap-1.5 scrollbar-none shrink-0">
          <span className="text-[11px] font-mono text-gray-500 uppercase tracking-wider mr-2 shrink-0">
            Jump to:
          </span>
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = currentFrameUrl === sec.path;
            return (
              <button
                key={sec.id}
                onClick={() => setCurrentFrameUrl(sec.path)}
                className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#D6544B] text-white font-medium shadow-sm shadow-[#D6544B]/20'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 border border-transparent hover:border-gray-800'
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
      <main className="flex-1 w-full relative overflow-y-auto">
        {activeTab === 'traffic' ? (
          <TrafficMonitor />
        ) : (
          <iframe
            key={currentFrameUrl}
            src={currentFrameUrl}
            title="Keystatic Admin Content Editor"
            className="w-full h-full border-0 absolute inset-0"
          />
        )}
      </main>
    </div>
  );
}
