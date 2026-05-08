'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import AppLayout from '@/components/AppLayout';

const AuthScreen = dynamic(() => import('./components/AuthScreen'), { ssr: false });

export default function SignUpLoginPage() {
  return (
    <AppLayout showNav={false}>
      <AuthScreen />
    </AppLayout>
  );
}