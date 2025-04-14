/**
 * Emission factors for different mining activities (kg CO2 per unit)
 */
export const emissionFactors = {
    diesel: 2.6, // kg CO2 per liter
    electricity: 0.716, // kg CO2 per kWh
    explosives: 170, // kg CO2 per ton of ANFO
  };
  
  /**
   * Carbon offset rates
   */
  export const carbonOffsets = {
    treePlanting: 25, // kg CO2 absorbed per tree per year
    solarPanels: 250, // kg CO2 offset per solar panel per year
  };
  
  /**
   * Industry benchmarks for emission intensity
   */
  export const industryBenchmarks = {
    openCast: 0.45, // tCO2/ton
    underground: 0.60, // tCO2/ton
  };
  
  /**
   * Carbon market rates
   */
  export const carbonMarketRates = {
    creditPrice: 300, // ₹ per tonne CO2
  };
  
  /**
   * Input data interface for emission calculations
   */
  export interface EmissionInputData {
    diesel: number;
    electricity: number;
    explosives: number;
    production: number;
    targetIntensity: number;
    offsetMode: 'trees' | 'solar' | 'combined';
  }
  
  /**
   * Results interface for emission calculations
   */
  export interface EmissionResults {
    totalEmissions: number;
    emissionBreakdown: {
      diesel: number;
      electricity: number;
      explosives: number;
    };
    emissionIntensity: number;
    isEligibleForCredits: boolean;
    carbonCredits: number;
    creditValue: number;
    treesRequired: number;
    solarPanelsRequired: number;
    emissionsAfterOffset: number;
    reductionPercentage: number;
    pieChartData: { name: string; value: number }[];
    trendData: { name: string; value: number }[];
  }
  
  /**
   * Calculate emissions and related metrics based on input data
   * @param data Input data containing activity metrics
   * @returns Complete emission calculation results
   */
  export function calculateEmissions(data: EmissionInputData): EmissionResults {
    // Calculate emissions for each source
    const dieselEmissions = data.diesel * emissionFactors.diesel;
    const electricityEmissions = data.electricity * emissionFactors.electricity;
    const explosivesEmissions = data.explosives * emissionFactors.explosives;
    
    const totalEmissions = dieselEmissions + electricityEmissions + explosivesEmissions;
    
    // Calculate emission intensity (tCO2/ton of coal)
    const emissionIntensity = totalEmissions / data.production / 1000; // Convert kg to tonnes
    
    // Calculate carbon credits
    const targetIntensity = data.targetIntensity;
    const isEligibleForCredits = emissionIntensity < targetIntensity;
    const carbonCredits = isEligibleForCredits ? 
      (targetIntensity - emissionIntensity) * data.production : 0;
    const creditValue = carbonCredits * carbonMarketRates.creditPrice;
    
    // Calculate offset requirements
    const treesRequired = Math.ceil(totalEmissions / carbonOffsets.treePlanting);
    const solarPanelsRequired = Math.ceil(totalEmissions / carbonOffsets.solarPanels);
    
    // Calculate emissions after offset based on selected mode
    let emissionsAfterOffset = totalEmissions;
    if (data.offsetMode === "trees") {
      emissionsAfterOffset = Math.max(0, totalEmissions - (treesRequired * carbonOffsets.treePlanting));
    } else if (data.offsetMode === "solar") {
      emissionsAfterOffset = Math.max(0, totalEmissions - (solarPanelsRequired * carbonOffsets.solarPanels));
    } else if (data.offsetMode === "combined") {
      const combinedOffset = (treesRequired * carbonOffsets.treePlanting / 2) + 
                           (solarPanelsRequired * carbonOffsets.solarPanels / 2);
      emissionsAfterOffset = Math.max(0, totalEmissions - combinedOffset);
    }
    
    const reductionPercentage = ((totalEmissions - emissionsAfterOffset) / totalEmissions) * 100;
    
    // Prepare chart data
    const pieChartData = [
      { name: 'Diesel', value: dieselEmissions },
      { name: 'Electricity', value: electricityEmissions },
      { name: 'Explosives', value: explosivesEmissions },
    ];
    
    const trendData = [
      { name: 'Total Emissions', value: totalEmissions },
      { name: 'After Offset', value: emissionsAfterOffset },
    ];
    
    return {
      totalEmissions,
      emissionBreakdown: {
        diesel: dieselEmissions,
        electricity: electricityEmissions,
        explosives: explosivesEmissions,
      },
      emissionIntensity,
      isEligibleForCredits,
      carbonCredits,
      creditValue,
      treesRequired,
      solarPanelsRequired,
      emissionsAfterOffset,
      reductionPercentage,
      pieChartData,
      trendData
    };
  }
  
  /**
   * Calculate the carbon offsets based on different strategies
   * @param totalEmissions Total emissions in kg CO2
   * @param strategy Offset strategy to use
   * @returns Amount of CO2 offset in kg
   */
  export function calculateOffsets(totalEmissions: number, strategy: 'trees' | 'solar' | 'combined'): number {
    const treesRequired = Math.ceil(totalEmissions / carbonOffsets.treePlanting);
    const solarPanelsRequired = Math.ceil(totalEmissions / carbonOffsets.solarPanels);
    
    let offsetAmount = 0;
    
    switch (strategy) {
      case 'trees':
        offsetAmount = treesRequired * carbonOffsets.treePlanting;
        break;
      case 'solar':
        offsetAmount = solarPanelsRequired * carbonOffsets.solarPanels;
        break;
      case 'combined':
        offsetAmount = (treesRequired * carbonOffsets.treePlanting / 2) + 
                     (solarPanelsRequired * carbonOffsets.solarPanels / 2);
        break;
    }
    
    return Math.min(offsetAmount, totalEmissions); // Can't offset more than total emissions
  }
  
  /**
   * Generate recommendations based on emission breakdown
   * @param emissionBreakdown Breakdown of emissions by source
   * @returns Array of recommendations
   */
  export function generateRecommendations(emissionBreakdown: Record<string, number>): Record<string, string[]> {
    const totalEmissions = Object.values(emissionBreakdown).reduce((sum, val) => sum + val, 0);
    const recommendations: Record<string, string[]> = {};
    
    // Diesel recommendations
    if (emissionBreakdown.diesel / totalEmissions > 0.4) {
      recommendations.diesel = [
        "Implement fleet management systems for optimized routes",
        "Consider electric or hybrid vehicles where feasible",
        "Train operators on fuel-efficient driving techniques",
        "Regular maintenance of equipment to ensure optimal efficiency"
      ];
    } else {
      recommendations.diesel = [
        "Maintain current diesel efficiency practices",
        "Regular equipment maintenance",
        "Optimize hauling routes"
      ];
    }
    
    // Electricity recommendations
    if (emissionBreakdown.electricity / totalEmissions > 0.3) {
      recommendations.electricity = [
        "Conduct energy audit to identify efficiency opportunities",
        "Install smart meters and energy management systems",
        "Implement variable frequency drives on major equipment",
        "Consider on-site renewable energy generation"
      ];
    } else {
      recommendations.electricity = [
        "Install energy-efficient lighting systems",
        "Implement automatic shutdown procedures for idle equipment",
        "Regular maintenance of electrical systems"
      ];
    }
    
    // Explosives recommendations
    if (emissionBreakdown.explosives / totalEmissions > 0.2) {
      recommendations.explosives = [
        "Review blast design to optimize explosives usage",
        "Implement electronic detonation systems for precise control",
        "Investigate lower-carbon explosive alternatives",
        "Train teams on efficient blasting techniques"
      ];
    } else {
      recommendations.explosives = [
        "Maintain current explosives management practices",
        "Optimize blast design",
        "Improve fragmentation efficiency"
      ];
    }
    
    return recommendations;
  }