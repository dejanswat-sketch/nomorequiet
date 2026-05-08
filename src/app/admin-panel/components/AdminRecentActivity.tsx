'use client';

import React, { useEffect, useState, useCallback } from 'react';

interface ActivityItem {
  id: string;
  type: string;
  userId: string;
  time: string;
  detail: string;
  color: string;
}

const TYPE_ICONS: Record<string, string> = {
  entry: '✦',
  purchase: '▲',
  portal: '◈',
  crisis: '⚠',
  deepread: '◎',
};

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}

export default function AdminRecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivity = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/analytics');
      if (!res.ok) return;
      const json = await res.json();
      setActivities(json.recentActivity ?? []);
    } catch {
      // silent fail — keep showing last data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivity();
    const interval = setInterval(fetchActivity, 30000);
    return () => clearInterval(interval);
  }, [fetchActivity]);

  return (
    <div className="nmq-card p-5 h-full">
      <div className="flex items-center justify-between mb-5">
        <p className="font-cormorant font-light text-cream text-base">Recent Activity</p>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-amber pulse-slow" />
          <p className="nmq-label" style={{ fontSize: '0.45rem', color: '#5a4e40' }}>LIVE</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={`skel-act-${i}`} className="animate-pulse flex gap-3 py-2">
              <div className="w-3 h-3 bg-deep-earth rounded-full flex-shrink-0 mt-1" />
              <div className="flex-1 space-y-1.5">
                <div className="h-2 bg-deep-earth rounded w-1/3" />
                <div className="h-2 bg-deep-earth rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <p className="font-cormorant italic text-mist text-sm">No activity yet.</p>
      ) : (
        <div className="flex flex-col divide-y divide-amber/6">
          {activities.map((act) => (
            <div key={act.id} className="py-3 flex items-start gap-3">
              <span
                className="flex-shrink-0 mt-0.5"
                style={{ color: act.color, fontSize: '0.7rem' }}
              >
                {TYPE_ICONS[act.type] ?? '·'}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-cormorant font-light text-cream text-sm truncate">
                    {act.userId ? `User ${act.userId.slice(0, 6).toUpperCase()}` : 'Anonymous'}
                  </p>
                  <p className="nmq-label flex-shrink-0" style={{ fontSize: '0.4rem', color: '#5a4e40' }}>
                    {timeAgo(act.time)}
                  </p>
                </div>
                <p className="font-cormorant italic text-mist text-xs mt-0.5 leading-snug">
                  {act.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}