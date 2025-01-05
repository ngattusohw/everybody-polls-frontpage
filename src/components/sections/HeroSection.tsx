import React from 'react';
import { Button } from '@/components/ui/button';
import { AppleIcon, SmartphoneIcon } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-blue-600 to-blue-800 text-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-medium mb-4 text-blue-100">
              Do you know anyone who has ever been polled before?
            </h2>
            <p className="text-xl md:text-2xl font-semibold text-blue-50">
              Me neither. Let's fix that.
            </p>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Your Voice Matters
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Join thousands of Americans in shaping the political conversation
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50 flex items-center space-x-2"
            >
              <AppleIcon className="w-5 h-5" />
              <span>Download on iOS</span>
            </Button>
            <Button 
              size="lg" 
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 flex items-center space-x-2"
            >
              <SmartphoneIcon className="w-5 h-5" />
              <span>Get it on Android</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}