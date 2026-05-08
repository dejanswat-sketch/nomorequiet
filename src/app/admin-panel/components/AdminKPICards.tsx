'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Icon from '@/components/ui/AppIcon';

interface KPIData {
  entriesThisWeek: number;
  entriesLastWeek: number;
  newUsersThisWeek: number;
  newUsersLastWeek: number;
  lightsTotal: number;
  lightsThisWeek: number;
  deepReadQueueCount: number;
  oldestDeepReadHoursAgo: number;
  crisisThisWeek: number;
  portalCompletionsThisWeek: number;
  totalRevenueCents: number;
  revenueByProduct: Record<string, number>;
  activeCompanions: number;
  avgDepthScore: number;
  avgDepthScorePrev: number;
}

function formatEur(cents: number): string {
  return `€ ${(cents / 100).toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function trendLabel(current: number, prev: number): string {
  if (prev === 0) return current > 0 ? `+${current} vs last week` : '—';
  const diff = current - prev;
  return diff >= 0 ? `+${diff} vs last week` : `${diff} vs last week`;
}

export default function AdminKPICards() {
  const [data, setData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/analytics');
      if (!res.ok) throw new Error('Failed to load analytics');
      const json = await res.json();
      setData(json.kpis);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error loading data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Real-time refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const revenueSubValue = data
    ? (() => {
        const parts: string[] = [];
        if (data.revenueByProduct['companion']) parts.push(`${Math.round(data.revenueByProduct['companion'] / 499)} Companion`);
        if (data.revenueByProduct['deep_insight']) parts.push(`${Math.round(data.revenueByProduct['deep_insight'] / 1000)} Insight`);
        if (data.revenueByProduct['deep_read']) parts.push(`${Math.round(data.revenueByProduct['deep_read'] / 4900)} Deep Read`);
        if (data.revenueByProduct['light']) parts.push(`${Math.round(data.revenueByProduct['light'] / 100)} Light`);
        return parts.join(' · ') || 'No purchases this week';
      })()
    : '—';

  const kpis = data
    ? [
        {
          id: 'kpi-entries',
          label: 'ENTRIES THIS WEEK',
          value: data.entriesThisWeek.toLocaleString(),
          subValue: trendLabel(data.entriesThisWeek, data.entriesLastWeek),
          trend: data.entriesThisWeek >= data.entriesLastWeek ? 'up' : 'down',
          icon: 'PencilSquareIcon',
          color: '#c8822a',
          bgTint: 'rgba(200,130,42,0.06)',
        },
        {
          id: 'kpi-users',
          label: 'NEW USERS',
          value: data.newUsersThisWeek.toLocaleString(),
          subValue: trendLabel(data.newUsersThisWeek, data.newUsersLastWeek),
          trend: data.newUsersThisWeek >= data.newUsersLastWeek ? 'up' : 'down',
          icon: 'UserPlusIcon',
          color: '#D4AF37',
          bgTint: 'rgba(212,175,55,0.06)',
        },
        {
          id: 'kpi-revenue',
          label: 'REVENUE (EUR)',
          value: formatEur(data.totalRevenueCents),
          subValue: revenueSubValue,
          trend: 'up',
          icon: 'CurrencyEuroIcon',
          color: '#c8822a',
          bgTint: 'rgba(200,130,42,0.06)',
        },
        {
          id: 'kpi-lights',
          label: 'LIGHTS LIT',
          value: data.lightsTotal.toLocaleString(),
          subValue: `${data.lightsThisWeek} new this week`,
          trend: 'up',
          icon: 'SparklesIcon',
          color: '#D4AF37',
          bgTint: 'rgba(212,175,55,0.06)',
        },
        {
          id: 'kpi-deepread',
          label: 'DEEP READ QUEUE',
          value: data.deepReadQueueCount.toString(),
          subValue: data.deepReadQueueCount > 0
            ? `Oldest: ${data.oldestDeepReadHoursAgo} hrs ago · Limit: 5/wk`
            : 'Queue empty · Limit: 5/wk',
          trend: 'neutral',
          icon: 'DocumentTextIcon',
          color: '#c8822a',
          bgTint: 'rgba(200,130,42,0.06)',
        },
        {
          id: 'kpi-crisis',
          label: 'CRISIS FLAGS',
          value: data.crisisThisWeek.toString(),
          subValue: data.crisisThisWeek > 0 ? 'This week · Review required' : 'This week · All clear',
          trend: data.crisisThisWeek > 0 ? 'alert' : 'up',
          icon: 'ExclamationTriangleIcon',
          color: data.crisisThisWeek > 0 ? '#ff6b2b' : '#c8822a',
          bgTint: data.crisisThisWeek > 0 ? 'rgba(255,107,43,0.08)' : 'rgba(200,130,42,0.06)',
          borderColor: data.crisisThisWeek > 0 ? 'rgba(255,107,43,0.25)' : undefined,
        },
        {
          id: 'kpi-portal',
          label: 'PORTAL COMPLETIONS',
          value: data.portalCompletionsThisWeek.toString(),
          subValue: `Builder lights granted: ${data.portalCompletionsThisWeek}`,
          trend: 'up',
          icon: 'TrophyIcon',
          color: '#D4AF37',
          bgTint: 'rgba(212,175,55,0.06)',
        },
        {
          id: 'kpi-companions',
          label: 'ACTIVE COMPANIONS',
          value: data.activeCompanions.toString(),
          subValue: `Monthly subscribers · 4.99 €/mo`,
          trend: 'up',
          icon: 'UsersIcon',
          color: '#c8822a',
          bgTint: 'rgba(200,130,42,0.06)',
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`skel-${i}`}
            className="nmq-card p-5 animate-pulse"
            style={{ background: 'rgba(200,130,42,0.04)', borderColor: 'rgba(200,130,42,0.08)' }}
          >
            <div className="h-2 bg-deep-earth rounded mb-3 w-3/4" />
            <div className="h-8 bg-deep-earth rounded mb-2 w-1/2" />
            <div className="h-2 bg-deep-earth rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="nmq-card p-5 col-span-4" style={{ borderColor: 'rgba(255,107,43,0.2)' }}>
        <p className="font-cormorant italic text-mist text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.id}
          className="nmq-card p-5 transition-all duration-200 hover:border-amber/25"
          style={{
            background: kpi.bgTint,
            borderColor: kpi.borderColor || 'rgba(200,130,42,0.12)',
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <p className="nmq-label" style={{ fontSize: '0.5rem', color: '#5a4e40' }}>
              {kpi.label}
            </p>
            <Icon
              name={kpi.icon as Parameters<typeof Icon>[0]['name']}
              size={14}
              className="flex-shrink-0"
              style={{ color: kpi.color, opacity: 0.7 }}
            />
          </div>
          <p
            className="font-cormorant tabular-nums font-light"
            style={{ fontSize: '1.8rem', color: kpi.color, lineHeight: 1.1 }}
          >
            {kpi.value}
          </p>
          <div className="flex items-center gap-1.5 mt-1.5">
            {kpi.trend === 'up' && (
              <Icon name="ArrowUpIcon" size={10} style={{ color: '#c8822a' }} />
            )}
            {kpi.trend === 'alert' && (
              <Icon name="ExclamationCircleIcon" size={10} style={{ color: '#ff6b2b' }} />
            )}
            <p
              className="font-cormorant italic"
              style={{ fontSize: '0.7rem', color: kpi.trend === 'alert' ? '#ff6b2b' : '#a89880' }}
            >
              {kpi.subValue}
            </p>
          </div>
        </div>
      ))}
      {/* Live indicator */}
      <div className="col-span-2 md:col-span-4 flex items-center justify-end gap-1.5 -mt-1">
        <div className="w-1.5 h-1.5 rounded-full bg-amber pulse-slow" />
        <p className="nmq-label" style={{ fontSize: '0.4rem', color: '#5a4e40' }}>LIVE · REFRESHES EVERY 30s</p>
      </div>
    </div>
  );
}