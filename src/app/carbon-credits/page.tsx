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
  ArrowDown, ArrowUp, Download, AlertCircle, CheckCircle, RefreshCcw, TrendingUp 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock market data
const mockMarketData = {
  buyOrders: [
    { id: 'b1', price: 295, quantity: 5000 },
    { id: 'b2', price: 290, quantity: 7500 },
    { id: 'b3', price: 285, quantity: 10000 },
    { id: 'b4', price: 280, quantity: 15000 }
  ],
  sellOrders: [
    { id: 's1', price: 305, quantity: 4000 },
    { id: 's2', price: 310, quantity: 6000 },
    { id: 's3', price: 315, quantity: 8000 },
    { id: 's4', price: 320, quantity: 12000 }
  ],
  marketPrice: 300,
  priceHistory: [
    { date: '06/01', price: 295 },
    { date: '07/01', price: 298 },
    { date: '08/01', price: 300 },
    { date: '09/01', price: 302 },
    { date: '10/01', price: 299 },
    { date: '11/01', price: 300 }
  ]
};

// Historical data for charts
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

export default function CarbonCreditsTrading() {
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
  
  // Trading states
  const [tradeMode, setTradeMode] = useState<'buy' | 'sell'>('sell');
  const [tradePrice, setTradePrice] = useState<number>(300);
  const [tradeQuantity, setTradeQuantity] = useState<number>(0);
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [tradeResult, setTradeResult] = useState<{
    status: string;
    message: string;
    amount: number;
    quantity: number;
  } | null>(null);
  
  // Portfolio states
  const [portfolio, setPortfolio] = useState({
    credits: 0,
    cash: 1000000,
    transactions: []
  });
  
  // Market states
  const [market, setMarket] = useState(mockMarketData);
  const [marketRefreshTime, setMarketRefreshTime] = useState(new Date());
  
  // Calculate results whenever inputs change
  useEffect(() => {
    calculateResults();
  }, [targetIntensity, actualIntensity, production, creditPrice]);
  
  // Set initial trade quantity when credits change
  useEffect(() => {
    if (creditType === 'Surplus') {
      setTradeQuantity(Math.floor(credits));
    } else {
      setTradeQuantity(Math.floor(credits));
    }
  }, [credits, creditType]);

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
    const compliance = type === 'Surplus' ? 
      (targetIntensity / actualIntensity) * 100 : 
      (actualIntensity / targetIntensity) * 100;
    
    // Update states
    setCredits(calculatedCredits);
    setCreditType(type);
    setTradeValue(value);
    setCompliancePercent(Math.min(compliance, 100));
    
    // Update portfolio with initial credits
    setPortfolio(prev => ({
      ...prev,
      credits: type === 'Surplus' ? calculatedCredits : 0
    }));
  };

  const simulateTrade = () => {
    if (tradeQuantity <= 0) {
      setTradeResult({
        status: 'error',
        message: 'Invalid Quantity',
        amount: 0,
        quantity: 0
      });
      return;
    }
    
    // Check if user has enough credits/cash
    if (tradeMode === 'sell' && tradeQuantity > portfolio.credits) {
      setTradeResult({
        status: 'error',
        message: 'Not enough credits',
        amount: 0,
        quantity: 0
      });
      return;
    }
    
    const executionPrice = orderType === 'market' ? market.marketPrice : tradePrice;
    const tradeAmount = tradeQuantity * executionPrice;
    
    if (tradeMode === 'buy' && tradeAmount > portfolio.cash) {
      setTradeResult({
        status: 'error',
        message: 'Not enough cash',
        amount: 0,
        quantity: 0
      });
      return;
    }
    
    // For limit orders, check if price is favorable
    if (orderType === 'limit') {
      if (tradeMode === 'buy' && tradePrice < market.marketPrice) {
        setTradeResult({
          status: 'pending',
          message: 'Order placed on book',
          amount: tradeAmount,
          quantity: tradeQuantity
        });
        return;
      }
      
      if (tradeMode === 'sell' && tradePrice > market.marketPrice) {
        setTradeResult({
          status: 'pending',
          message: 'Order placed on book',
          amount: tradeAmount,
          quantity: tradeQuantity
        });
        return;
      }
    }
    
    // Execute trade
    const newPortfolio = { ...portfolio };
    
    if (tradeMode === 'buy') {
      newPortfolio.credits += tradeQuantity;
      newPortfolio.cash -= tradeAmount;
      newPortfolio.transactions = [
        {
          id: Date.now(),
          type: 'buy',
          quantity: tradeQuantity,
          price: executionPrice,
          total: tradeAmount,
          date: new Date().toLocaleString()
        },
        ...newPortfolio.transactions
      ].slice(0, 10);
    } else {
      newPortfolio.credits -= tradeQuantity;
      newPortfolio.cash += tradeAmount;
      newPortfolio.transactions = [
        {
          id: Date.now(),
          type: 'sell',
          quantity: tradeQuantity,
          price: executionPrice,
          total: tradeAmount,
          date: new Date().toLocaleString()
        },
        ...newPortfolio.transactions
      ].slice(0, 10);
    }
    
    setPortfolio(newPortfolio);
    
    // Update trade result
    setTradeResult({
      status: 'success',
      message: `${tradeMode === 'buy' ? 'Purchase' : 'Sale'} Executed`,
      amount: tradeAmount,
      quantity: tradeQuantity
    });
    
    // Simulate market reaction
    simulateMarketReaction(tradeMode, tradeQuantity);
  };
  
  const simulateMarketReaction = (mode, quantity) => {
    // Clone market data
    const newMarket = { ...market };
    
    // Adjust market price based on trade
    const priceImpact = (quantity / 50000) * (mode === 'buy' ? 1 : -1);
    newMarket.marketPrice = Math.round((newMarket.marketPrice + priceImpact) * 100) / 100;
    
    // Update price history
    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    newMarket.priceHistory = [
      ...newMarket.priceHistory.slice(-5),
      { date: timeStr, price: newMarket.marketPrice }
    ];
    
    // Update order books
    if (mode === 'buy') {
      // Remove some sell orders that were matched
      if (newMarket.sellOrders.length > 0) {
        const firstOrder = { ...newMarket.sellOrders[0] };
        firstOrder.quantity = Math.max(0, firstOrder.quantity - quantity);
        
        if (firstOrder.quantity === 0) {
          newMarket.sellOrders = newMarket.sellOrders.slice(1);
        } else {
          newMarket.sellOrders[0] = firstOrder;
        }
      }
      
      // Add some new buy interest
      newMarket.buyOrders.unshift({
        id: `b${Date.now()}`,
        price: Math.floor(newMarket.marketPrice * 0.98),
        quantity: Math.floor(quantity * 0.8)
      });
    } else {
      // Remove some buy orders that were matched
      if (newMarket.buyOrders.length > 0) {
        const firstOrder = { ...newMarket.buyOrders[0] };
        firstOrder.quantity = Math.max(0, firstOrder.quantity - quantity);
        
        if (firstOrder.quantity === 0) {
          newMarket.buyOrders = newMarket.buyOrders.slice(1);
        } else {
          newMarket.buyOrders[0] = firstOrder;
        }
      }
      
      // Add some new sell interest
      newMarket.sellOrders.unshift({
        id: `s${Date.now()}`,
        price: Math.ceil(newMarket.marketPrice * 1.02),
        quantity: Math.floor(quantity * 0.8)
      });
    }
    
    // Keep only top 4 orders
    newMarket.buyOrders = newMarket.buyOrders.slice(0, 4).sort((a, b) => b.price - a.price);
    newMarket.sellOrders = newMarket.sellOrders.slice(0, 4).sort((a, b) => a.price - b.price);
    
    setMarket(newMarket);
    setMarketRefreshTime(now);
  };
  
  const refreshMarket = () => {
    // Add small random fluctuation to market price
    const newMarket = { ...market };
    const fluctuation = (Math.random() - 0.5) * 3;
    newMarket.marketPrice = Math.round((newMarket.marketPrice + fluctuation) * 100) / 100;
    
    // Update price history
    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    newMarket.priceHistory = [
      ...newMarket.priceHistory.slice(-5),
      { date: timeStr, price: newMarket.marketPrice }
    ];
    
    // Slightly modify order books
    newMarket.buyOrders = newMarket.buyOrders.map(order => ({
      ...order,
      price: Math.round(order.price * (1 + (Math.random() - 0.5) * 0.01) * 100) / 100,
      quantity: Math.floor(order.quantity * (1 + (Math.random() - 0.5) * 0.1))
    })).sort((a, b) => b.price - a.price);
    
    newMarket.sellOrders = newMarket.sellOrders.map(order => ({
      ...order,
      price: Math.round(order.price * (1 + (Math.random() - 0.5) * 0.01) * 100) / 100,
      quantity: Math.floor(order.quantity * (1 + (Math.random() - 0.5) * 0.1))
    })).sort((a, b) => a.price - b.price);
    
    setMarket(newMarket);
    setMarketRefreshTime(now);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Carbon Credits Trading</h1>
      
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
            <Button onClick={calculateResults} className="w-full">Calculate</Button>
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
              <span className="text-sm font-medium">Current Market Price:</span>
              <span className="text-lg">
                ₹{market.marketPrice.toLocaleString()}/ton
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
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Recommendation: {creditType === 'Surplus' 
                ? 'Consider monetizing credits via market' 
                : 'Purchase credits to meet compliance'}
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* Trading and Portfolio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Trading Panel */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Trading</CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Market Price: ₹{market.marketPrice}</span>
              <Button variant="ghost" size="sm" onClick={refreshMarket}>
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="sell" onValueChange={(val) => setTradeMode(val as 'buy' | 'sell')}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="sell">Sell Credits</TabsTrigger>
                <TabsTrigger value="buy">Buy Credits</TabsTrigger>
              </TabsList>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="order-type">Order Type</Label>
                    <Select defaultValue="market" onValueChange={(val) => setOrderType(val as 'market' | 'limit')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Order Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="market">Market Order</SelectItem>
                        <SelectItem value="limit">Limit Order</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input 
                      id="quantity" 
                      type="number" 
                      value={tradeQuantity}
                      onChange={(e) => setTradeQuantity(parseFloat(e.target.value))}
                    />
                  </div>
                  
                  {orderType === 'limit' && (
                    <div>
                      <Label htmlFor="trade-price">{tradeMode === 'buy' ? 'Bid' : 'Ask'} Price (₹/ton)</Label>
                      <Input 
                        id="trade-price" 
                        type="number" 
                        value={tradePrice}
                        onChange={(e) => setTradePrice(parseFloat(e.target.value))}
                      />
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={simulateTrade} 
                  className="w-full"
                  variant={tradeMode === 'buy' ? 'default' : 'outline'}
                >
                  {tradeMode === 'buy' ? 'Buy' : 'Sell'} {tradeQuantity} Credits for 
                  ₹{(orderType === 'market' ? market.marketPrice : tradePrice) * tradeQuantity}
                </Button>
                
                {tradeResult && (
                  <Alert variant={tradeResult.status === 'success' ? 'default' : 
                    tradeResult.status === 'pending' ? 'warning' : 'destructive'}>
                    {tradeResult.status === 'success' ? 
                      <CheckCircle className="h-4 w-4" /> : 
                      <AlertCircle className="h-4 w-4" />
                    }
                    <AlertTitle>{tradeResult.message}</AlertTitle>
                    <AlertDescription>
                      {tradeResult.status === 'success' ? 
                        `${tradeMode === 'sell' ? 'Sold' : 'Bought'} ${tradeResult.quantity} credits for ₹${tradeResult.amount.toLocaleString()}` :
                        tradeResult.status === 'pending' ? 
                          `Order placed to ${tradeMode} ${tradeQuantity} credits at ₹${tradePrice}/ton` :
                          tradeResult.message
                      }
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Portfolio Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Credits Balance:</span>
              <span className="text-lg font-bold">{portfolio.credits.toLocaleString()} credits</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Cash Balance:</span>
              <span className="text-lg font-bold">₹{portfolio.cash.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Value of Credits:</span>
              <span className="text-lg">₹{(portfolio.credits * market.marketPrice).toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Portfolio Value:</span>
              <span className="text-lg font-bold">₹{(portfolio.cash + portfolio.credits * market.marketPrice).toLocaleString()}</span>
            </div>
            
            {portfolio.transactions.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Recent Transactions</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {portfolio.transactions.map(tx => (
                    <div key={tx.id} className="text-xs flex items-center justify-between">
                      <span>{tx.date}</span>
                      <Badge variant={tx.type === 'buy' ? 'default' : 'outline'}>
                        {tx.type === 'buy' ? 'BUY' : 'SELL'} {tx.quantity} @ ₹{tx.price}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Market Data */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Market Data</CardTitle>
          <span className="text-xs text-muted-foreground">
            Last updated: {marketRefreshTime.toLocaleTimeString()}
          </span>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Order Book</h3>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground grid grid-cols-2">
                  <span>Price</span>
                  <span>Quantity</span>
                </div>
                
                <div className="space-y-1">
                  {market.sellOrders.slice().reverse().map(order => (
                    <div key={order.id} className="text-red-500 text-xs grid grid-cols-2">
                      <span>₹{order.price}</span>
                      <span>{order.quantity.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center py-1 my-1 bg-gray-100 px-2 dark:bg-gray-800">
                  <span className="text-xs font-medium">Market Price</span>
                  <span className="text-xs font-medium">₹{market.marketPrice}</span>
                </div>
                
                <div className="space-y-1">
                  {market.buyOrders.map(order => (
                    <div key={order.id} className="text-green-500 text-xs grid grid-cols-2">
                      <span>₹{order.price}</span>
                      <span>{order.quantity.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Price History</h3>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={market.priceHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                    <Tooltip />
                    <Line type="monotone" dataKey="price" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Credit Performance Over Cycles</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
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
            <CardTitle>Credit Price Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
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