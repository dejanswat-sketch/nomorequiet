import React from 'react';
import AppLayout from '@/components/AppLayout';
import MapOfLightsClient from './components/MapOfLightsClient';

export default function MapOfLightsPage() {
  return (
    <AppLayout showNav={true} navVariant="solid">
      <MapOfLightsClient />
    </AppLayout>
  );
}