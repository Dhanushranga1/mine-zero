"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DataVisualization = () => {
  const [data, setData] = useState(null);

  const generateData = () => {
    // Placeholder data generation - replace with actual data fetching logic
    const generatedData = [
      { year: 2020, emissions: 100, neutralityProgress: 0 },
      { year: 2021, emissions: 95, neutralityProgress: 10 },
      { year: 2022, emissions: 85, neutralityProgress: 25 },
      { year: 2023, emissions: 70, neutralityProgress: 45 },
      { year: 2024, emissions: 50, neutralityProgress: 70 },
    ];
    setData(generatedData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Data Visualization</h1>

      <Card>
        <CardHeader>
          <CardTitle>Emissions and Neutrality Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={generateData} className="mb-4">Generate Data</Button>
          {data && (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="emissions" stroke="#8884d8" name="Emissions" />
                <Line yAxisId="right" type="monotone" dataKey="neutralityProgress" stroke="#82ca9d" name="Neutrality Progress" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataVisualization;