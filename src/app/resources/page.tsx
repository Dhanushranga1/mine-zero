'use client';

import React from 'react';
import { BookOpenText, FileText, Info, Database, Globe2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ResourcesPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Resources & Documentation</h1>
      <p className="text-gray-600 mb-10 max-w-3xl">
        Explore comprehensive documentation and reference material to help you make the most of MineZero. This page consolidates everything from user guidance and emission factor references to policy documentation and compliance standards.
      </p>

      <section className="mb-12">
        <Card>
          <CardHeader>
            <BookOpenText className="h-6 w-6 text-blue-600 inline-block mr-2" />
            <CardTitle>User Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Learn how to use the MineZero platform effectively. The user guide walks you through all major features:
            </p>
            <ul className="list-disc pl-5 mt-2 text-sm">
              <li>How to estimate emissions from diesel, electricity, and explosives</li>
              <li>Offset simulation using tree plantation or solar energy</li>
              <li>Understanding your carbon credit score and market value</li>
              <li>Generating audit-ready CSV reports</li>
              <li>Using the compliance checker and ESG estimator</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="mb-12">
        <Card>
          <CardHeader>
            <Database className="h-6 w-6 text-blue-600 inline-block mr-2" />
            <CardTitle>Emission Factor Database</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              All emissions are calculated using official and peer-reviewed emission factors. Sources include:
            </p>
            <ul className="list-disc pl-5 mt-2 text-sm">
              <li>Diesel: 2.6 kg CO₂/liter [CPCB/IPCC]</li>
              <li>Electricity: 0.716 kg CO₂/kWh [CEA 2022-23 grid average]</li>
              <li>Explosives: 170 kg CO₂/ton (ANFO) [Mining benchmark]</li>
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              These values are customizable if site-specific factors are available. Updates will reflect in real-time credit and offset projections.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-12">
        <Card>
          <CardHeader>
            <FileText className="h-6 w-6 text-blue-600 inline-block mr-2" />
            <CardTitle>Carbon Credit Policy & Pricing</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              MineZero aligns with India’s Perform, Achieve, Trade (PAT) Scheme and upcoming Carbon Credit Trading Scheme (CCTS). The platform supports:
            </p>
            <ul className="list-disc pl-5 mt-2 text-sm">
              <li>Real-time simulation of carbon credit earnings and shortfalls</li>
              <li>Custom pricing: ₹250 to ₹1200/tCO₂ (adjustable)</li>
              <li>Voluntary and compliance-based trading logic</li>
              <li>Eligibility logic based on emission intensity gap from baseline</li>
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              Users can simulate credit value and offset cost under different policy pricing scenarios and submit reports to environmental authorities.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-12">
        <Card>
          <CardHeader>
            <Globe2 className="h-6 w-6 text-blue-600 inline-block mr-2" />
            <CardTitle>Compliance & ESG Framework</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              The system offers interactive modules to assess compliance against national environmental standards, including:
            </p>
            <ul className="list-disc pl-5 mt-2 text-sm">
              <li>Air Quality: SPM, PM₁₀, SO₂, NO₂ limits by zone type (Industrial, Rural)</li>
              <li>Water Quality: pH, BOD, COD, TSS, Oil & Grease discharge thresholds</li>
              <li>ESG Estimator: Estimates ESG level (Low, Moderate, High) based on policy indicators</li>
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              Results are visualized using colored status badges, audit flags, and downloadable summaries for environmental reporting.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}