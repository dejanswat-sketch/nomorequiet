'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';
import type { AdminView } from './AdminLayout';

interface AdminSidebarProps {
  activeView: AdminView;
  onNavigate: (view: AdminView) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const NAV_ITEMS: {
  id: AdminView;
  label: string;
  icon: string;
  badge?: number;
  badgeColor?: string;
}[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'Squares2X2Icon' },
  { id: 'storyhub', label: 'Story Hub', icon: 'BookOpenIcon', badgeColor: '#D4AF37' },
  { id: 'deepread', label: 'Deep Read Queue', icon: 'DocumentTextIcon', badge: 3, badgeColor: '#c8822a' },
  { id: 'crisis', label: 'Crisis Inbox', icon: 'ExclamationTriangleIcon', badge: 2, badgeColor: '#ff6b2b' },
  { id: 'ritual', label: 'Ritual Switch', icon: 'SparklesIcon' },
  { id: 'users', label: 'Users', icon: 'UsersIcon' },
];

export default function AdminSidebar({
  activeView,
  onNavigate,
  collapsed,
  onToggleCollapse,
}: AdminSidebarProps) {
  return (
    <div
      className={`flex flex-col border-r border-amber/10 bg-deep-earth/40 transition-all duration-300 ${
        collapsed ? 'w-14' : 'w-56'
      }`}
    >
      {/* Toggle */}
      <button
        className="flex items-center justify-end px-3 py-3 text-silence hover:text-mist transition-colors border-b border-amber/8"
        onClick={onToggleCollapse}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <Icon name={collapsed ? 'ChevronRightIcon' : 'ChevronLeftIcon'} size={14} />
      </button>

      {/* Nav items */}
      <nav className="flex-1 py-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={`admin-nav-${item.id}`}
            className={`w-full flex items-center gap-3 px-3 py-3 transition-all duration-200 relative group ${
              activeView === item.id
                ? 'bg-amber/10 text-amber border-l-2 border-amber' :'text-mist hover:bg-amber/5 hover:text-cream'
            }`}
            onClick={() => onNavigate(item.id)}
          >
            <Icon name={item.icon as Parameters<typeof Icon>[0]['name']} size={16} />
            {!collapsed && (
              <>
                <span className="font-cormorant font-light text-sm flex-1 text-left">
                  {item.label}
                </span>
                {item.badge && (
                  <span
                    className="flex items-center justify-center rounded-full text-void font-spectral tabular-nums"
                    style={{
                      background: item.badgeColor,
                      fontSize: '0.5rem',
                      minWidth: '16px',
                      height: '16px',
                      padding: '0 4px',
                      fontWeight: 300,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </>
            )}

            {/* Collapsed tooltip */}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-deep-earth border border-amber/20 nmq-label text-cream whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
                style={{ fontSize: '0.5rem' }}>
                {item.label}
                {item.badge && (
                  <span className="ml-1.5" style={{ color: item.badgeColor }}>({item.badge})</span>
                )}
              </div>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-3 py-4 border-t border-amber/8">
          <p className="nmq-label" style={{ fontSize: '0.45rem', color: '#5a4e40' }}>
            RTANJ · 43°46′N
          </p>
          <p className="nmq-label mt-0.5" style={{ fontSize: '0.4rem', color: '#3a3028' }}>
            v3.0 · MASTER CONSTITUTION
          </p>
        </div>
      )}
    </div>
  );
}