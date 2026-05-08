'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const UserSettingsScreen = dynamic(() => import('./components/UserSettingsScreen'), { ssr: false });

export default function UserSettingsPage() {
  return <UserSettingsScreen />;
}
