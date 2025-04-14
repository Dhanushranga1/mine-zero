"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Download, PieChart as PieChartIcon, BarChart as BarChartIcon, TreePine, PanelTop } from "lucide-react";
import { calculateEmissions, EmissionInputData, industryBenchmarks } from "@/utils/emissions";
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

const formSchema = z.object({
  diesel: z.number().min(0, "Must be a positive number"),
  electricity: z.number().min(0, "Must be a positive number"),
  explosives: z.number().min(0, "Must be a positive number"),
  production: z.number().min(1, "Enter total mined output (tons)"),
  targetIntensity: z.number().min(0.01, "Enter regulator-assigned target"),
  offsetMode: z.enum(["trees", "solar", "combined"]),
  mineType: z.enum(["openCast", "underground"]),
});

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const progressColors = {
  good: "bg-green-500",
  medium: "bg-yellow-500",
  bad: "bg-red-500"
};

export default function EmissionsPage() {
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      diesel: 1000,
      electricity: 5000,
      explosives: 2,
      production: 10000,
      targetIntensity: 0.5,
      offsetMode: "combined",
      mineType: "openCast",
    },
  });

  function onSubmit(values) {
    const inputData = {
      diesel: values.diesel,
      electricity: values.electricity,
      explosives: values.explosives,
      production: values.production,
      targetIntensity: values.targetIntensity,
      offsetMode: values.offsetMode,
      mineType: values.mineType,
    };

    const emissionResults = calculateEmissions(inputData);
    setResults(emissionResults);
    setActiveTab("overview");
  }

  function getProgressColor(value, target) {
    if (value <= target * 0.8) return progressColors.good;
    if (value <= target) return progressColors.medium;
    return progressColors.bad;
  }

  function formatNumber(num) {
    return new Intl.NumberFormat("en-IN").format(num);
  }

  function exportToCSV() {
    if (!results) return;

    const formValues = form.getValues();
    const headers = ["Metric", "Value"];
    
    const rows = [
      ["Date", new Date().toLocaleDateString()],
      ["Mine Type", formValues.mineType === "openCast" ? "Open Cast" : "Underground"],
      ["Diesel consumption (liters)", formValues.diesel],
      ["Electricity consumption (kWh)", formValues.electricity],
      ["Explosives used (tons)", formValues.explosives],
      ["Production (tons)", formValues.production],
      ["Target intensity (tCO2/ton)", formValues.targetIntensity],
      ["Offset method", formValues.offsetMode],
      ["Industry benchmark (tCO2/ton)", industryBenchmarks[formValues.mineType]],
      ["Total emissions (kg CO2)", results.totalEmissions.toFixed(2)],
      ["Diesel emissions (kg CO2)", results.emissionBreakdown.diesel.toFixed(2)],
      ["Electricity emissions (kg CO2)", results.emissionBreakdown.electricity.toFixed(2)],
      ["Explosives emissions (kg CO2)", results.emissionBreakdown.explosives.toFixed(2)],
      ["Emission intensity (tCO2/ton)", results.emissionIntensity.toFixed(3)],
      ["Carbon credits earned (tons)", results.carbonCredits.toFixed(2)],
      ["Credit value (₹)", results.creditValue.toFixed(2)],
      ["Trees required for offset", results.treesRequired],
      ["Solar panels required for offset", results.solarPanelsRequired],
      ["Emissions after offset (kg CO2)", results.emissionsAfterOffset.toFixed(2)],
      ["Reduction percentage (%)", results.reductionPercentage.toFixed(2)],
      ["Benchmark comparison (%)", ((results.emissionIntensity / industryBenchmarks[formValues.mineType]) * 100).toFixed(1)],
    ];

    // Add recommendations
    if (results.recommendations) {
      rows.push(["", ""]);
      rows.push(["RECOMMENDATIONS", ""]);
      
      Object.entries(results.recommendations).forEach(([category, recs]) => {
        rows.push([`${category.toUpperCase()} RECOMMENDATIONS`, ""]);
        recs.forEach((rec, index) => {
          rows.push([`${index + 1}. ${rec}`, ""]);
        });
      });
    }

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `emission_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  }

  function getComparisonData() {
    if (!results) return [];
    
    const mineType = form.getValues("mineType");
    const benchmark = industryBenchmarks[mineType];
    
    return [
      { name: "Your Mine", value: results.emissionIntensity },
      { name: `Industry Avg (${mineType === "openCast" ? "Open Cast" : "Underground"})`, value: benchmark },
    ];
  }

  function getOffsetComparisonData() {
    if (!results) return [];
    
    return [
      { name: "Without Offset", value: results.totalEmissions / 1000 },
      { name: "With Trees", value: Math.max(0, results.totalEmissions - results.treesRequired * 25) / 1000 },
      { name: "With Solar", value: Math.max(0, results.totalEmissions - results.solarPanelsRequired * 250) / 1000 },
      { name: "With Combined", value: results.emissionsAfterOffset / 1000 },
    ];
  }

  function getRadarData() {
    if (!results) return [];
    
    const mineType = form.getValues("mineType");
    const benchmark = industryBenchmarks[mineType];
    
    return [
      {
        subject: "Emission Intensity",
        A: (results.emissionIntensity / benchmark) * 100,
        fullMark: 150,
      },
      {
        subject: "Carbon Credits",
        A: results.carbonCredits > 0 ? 100 : 50,
        fullMark: 150,
      },
      {
        subject: "Offset Effectiveness",
        A: results.reductionPercentage,
        fullMark: 150,
      },
      {
        subject: "Diesel Efficiency",
        A: 100 - ((results.emissionBreakdown.diesel / results.totalEmissions) * 100),
        fullMark: 150,
      },
      {
        subject: "Electricity Efficiency",
        A: 100 - ((results.emissionBreakdown.electricity / results.totalEmissions) * 100),
        fullMark: 150,
      },
    ];
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-4">Coal Mining Emissions Calculator</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Input Form */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Input Parameters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="mineType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mine Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select mine type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="openCast">Open Cast</SelectItem>
                          <SelectItem value="underground">Underground</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="diesel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diesel Consumption (liters)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="electricity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Electricity Consumption (kWh)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="explosives"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Explosives Used (tons)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="production"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Production (tons)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="targetIntensity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Emission Intensity (tCO₂/ton)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="offsetMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Offset Method</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select offset method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="trees">Tree Planting</SelectItem>
                          <SelectItem value="solar">Solar Panels</SelectItem>
                          <SelectItem value="combined">Combined Approach</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full">Calculate Emissions</Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Results Panel */}
        {results && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Emission Results</span>
                <Button onClick={exportToCSV} size="sm" className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="charts">Visualizations</TabsTrigger>
                  <TabsTrigger value="offsets">Offsets</TabsTrigger>
                  <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                </TabsList>
                
                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">Emission Summary</h3>
                      <div className="space-y-2">
                        <div>
                          <div className="text-sm text-gray-500">Total Emissions</div>
                          <div className="text-2xl font-bold">{formatNumber(results.totalEmissions.toFixed(0))} kg CO₂</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Emission Intensity</div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold">{results.emissionIntensity.toFixed(3)} tCO₂/ton</span>
                            <Badge 
                              className={results.emissionIntensity <= form.getValues("targetIntensity") ? "bg-green-500" : "bg-red-500"}
                            >
                              {results.emissionIntensity <= form.getValues("targetIntensity") ? "Within Target" : "Above Target"}
                            </Badge>
                          </div>
                          <div className="mt-2">
                            <div className="text-xs text-gray-500 flex justify-between">
                              <span>0</span>
                              <span>Target: {form.getValues("targetIntensity")}</span>
                              <span>{(form.getValues("targetIntensity") * 2).toFixed(2)}</span>
                            </div>
                            <Progress 
                              value={(results.emissionIntensity / (form.getValues("targetIntensity") * 2)) * 100} 
                              className={getProgressColor(results.emissionIntensity, form.getValues("targetIntensity"))}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">Carbon Credits</h3>
                      <div className="space-y-2">
                        <div>
                          <div className="text-sm text-gray-500">Credits Earned</div>
                          <div className="text-2xl font-bold">{results.carbonCredits.toFixed(2)} tons</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Market Value</div>
                          <div className="text-2xl font-bold">₹ {formatNumber(results.creditValue.toFixed(0))}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="p-4 bg-gray-50 rounded-lg flex flex-col items-center">
                      <div className="text-sm text-gray-500">Diesel</div>
                      <div className="text-xl font-bold">{formatNumber(results.emissionBreakdown.diesel.toFixed(0))} kg</div>
                      <div className="text-xs text-gray-500">{(results.emissionBreakdown.diesel / results.totalEmissions * 100).toFixed(1)}%</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg flex flex-col items-center">
                      <div className="text-sm text-gray-500">Electricity</div>
                      <div className="text-xl font-bold">{formatNumber(results.emissionBreakdown.electricity.toFixed(0))} kg</div>
                      <div className="text-xs text-gray-500">{(results.emissionBreakdown.electricity / results.totalEmissions * 100).toFixed(1)}%</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg flex flex-col items-center">
                      <div className="text-sm text-gray-500">Explosives</div>
                      <div className="text-xl font-bold">{formatNumber(results.emissionBreakdown.explosives.toFixed(0))} kg</div>
                      <div className="text-xs text-gray-500">{(results.emissionBreakdown.explosives / results.totalEmissions * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Industry Benchmark Comparison</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="text-sm text-gray-500">
                          Your mine vs {form.getValues("mineType") === "openCast" ? "Open Cast" : "Underground"} Average
                        </div>
                        <Progress 
                          value={(results.emissionIntensity / industryBenchmarks[form.getValues("mineType")]) * 100}
                          className={
                            results.emissionIntensity <= industryBenchmarks[form.getValues("mineType")] * 0.8
                              ? "bg-green-500"
                              : results.emissionIntensity <= industryBenchmarks[form.getValues("mineType")]
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }
                        />
                      </div>
                      <div className="text-xl font-bold">
                        {((results.emissionIntensity / industryBenchmarks[form.getValues("mineType")]) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Charts Tab */}
                <TabsContent value="charts">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-lg mb-2 flex items-center">
                        <PieChartIcon className="w-4 h-4 mr-2" />
                        Emission Source Breakdown
                      </h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={results.pieChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {results.pieChartData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${formatNumber(value.toFixed(2))} kg CO₂`, null]} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-lg mb-2 flex items-center">
                        <BarChartIcon className="w-4 h-4 mr-2" />
                        Industry Benchmark Comparison
                      </h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={getComparisonData()}>
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value.toFixed(3)} tCO₂/ton`, null]} />
                          <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-lg mb-2 flex items-center">
                        <BarChartIcon className="w-4 h-4 mr-2" />
                        Performance Radar
                      </h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <RadarChart data={getRadarData()}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" />
                          <PolarRadiusAxis angle={30} domain={[0, 150]} />
                          <Radar name="Performance" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Offsets Tab */}
                <TabsContent value="offsets" className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6 mb-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-lg mb-2 flex items-center">
                        <TreePine className="w-5 h-5 mr-2" />
                        Tree Planting Offset
                      </h3>
                      <div className="text-3xl font-bold">{formatNumber(results.treesRequired)} trees</div>
                      <div className="text-sm text-gray-500">Would offset {formatNumber((results.treesRequired * 25).toFixed(0))} kg CO₂ per year</div>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Current emissions</span>
                          <span>After offset</span>
                        </div>
                        <Progress 
                          value={(1 - (Math.max(0, results.totalEmissions - results.treesRequired * 25) / results.totalEmissions)) * 100}
                          className="bg-green-500"
                        />
                        <div className="mt-1 text-sm">
                          Reduction: {(100 - (Math.max(0, results.totalEmissions - results.treesRequired * 25) / results.totalEmissions * 100)).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-lg mb-2 flex items-center">
                        <PanelTop className="w-5 h-5 mr-2" />
                        Solar Panel Offset
                      </h3>
                      <div className="text-3xl font-bold">{formatNumber(results.solarPanelsRequired)} panels</div>
                      <div className="text-sm text-gray-500">Would offset {formatNumber((results.solarPanelsRequired * 250).toFixed(0))} kg CO₂ per year</div>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Current emissions</span>
                          <span>After offset</span>
                        </div>
                        <Progress 
                          value={(1 - (Math.max(0, results.totalEmissions - results.solarPanelsRequired * 250) / results.totalEmissions)) * 100}
                          className="bg-blue-500"
                        />
                        <div className="mt-1 text-sm">
                          Reduction: {(100 - (Math.max(0, results.totalEmissions - results.solarPanelsRequired * 250) / results.totalEmissions * 100)).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Offset Method Comparison</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={getOffsetComparisonData()}>
                        <XAxis dataKey="name" />
                        <YAxis label={{ value: 'Emissions (tCO₂)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip formatter={(value) => [`${value.toFixed(2)} tCO₂`, null]} />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                    
                    <div className="mt-4 p-3 border rounded-lg bg-blue-50 text-blue-800">
                      <h4 className="font-semibold">Selected Method: {form.getValues("offsetMode").charAt(0).toUpperCase() + form.getValues("offsetMode").slice(1)}</h4>
                      <p className="text-sm mt-1">
                        With this method, your emissions would be reduced by {results.reductionPercentage.toFixed(1)}%, 
                        resulting in {formatNumber(results.emissionsAfterOffset.toFixed(0))} kg CO₂ after offset.
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Recommendations Tab */}
                <TabsContent value="recommendations">
                  {results.recommendations && (
                    <div className="space-y-4">
                      {Object.entries(results.recommendations).map(([category, recs]) => (
                        <div key={category} className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="font-semibold text-lg mb-2 capitalize">{category} Recommendations</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {recs.map((rec, index) => (
                              <li key={index} className="text-sm">{rec}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold text-lg mb-2">Carbon Credit Strategy</h3>
                        <p className="text-sm">
                          {results.isEligibleForCredits 
                            ? `Your operation is eligible for ${results.carbonCredits.toFixed(2)} tons of carbon credits, 
                               worth approximately ₹${formatNumber(results.creditValue.toFixed(0))}. Consider registering with 
                               recognized carbon credit programs to monetize these credits.`
                            : `Your operation currently exceeds the target intensity of ${form.getValues("targetIntensity")} tCO₂/ton. 
                               Implementing the recommendations above could help bring your emissions below the threshold and qualify for carbon credits.`
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}