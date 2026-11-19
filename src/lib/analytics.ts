import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface TrafficEvent {
  id: string;
  timestamp: string;
  path: string;
  referrer: string;
  device: 'Desktop' | 'Mobile' | 'Tablet';
  browser: 'Chrome' | 'Safari' | 'Firefox' | 'Edge' | 'Other';
  country: string;
  visitorHash: string;
}

export interface AnalyticsSummary {
  totalViews: number;
  uniqueVisitors: number;
  todayViews: number;
  topPages: { path: string; count: number; percentage: number }[];
  referrers: { source: string; count: number; percentage: number }[];
  devices: { device: string; count: number; percentage: number }[];
  browsers: { browser: string; count: number; percentage: number }[];
  countries: { country: string; count: number; percentage: number }[];
  recentHits: TrafficEvent[];
  storageProvider: 'kv' | 'file';
}

const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || null;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || null;
const KV_KEY = 'portfolio_analytics_events_v1';

const BUNDLED_ANALYTICS_FILE = path.join(process.cwd(), 'content', 'analytics.json');
const TMP_ANALYTICS_FILE = path.join('/tmp', 'analytics.json');

const ANALYTICS_FILE =
  process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
    ? TMP_ANALYTICS_FILE
    : BUNDLED_ANALYTICS_FILE;

// In-memory cache to ensure instant reads during warm container execution
let memoryEvents: TrafficEvent[] | null = null;
let lastKvFetchMs = 0;
const KV_CACHE_TTL_MS = 15000; // 15 seconds

/**
 * Fetch events from Vercel KV / Upstash Redis REST API if configured
 */
