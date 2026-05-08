'use client';

import React from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,  } from 'recharts';

const weeklyData = [
  { day: 'Mon Apr 21', entries: 34, newUsers: 6, revenue: 38 },
  { day: 'Tue Apr 22', entries: 41, newUsers: 8, revenue: 45 },
  { day: 'Wed Apr 23', entries: 28, newUsers: 4, revenue: 20 },
  { day: 'Thu Apr 24', entries: 52, newUsers: 11, revenue: 68 },
  { day: 'Fri Apr 25', entries: 47, newUsers: 9, revenue: 54 },
  { day: 'Sat Apr 26', entries: 43, newUsers: 5, revenue: 42 },
  { day: 'Sun Apr 27', entries: 39, newUsers: 4, revenue: 45 },
];

const depthData = [
  { score: '1-2', count: 8 },
  { score: '3-4', count: 22 },
  { score: '5-6', count: 64 },
  { score: '7-8', count: 118 },
  { score: '9-10', count: 72 },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="nmq-card p-3"
        style={{ minWidth: '140px' }}
      >
        <p className="nmq-label mb-2" style={{ fontSize: '0.45rem', color: '#5a4e40' }}>
          {label}
        </p>
        {payload.map((p) => (
          <div key={`tt-${p.name}`} className="flex items-center justify-between gap-3">
            <span className="font-cormorant italic text-mist text-xs">{p.name}</span>
            <span className="font-cormorant tabular-nums text-xs" style={{ color: p.color }}>
              {p.name === 'Revenue' ? `€${p.value}` : p.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminWeeklyChart() {
  return (
    <div className="nmq-card p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="nmq-label mb-0.5" style={{ fontSize: '0.5rem', color: '#5a4e40' }}>
            THIS WEEK
          </p>
          <p className="font-cormorant font-light text-cream text-base">
            Entries · New Users · Revenue
          </p>
        </div>
        <p className="nmq-label" style={{ fontSize: '0.45rem', color: '#5a4e40' }}>
          APR 21–27, 2026
        </p>
      </div>

      {/* Area chart */}
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={weeklyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="adminEntriesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#c8822a" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#c8822a" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="adminUsersGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(200,130,42,0.08)" strokeDasharray="3 3" />
          <XAxis
            dataKey="day"
            tickFormatter={(v) => v.split(' ')[0]}
            tick={{ fill: '#5a4e40', fontSize: 9, fontFamily: 'Spectral, serif' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#5a4e40', fontSize: 9, fontFamily: 'Spectral, serif' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="entries"
            name="Entries"
            stroke="#c8822a"
            strokeWidth={1.5}
            fill="url(#adminEntriesGrad)"
          />
          <Area
            type="monotone"
            dataKey="newUsers"
            name="New Users"
            stroke="#D4AF37"
            strokeWidth={1.5}
            fill="url(#adminUsersGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Depth distribution bar chart */}
      <div className="mt-6 pt-5 border-t border-amber/8">
        <p className="nmq-label mb-4" style={{ fontSize: '0.5rem', color: '#5a4e40' }}>
          DEPTH SCORE DISTRIBUTION THIS WEEK
        </p>
        <ResponsiveContainer width="100%" height={100}>
          <BarChart data={depthData} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="rgba(200,130,42,0.06)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="score"
              tick={{ fill: '#5a4e40', fontSize: 9, fontFamily: 'Spectral, serif' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#5a4e40', fontSize: 9, fontFamily: 'Spectral, serif' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="count"
              name="Entries"
              fill="#c8822a"
              fillOpacity={0.7}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        <p className="nmq-label mt-1.5" style={{ fontSize: '0.4rem', color: '#3a3028' }}>
          Scores 7-10 dominant — community writing at depth
        </p>
      </div>
    </div>
  );
}