'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const PortalScreen = dynamic(() => import('./components/PortalScreen'), { ssr: false });

export default function PortalPage() {
  return <PortalScreen />;
}
