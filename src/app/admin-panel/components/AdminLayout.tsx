'use client';

import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import AdminDashboard from './AdminDashboard';
import AdminDeepReadQueue from './AdminDeepReadQueue';
import AdminCrisisInbox from './AdminCrisisInbox';
import AdminRitualSwitch from './AdminRitualSwitch';
import AdminStoryHub from './AdminStoryHub';

export type AdminView = 'dashboard' | 'deepread' | 'crisis' | 'ritual' | 'users' | 'storyhub';
export type RitualMode = 'default' | 'dawn' | 'solstice' | 'ember' | 'midnight';

export default function AdminLayout() {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [ritualMode, setRitualMode] = useState<RitualMode>('default');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard': return <AdminDashboard ritualMode={ritualMode} />;
      case 'deepread': return <AdminDeepReadQueue />;
      case 'crisis': return <AdminCrisisInbox />;
      case 'ritual': return <AdminRitualSwitch currentMode={ritualMode} onModeChange={setRitualMode} />;
      case 'storyhub': return <AdminStoryHub />;
      default: return <AdminDashboard ritualMode={ritualMode} />;
    }
  };

  return (
    <div className={`min-h-screen bg-void flex flex-col ${ritualMode !== 'default' ? `ritual-${ritualMode}` : ''}`}>
      <AdminTopbar />
      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 56px)' }}>
        <AdminSidebar
          activeView={activeView}
          onNavigate={setActiveView}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 overflow-y-auto bg-void">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}