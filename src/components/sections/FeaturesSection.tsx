import React from 'react';
import { Vote, BarChart3, Target, UserCircle2 } from 'lucide-react';
import { FeatureCard } from '@/components/features/FeatureCard';

export function FeaturesSection() {
  const features = [
    {
      icon: Vote,
      title: "Make Your Voice Heard",
      description: "Vote on important topics and see how your views align with others"
    },
    {
      icon: BarChart3,
      title: "Explore Detailed Insights",
      description: "Filter results by age, location, occupation & more"
    },
    {
      icon: Target,
      title: "Test Your Prediction Skills",
      description: "Predict majority opinions and track your accuracy"
    },
    {
      icon: UserCircle2,
      title: "Privacy First",
      description: "Your data is only used for anonymous, aggregated insights"
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Join Everybody Polls?</h2>
          <p className="text-xl text-gray-600">
            Quick sign-up process, meaningful insights, and a voice in the conversation
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}