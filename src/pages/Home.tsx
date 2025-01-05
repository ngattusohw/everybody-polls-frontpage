import React from 'react';
import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';

export default function Home() {
  return (
    <main className="flex-grow">
      <HeroSection />
      <FeaturesSection />
    </main>
  );
}