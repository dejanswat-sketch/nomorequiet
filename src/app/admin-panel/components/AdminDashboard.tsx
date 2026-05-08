'use client';

import React, { useState, useEffect } from 'react';
import AdminKPICards from './AdminKPICards';
import AdminWeeklyChart from './AdminWeeklyChart';
import AdminRecentActivity from './AdminRecentActivity';
import type { RitualMode } from './AdminLayout';

interface AdminDashboardProps {
  ritualMode: RitualMode;
}

function getCurrentWeekLabel(): string {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
  return `OVERVIEW · WEEK OF ${fmt(weekStart)}–${fmt(weekEnd)}, ${now.getFullYear()}`;
}

export default function AdminDashboard({ ritualMode }: AdminDashboardProps) {
  const [weekLabel, setWeekLabel] = useState('');

  useEffect(() => {
    setWeekLabel(getCurrentWeekLabel());
  }, []);

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-8 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="nmq-label mb-1" style={{ fontSize: '0.55rem', color: '#c8822a' }}>
          {weekLabel || 'OVERVIEW · LOADING...'}
        </p>
        <h1 className="nmq-heading text-3xl italic text-gold">
          The House is open.
        </h1>
        <p className="font-cormorant italic text-mist text-base mt-1">
          {ritualMode !== 'default'
            ? `Ritual mode active: ${ritualMode.toUpperCase()}`
            : 'Default atmosphere · All nodes active.'}
        </p>
      </div>

      <AdminKPICards />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
        <div className="xl:col-span-2">
          <AdminWeeklyChart />
        </div>
        <div>
          <AdminRecentActivity />
        </div>
      </div>
    </div>
  );
}