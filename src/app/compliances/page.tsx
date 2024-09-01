"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CompliancesPage: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Compliances</h1>

      <Card>
        <CardHeader>
          <CardTitle>Air Quality Standards</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold mb-2">Suspended Particulate Matter (SPM):</h3>
          <ul className="list-disc pl-5 mb-4">
            <li>Industrial Areas: 500 µg/m³ (24-hour average)</li>
            <li>Residential/Rural/Other Areas: 200 µg/m³ (24-hour average)</li>
          </ul>

          <h3 className="font-semibold mb-2">Respirable Suspended Particulate Matter (RSPM or PM10):</h3>
          <ul className="list-disc pl-5 mb-4">
            <li>Industrial Areas: 150 µg/m³ (24-hour average)</li>
            <li>Residential/Rural/Other Areas: 100 µg/m³ (24-hour average)</li>
          </ul>

          <h3 className="font-semibold mb-2">Nitrogen Dioxide (NO2):</h3>
          <ul className="list-disc pl-5 mb-4">
            <li>Industrial Areas: 80 µg/m³ (24-hour average)</li>
            <li>Residential/Rural/Other Areas: 60 µg/m³ (24-hour average)</li>
          </ul>

          <h3 className="font-semibold mb-2">Sulfur Dioxide (SO2):</h3>
          <ul className="list-disc pl-5 mb-4">
            <li>Industrial Areas: 80 µg/m³ (24-hour average)</li>
            <li>Residential/Rural/Other Areas: 60 µg/m³ (24-hour average)</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Water Quality Standards</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>pH: 6.5 to 8.5</li>
            <li>
              Total Suspended Solids (TSS):
              <ul className="list-circle pl-5 mt-1">
                <li>Effluent Discharge: 100 mg/L (inland surface water), 200 mg/L (public sewers)</li>
              </ul>
            </li>
            <li>Oil and Grease: 10 mg/L</li>
            <li>
              Chemical Oxygen Demand (COD):
              <ul className="list-circle pl-5 mt-1">
                <li>Effluent Discharge: 250 mg/L</li>
              </ul>
            </li>
            <li>
              Biochemical Oxygen Demand (BOD):
              <ul className="list-circle pl-5 mt-1">
                <li>Effluent Discharge: 30 mg/L (inland surface water), 350 mg/L (public sewers)</li>
              </ul>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Specific Emission Limits</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            There is no specific threshold for carbon emissions, but operations are expected to align with 
            National Action Plan on Climate Change (NAPCC) and adopt clean technologies to reduce emissions.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ESG</CardTitle>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default CompliancesPage;