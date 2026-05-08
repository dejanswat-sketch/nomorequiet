'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import AppLayout from '@/components/AppLayout';

const PersonalArcScreen = dynamic(() => import('./components/PersonalArcScreen'), { ssr: false });

export default function PersonalArcPage() {
  return (
    <AppLayout showNav={true} navVariant="solid">
      <PersonalArcScreen />
    </AppLayout>
  );
}
