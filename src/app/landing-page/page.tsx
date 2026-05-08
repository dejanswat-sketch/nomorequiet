import React from 'react';
import AppLayout from '@/components/AppLayout';
import LandingHero from './components/LandingHero';
import LandingManifest from './components/LandingManifest';
import LandingLightCounter from './components/LandingLightCounter';
import LandingProductPyramid from './components/LandingProductPyramid';
import LandingMapPreview from './components/LandingMapPreview';
import LandingFoundingFragments from './components/LandingFoundingFragments';
import LandingFooter from './components/LandingFooter';
import LandingStarTiers from './components/LandingStarTiers';
import FeaturedStoryWidget from '@/components/FeaturedStoryWidget';

export default function LandingPage() {
  return (
    <AppLayout showNav={true} navVariant="transparent">
      <LandingHero />
      <LandingManifest />
      {/* Featured Story Widget — centered between Manifest and Light Counter */}
      <div className="flex justify-center px-6 py-8">
        <FeaturedStoryWidget />
      </div>
      <LandingLightCounter />
      <LandingStarTiers />
      <LandingFoundingFragments />
      <LandingProductPyramid />
      <LandingMapPreview />
      <LandingFooter />
    </AppLayout>
  );
}