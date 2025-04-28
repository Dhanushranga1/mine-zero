'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BarChart2, CreditCard, TrendingUp, BookOpen, Award, Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  href: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

interface MetricCardProps {
  value: string;
  label: string;
  iconColor: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ href, title, description, icon: Icon }) => (
  <Link href={href} className="group block bg-white rounded-lg p-6 shadow-sm transition-all duration-300 hover:shadow-md border border-gray-200 hover:border-gray-300 hover:scale-105">
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

const MetricCard: React.FC<MetricCardProps> = ({ value, label, iconColor }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
  >
    <div className={`w-12 h-12 rounded-full ${iconColor} flex items-center justify-center mb-4`}>
      <div className="w-6 h-6 text-white">
        {iconColor.includes('blue') && <BarChart2 className="w-full h-full" />}
        {iconColor.includes('green') && <Zap className="w-full h-full" />}
        {iconColor.includes('purple') && <Award className="w-full h-full" />}
        {iconColor.includes('orange') && <Shield className="w-full h-full" />}
      </div>
    </div>
    <h2 className="text-3xl font-bold mb-1">{value}</h2>
    <p className="text-sm text-gray-600">{label}</p>
  </motion.div>
);

const HighlightFeature = ({ icon: Icon, title, description }) => (
  <div className="flex items-start mb-6">
    <div className="bg-blue-100 p-2 rounded-lg mr-4">
      <Icon className="w-5 h-5 text-blue-600" />
    </div>
    <div>
      <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </div>
);

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 flex flex-col items-center">
      <div className="w-full max-w-6xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 mb-6">
            MineZero
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Revolutionizing carbon footprint management for coal mines. Track, trade, and transform your sustainability journey.
          </p>
        </motion.div>

        {/* Impact Metrics Section
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Making a Real Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard value="185+" label="Mines Simulated" iconColor="bg-blue-600" />
            <MetricCard value="430K+" label="Total Emissions Analyzed (kg CO₂)" iconColor="bg-green-600" />
            <MetricCard value="82K+" label="Carbon Credits Simulated (tons)" iconColor="bg-purple-600" />
            <MetricCard value="100%" label="CPCB-aligned Compliance" iconColor="bg-orange-500" />
          </div>
        </motion.div> */}

        {/* Platform Highlights */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Why MineZero?</h2>
          <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <HighlightFeature 
                  icon={BarChart2} 
                  title="Precision Analytics" 
                  description="Activity-based emission modeling using India-specific factors for unmatched accuracy."
                />
                <HighlightFeature 
                  icon={Shield} 
                  title="Policy-Aware" 
                  description="Fully aligned with PAT Scheme & CCTS carbon market logic for regulatory compliance."
                />
              </div>
              <div>
                <HighlightFeature 
                  icon={Zap} 
                  title="Future-Ready Platform" 
                  description="IoT-compatible architecture with mock trading and comprehensive ESG integration."
                />
                <HighlightFeature 
                  icon={Award} 
                  title="Industry Leadership" 
                  description="Setting the standard for sustainable mining practices with cutting-edge technology."
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Explore Our Platform</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <FeatureCard
              href="/emissions"
              title="Estimate Emissions"
              description="Calculate and track your carbon footprint with precision."
              icon={BarChart2}
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
            <FeatureCard
              href="/`reso`urces"
              title="Resources & Documentation"
              description="Access guides, FAQs, and additional resources."
              icon={BookOpen}
            />
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <Link href="/emissions" className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-lg transition-colors duration-300 shadow-md hover:shadow-lg">
            🚀 Get Started with Emissions Tracking
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </main>
  );
}