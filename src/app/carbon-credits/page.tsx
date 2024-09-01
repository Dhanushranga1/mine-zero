"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, XAxis, YAxis, Tooltip, Line, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, Wallet } from 'lucide-react';
import { ethers } from 'ethers';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

// Mock ABI for the smart contract
const ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function buy(uint256 amount) payable",
  "function sell(uint256 amount)",
];

// Mock historical data
const historicalData = [
  { date: '2023-01', price: 25, volume: 1000 },
  { date: '2023-02', price: 27, volume: 1200 },
  { date: '2023-03', price: 26, volume: 900 },
  { date: '2023-04', price: 28, volume: 1100 },
  { date: '2023-05', price: 30, volume: 1300 },
];

// Blockchain integration (mock implementation)
const useBlockchain = () => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const initializeContract = async () => {
      try {
        if (typeof window !== 'undefined' && (window as any).ethereum) {
          const provider = new ethers.BrowserProvider((window as any).ethereum);
          const signer = await provider.getSigner();
          const contractAddress = "0x..."; // Replace with actual contract address
          const carbonCreditContract = new ethers.Contract(contractAddress, ABI, signer);
          setContract(carbonCreditContract);
        }
      } catch (error) {
        console.error("Failed to initialize contract:", error);
      }
    };
    initializeContract();
  }, []);

  const updateBalance = useCallback(async () => {
    if (contract) {
      const signer = await contract.runner?.provider?.getSigner();
      const address = await signer.getAddress();
      const balance = await contract.balanceOf(address);
      setBalance(Number(ethers.formatEther(balance)));
    }
  }, [contract]);

  useEffect(() => {
    updateBalance();
  }, [updateBalance]);

  return { contract, balance, updateBalance };
};

interface EmissionData {
  year: number;
  emissions: number;
  cleanTech: number;
  afforestation: number;
  renewables: number;
  energyEfficiency: number;
  carbonCredits: number;
}

interface SimulationResult {
  currentEmissions: number;
  projectedReduction: number;
  potentialCredits: number;
  financialImpact: number;
}

interface Project {
  id: number;
  name: string;
  credits: number;
  cost: number;
}

