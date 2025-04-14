"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CompliancesPage: React.FC = () => {
  // State for self-check inputs
  const [zone, setZone] = useState<'industrial' | 'residential'>('industrial');
  const [waterDischarge, setWaterDischarge] = useState<'surface' | 'sewer'>('surface');
  const [inputs, setInputs] = useState({
    spm: '',
    pm10: '',
    no2: '',
    so2: '',
    ph: '',
    tss: '',
    oilGrease: '',
    cod: '',
    bod: ''
  });
  
  // State for ESG estimator
  const [esgEnvironmental, setEsgEnvironmental] = useState<'high' | 'medium' | 'low' | ''>('');
  const [esgGovernance, setEsgGovernance] = useState<'high' | 'medium' | 'low' | ''>('');
  
  // State to track if compliance check was performed
  const [checkedCompliance, setCheckedCompliance] = useState(false);
  
  // Limits based on standards
  const limits = {
    air: {
      industrial: {
        spm: 500,
        pm10: 150,
        no2: 80,
        so2: 80
      },
      residential: {
        spm: 200,
        pm10: 100,
        no2: 60,
        so2: 60
      }
    },
    water: {
      ph: { min: 6.5, max: 8.5 },
      tss: { surface: 100, sewer: 200 },
      oilGrease: 10,
      cod: 250,
      bod: { surface: 30, sewer: 350 }
    }
  };
  
  // Calculate compliance status
  const calculateCompliance = () => {
    const complianceStatus = {
      spm: Number(inputs.spm) <= limits.air[zone].spm,
      pm10: Number(inputs.pm10) <= limits.air[zone].pm10,
      no2: Number(inputs.no2) <= limits.air[zone].no2,
      so2: Number(inputs.so2) <= limits.air[zone].so2,
      ph: Number(inputs.ph) >= limits.water.ph.min && Number(inputs.ph) <= limits.water.ph.max,
      tss: Number(inputs.tss) <= limits.water.tss[waterDischarge],
      oilGrease: Number(inputs.oilGrease) <= limits.water.oilGrease,
      cod: Number(inputs.cod) <= limits.water.cod,
      bod: Number(inputs.bod) <= limits.water.bod[waterDischarge]
    };
    
    // Calculate overall compliance
    const complianceValues = Object.values(complianceStatus);
    const compliantCount = complianceValues.filter(Boolean).length;
    const totalChecks = complianceValues.length;
    
    let overallStatus = "Compliant";
    if (compliantCount === 0) {
      overallStatus = "Non-Compliant";
    } else if (compliantCount < totalChecks) {
      overallStatus = "Partially Compliant";
    }
    
    return { statuses: complianceStatus, overall: overallStatus };
  };
  
  // ESG score calculator
  const calculateEsgScore = () => {
    if (!esgEnvironmental || !esgGovernance) return '';
    
    const scores = {
      high: 3,
      medium: 2,
      low: 1
    };
    
    const environmentalScore = scores[esgEnvironmental];
    const governanceScore = scores[esgGovernance];
    const totalScore = environmentalScore + governanceScore;
    
    if (totalScore >= 5) return "Excellent";
    if (totalScore >= 3) return "Moderate";
    return "Needs Improvement";
  };
  
  // Status badge component
  const StatusBadge = ({ status }: { status: boolean }) => {
    return status ? 
      <Badge className="bg-green-500 hover:bg-green-600">Compliant ✅</Badge> : 
      <Badge className="bg-red-500 hover:bg-red-600">Non-compliant ❌</Badge>;
  };
  
  // ESG status badge
  const EsgStatusBadge = ({ score }: { score: string }) => {
    if (!score) return null;
    
    if (score === "Excellent") {
      return <Badge className="bg-green-500 hover:bg-green-600">🟢 Excellent</Badge>;
    }
    if (score === "Moderate") {
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">🟡 Moderate</Badge>;
    }
    return <Badge className="bg-red-500 hover:bg-red-600">🔴 Needs Improvement</Badge>;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckedCompliance(true);
  };
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };
  
  const compliance = calculateCompliance();
  const esgScore = calculateEsgScore();
  
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Compliance & Environmental Standards</h1>

      <Tabs defaultValue="standards">
        <TabsList className="mb-4">
          <TabsTrigger value="standards">Standards</TabsTrigger>
          <TabsTrigger value="self-check">Self-Check System</TabsTrigger>
        </TabsList>
        
        <TabsContent value="standards" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Air Quality Standards</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border px-4 py-2 text-left">Pollutant</th>
                    <th className="border px-4 py-2 text-left">Industrial Area Limit</th>
                    <th className="border px-4 py-2 text-left">Residential Area Limit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">SPM</td>
                    <td className="border px-4 py-2">500 µg/m³</td>
                    <td className="border px-4 py-2">200 µg/m³</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">PM10</td>
                    <td className="border px-4 py-2">150 µg/m³</td>
                    <td className="border px-4 py-2">100 µg/m³</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">NO₂</td>
                    <td className="border px-4 py-2">80 µg/m³</td>
                    <td className="border px-4 py-2">60 µg/m³</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">SO₂</td>
                    <td className="border px-4 py-2">80 µg/m³</td>
                    <td className="border px-4 py-2">60 µg/m³</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Water Quality Standards</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border px-4 py-2 text-left">Parameter</th>
                    <th className="border px-4 py-2 text-left">Standard</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">pH</td>
                    <td className="border px-4 py-2">6.5 to 8.5</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">TSS</td>
                    <td className="border px-4 py-2">100 mg/L (surface), 200 mg/L (sewer)</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Oil & Grease</td>
                    <td className="border px-4 py-2">≤ 10 mg/L</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">COD</td>
                    <td className="border px-4 py-2">≤ 250 mg/L</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">BOD</td>
                    <td className="border px-4 py-2">≤ 30 mg/L (surface), 350 mg/L (sewer)</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emission Compliance & Policy Context</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                India does not enforce a direct carbon emission cap for mining operations. 
                However, under the Carbon Credit Trading Scheme (CCTS, 2023), entities are expected 
                to meet emission intensity targets (e.g., tCO₂/ton of output). Surplus reductions 
                may earn Carbon Credit Certificates (CCCs); shortfalls require purchases.
              </p>
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Reference Links:</h3>
                <ul className="list-disc pl-5">
                  <li><a href="https://pib.gov.in/PressReleasePage.aspx?PRID=2082528" className="text-blue-600 hover:underline">MoEFCC CCTS Press Release</a></li>
                  <li><a href="https://beeindia.gov.in/content/pat-scheme" className="text-blue-600 hover:underline">BEE PAT Scheme Overview</a></li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ESG Framework Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-2">Environmental Impact and Regulation:</h3>
              <ul className="list-disc pl-5 mb-4">
                <li>Climate Change Mitigation: Coal mining is closely associated with high carbon emissions and environmental degradation. A strong environmental score reflects a coal mine's efforts to reduce its carbon footprint, manage waste, and mitigate its impact on ecosystems.</li>
                <li>Regulatory Compliance: Coal mines operate under stringent environmental regulations. A high ESG score indicates compliance with these regulations, reducing the risk of fines, penalties, or operational shutdowns due to environmental violations.</li>
              </ul>

              <h3 className="font-semibold mb-2">Governance and Transparency:</h3>
              <ul className="list-disc pl-5 mb-4">
                <li>Ethical Management: Good governance practices in coal mines include transparency, accountability, and ethical management. A high governance score signals that the company has robust policies in place to prevent corruption, ensure compliance with laws, and manage risks effectively.</li>
                <li>Investor Confidence: Strong governance is critical for maintaining investor confidence. Investors are increasingly focused on ESG factors when making decisions, and poor governance can lead to a loss of investor trust and capital.</li>
              </ul>

              <div className="mt-6 p-4 bg-gray-100 rounded-md">
                <h3 className="font-semibold mb-2">ESG Score Estimator:</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Environmental:</label>
                    <Select onValueChange={(value: 'high' | 'medium' | 'low') => setEsgEnvironmental(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Governance:</label>
                    <Select onValueChange={(value: 'high' | 'medium' | 'low') => setEsgGovernance(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {esgScore && (
                  <div className="mt-4">
                    <div className="font-medium">Overall ESG Status:</div>
                    <div className="mt-1"><EsgStatusBadge score={esgScore} /></div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="self-check" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>🧪 Self-Check System</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Operation Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Zone Type:</label>
                        <Select defaultValue="industrial" onValueChange={(value: 'industrial' | 'residential') => setZone(value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select zone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="industrial">Industrial</SelectItem>
                            <SelectItem value="residential">Residential/Rural</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Water Discharge Type:</label>
                        <Select defaultValue="surface" onValueChange={(value: 'surface' | 'sewer') => setWaterDischarge(value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select discharge type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="surface">Inland Surface Water</SelectItem>
                            <SelectItem value="sewer">Public Sewers</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Air Quality Measurements</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">SPM (µg/m³):</label>
                        <Input 
                          type="number" 
                          name="spm" 
                          value={inputs.spm} 
                          onChange={handleInputChange} 
                          placeholder={`Limit: ${limits.air[zone].spm} µg/m³`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">PM10 (µg/m³):</label>
                        <Input 
                          type="number" 
                          name="pm10" 
                          value={inputs.pm10} 
                          onChange={handleInputChange}
                          placeholder={`Limit: ${limits.air[zone].pm10} µg/m³`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">NO₂ (µg/m³):</label>
                        <Input 
                          type="number" 
                          name="no2" 
                          value={inputs.no2} 
                          onChange={handleInputChange}
                          placeholder={`Limit: ${limits.air[zone].no2} µg/m³`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">SO₂ (µg/m³):</label>
                        <Input 
                          type="number" 
                          name="so2" 
                          value={inputs.so2} 
                          onChange={handleInputChange}
                          placeholder={`Limit: ${limits.air[zone].so2} µg/m³`}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Water Quality Measurements</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">pH:</label>
                        <Input 
                          type="number" 
                          name="ph" 
                          value={inputs.ph} 
                          onChange={handleInputChange}
                          placeholder="Limit: 6.5 to 8.5"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">TSS (mg/L):</label>
                        <Input 
                          type="number" 
                          name="tss" 
                          value={inputs.tss} 
                          onChange={handleInputChange}
                          placeholder={`Limit: ${limits.water.tss[waterDischarge]} mg/L`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Oil & Grease (mg/L):</label>
                        <Input 
                          type="number" 
                          name="oilGrease" 
                          value={inputs.oilGrease} 
                          onChange={handleInputChange}
                          placeholder="Limit: 10 mg/L"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Additional Water Parameters</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">COD (mg/L):</label>
                        <Input 
                          type="number" 
                          name="cod" 
                          value={inputs.cod} 
                          onChange={handleInputChange}
                          placeholder="Limit: 250 mg/L"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">BOD (mg/L):</label>
                        <Input 
                          type="number" 
                          name="bod" 
                          value={inputs.bod} 
                          onChange={handleInputChange}
                          placeholder={`Limit: ${limits.water.bod[waterDischarge]} mg/L`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button type="submit" className="w-full mt-4">Check Compliance Status</Button>
              </form>
            </CardContent>
          </Card>
          
          {checkedCompliance && (
            <Card>
              <CardHeader>
                <CardTitle>Compliance Summary Panel</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border px-4 py-2 text-left">Metric</th>
                      <th className="border px-4 py-2 text-left">Value</th>
                      <th className="border px-4 py-2 text-left">Limit</th>
                      <th className="border px-4 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inputs.spm && (
                      <tr>
                        <td className="border px-4 py-2">SPM</td>
                        <td className="border px-4 py-2">{inputs.spm} µg/m³</td>
                        <td className="border px-4 py-2">{limits.air[zone].spm} µg/m³</td>
                        <td className="border px-4 py-2"><StatusBadge status={compliance.statuses.spm} /></td>
                      </tr>
                    )}
                    {inputs.pm10 && (
                      <tr>
                        <td className="border px-4 py-2">PM10</td>
                        <td className="border px-4 py-2">{inputs.pm10} µg/m³</td>
                        <td className="border px-4 py-2">{limits.air[zone].pm10} µg/m³</td>
                        <td className="border px-4 py-2"><StatusBadge status={compliance.statuses.pm10} /></td>
                      </tr>
                    )}
                    {inputs.no2 && (
                      <tr>
                        <td className="border px-4 py-2">NO₂</td>
                        <td className="border px-4 py-2">{inputs.no2} µg/m³</td>
                        <td className="border px-4 py-2">{limits.air[zone].no2} µg/m³</td>
                        <td className="border px-4 py-2"><StatusBadge status={compliance.statuses.no2} /></td>
                      </tr>
                    )}
                    {inputs.so2 && (
                      <tr>
                        <td className="border px-4 py-2">SO₂</td>
                        <td className="border px-4 py-2">{inputs.so2} µg/m³</td>
                        <td className="border px-4 py-2">{limits.air[zone].so2} µg/m³</td>
                        <td className="border px-4 py-2"><StatusBadge status={compliance.statuses.so2} /></td>
                      </tr>
                    )}
                    {inputs.ph && (
                      <tr>
                        <td className="border px-4 py-2">pH</td>
                        <td className="border px-4 py-2">{inputs.ph}</td>
                        <td className="border px-4 py-2">6.5 to 8.5</td>
                        <td className="border px-4 py-2"><StatusBadge status={compliance.statuses.ph} /></td>
                      </tr>
                    )}
                    {inputs.tss && (
                      <tr>
                        <td className="border px-4 py-2">TSS</td>
                        <td className="border px-4 py-2">{inputs.tss} mg/L</td>
                        <td className="border px-4 py-2">{limits.water.tss[waterDischarge]} mg/L</td>
                        <td className="border px-4 py-2"><StatusBadge status={compliance.statuses.tss} /></td>
                      </tr>
                    )}
                    {inputs.oilGrease && (
                      <tr>
                        <td className="border px-4 py-2">Oil & Grease</td>
                        <td className="border px-4 py-2">{inputs.oilGrease} mg/L</td>
                        <td className="border px-4 py-2">10 mg/L</td>
                        <td className="border px-4 py-2"><StatusBadge status={compliance.statuses.oilGrease} /></td>
                      </tr>
                    )}
                    {inputs.cod && (
                      <tr>
                        <td className="border px-4 py-2">COD</td>
                        <td className="border px-4 py-2">{inputs.cod} mg/L</td>
                        <td className="border px-4 py-2">250 mg/L</td>
                        <td className="border px-4 py-2"><StatusBadge status={compliance.statuses.cod} /></td>
                      </tr>
                    )}
                    {inputs.bod && (
                      <tr>
                        <td className="border px-4 py-2">BOD</td>
                        <td className="border px-4 py-2">{inputs.bod} mg/L</td>
                        <td className="border px-4 py-2">{limits.water.bod[waterDischarge]} mg/L</td>
                        <td className="border px-4 py-2"><StatusBadge status={compliance.statuses.bod} /></td>
                      </tr>
                    )}
                  </tbody>
                </table>
                
                <div className="mt-6 flex items-center">
                  <span className="font-medium mr-2">Overall Compliance Status:</span>
                  <Badge 
                    className={`
                      ${compliance.overall === 'Compliant' ? 'bg-green-500 hover:bg-green-600' : 
                      compliance.overall === 'Partially Compliant' ? 'bg-yellow-500 hover:bg-yellow-600' : 
                      'bg-red-500 hover:bg-red-600'}
                    `}
                  >
                    {compliance.overall}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Source & Policy Reference Panel</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-medium mb-2">📚 Based on:</p>
          <ul className="list-disc pl-5">
            <li>CPCB National Ambient Air Quality Standards (2009)</li>
            <li>Environmental Protection Rules, 1986</li>
            <li>Water (Prevention and Control of Pollution) Act, 1974</li>
            <li>CCTS 2023 (MoEFCC)</li>
            <li>ESG frameworks (SEBI + MoEFCC NAPCC)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompliancesPage;