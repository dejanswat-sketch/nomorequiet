import React from 'react';
import AppNav from './AppNav';

interface AppLayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
  navVariant?: 'transparent' | 'solid';
}

export default function AppLayout({
  children,
  showNav = true,
  navVariant = 'solid',
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-void flex flex-col">
      {showNav && <AppNav variant={navVariant} />}
      <main className="flex-1">{children}</main>
    </div>
  );
}