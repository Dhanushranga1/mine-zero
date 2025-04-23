"use client"
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Trees, Zap, Factory, CloudLightning, Lightbulb, Sparkles, Download, Share2, FileText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
  netEmissions: number;
  costSavings: number;
}

const CarbonNeutralityPathways: React.FC = () => {
  const [baselineEmissions, setBaselineEmissions] = useState<number>(1000);
  const [mineSize, setMineSize] = useState('medium');
  const [targetYear, setTargetYear] = useState<number>(2034);
  const [simulationData, setSimulationData] = useState<EmissionData[]>([]);
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [costSavings, setCostSavings] = useState<number>(0);
  const [carbonPrice, setCarbonPrice] = useState<number>(50);
  const [comparisonMode, setComparisonMode] = useState<boolean>(false);
  const [comparisonPathway, setComparisonPathway] = useState<string | null>(null);
  const [comparisonData, setComparisonData] = useState<EmissionData[]>([]);
  
  // API key directly hardcoded as requested
  const GEMINI_API_KEY = "AIzaSyAaUv8oM2cyuTgnlXu9bCl8Yn0p6V2xzfM";

  useEffect(() => {
    if (selectedPathway) {
      runSimulation(selectedPathway, setSimulationData);
    }
    if (comparisonMode && comparisonPathway) {
      runSimulation(comparisonPathway, setComparisonData);
    }
  }, [selectedPathway, comparisonPathway, mineSize, baselineEmissions, targetYear, carbonPrice]);

  const runSimulation = (pathwayId: string, setData: React.Dispatch<React.SetStateAction<EmissionData[]>>) => {
    const data: EmissionData[] = [];
    let currentEmissions = baselineEmissions;
    const selectedMineSize = mineSizes.find(size => size.id === mineSize);
    const emissionsFactor = selectedMineSize ? selectedMineSize.emissionsFactor : 1;
    const years = targetYear - 2024;

    const pathway = pathways.find(p => p.id === pathwayId);
    if (!pathway) return;

    let totalCostSavings = 0;

    for (let year = 0; year < years; year++) {
      const reductionFactor = (year + 1) / years;
      const totalReduction = pathway.reductionFactors.reduce((acc, factor) => acc + factor * reductionFactor, 0);
      const yearlyEmissions = baselineEmissions * emissionsFactor * (1 - totalReduction);
      
      // Calculate cost savings from reduced emissions
      const yearlySavings = (baselineEmissions * emissionsFactor - yearlyEmissions) * carbonPrice;
      totalCostSavings += yearlySavings;

      data.push({
        year: 2024 + year,
        emissions: Math.max(yearlyEmissions, 0),
        cleanTech: pathway.reductionFactors[0] * baselineEmissions * emissionsFactor * reductionFactor,
        afforestation: pathway.reductionFactors[1] * baselineEmissions * emissionsFactor * reductionFactor,
        renewables: pathway.reductionFactors[2] * baselineEmissions * emissionsFactor * reductionFactor,
        energyEfficiency: pathway.reductionFactors[3] * baselineEmissions * emissionsFactor * reductionFactor,
        carbonCredits: pathway.reductionFactors[4] * baselineEmissions * emissionsFactor * reductionFactor,
        netEmissions: Math.max(yearlyEmissions, 0),
        costSavings: yearlySavings
      });
    }

    setData(data);
    if (pathwayId === selectedPathway) {
      setCostSavings(totalCostSavings);
    }
  };

  const pathways = [
    {
      id: 'balanced',
      name: 'Balanced Approach',
      description: 'A well-rounded strategy targeting all aspects of emission reduction.',
      reductionFactors: [0.2, 0.2, 0.2, 0.2, 0.2],
      icon: <Sparkles className="h-5 w-5" />
    },
    {
      id: 'techFocused',
      name: 'Technology-Focused',
      description: 'Emphasizes clean technologies and energy efficiency improvements.',
      reductionFactors: [0.4, 0.1, 0.2, 0.2, 0.1],
      icon: <Zap className="h-5 w-5" />
    },
    {
      id: 'natureBased',
      name: 'Nature-Based Solutions',
      description: 'Prioritizes afforestation and carbon credits from nature-based projects.',
      reductionFactors: [0.1, 0.4, 0.1, 0.1, 0.3],
      icon: <Trees className="h-5 w-5" />
    },
    {
      id: 'energyTransition',
      name: 'Energy Transition',
      description: 'Focuses on transitioning to renewable energy sources.',
      reductionFactors: [0.2, 0.1, 0.4, 0.2, 0.1],
      icon: <Lightbulb className="h-5 w-5" />
    },
  ];

  const mineSizes = [
    { id: 'small', name: 'Small Mine', emissionsFactor: 0.5, description: 'Annual production < 1 million tons' },
    { id: 'medium', name: 'Medium Mine', emissionsFactor: 1, description: 'Annual production 1-10 million tons' },
    { id: 'large', name: 'Large Mine', emissionsFactor: 2, description: 'Annual production > 10 million tons' },
  ];

  const getSuggestionsFromGemini = async () => {
    setIsLoading(true);
    try {
      // Initialize Gemini API with the API key
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `Given a ${mineSize} coal mine with baseline emissions of ${baselineEmissions} tons CO2/year targeting carbon neutrality by ${targetYear}, 
      suggest 3 specific and actionable ways this mine can reduce its emissions. Include cost estimates and implementation timelines. Format in markdown.`;

      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        setAiSuggestions(response.text());
      } catch (error) {
        console.error('Error getting AI suggestions:', error);
        setAiSuggestions('Unable to generate suggestions at this time. Please try again later.');
      }
    } catch (error) {
      console.error('API initialization error:', error);
      setAiSuggestions('Error initializing AI service. Please check your API key.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback in case the API doesn't work
  const getBackupSuggestions = () => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const mockSuggestions = `
## Key Recommendations for ${mineSize} Mine

### 1. Energy Efficiency Upgrades
- **Action**: Replace old equipment with energy-efficient alternatives
- **Cost**: $500,000 - $1,200,000
- **Timeline**: 12-18 months
- **Reduction Potential**: 15-20% of total emissions

### 2. Renewable Energy Integration
- **Action**: Install solar arrays on available land and buildings
- **Cost**: $800,000 - $2,500,000
- **Timeline**: 18-24 months
- **Reduction Potential**: 25-30% of energy-related emissions

### 3. Methane Capture Systems
- **Action**: Implement advanced methane capture technology
- **Cost**: $1,200,000 - $3,000,000
- **Timeline**: 12-36 months
- **Reduction Potential**: 40-60% of methane emissions
      `;
      
      setAiSuggestions(mockSuggestions);
      setIsLoading(false);
    }, 2000);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const downloadReport = () => {
    if (!simulationData.length) return;
    
    const pathway = pathways.find(p => p.id === selectedPathway);
    const finalYearData = simulationData[simulationData.length - 1];
    const reductionPercentage = ((baselineEmissions - finalYearData.emissions) / baselineEmissions * 100).toFixed(2);
    
    const report = `
# Carbon Neutrality Pathway Report

## Mine Details
- **Mine Size**: ${mineSizes.find(size => size.id === mineSize)?.name}
- **Baseline Emissions**: ${baselineEmissions} tons CO2/year
- **Target Year**: ${targetYear}
- **Selected Pathway**: ${pathway?.name}

## Emission Reduction Summary
- **Initial Emissions (2024)**: ${baselineEmissions} tons CO2/year
- **Final Emissions (${finalYearData.year})**: ${finalYearData.emissions.toFixed(2)} tons CO2/year
- **Total Reduction**: ${reductionPercentage}%
- **Estimated Cost Savings**: $${costSavings.toFixed(2)}

## Reduction Breakdown for ${finalYearData.year}
- Clean Technology: ${finalYearData.cleanTech.toFixed(2)} tons CO2
- Afforestation: ${finalYearData.afforestation.toFixed(2)} tons CO2
- Renewables: ${finalYearData.renewables.toFixed(2)} tons CO2
- Energy Efficiency: ${finalYearData.energyEfficiency.toFixed(2)} tons CO2
- Carbon Credits: ${finalYearData.carbonCredits.toFixed(2)} tons CO2
    `;
    
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carbon-neutrality-report-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Carbon Neutrality Pathway Planner</h1>
        {simulationData.length > 0 && (
          <div className="flex gap-2">
            <Button onClick={downloadReport} size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" /> Export Report
            </Button>
          </div>
        )}
      </div>
      
      <Tabs defaultValue="setup">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="simulation" disabled={!selectedPathway}>Results</TabsTrigger>
          <TabsTrigger value="recommendations" disabled={!aiSuggestions}>Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="setup" className="space-y-4">
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
              <div>
                <Label htmlFor="targetYear">Target Year for Carbon Neutrality</Label>
                <div className="flex gap-4 items-center">
                  <Slider
                    value={[targetYear]}
                    min={2025}
                    max={2050}
                    step={1}
                    onValueChange={(value) => setTargetYear(value[0])}
                    className="flex-1"
                  />
                  <span className="font-bold">{targetYear}</span>
                </div>
              </div>
              <div>
                <Label htmlFor="carbonPrice">Carbon Price ($ per ton)</Label>
                <Input
                  id="carbonPrice"
                  type="number"
                  value={carbonPrice}
                  onChange={(e) => setCarbonPrice(Number(e.target.value))}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="comparisonMode"
                  checked={comparisonMode}
                  onChange={(e) => setComparisonMode(e.target.checked)}
                />
                <Label htmlFor="comparisonMode">Enable Pathway Comparison</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Select Pathway{comparisonMode ? "(s)" : ""}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pathways.map((pathway) => (
                <motion.div
                  key={pathway.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => {
                      if (comparisonMode) {
                        if (selectedPathway === pathway.id) {
                          setSelectedPathway(null);
                        } else if (comparisonPathway === pathway.id) {
                          setComparisonPathway(null);
                        } else if (!selectedPathway) {
                          setSelectedPathway(pathway.id);
                        } else if (!comparisonPathway) {
                          setComparisonPathway(pathway.id);
                        }
                      } else {
                        setSelectedPathway(pathway.id);
                      }
                    }}
                    variant={
                      selectedPathway === pathway.id || comparisonPathway === pathway.id 
                        ? "default" 
                        : "outline"
                    }
                    className="w-full justify-start"
                  >
                    {pathway.icon}
                    <span className="ml-2">{pathway.name}</span>
                    {selectedPathway === pathway.id && <Badge className="ml-2">Primary</Badge>}
                    {comparisonPathway === pathway.id && <Badge className="ml-2" variant="outline">Comparison</Badge>}
                  </Button>
                </motion.div>
              ))}
              
              <div className="flex gap-2">
                <Button onClick={getSuggestionsFromGemini} className="w-1/2" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Generating...
                    </>
                  ) : (
                    <>
                      Get AI Suggestions <Sparkles className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                <Button onClick={getBackupSuggestions} className="w-1/2" variant="outline" disabled={isLoading}>
                  Use Sample Suggestions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="simulation">
          {selectedPathway && simulationData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Emission Reduction Forecast</CardTitle>
                  <CardDescription>
                    Estimated cost savings: ${costSavings.toFixed(2)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="year" 
                        type="number" 
                        domain={[2024, targetYear]} 
                        allowDataOverflow 
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        data={simulationData} 
                        type="monotone" 
                        dataKey="emissions" 
                        stroke="#8884d8" 
                        name="Emissions" 
                      />
                      {comparisonMode && comparisonData.length > 0 && (
                        <Line 
                          data={comparisonData} 
                          type="monotone" 
                          dataKey="emissions" 
                          stroke="#82ca9d" 
                          name="Comparison Emissions" 
                          strokeDasharray="5 5"
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Reduction Strategy Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={simulationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="cleanTech" stackId="a" fill="#82ca9d" name="Clean Tech" />
                      <Bar dataKey="afforestation" stackId="a" fill="#ffc658" name="Afforestation" />
                      <Bar dataKey="renewables" stackId="a" fill="#ff7300" name="Renewables" />
                      <Bar dataKey="energyEfficiency" stackId="a" fill="#0088FE" name="Energy Efficiency" />
                      <Bar dataKey="carbonCredits" stackId="a" fill="#8884d8" name="Carbon Credits" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>
        
        <TabsContent value="recommendations">
          {aiSuggestions && (
            <Card>
              <CardHeader>
                <CardTitle>AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ReactMarkdown>{aiSuggestions}</ReactMarkdown>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default CarbonNeutralityPathways;