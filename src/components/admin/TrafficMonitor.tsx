'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  Users,
  Eye,
  Globe,
  Smartphone,
  Compass,
  RefreshCw,
  Clock,
  Sparkles,
  Trash2,
  Download,
  Database,
  Info,
  X,
  Upload,
} from 'lucide-react';
import type { AnalyticsSummary } from '@/lib/analytics';

const BACKUP_STORAGE_KEY = 'sai_analytics_backup_v1';

export function TrafficMonitor() {
  const [range, setRange] = useState<'today' | '7d' | '30d' | 'all'>('all');
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showKvModal, setShowKvModal] = useState(false);
  const [hasLocalBackup, setHasLocalBackup] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const fetchData = async (selectedRange: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?range=${selectedRange}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);

        // Auto-cache to browser localStorage as a client-side backup
        if (json.recentHits && json.recentHits.length > 0) {
          try {
            const existingRaw = localStorage.getItem(BACKUP_STORAGE_KEY);
            const existingHits = existingRaw ? JSON.parse(existingRaw) : [];
            const mergedMap = new Map();
            existingHits.forEach((h: { id: string }) => mergedMap.set(h.id, h));
            json.recentHits.forEach((h: { id: string }) => mergedMap.set(h.id, h));
            localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(Array.from(mergedMap.values())));
          } catch {
            // Ignore quota errors
          }
        }
      }
    } catch (err) {
      console.error('Failed to load traffic analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(range);

    // Check if client has cached backup
    try {
      const existingRaw = localStorage.getItem(BACKUP_STORAGE_KEY);
      if (existingRaw) {
        const parsed = JSON.parse(existingRaw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHasLocalBackup(true);
        }
      }
    } catch {
      // Ignore
    }
  }, [range]);

  const handleDownloadBackup = () => {
    if (!data?.recentHits) return;
    const blob = new Blob([JSON.stringify(data.recentHits, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-analytics-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRestoreFromCache = async () => {
    try {
      const existingRaw = localStorage.getItem(BACKUP_STORAGE_KEY);
      if (!existingRaw) return;
      const parsed = JSON.parse(existingRaw);
      if (!Array.isArray(parsed) || parsed.length === 0) return;

      setRestoring(true);
      const res = await fetch('/api/admin/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: parsed }),
      });

      if (res.ok) {
        fetchData(range);
      }
    } catch (err) {
      console.error('Failed to restore analytics backup:', err);
    } finally {
      setRestoring(false);
    }
  };

  return (
    <div className="p-3.5 sm:p-6 max-w-7xl mx-auto space-y-6 sm:space-y-8 font-sans transition-colors duration-200 w-full min-w-0 overflow-x-hidden">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800/80 pb-6 transition-colors duration-200">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Traffic & Visitor Intelligence</h2>
            <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              Live Tracking
            </span>

            {/* Storage Provider Badge */}
            <button
              onClick={() => setShowKvModal(true)}
              className={`flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
                data?.storageProvider === 'kv'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/15'
              }`}
              title="Click to view persistence status and cloud sync setup"
            >
              <Database size={11} />
              <span>{data?.storageProvider === 'kv' ? 'Cloud KV Persistent' : 'Local /tmp Storage (Tap to Enable KV)'}</span>
              <Info size={10} className="opacity-70" />
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Real-time analytics for portfolio visitors, technical blog readers, and referral sources.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe Filter */}
          <div className="flex overflow-x-auto bg-gray-100 dark:bg-[#14141C] p-0.5 sm:p-1 rounded-full border border-gray-200 dark:border-gray-800 transition-colors duration-200">
            {(['today', '7d', '30d', 'all'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setRange(t)}
                className={`px-2.5 sm:px-3.5 py-1 text-[11px] sm:text-xs rounded-full font-mono transition-all cursor-pointer border-0 shrink-0 ${
                  range === t
                    ? 'bg-[#D6544B] text-white font-semibold shadow-[0_2px_10px_rgba(214,84,75,0.3)]'
                    : 'bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {t === 'today' ? 'Today' : t === '7d' ? '7 Days' : t === '30d' ? '30 Days' : 'All Time'}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => fetchData(range)}
            disabled={loading}
            className="p-2 rounded-full bg-white dark:bg-[#14141C] border border-gray-200 dark:border-gray-800 hover:border-[#D6544B]/40 dark:hover:border-[#D6544B]/40 text-gray-600 dark:text-gray-400 hover:text-[#D6544B] dark:hover:text-[#D6544B] transition-all cursor-pointer shadow-sm"
            title="Refresh analytics data"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>

          {/* Download JSON Backup */}
          <button
            onClick={handleDownloadBackup}
            disabled={loading || !data?.totalViews}
            className="p-2 rounded-full bg-white dark:bg-[#14141C] border border-gray-200 dark:border-gray-800 hover:border-[#D6544B]/40 dark:hover:border-[#D6544B]/40 text-gray-600 dark:text-gray-400 hover:text-[#D6544B] dark:hover:text-[#D6544B] transition-all cursor-pointer shadow-sm disabled:opacity-40"
            title="Download JSON Analytics Backup"
          >
            <Download size={15} />
          </button>

          {/* Restore Cache Button (if client backup exists) */}
          {hasLocalBackup && (
            <button
              onClick={handleRestoreFromCache}
              disabled={restoring}
              className="p-2 rounded-full bg-white dark:bg-[#14141C] border border-gray-200 dark:border-gray-800 hover:border-emerald-400 dark:hover:border-emerald-500/40 text-gray-600 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-all cursor-pointer shadow-sm"
              title="Restore / Sync from Browser Cache"
            >
              <Upload size={15} className={restoring ? 'animate-bounce' : ''} />
            </button>
          )}

          {/* Clear Button */}
          <button
            onClick={async () => {
              if (window.confirm('Clear all recorded analytics history and start from 0?')) {
                await fetch('/api/admin/analytics', { method: 'DELETE' });
                try {
                  localStorage.removeItem(BACKUP_STORAGE_KEY);
                  setHasLocalBackup(false);
                } catch {
                  // Ignore
                }
                fetchData(range);
              }
            }}
            className="p-2 rounded-full bg-white dark:bg-[#14141C] border border-gray-200 dark:border-gray-800 hover:border-red-400 dark:hover:border-red-500/40 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-all cursor-pointer shadow-sm"
            title="Clear and reset analytics data"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Cloud KV Persistence Modal */}
      {showKvModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F0F16] border border-gray-200 dark:border-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white text-sm">
                <Database size={16} className="text-[#D6544B]" />
                <span>100% Cloud Persistence Setup</span>
              </div>
              <button
                onClick={() => setShowKvModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="text-xs text-gray-600 dark:text-gray-300 space-y-3 leading-relaxed">
              <p>
                In serverless environments like Vercel, the local filesystem is ephemeral and resets during cold starts or redeployments.
              </p>
              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#14141E] border border-gray-200 dark:border-gray-800 space-y-2">
                <div className="font-semibold text-gray-900 dark:text-white text-xs">
                  How to enable permanent cloud persistence:
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-gray-600 dark:text-gray-300">
                  <li>Open your <strong>Vercel Dashboard</strong> and navigate to your project.</li>
                  <li>Click the <strong>Storage</strong> tab and select <strong>KV (Redis)</strong>.</li>
                  <li>Click <strong>Create Database</strong> and link it to this project.</li>
                  <li>Vercel automatically sets <code className="text-[#D6544B] font-mono">KV_REST_API_URL</code> and <code className="text-[#D6544B] font-mono">KV_REST_API_TOKEN</code>.</li>
                </ol>
              </div>
              <p className="text-[11px] text-gray-500">
                Your portfolio code is already pre-configured to detect Vercel KV and Upstash Redis automatically! Once linked, every pageview and visitor hit is stored permanently forever across all regions and deployments.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowKvModal(false)}
                className="px-4 py-1.5 bg-[#D6544B] hover:bg-[#BF433B] text-white text-xs font-semibold rounded-full transition-all cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Page Views */}
        <div className="bg-white dark:bg-[#0F0F16] border border-gray-200 dark:border-gray-800/80 rounded-2xl p-5 relative overflow-hidden shadow-sm dark:shadow-none transition-colors duration-200">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Total Page Views</span>
            <div className="p-2 rounded-full bg-[#D6544B]/10 text-[#D6544B]">
              <Eye size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold font-sans text-gray-900 dark:text-white tracking-tight">
            {loading ? '...' : (data?.totalViews || 0).toLocaleString()}
          </div>
          <div className="text-[11px] font-mono text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
            <span className="text-[#D6544B] font-medium">Recorded hits</span> across all routes
          </div>
        </div>

        {/* Unique Visitors */}
        <div className="bg-white dark:bg-[#0F0F16] border border-gray-200 dark:border-gray-800/80 rounded-2xl p-5 relative overflow-hidden shadow-sm dark:shadow-none transition-colors duration-200">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Unique Visitors</span>
            <div className="p-2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Users size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold font-sans text-gray-900 dark:text-white tracking-tight">
            {loading ? '...' : (data?.uniqueVisitors || 0).toLocaleString()}
          </div>
          <div className="text-[11px] font-mono text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
            <span>Deduplicated via anonymized SHA-256</span>
          </div>
        </div>

        {/* Today's Activity */}
        <div className="bg-white dark:bg-[#0F0F16] border border-gray-200 dark:border-gray-800/80 rounded-2xl p-5 relative overflow-hidden shadow-sm dark:shadow-none transition-colors duration-200">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Today&apos;s Activity</span>
            <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Activity size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold font-sans text-gray-900 dark:text-white tracking-tight">
            {loading ? '...' : (data?.todayViews || 0).toLocaleString()}
          </div>
          <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
            Active today
          </div>
        </div>

        {/* Top Traffic Source */}
        <div className="bg-white dark:bg-[#0F0F16] border border-gray-200 dark:border-gray-800/80 rounded-2xl p-5 relative overflow-hidden shadow-sm dark:shadow-none transition-colors duration-200">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Top Referral Channel</span>
            <div className="p-2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Globe size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold font-sans text-gray-900 dark:text-white tracking-tight truncate">
            {loading ? '...' : data?.referrers?.[0]?.source || 'Direct'}
          </div>
          <div className="text-[11px] font-mono text-gray-500 dark:text-gray-400 mt-2">
            {data?.referrers?.[0] ? `${data.referrers[0].percentage}% of total acquisitions` : 'Direct navigation'}
          </div>
        </div>
      </div>

      {/* Main Grid: Top Pages & Referrers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Visited Pages */}
        <div className="bg-white dark:bg-[#0F0F16] border border-gray-200 dark:border-gray-800/80 rounded-2xl p-6 space-y-4 shadow-sm dark:shadow-none transition-colors duration-200">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800/60 pb-3">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-medium text-sm">
              <Compass size={16} className="text-[#D6544B]" />
              <span>Top Visited Pages</span>
            </div>
            <span className="text-xs font-mono text-gray-500 dark:text-gray-400">Visits & Share</span>
          </div>

          <div className="space-y-3">
            {(!data?.topPages || data.topPages.length === 0) && (
              <div className="text-xs text-gray-500 py-6 text-center">No page visit records yet</div>
            )}
            {data?.topPages?.slice(0, 7).map((p) => (
              <div key={p.path} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-gray-800 dark:text-gray-200 truncate max-w-xs">{p.path}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 dark:text-gray-400 font-mono">{p.count}</span>
                    <span className="text-[11px] text-gray-500 font-mono w-10 text-right">{p.percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 dark:bg-[#161622] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#D6544B] h-full rounded-full transition-all duration-500"
                    style={{ width: `${p.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources / Referrers */}
        <div className="bg-white dark:bg-[#0F0F16] border border-gray-200 dark:border-gray-800/80 rounded-2xl p-6 space-y-4 shadow-sm dark:shadow-none transition-colors duration-200">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800/60 pb-3">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-medium text-sm">
              <Globe size={16} className="text-blue-500 dark:text-blue-400" />
              <span>Traffic Acquisition Sources</span>
            </div>
            <span className="text-xs font-mono text-gray-500 dark:text-gray-400">Referrals</span>
          </div>

          <div className="space-y-3">
            {(!data?.referrers || data.referrers.length === 0) && (
              <div className="text-xs text-gray-500 py-6 text-center">No referral records yet</div>
            )}
            {data?.referrers?.slice(0, 7).map((ref) => (
              <div key={ref.source} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-mono text-gray-800 dark:text-gray-200">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        ref.source === 'X'
                          ? 'bg-black dark:bg-white dark:border-white/40'
                          : ref.source === 'LinkedIn'
                          ? 'bg-[#0077B5]'
                          : ref.source === 'GitHub'
                          ? 'bg-gray-600 dark:bg-gray-400'
                          : ref.source === 'Google'
                          ? 'bg-red-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                    <span>{ref.source}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 dark:text-gray-400 font-mono">{ref.count}</span>
                    <span className="text-[11px] text-gray-500 font-mono w-10 text-right">{ref.percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 dark:bg-[#161622] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${ref.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Breakdown: Device & Browser Distribution */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Device Distribution */}
        <div className="bg-white dark:bg-[#0F0F16] border border-gray-200 dark:border-gray-800/80 rounded-2xl p-5 space-y-4 shadow-sm dark:shadow-none transition-colors duration-200">
          <div className="flex items-center gap-2 text-gray-900 dark:text-white font-medium text-sm border-b border-gray-100 dark:border-gray-800/60 pb-3">
            <Smartphone size={16} className="text-purple-500 dark:text-purple-400" />
            <span>Device Type</span>
          </div>
          <div className="space-y-2.5">
            {data?.devices?.map((d) => (
              <div key={d.device} className="flex items-center justify-between text-xs">
                <span className="text-gray-700 dark:text-gray-300 font-mono">{d.device}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400 font-mono">{d.count} hits</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 font-mono text-[11px]">
                    {d.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Browser Breakdown */}
        <div className="bg-white dark:bg-[#0F0F16] border border-gray-200 dark:border-gray-800/80 rounded-2xl p-5 space-y-4 shadow-sm dark:shadow-none transition-colors duration-200">
          <div className="flex items-center gap-2 text-gray-900 dark:text-white font-medium text-sm border-b border-gray-100 dark:border-gray-800/60 pb-3">
            <Globe size={16} className="text-emerald-500 dark:text-emerald-400" />
            <span>Browsers</span>
          </div>
          <div className="space-y-2.5">
            {data?.browsers?.map((b) => (
              <div key={b.browser} className="flex items-center justify-between text-xs">
                <span className="text-gray-700 dark:text-gray-300 font-mono">{b.browser}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400 font-mono">{b.count} hits</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono text-[11px]">
                    {b.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Country Breakdown */}
        <div className="bg-white dark:bg-[#0F0F16] border border-gray-200 dark:border-gray-800/80 rounded-2xl p-5 space-y-4 shadow-sm dark:shadow-none transition-colors duration-200">
          <div className="flex items-center gap-2 text-gray-900 dark:text-white font-medium text-sm border-b border-gray-100 dark:border-gray-800/60 pb-3">
            <Sparkles size={16} className="text-amber-500 dark:text-yellow-400" />
            <span>Top Geographic Regions</span>
          </div>
          <div className="space-y-2.5">
            {data?.countries?.map((c) => (
              <div key={c.country} className="flex items-center justify-between text-xs">
                <span className="text-gray-700 dark:text-gray-300 font-mono uppercase">{c.country}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400 font-mono">{c.count} hits</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-yellow-500/10 text-amber-700 dark:text-yellow-300 font-mono text-[11px]">
                    {c.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real-Time Live Activity Stream */}
      <div className="bg-white dark:bg-[#0F0F16] border border-gray-200 dark:border-gray-800/80 rounded-2xl p-6 space-y-4 shadow-sm dark:shadow-none transition-colors duration-200">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800/60 pb-4">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[#D6544B]" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Visitor Activity Stream</h3>
          </div>
          <span className="text-xs font-mono text-gray-500">Latest 30 hits</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800/60 text-gray-500 dark:text-gray-400 font-mono uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3">Path Visited</th>
                <th className="py-2.5 px-3">Source / Referrer</th>
                <th className="py-2.5 px-3">Device & Browser</th>
                <th className="py-2.5 px-3 text-right">Visitor Identifier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/40 font-mono">
              {(!data?.recentHits || data.recentHits.length === 0) && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500 font-sans text-xs">
                    No visitor hits recorded yet. Real-time traffic will stream here as visitors explore your portfolio.
                  </td>
                </tr>
              )}
              {data?.recentHits?.map((hit) => {
                const date = new Date(hit.timestamp);
                const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                return (
                  <tr key={hit.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {dateStr} <span className="text-gray-400 dark:text-gray-500">{timeStr}</span>
                    </td>
                    <td className="py-2.5 px-3 text-gray-900 dark:text-white font-medium">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#D6544B]/10 text-[#D6544B] dark:text-[#f87168] border border-[#D6544B]/20 font-medium">
                        {hit.path}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20 text-[11px] font-medium">
                        {hit.referrer}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-gray-700 dark:text-gray-300">
                      {hit.device} · {hit.browser}
                    </td>
                    <td className="py-2.5 px-3 text-right text-gray-500 text-[11px]">
                      {hit.visitorHash} ({hit.country})
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
