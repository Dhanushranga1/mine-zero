"use client";

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { 
  Card, CardContent, CardHeader, CardTitle, CardFooter 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowDown, ArrowUp, Download, AlertCircle, CheckCircle
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Mock data for charts
const historicalData = [
  { cycle: "2021-22", credits: 10000 },
  { cycle: "2022-23", credits: -5000 },
  { cycle: "2023-24", credits: 15000 },
];

const priceData = [
  { year: "2021", price: 250 },
  { year: "2022", price: 400 },
  { year: "2023", price: 350 },
  { year: "2024", price: 300 },
];

export default function CarbonCreditsPage() {
  // Input states
  const [targetIntensity, setTargetIntensity] = useState<number>(0.45);
  const [actualIntensity, setActualIntensity] = useState<number>(0.40);
  const [production, setProduction] = useState<number>(200000);
  const [creditPrice, setCreditPrice] = useState<number>(300);
  
  // Result states
  const [credits, setCredits] = useState<number>(0);
  const [creditType, setCreditType] = useState<'Surplus' | 'Deficit'>('Surplus');
  const [tradeValue, setTradeValue] = useState<number>(0);
  const [compliancePercent, setCompliancePercent] = useState<number>(0);
  
  // Trading simulation states
  const [tradeMode, setTradeMode] = useState<'buy' | 'sell'>('sell');
  const [tradePrice, setTradePrice] = useState<number>(300);
  const [tradeResult, setTradeResult] = useState<{
    status: string;
    message: string;
    amount: number;
  } | null>(null);

  // Calculate results whenever inputs change
  useEffect(() => {
    calculateResults();
  }, [targetIntensity, actualIntensity, production, creditPrice]);

  const calculateResults = () => {
    // Check if we have all required inputs
    if (!targetIntensity || !actualIntensity || !production) return;
    
    // Calculate credits
    let calculatedCredits: number;
    let type: 'Surplus' | 'Deficit';

    if (actualIntensity < targetIntensity) {
      calculatedCredits = (targetIntensity - actualIntensity) * production;
      type = 'Surplus';
    } else {
      calculatedCredits = (actualIntensity - targetIntensity) * production;
      type = 'Deficit';
    }
    
    // Calculate trade value
    const value = calculatedCredits * creditPrice;
    
    // Calculate compliance percentage
    const compliance = (actualIntensity / targetIntensity) * 100;
    
    // Update states
    setCredits(calculatedCredits);
    setCreditType(type);
    setTradeValue(value);
    setCompliancePercent(Math.min(compliance, 100));
  };

  const handleCalculate = () => {
    calculateResults();
  };

  const simulateTrade = () => {
    const MARKET_PRICE = 300; // Reference market price
    
    if (tradeMode === 'sell') {
      if (tradePrice <= MARKET_PRICE) {
        setTradeResult({
          status: 'success',
          message: 'Trade Successful',
          amount: credits * tradePrice
        });
      } else {
        setTradeResult({
          status: 'error',
          message: 'No buyers found at this price',
          amount: 0
        });
      }
    } else { // buy mode
      if (tradePrice >= MARKET_PRICE) {
        setTradeResult({
          status: 'success',
          message: 'Trade Successful',
          amount: credits * tradePrice
        });
      } else {
        setTradeResult({
          status: 'error',
          message: 'No sellers found at this price',
          amount: 0
        });
      }
    }
  };

  const exportCSV = () => {
    const csvContent = `Target Intensity,${targetIntensity} tCO₂/ton
Actual Intensity,${actualIntensity} tCO₂/ton
Production,${production.toLocaleString()} tons
Credits ${creditType === 'Surplus' ? 'Earned' : 'Needed'},${credits.toLocaleString()} tons
Credit Value,₹${tradeValue.toLocaleString()}
Market Rate,₹${creditPrice}/t
Credit Type,${creditType}
Compliance %,${compliancePercent.toFixed(1)}%
Recommendation,${creditType === 'Surplus' ? 'Eligible for carbon trading' : 'Need to reduce intensity'}`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'carbon_credits_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Carbon Credits Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Input Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="target-intensity">Target Intensity (tCO₂/ton)</Label>
              <Input 
                id="target-intensity" 
                type="number" 
                step="0.01"
                value={targetIntensity}
                onChange={(e) => setTargetIntensity(parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="actual-intensity">Actual Intensity (tCO₂/ton)</Label>
              <Input 
                id="actual-intensity" 
                type="number" 
                step="0.01"
                value={actualIntensity}
                onChange={(e) => setActualIntensity(parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="production">Production Volume (tons)</Label>
              <Input 
                id="production" 
                type="number"
                value={production}
                onChange={(e) => setProduction(parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="credit-price">Credit Price (₹/tCO₂)</Label>
              <Input 
                id="credit-price" 
                type="number"
                value={creditPrice}
                onChange={(e) => setCreditPrice(parseFloat(e.target.value))}
              />
            </div>
            <Button onClick={handleCalculate} className="w-full">Calculate</Button>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Carbon Credit Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Credit Status:</span>
              <span className="text-lg font-bold">
                You have {creditType === 'Surplus' ? 'earned' : 'need'} {credits.toLocaleString()} credits
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Trade Value:</span>
              <span className="text-lg">
                Worth approx ₹{tradeValue.toLocaleString()} at ₹{creditPrice}/ton
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Status:</span>
              <Badge variant={creditType === 'Surplus' ? "success" : "destructive"}>
                {creditType}
                {creditType === 'Surplus' ? 
                  <ArrowUp className="ml-1 h-4 w-4" /> : 
                  <ArrowDown className="ml-1 h-4 w-4" />
                }
              </Badge>
            </div>
            
            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span>Compliance Level</span>
                <span>{compliancePercent.toFixed(1)}%</span>
              </div>
              <Progress value={compliancePercent} className="h-2" />
            </div>
            
            <Button variant="outline" onClick={exportCSV} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Export Report (CSV)
            </Button>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Recommendation: {creditType === 'Surplus' 
                ? 'Consider monetizing credits via Indian Carbon Market (IEX/BEE)' 
                : 'Reduce intensity through efficiency measures or carbon market purchases'}
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* Trading Simulation Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Credit Trading Simulation</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sell" onValueChange={(val) => setTradeMode(val as 'buy' | 'sell')}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="sell">Sell Credits</TabsTrigger>
              <TabsTrigger value="buy">Buy Credits</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sell" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sell-amount">Credits Available</Label>
                  <Input id="sell-amount" value={creditType === 'Surplus' ? credits.toLocaleString() : '0'} disabled />
                </div>
                <div>
                  <Label htmlFor="sell-price">Ask Price (₹/ton)</Label>
                  <Input 
                    id="sell-price" 
                    type="number" 
                    value={tradePrice}
                    onChange={(e) => setTradePrice(parseFloat(e.target.value))}
                  />
                </div>
              </div>
              <Button onClick={simulateTrade} disabled={creditType !== 'Surplus'}>
                Simulate Sale
              </Button>
            </TabsContent>
            
            <TabsContent value="buy" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="buy-amount">Credits Needed</Label>
                  <Input id="buy-amount" value={creditType === 'Deficit' ? credits.toLocaleString() : '0'} disabled />
                </div>
                <div>
                  <Label htmlFor="buy-price">Bid Price (₹/ton)</Label>
                  <Input 
                    id="buy-price" 
                    type="number"
                    value={tradePrice}
                    onChange={(e) => setTradePrice(parseFloat(e.target.value))}
                  />
                </div>
              </div>
              <Button onClick={simulateTrade} disabled={creditType !== 'Deficit'}>
                Simulate Purchase
              </Button>
            </TabsContent>
          </Tabs>
          
          {tradeResult && (
            <Alert className="mt-4" variant={tradeResult.status === 'success' ? 'default' : 'destructive'}>
              {tradeResult.status === 'success' ? 
                <CheckCircle className="h-4 w-4" /> : 
                <AlertCircle className="h-4 w-4" />
              }
              <AlertTitle>{tradeResult.message}</AlertTitle>
              <AlertDescription>
                {tradeResult.status === 'success' ? 
                  `${tradeMode === 'sell' ? 'Sale completed for' : 'Purchase completed for'} ₹${tradeResult.amount.toLocaleString()}` :
                  `${tradeMode === 'sell' ? 'Try lowering your ask price' : 'Try increasing your bid price'} to current market rate (₹300/ton)`
                }
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Credit Performance Over Cycles</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="cycle" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="credits" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Credit Value Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}