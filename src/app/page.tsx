'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BarChart2, Leaf, CreditCard, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  href: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ href, title, description, icon: Icon }) => (
  <Link href={href} className="group block bg-white rounded-lg p-4 shadow-sm transition-all duration-300 hover:shadow-md border border-gray-200 hover:border-gray-300 hover:scale-102">
    <div className="transition-transform duration-300 group-hover:translate-y-[-2px]">
      <Icon className="w-8 h-8 mb-3 text-blue-600" />
      <h3 className="text-lg font-bold mb-1 text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-1 transition-transform duration-300">
        Learn More <ArrowRight className="ml-1 w-3 h-3" />
      </div>
    </div>
  </Link>
);

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 flex flex-col items-center justify-center p-6 pt-16">
      <div className="w-full max-w-5xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 mb-6 text-center"
        >
          MineZero
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg text-gray-600 text-center mb-10 max-w-xl mx-auto"
        >
          Revolutionizing carbon footprint management for coal mines. Choose a feature to start your journey towards sustainability.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <FeatureCard
            href="/emissions"
            title="Estimate Emissions"
            description="Calculate and track your carbon footprint with precision."
            icon={BarChart2}
          />
          <FeatureCard
            href="/carbon-neutrality"
            title="Neutrality Pathways"
            description="Discover strategies to achieve carbon neutrality."
            icon={Leaf}
          />
          <FeatureCard
            href="/carbon-credits"
            title="Carbon Credits"
            description="Navigate the world of carbon credit trading."
            icon={CreditCard}
          />
          <FeatureCard
            href="/carbon-neutrality/pathways"
            title="Neutrality Pathways"
            description="Explore strategies to achieve carbon neutrality."
            icon={TrendingUp}
          />
        </motion.div>
      </div>
    </main>
  );
}