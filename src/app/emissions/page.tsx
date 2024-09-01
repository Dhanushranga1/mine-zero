"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRouter } from 'next/navigation';
import { CSVLink } from 'react-csv';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

// Emission factors and offsets
const emissionFactors = {
  'surface-mining': {
    blasting: 0.5,
    excavation: 1.0,
    transportation: 0.3,
  },
  'underground-mining': {
    roomAndPillar: 0.7,
    longwall: 0.9,
    subLevelCaving: 0.6,
  },
} as const;

const carbonOffsets = {
  treePlanting: 0.1, // kg CO2 absorbed per tree per year
  solarPanels: 0.12, // kg CO2 offset per kWh of solar energy
};

const costPerKgCO2 = 10; // Local cost of carbon offset in rupees per kg CO2

const formSchema = z.object({
  date: z.date(),
  activity: z.enum(["surface-mining", "underground-mining"]),
  blasting: z.number().min(0).optional(),
  excavation: z.number().min(0).optional(),
  transportation: z.number().min(0).optional(),
  roomAndPillar: z.number().min(0).optional(),
  longwall: z.number().min(0).optional(),
  subLevelCaving: z.number().min(0).optional(),
});

type FormValues = z.infer<typeof formSchema>;

type ResultType = {
  totalEmissions: number;
  emissions: Record<string, number>;
  data: { name: string; value: number }[];
  treesRequired: number;
  solarPanelsRequired: number;
  emissionsAfterTreeOffset: number;
  emissionsAfterSolarOffset: number;
  costOfEmissions: number;
};

const EmissionCalculator = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      activity: "surface-mining",
    },
  });
  const [result, setResult] = useState<ResultType | null>(null);
  const [carbonTrends, setCarbonTrends] = useState<{ name: string; value: number }[] | null>(null);
  const router = useRouter();

  const onSubmit = (data: FormValues) => {
    try {
      const emissionData = emissionFactors[data.activity];
      if (!emissionData) throw new Error("Invalid activity selected");

      const totalEmissions = Object.keys(emissionData).reduce((total, key) => {
        const value = data[key as keyof typeof emissionData] || 0;
        return total + (value * emissionData[key as keyof typeof emissionData]);
      }, 0);

      const treesRequired = Math.ceil(totalEmissions / carbonOffsets.treePlanting);
      const solarPanelsRequired = Math.ceil(totalEmissions / carbonOffsets.solarPanels);

      const emissionsAfterTreeOffset = totalEmissions - (treesRequired * carbonOffsets.treePlanting);
      const emissionsAfterSolarOffset = totalEmissions - (solarPanelsRequired * carbonOffsets.solarPanels);

      const costOfEmissions = totalEmissions * costPerKgCO2;

      setResult({
        totalEmissions,
        emissions: emissionData,
        data: Object.keys(emissionData).map(process => ({
          name: process.replace(/([A-Z])/g, ' $1').toUpperCase(),
          value: (data[process as keyof typeof emissionData] || 0) * emissionData[process as keyof typeof emissionData]
        })),
        treesRequired,
        solarPanelsRequired,
        emissionsAfterTreeOffset,
        emissionsAfterSolarOffset,
        costOfEmissions
      });

      setCarbonTrends([
        { name: 'Total Emissions', value: totalEmissions },
        { name: 'Emissions After Tree Offset', value: emissionsAfterTreeOffset },
        { name: 'Emissions After Solar Offset', value: emissionsAfterSolarOffset }
      ]);
    } catch (error) {
      console.error("Error calculating emissions:", error);
    }
  };

  const renderProcesses = () => {
    const activity = form.watch("activity");
    if (!activity) return null;

    const processes = Object.keys(emissionFactors[activity]);

    return processes.map(process => (
      <FormField
        key={process}
        control={form.control}
        name={process as keyof FormValues}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{process.replace(/([A-Z])/g, ' $1').toUpperCase()} (unit)</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="any"
                placeholder="Enter amount in appropriate unit"
                {...field}
                value={field.value as number | undefined}
                onChange={(e) => {
                  const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
                  field.onChange(value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ));
  };

  return (
    <div className="container mx-auto p-8 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 mt-24">Coal Mining Emissions Calculator</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Input Data</CardTitle>
            <CardDescription>Enter mining activity details</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          className="rounded-md border"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="activity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Mining Activity</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select mining activity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="surface-mining">Surface Mining</SelectItem>
                          <SelectItem value="underground-mining">Underground Mining</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {renderProcesses()}

                <Button type="submit">Calculate Emissions</Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>Emission calculations and trends</CardDescription>
          </CardHeader>
          <CardContent>
            {result && (
              <div className="space-y-6">
                <p className="text-lg font-semibold">
                  Total Emissions: {result.totalEmissions.toFixed(2)} kg CO2
                </p>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Emission Breakdown</h3>
                  <PieChart width={400} height={300}>
                    <Pie data={result.data} dataKey="value" nameKey="name" outerRadius={100} fill="#82ca9d">
                      {result.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#8884d8' : '#82ca9d'} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </div>

                {carbonTrends && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Carbon Footprint Trends</h3>
                    <BarChart width={400} height={300} data={carbonTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </div>
                )}

                <div className="space-y-4 bg-gray-50 p-4 rounded-md">
                  <h3 className="text-lg font-semibold">Offset Options</h3>
                  <div className="space-y-2">
                    <Label htmlFor="treePlanting">Trees Required for Offset</Label>
                    <Input id="treePlanting" type="number" value={result.treesRequired} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="solarPanels">Solar Panels Required for Offset</Label>
                    <Input id="solarPanels" type="number" value={result.solarPanelsRequired} readOnly />
                  </div>
                  <p>Emissions After Tree Offset: {result.emissionsAfterTreeOffset.toFixed(2)} kg CO2</p>
                  <p>Emissions After Solar Offset: {result.emissionsAfterSolarOffset.toFixed(2)} kg CO2</p>
                  <p>Cost of Emissions: ₹{result.costOfEmissions.toFixed(2)}</p>
                </div>

                <CSVLink data={result.data} filename="emissions-data.csv" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg text-sm shadow-md hover:bg-blue-700 transition duration-300">
                  Download Data
                </CSVLink>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={() => router.push('/')}>
              Back to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default EmissionCalculator;
