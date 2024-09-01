"use client"
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Trees, Zap, Factory, CloudLightning, Lightbulb, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface EmissionData {
  year: number;
  emissions: number;
  cleanTech: number;
  afforestation: number;
  renewables: number;
  energyEfficiency: number;
  carbonCredits: number;
  absorption: number;
  potentialCarbonCredits: number;
}

const CarbonNeutralityPathways: React.FC = () => {
  const [baselineEmissions, setBaselineEmissions] = useState<number>(1000);
  const [mineSize, setMineSize] = useState('medium');
  const [simulationData, setSimulationData] = useState<EmissionData[]>([]);
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const years = 10;

  useEffect(() => {
    if (selectedPathway) {
      runSimulation();
    }
  }, [selectedPathway, mineSize, baselineEmissions]);

  const runSimulation = () => {
    const data: EmissionData[] = [];
    let currentEmissions = baselineEmissions;
    const selectedMineSize = mineSizes.find(size => size.id === mineSize);
    const emissionsFactor = selectedMineSize ? selectedMineSize.emissionsFactor : 1;

    const pathway = pathways.find(p => p.id === selectedPathway);
    if (!pathway) return;

    for (let year = 0; year < years; year++) {
      const reductionFactor = (year + 1) / years;
      const totalReduction = pathway.reductionFactors.reduce((acc, factor) => acc + factor * reductionFactor, 0);
      currentEmissions = baselineEmissions * emissionsFactor * (1 - totalReduction);

      data.push({
        year: 2024 + year,
        emissions: Math.max(currentEmissions, 0),
        cleanTech: pathway.reductionFactors[0] * baselineEmissions * emissionsFactor * reductionFactor,
        afforestation: pathway.reductionFactors[1] * baselineEmissions * emissionsFactor * reductionFactor,
        renewables: pathway.reductionFactors[2] * baselineEmissions * emissionsFactor * reductionFactor,
        energyEfficiency: pathway.reductionFactors[3] * baselineEmissions * emissionsFactor * reductionFactor,
        carbonCredits: pathway.reductionFactors[4] * baselineEmissions * emissionsFactor * reductionFactor,
        absorption: 0,
        potentialCarbonCredits: 0,
      });
    }

    setSimulationData(data);
  };

  const pathways = [
    {
      id: 'balanced',
      name: 'Balanced Approach',
      description: 'A well-rounded strategy targeting all aspects of emission reduction.',
      reductionFactors: [0.2, 0.2, 0.2, 0.2, 0.2],
    },
    {
      id: 'techFocused',
      name: 'Technology-Focused',
      description: 'Emphasizes clean technologies and energy efficiency improvements.',
      reductionFactors: [0.4, 0.1, 0.2, 0.2, 0.1],
    },
    {
      id: 'natureBased',
      name: 'Nature-Based Solutions',
      description: 'Prioritizes afforestation and carbon credits from nature-based projects.',
      reductionFactors: [0.1, 0.4, 0.1, 0.1, 0.3],
    },
    {
      id: 'energyTransition',
      name: 'Energy Transition',
      description: 'Focuses on transitioning to renewable energy sources.',
      reductionFactors: [0.2, 0.1, 0.4, 0.2, 0.1],
    },
  ];

  const mineSizes = [
    { id: 'small', name: 'Small Mine', emissionsFactor: 0.5, description: 'Annual production < 1 million tons' },
    { id: 'medium', name: 'Medium Mine', emissionsFactor: 1, description: 'Annual production 1-10 million tons' },
    { id: 'large', name: 'Large Mine', emissionsFactor: 2, description: 'Annual production > 10 million tons' },
  ];

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

  const getSuggestionsFromGemini = async () => {
    setIsLoading(true);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Given a ${mineSize} coal mine with baseline emissions of ${baselineEmissions} tons CO2/year, 
    suggest 3 specific and actionable ways this mine can reduce its emissions and move towards carbon neutrality. 
    Focus on practical solutions that can be implemented in the short to medium term. Format your response in markdown.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      setAiSuggestions(response.text());
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      setAiSuggestions('Unable to generate suggestions at this time. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 space-y-8"
    >
      <h1 className="text-3xl font-bold mb-4">Carbon Neutrality Pathway Planner</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Mine Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="baselineEmissions">Baseline Emissions (tons CO2/year)</Label>
            <Input
              id="baselineEmissions"
              type="number"
              value={baselineEmissions}
              onChange={(e) => setBaselineEmissions(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="mineSize">Mine Size</Label>
            <Select onValueChange={setMineSize} value={mineSize}>
              <SelectTrigger>
                <SelectValue placeholder="Select mine size" />
              </SelectTrigger>
              <SelectContent>
                {mineSizes.map((size) => (
                  <SelectItem key={size.id} value={size.id}>
                    {size.name}
                    <span className="text-sm text-gray-500 block">{size.description}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Select a Pathway</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {pathways.map((pathway) => (
            <motion.div
              key={pathway.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => setSelectedPathway(pathway.id)}
                variant={selectedPathway === pathway.id ? "default" : "outline"}
                className="w-full justify-start"
              >
                {pathway.name} ({pathway.description})
              </Button>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {selectedPathway && simulationData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Emission Reduction Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={simulationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="emissions" stroke="#8884d8" name="Total Emissions" />
                  <Line type="monotone" dataKey="cleanTech" stroke="#82ca9d" name="Clean Tech" />
                  <Line type="monotone" dataKey="afforestation" stroke="#ffc658" name="Afforestation" />
                  <Line type="monotone" dataKey="renewables" stroke="#ff7300" name="Renewables" />
                  <Line type="monotone" dataKey="energyEfficiency" stroke="#0088FE" name="Energy Efficiency" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Emission Reduction Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-around">
              <div className="w-1/2">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={Object.entries(simulationData[simulationData.length - 1])
                        .filter(([key]) => ['cleanTech', 'afforestation', 'renewables', 'energyEfficiency', 'carbonCredits'].includes(key))
                        .map(([key, value]) => ({ name: key, value }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {Object.entries(simulationData[simulationData.length - 1])
                        .filter(([key]) => ['cleanTech', 'afforestation', 'renewables', 'energyEfficiency', 'carbonCredits'].includes(key))
                        .map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={simulationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="cleanTech" stackId="a" fill="#82ca9d" />
                    <Bar dataKey="afforestation" stackId="a" fill="#ffc658" />
                    <Bar dataKey="renewables" stackId="a" fill="#ff7300" />
                    <Bar dataKey="energyEfficiency" stackId="a" fill="#0088FE" />
                    <Bar dataKey="carbonCredits" stackId="a" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button onClick={getSuggestionsFromGemini} className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Generating Suggestions...
            </>
          ) : (
            <>
              Get AI Suggestions <Sparkles className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </motion.div>

      {aiSuggestions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>AI Suggestions for Emission Reduction</CardTitle>
            </CardHeader>
            <CardContent>
              <ReactMarkdown>{aiSuggestions}</ReactMarkdown>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CarbonNeutralityPathways;