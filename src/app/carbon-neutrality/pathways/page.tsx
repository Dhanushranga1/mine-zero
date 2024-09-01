"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CarbonNeutralityPathways = () => {
  const [pathwayData, setPathwayData] = useState(null);
  const [carbonCredits, setCarbonCredits] = useState(0);

  const simulatePathway = (strategy) => {
    // Simulate pathway data (replace with actual calculations)
    const data = [
      { year: 2023, emissions: 100, [strategy]: 90 },
      { year: 2024, emissions: 95, [strategy]: 80 },
      { year: 2025, emissions: 90, [strategy]: 70 },
      { year: 2026, emissions: 85, [strategy]: 60 },
      { year: 2027, emissions: 80, [strategy]: 50 },
    ];
    setPathwayData(data);
  };

  const calculateCarbonCredits = (emissions) => {
    // Simple calculation (replace with actual logic)
    const credits = emissions * 0.5; // Assume 50% of emissions can be converted to credits
    setCarbonCredits(credits);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Carbon Neutrality Pathways</h1>

      <Tabs defaultValue="cleanTech">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cleanTech">Clean Technologies</TabsTrigger>
          <TabsTrigger value="afforestation">Afforestation</TabsTrigger>
          <TabsTrigger value="renewables">Renewable Energy</TabsTrigger>
          <TabsTrigger value="carbonCredits">Carbon Credits</TabsTrigger>
        </TabsList>

        <TabsContent value="cleanTech">
          <Card>
            <CardHeader>
              <CardTitle>Clean Technology Adoption</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="initialEmissions">Initial Emissions (tons CO2)</Label>
                  <Input id="initialEmissions" type="number" placeholder="Enter initial emissions" />
                </div>
                <div>
                  <Label htmlFor="cleanTechAdoption">Clean Tech Adoption Rate (%)</Label>
                  <Input id="cleanTechAdoption" type="number" placeholder="Enter adoption rate" />
                </div>
                <Button onClick={() => simulatePathway('cleanTech')}>Simulate Clean Tech Pathway</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="afforestation">
          <Card>
            <CardHeader>
              <CardTitle>Afforestation Offsets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="emissionsToOffset">Emissions to Offset (tons CO2)</Label>
                  <Input id="emissionsToOffset" type="number" placeholder="Enter emissions to offset" />
                </div>
                <div>
                  <Label htmlFor="landArea">Available Land Area (hectares)</Label>
                  <Input id="landArea" type="number" placeholder="Enter available land area" />
                </div>
                <Button onClick={() => simulatePathway('afforestation')}>Calculate Afforestation Impact</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="renewables">
          <Card>
            <CardHeader>
              <CardTitle>Renewable Energy Adoption</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="currentEnergy">Current Energy Consumption (MWh)</Label>
                  <Input id="currentEnergy" type="number" placeholder="Enter current energy consumption" />
                </div>
                <div>
                  <Label htmlFor="renewablePercentage">Renewable Energy Percentage (%)</Label>
                  <Input id="renewablePercentage" type="number" placeholder="Enter renewable percentage" />
                </div>
                <Button onClick={() => simulatePathway('renewables')}>Simulate Renewable Energy Impact</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="carbonCredits">
          <Card>
            <CardHeader>
              <CardTitle>Carbon Credits Estimation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="totalEmissions">Total Emissions (tons CO2)</Label>
                  <Input id="totalEmissions" type="number" placeholder="Enter total emissions" />
                </div>
                <Button onClick={() => calculateCarbonCredits(100)}>Estimate Carbon Credits</Button>
                {carbonCredits > 0 && (
                  <p className="text-lg font-semibold">Estimated Carbon Credits: {carbonCredits.toFixed(2)}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {pathwayData && (
        <Card className="mt-8">
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
                <Line type="monotone" dataKey="emissions" stroke="#8884d8" name="Emissions" />
                <Line type="monotone" dataKey={Object.keys(pathwayData[0])[2]} stroke="#82ca9d" name="Reduction Strategy" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CarbonNeutralityPathways;