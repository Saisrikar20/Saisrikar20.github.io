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
} from 'lucide-react';
import type { AnalyticsSummary } from '@/lib/analytics';

export function TrafficMonitor() {
  const [range, setRange] = useState<'today' | '7d' | '30d' | 'all'>('all');
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async (selectedRange: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?range=${selectedRange}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to load traffic analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(range);
  }, [range]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 font-sans transition-colors duration-200">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800/80 pb-6 transition-colors duration-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Traffic & Visitor Intelligence</h2>
            <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              Live Tracking
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Real-time analytics for portfolio visitors, technical blog readers, and referral sources.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Timeframe Filter */}
          <div className="flex bg-gray-100 dark:bg-[#14141C] p-1 rounded-full border border-gray-200 dark:border-gray-800 transition-colors duration-200">
            {(['today', '7d', '30d', 'all'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setRange(t)}
                className={`px-3.5 py-1 text-xs rounded-full font-mono transition-all cursor-pointer border-0 ${
                  range === t
                    ? 'bg-[#D6544B] text-white font-semibold shadow-[0_2px_10px_rgba(214,84,75,0.3)]'
                    : 'bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {t === 'today' ? 'Today' : t === '7d' ? '7 Days' : t === '30d' ? '30 Days' : 'All Time'}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchData(range)}
            disabled={loading}
            className="p-2 rounded-full bg-white dark:bg-[#14141C] border border-gray-200 dark:border-gray-800 hover:border-[#D6544B]/40 dark:hover:border-[#D6544B]/40 text-gray-600 dark:text-gray-400 hover:text-[#D6544B] dark:hover:text-[#D6544B] transition-all cursor-pointer shadow-sm"
            title="Refresh analytics data"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

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
