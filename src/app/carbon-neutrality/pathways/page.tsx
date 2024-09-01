"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CarbonNeutralityPathways = () => {
  const [pathwayData, setPathwayData] = useState(null);

  const simulatePathway = () => {
    // Simulate pathway data (replace with actual calculations)
    const data = [
      { year: 2023, emissions: 100, cleanTech: 90, afforestation: 80, renewables: 70 },
      { year: 2024, emissions: 95, cleanTech: 80, afforestation: 70, renewables: 60 },
      { year: 2025, emissions: 90, cleanTech: 70, afforestation: 60, renewables: 50 },
      { year: 2026, emissions: 85, cleanTech: 60, afforestation: 50, renewables: 40 },
      { year: 2027, emissions: 80, cleanTech: 50, afforestation: 40, renewables: 30 },
    ];
    setPathwayData(data);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Carbon Neutrality Pathways</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Pathway Simulation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input placeholder="Initial emissions (tons CO2)" type="number" />
              <Input placeholder="Clean tech adoption rate (%)" type="number" />
              <Input placeholder="Afforestation area (hectares)" type="number" />
              <Input placeholder="Renewable energy adoption (%)" type="number" />
              <Button onClick={simulatePathway}>Simulate Pathway</Button>
            </div>
          </CardContent>
        </Card>

        {pathwayData && (
          <Card>
            <CardHeader>
              <CardTitle>Pathway Projection</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={pathwayData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="emissions" stroke="#8884d8" />
                  <Line type="monotone" dataKey="cleanTech" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="afforestation" stroke="#ffc658" />
                  <Line type="monotone" dataKey="renewables" stroke="#ff7300" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CarbonNeutralityPathways;