// Main component
const CarbonCreditSystem = () => {
  const [credits, setCredits] = useState(100);
  const [price, setPrice] = useState(30);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [tradeAmount, setTradeAmount] = useState('');
  const [offsetProjects, setOffsetProjects] = useState<Project[]>([
    { id: 1, name: 'Reforestation Project', credits: 50, cost: 1000 },
    { id: 2, name: 'Solar Farm Initiative', credits: 30, cost: 800 },
    { id: 3, name: 'Wind Energy Project', credits: 40, cost: 900 },
  ]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [cleanTechReduction, setCleanTechReduction] = useState(0);
  const [afforestationOffset, setAfforestationOffset] = useState(0);
  const [renewablesReduction, setRenewablesReduction] = useState(0);
  const [energyEfficiencyReduction, setEnergyEfficiencyReduction] = useState(0);
  const [mineSize, setMineSize] = useState('medium');
  const [baselineEmissions, setBaselineEmissions] = useState(1000);
  const [userCredits, setUserCredits] = useState(0);

  const { contract, balance, updateBalance } = useBlockchain();

  useEffect(() => {
    const interval = setInterval(() => {
      setPrice(prevPrice => {
        const change = (Math.random() - 0.5) * 2;
        return Math.max(1, prevPrice + change);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleTrade = async (isBuying: boolean) => {
    if (!tradeAmount || isNaN(parseFloat(tradeAmount))) {
      setAlertMessage('Please enter a valid amount');
      setShowAlert(true);
      return;
    }

    try {
      if (contract) {
        const amount = ethers.parseEther(tradeAmount);
        if (isBuying) {
          await contract.buy(amount, { value: ethers.parseEther((parseFloat(tradeAmount) * price).toString()) });
          setCredits(prevCredits => prevCredits + parseFloat(tradeAmount));
        } else {
          await contract.sell(amount);
          setCredits(prevCredits => prevCredits - parseFloat(tradeAmount));
        }
        await updateBalance();
        setAlertMessage(`Successfully ${isBuying ? 'bought' : 'sold'} ${tradeAmount} credits`);
        setShowAlert(true);
        document.getElementById('tradeAmount')?.focus();
      }
    } catch (error) {
      if (error instanceof Error) {
        setAlertMessage(`Transaction failed: ${error.message}`);
      } else {
        setAlertMessage('Transaction failed: Unknown error');
      }
      setShowAlert(true);
    }
  };

  const handleSimulation = () => {
    const totalReduction = cleanTechReduction + afforestationOffset + renewablesReduction + energyEfficiencyReduction;
    const projectedReduction = baselineEmissions * (totalReduction / 100);
    const remainingEmissions = baselineEmissions - projectedReduction;
    const potentialCredits = Math.floor(projectedReduction / 1000); // 1 credit per 1000 units of reduction
    const financialImpact = potentialCredits * price;

    setSimulationResult({
      currentEmissions: baselineEmissions,
      projectedReduction,
      potentialCredits,
      financialImpact,
    });

    // Credit the user with carbon credits
    setUserCredits(prevCredits => prevCredits + potentialCredits);
    setAlertMessage(`You've earned ${potentialCredits} carbon credits!`);
    setShowAlert(true);
  };

  const predictFuturePrice = () => {
    const lastPrice = historicalData[historicalData.length - 1].price;
    const trend = (price - lastPrice) / lastPrice;
    const volatility = 0.1; // Example volatility factor
    const predictedChange = trend + (Math.random() - 0.5) * volatility;
    return price * (1 + predictedChange);
  };

  const handleInvest = async (project: Project) => {
    if (userCredits >= project.credits) {
      try {
        setUserCredits(prev => prev - project.credits);
        setOffsetProjects(prev => prev.filter(p => p.id !== project.id));
        setAlertMessage(`Successfully invested ${project.credits} credits in ${project.name}`);
        setShowAlert(true);
      } catch (error) {
        setAlertMessage('Investment failed. Please try again.');
        setShowAlert(true);
      }
    } else {
      setAlertMessage('Not enough credits to invest in this project');
      setShowAlert(true);
    }
  };

  // Project Details Modal
  const ProjectDetailsModal = ({ project, onClose }: { project: Project; onClose: () => void }) => (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg p-6 overflow-y-auto"
    >
      <h2 className="text-2xl font-bold mb-4">{project.name}</h2>
      <p>Credits: {project.credits}</p>
      <p>Cost: ${project.cost}</p>
      <div className="mt-4">
        <Button onClick={() => handleInvest(project)} className="mr-2">Invest</Button>
        <Button onClick={onClose} variant="secondary">Close</Button>
      </div>
    </motion.div>
  );

  // Carbon Footprint Breakdown data
  const carbonFootprintData = [
    { name: 'Transportation', value: 30 },
    { name: 'Energy', value: 40 },
    { name: 'Agriculture', value: 20 },
    { name: 'Waste', value: 10 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Carbon Credit System</h1>
      {showAlert && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Alert</AlertTitle>
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Wallet className="h-6 w-6" />
            <span>Balance: {credits.toFixed(2)} credits</span>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current Price: ${price.toFixed(2)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Button onClick={() => handleTrade(true)}>Buy Credits</Button>
            <Button onClick={() => handleTrade(false)} variant="destructive">Sell Credits</Button>
            <Input
              type="number"
              placeholder="Enter amount"
              value={tradeAmount}
              onChange={(e) => setTradeAmount(e.target.value)}
              className="w-32"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Historical Data</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Carbon Footprint Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={carbonFootprintData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {carbonFootprintData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Offset Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {offsetProjects.map(project => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Credits Required: {project.credits}</p>
                  <p>Cost: ${project.cost}</p>
                  <Button 
                    onClick={() => setSelectedProject(project)} 
                    className="mt-2"
                    disabled={userCredits < project.credits}
                  >
                    {userCredits >= project.credits ? 'Invest' : 'Not Enough Credits'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedProject && (
        <AnimatePresence>
          <ProjectDetailsModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        </AnimatePresence>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Emission Reduction Simulation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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
              <Label htmlFor="cleanTech">Clean Technology Reduction (%)</Label>
              <Slider
                id="cleanTech"
                min={0}
                max={100}
                step={1}
                value={[cleanTechReduction]}
                onValueChange={(value) => setCleanTechReduction(value[0])}
              />
            </div>
            <div>
              <Label htmlFor="afforestation">Afforestation Offset (%)</Label>
              <Slider
                id="afforestation"
                min={0}
                max={100}
                step={1}
                value={[afforestationOffset]}
                onValueChange={(value) => setAfforestationOffset(value[0])}
              />
            </div>
            <div>
              <Label htmlFor="renewables">Renewables Reduction (%)</Label>
              <Slider
                id="renewables"
                min={0}
                max={100}
                step={1}
                value={[renewablesReduction]}
                onValueChange={(value) => setRenewablesReduction(value[0])}
              />
            </div>
            <div>
              <Label htmlFor="energyEfficiency">Energy Efficiency Reduction (%)</Label>
              <Slider
                id="energyEfficiency"
                min={0}
                max={100}
                step={1}
                value={[energyEfficiencyReduction]}
                onValueChange={(value) => setEnergyEfficiencyReduction(value[0])}
              />
            </div>
            <Button onClick={handleSimulation} className="mt-4">Run Simulation</Button>
          </div>
          {simulationResult && (
            <div className="p-4 border rounded-lg mt-4">
              <p>Current Emissions: {simulationResult.currentEmissions} units</p>
              <p>Projected Reduction: {simulationResult.projectedReduction.toFixed(2)} units</p>
              <p>Potential Credits: {simulationResult.potentialCredits.toFixed(2)} credits</p>
              <p>Financial Impact: ${simulationResult.financialImpact.toFixed(2)}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Carbon Credits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <span>Credits: {userCredits}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Price Prediction</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Predicted Future Price: ${predictFuturePrice().toFixed(2)}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CarbonCreditSystem;