async function loadEventsFromKV(): Promise<TrafficEvent[] | null> {
  if (!KV_URL || !KV_TOKEN) return null;

  try {
    const res = await fetch(`${KV_URL}/get/${KV_KEY}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.result) {
        const parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    }
  } catch (err) {
    console.error('Failed to read from Vercel KV / Upstash:', err);
  }
  return null;
}

/**
 * Persist events to Vercel KV / Upstash Redis REST API
 */
async function saveEventsToKV(events: TrafficEvent[]): Promise<boolean> {
  if (!KV_URL || !KV_TOKEN) return false;

  try {
    const capped = events.slice(-5000);
    const res = await fetch(`${KV_URL}/set/${KV_KEY}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(JSON.stringify(capped)),
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to save to Vercel KV / Upstash:', err);
    return false;
  }
}

/**
 * Read events from local filesystem or bundled file with serverless /tmp fallback
 */
function loadEventsFromFile(): TrafficEvent[] {
  try {
    // 1. Try reading the active target file
    if (fs.existsSync(ANALYTICS_FILE)) {
      const raw = fs.readFileSync(ANALYTICS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }

    // 2. If in serverless and /tmp is empty, seed from bundled content/analytics.json
    if (ANALYTICS_FILE !== BUNDLED_ANALYTICS_FILE && fs.existsSync(BUNDLED_ANALYTICS_FILE)) {
      const raw = fs.readFileSync(BUNDLED_ANALYTICS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Seed /tmp so subsequent reads in this container find it
        try {
          const dir = path.dirname(ANALYTICS_FILE);
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(ANALYTICS_FILE, raw, 'utf-8');
        } catch {
          // Ignore write failure in seed
        }
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading analytics events from filesystem:', err);
  }

  return [];
}

/**
 * Save events to filesystem (both /tmp and content/analytics.json when writable)
 */
function saveEventsToFile(events: TrafficEvent[]) {
  const capped = events.slice(-5000);
  const jsonStr = JSON.stringify(capped, null, 2);

  // 1. Write to active analytics file (/tmp on Vercel, content/analytics.json locally)
  try {
    const dir = path.dirname(ANALYTICS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(ANALYTICS_FILE, jsonStr, 'utf-8');
  } catch (err) {
    console.error('Error saving analytics data to active file:', err);
  }

  // 2. Also attempt to save to content/analytics.json if locally running
  if (ANALYTICS_FILE !== BUNDLED_ANALYTICS_FILE) {
    try {
      if (fs.existsSync(path.dirname(BUNDLED_ANALYTICS_FILE))) {
        fs.writeFileSync(BUNDLED_ANALYTICS_FILE, jsonStr, 'utf-8');
      }
    } catch {
      // Expected to fail on read-only serverless lambdas
    }
  }
}

/**
 * Load events with cloud KV prioritized, falling back to local filesystem
 */
export async function loadEvents(): Promise<TrafficEvent[]> {
  const now = Date.now();

  // If KV is configured, check if we need to refresh from cloud
  if (KV_URL && KV_TOKEN) {
    if (!memoryEvents || now - lastKvFetchMs > KV_CACHE_TTL_MS) {
      const kvEvents = await loadEventsFromKV();
      if (kvEvents !== null) {
        memoryEvents = kvEvents;
        lastKvFetchMs = now;
        return memoryEvents;
      }
    }
  }

  // If in-memory cache exists and KV was not stale, return cache
  if (memoryEvents) return memoryEvents;

  // Fallback to filesystem
  const fileEvents = loadEventsFromFile();
  memoryEvents = fileEvents;
  return memoryEvents;
}

export async function clearAnalytics(): Promise<void> {
  memoryEvents = [];

  // Clear KV if active
  if (KV_URL && KV_TOKEN) {
    await saveEventsToKV([]);
  }

  // Clear files
  saveEventsToFile([]);
}

export async function restoreAnalytics(events: TrafficEvent[]): Promise<void> {
  if (!Array.isArray(events)) return;
  const capped = events.slice(-5000);
  memoryEvents = capped;

  if (KV_URL && KV_TOKEN) {
    await saveEventsToKV(capped);
  }
  saveEventsToFile(capped);
}

export function parseReferrer(rawReferrer: string | null | undefined): string {
  if (!rawReferrer) return 'Direct';
  try {
    const parsed = new URL(rawReferrer);
    const host = parsed.hostname.toLowerCase();
    if (host.includes('t.co') || host.includes('twitter.com') || host.includes('x.com')) return 'X';
    if (host.includes('linkedin.com')) return 'LinkedIn';
    if (host.includes('github.com')) return 'GitHub';
    if (host.includes('google.')) return 'Google';
    if (host.includes('reddit.com')) return 'Reddit';
    if (host.includes('youtube.com')) return 'YouTube';
    return host.replace(/^www\./, '');
  } catch {
    return 'Direct';
  }
}

export function parseUserAgent(ua: string | null | undefined): {
  device: 'Desktop' | 'Mobile' | 'Tablet';
  browser: 'Chrome' | 'Safari' | 'Firefox' | 'Edge' | 'Other';
} {
  if (!ua) return { device: 'Desktop', browser: 'Other' };
  const lower = ua.toLowerCase();

  // Device
  let device: 'Desktop' | 'Mobile' | 'Tablet' = 'Desktop';
  if (/ipad|tablet|(android(?!.*mobile))/i.test(lower)) {
    device = 'Tablet';
  } else if (/mobile|iphone|ipod|android|blackberry|iemobile|opera mini/i.test(lower)) {
    device = 'Mobile';
  }

  // Browser
  let browser: 'Chrome' | 'Safari' | 'Firefox' | 'Edge' | 'Other' = 'Other';
  if (lower.includes('edg/')) {
    browser = 'Edge';
  } else if (lower.includes('firefox/') || lower.includes('fxios/')) {
    browser = 'Firefox';
  } else if (lower.includes('chrome/') || lower.includes('crios/')) {
    browser = 'Chrome';
  } else if (lower.includes('safari/') && !lower.includes('chrome')) {
    browser = 'Safari';
  }

  return { device, browser };
}

export async function recordTrafficHit(params: {
  path: string;
  referrer?: string | null;
  userAgent?: string | null;
  ip?: string | null;
  country?: string | null;
}) {
  const p = params.path;
  if (
    !p ||
    p.startsWith('/_next') ||
    p.startsWith('/api') ||
    p.startsWith('/admin') ||
    p.startsWith('/keystatic') ||
    p.includes('.') // static assets
  ) {
    return;
  }

  const events = await loadEvents();
  const { device, browser } = parseUserAgent(params.userAgent);
  const ref = parseReferrer(params.referrer);

  // Anonymized hash from IP + UA
  const rawId = `${params.ip || 'unknown'}-${params.userAgent || 'generic'}`;
  const visitorHash = crypto.createHash('sha256').update(rawId).digest('hex').slice(0, 12);

  const newEvent: TrafficEvent = {
    id: `hit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    path: p,
    referrer: ref,
    device,
    browser,
    country: params.country || 'IN',
    visitorHash,
  };

  events.push(newEvent);
  memoryEvents = events;

  // Persist across cloud KV and local files
  if (KV_URL && KV_TOKEN) {
    saveEventsToKV(events).catch((e) => console.error('Background KV save error:', e));
  }
  saveEventsToFile(events);
}

export async function getAnalyticsSummary(timeRange: 'today' | '7d' | '30d' | 'all' = 'all'): Promise<AnalyticsSummary> {
  const events = await loadEvents();
  const now = Date.now();

  let filtered = events;
  if (timeRange === 'today') {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const startMs = startOfDay.getTime();
    filtered = events.filter((e) => new Date(e.timestamp).getTime() >= startMs);
  } else if (timeRange === '7d') {
    const startMs = now - 7 * 24 * 60 * 60 * 1000;
    filtered = events.filter((e) => new Date(e.timestamp).getTime() >= startMs);
  } else if (timeRange === '30d') {
    const startMs = now - 30 * 24 * 60 * 60 * 1000;
    filtered = events.filter((e) => new Date(e.timestamp).getTime() >= startMs);
  }

  const totalViews = filtered.length;
  const uniqueHashes = new Set(filtered.map((e) => e.visitorHash));
  const uniqueVisitors = uniqueHashes.size;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const todayMs = startOfDay.getTime();
  const todayViews = events.filter((e) => new Date(e.timestamp).getTime() >= todayMs).length;

  const aggregate = (key: keyof TrafficEvent) => {
    const counts: Record<string, number> = {};
    filtered.forEach((e) => {
      const val = String(e[key] || 'Unknown');
      counts[val] = (counts[val] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([k, count]) => ({
        name: k,
        count,
        percentage: totalViews > 0 ? Math.round((count / totalViews) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  };

  const pagesAgg = aggregate('path').map((item) => ({
    path: item.name,
    count: item.count,
    percentage: item.percentage,
  }));

  const refAgg = aggregate('referrer').map((item) => ({
    source: item.name,
    count: item.count,
    percentage: item.percentage,
  }));

  const devAgg = aggregate('device').map((item) => ({
    device: item.name,
    count: item.count,
    percentage: item.percentage,
  }));

  const browAgg = aggregate('browser').map((item) => ({
    browser: item.name,
    count: item.count,
    percentage: item.percentage,
  }));

  const ctryAgg = aggregate('country').map((item) => ({
    country: item.name,
    count: item.count,
    percentage: item.percentage,
  }));

  const recentHits = [...filtered].reverse().slice(0, 30);

  return {
    totalViews,
    uniqueVisitors,
    todayViews,
    topPages: pagesAgg,
    referrers: refAgg,
    devices: devAgg,
    browsers: browAgg,
    countries: ctryAgg,
    recentHits,
    storageProvider: KV_URL && KV_TOKEN ? 'kv' : 'file',
  };
}
