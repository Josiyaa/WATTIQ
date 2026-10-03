import { useState, useEffect, useCallback } from 'react';
import { 
  Appliance, 
  TariffSchedule, 
  SolarSystemState, 
  AIInsight, 
  TelemetryPoint, 
  SimulationParams 
} from '../types/energy';
import { 
  INITIAL_APPLIANCES, 
  DEFAULT_TARIFF, 
  DEFAULT_SOLAR_STATE, 
  INITIAL_AI_INSIGHTS,
  GENERATE_HOURLY_HISTORY,
  GENERATE_DAILY_HISTORY,
  GENERATE_MONTHLY_HISTORY
} from '../utils/mockData';
import {
  fetchAppliances,
  toggleApplianceApi,
  addApplianceApi,
  deleteApplianceApi,
  fetchTelemetryApi
} from '../services/api';


export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
}

export function useEnergyData() {
  const [appliances, setAppliances] = useState<Appliance[]>(() => {
    const saved = localStorage.getItem('volt_appliances');
    return saved ? JSON.parse(saved) : INITIAL_APPLIANCES;
  });

  const [tariff, setTariff] = useState<TariffSchedule>(() => {
    const saved = localStorage.getItem('volt_tariff');
    return saved ? JSON.parse(saved) : DEFAULT_TARIFF;
  });

  const [solarState, setSolarState] = useState<SolarSystemState>(() => {
    const saved = localStorage.getItem('volt_solar');
    return saved ? JSON.parse(saved) : DEFAULT_SOLAR_STATE;
  });

  const [aiInsights, setAiInsights] = useState<AIInsight[]>(INITIAL_AI_INSIGHTS);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(3000); // 3 seconds live pulse
  const [isLiveTelemetryActive, setIsLiveTelemetryActive] = useState<boolean>(true);

  // Historical Datasets
  const [hourlyData] = useState(GENERATE_HOURLY_HISTORY);
  const [dailyData] = useState(GENERATE_DAILY_HISTORY);
  const [monthlyData] = useState(GENERATE_MONTHLY_HISTORY);

  // Simulation scenario state
  const [simParams, setSimParams] = useState<SimulationParams>({
    evChargeSchedule: 'off-peak',
    hvacThermostatOffset: 0,
    solarCapacityBoostKw: 0,
    batteryUpgradeKwh: 0
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage['type'], title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('volt_appliances', JSON.stringify(appliances));
  }, [appliances]);

  useEffect(() => {
    localStorage.setItem('volt_tariff', JSON.stringify(tariff));
  }, [tariff]);

  useEffect(() => {
    localStorage.setItem('volt_solar', JSON.stringify(solarState));
  }, [solarState]);

  // Sync with Backend API if available
  useEffect(() => {
    fetchAppliances().then(data => {
      if (data && Array.isArray(data)) {
        setAppliances(data);
      }
    });
  }, []);

  // Compute live active wattage from appliances
  const calculateTotalHomeLoadWatts = useCallback(() => {
    let load = appliances.reduce((sum, app) => {
      if (app.isOn) {
        return sum + app.powerWatts;
      }
      return sum + app.standbyWatts;
    }, 0);

    // Apply simulation offset if thermostat shifted
    if (simParams.hvacThermostatOffset !== 0) {
      const hvac = appliances.find(a => a.id === 'app-hvac');
      if (hvac && hvac.isOn) {
        const reductionRatio = simParams.hvacThermostatOffset * 0.08; // 8% per degree
        load -= hvac.powerWatts * reductionRatio;
      }
    }
    return Math.max(120, Math.round(load));
  }, [appliances, simParams.hvacThermostatOffset]);

  // Current Telemetry State
  const [telemetry, setTelemetry] = useState<TelemetryPoint>(() => {
    const homeLoadWatts = 3450;
    const solarGenWatts = 3420;
    const netFlow = homeLoadWatts - solarGenWatts;
    return {
      timestamp: new Date().toISOString(),
      timeLabel: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      homeLoadWatts,
      solarGenWatts,
      gridImportWatts: Math.max(0, netFlow),
      batteryFlowWatts: netFlow < 0 ? Math.abs(netFlow) : 0,
      batterySocPercent: 78,
      costRate: DEFAULT_TARIFF.standardRate,
      touTier: 'Standard'
    };
  });

  // Voltage & Grid Frequency Simulation
  const [gridVoltage, setGridVoltage] = useState(120.4);
  const [gridFrequency, setGridFrequency] = useState(59.98);

  // Live Simulation Heartbeat Loop
  useEffect(() => {
    if (!isLiveTelemetryActive) return;

    const interval = setInterval(() => {
      const homeLoad = calculateTotalHomeLoadWatts();
      const randomSolarNoise = (Math.random() - 0.48) * 180;
      const effectiveSolarCapacityKw = solarState.capacityKw + simParams.solarCapacityBoostKw;
      const maxSolarWatts = effectiveSolarCapacityKw * 1000;
      
      const solarGen = Math.min(
        maxSolarWatts, 
        Math.max(0, Math.round(solarState.currentGenWatts + randomSolarNoise))
      );

      const netBalance = homeLoad - solarGen;
      let gridImport = 0;
      let batteryFlow = 0;
      let newSoc = solarState.batterySocPercent;

      if (netBalance > 0) {
        // Home load exceeds solar output
        if (newSoc > 15) {
          // Battery discharges to support load
          batteryFlow = -Math.min(netBalance, 3000); // max 3kW discharge
          gridImport = netBalance + batteryFlow; // batteryFlow is negative
          newSoc = Math.max(15, newSoc - 0.1);
        } else {
          // Battery empty, import full load from grid
          gridImport = netBalance;
          batteryFlow = 0;
        }
      } else {
        // Excess Solar production
        const excessWatts = Math.abs(netBalance);
        if (newSoc < 99) {
          // Charge battery
          batteryFlow = Math.min(excessWatts, 3500); // max 3.5kW charge
          gridImport = 0;
          newSoc = Math.min(100, newSoc + 0.15);
        } else {
          // Battery full, export excess to grid
          gridImport = -excessWatts; // negative indicates export to grid
          batteryFlow = 0;
        }
      }

      // Determine Time of Use Tier based on hour
      const currentHour = new Date().getHours();
      let touTier: TelemetryPoint['touTier'] = 'Standard';
      let currentRate = tariff.standardRate;

      if (tariff.useTou) {
        if (currentHour >= 16 && currentHour < 21) {
          touTier = 'Peak';
          currentRate = tariff.peakRate;
        } else if (currentHour >= 23 || currentHour < 7) {
          touTier = 'Off-Peak';
          currentRate = tariff.offPeakRate;
        }
      }

      const now = new Date();
      const newTelemetryPoint: TelemetryPoint = {
        timestamp: now.toISOString(),
        timeLabel: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        homeLoadWatts: homeLoad,
        solarGenWatts: solarGen,
        gridImportWatts: Math.round(gridImport),
        batteryFlowWatts: Math.round(batteryFlow),
        batterySocPercent: Number(newSoc.toFixed(1)),
        costRate: currentRate,
        touTier
      };

      setTelemetry(newTelemetryPoint);
      setSolarState(prev => ({
        ...prev,
        currentGenWatts: solarGen,
        batterySocPercent: Number(newSoc.toFixed(1)),
        isBatteryDischarging: batteryFlow < 0
      }));

      // Slight grid electrical noise
      setGridVoltage(Number((120.0 + (Math.random() - 0.5) * 0.8).toFixed(1)));
      setGridFrequency(Number((60.0 + (Math.random() - 0.5) * 0.06).toFixed(2)));

    }, simulationSpeed);

    return () => clearInterval(interval);
  }, [
    isLiveTelemetryActive, 
    simulationSpeed, 
    calculateTotalHomeLoadWatts, 
    solarState.capacityKw, 
    solarState.currentGenWatts, 
    solarState.batterySocPercent,
    simParams, 
    tariff
  ]);

  // Toggle Appliance ON / OFF
  const toggleAppliance = useCallback((id: string) => {
    setAppliances(prev => prev.map(app => {
      if (app.id === id) {
        const updatedState = !app.isOn;
        addToast(
          updatedState ? 'info' : 'warning',
          app.name,
          `${app.name} is now ${updatedState ? 'ON (' + app.powerWatts + 'W)' : 'OFF (Standby ' + app.standbyWatts + 'W)'}`
        );
        return { ...app, isOn: updatedState };
      }
      return app;
    }));
    toggleApplianceApi(id);
  }, [addToast]);

  // Add Custom Appliance
  const addAppliance = useCallback((newApp: Omit<Appliance, 'id' | 'monthlyCostEstimate'>) => {
    const id = `app-custom-${Date.now()}`;
    const monthlyCost = Number(((newApp.powerWatts / 1000) * newApp.dailyAvgHours * 30 * tariff.standardRate).toFixed(2));
    const fullAppliance: Appliance = {
      ...newApp,
      id,
      monthlyCostEstimate: monthlyCost
    };

    setAppliances(prev => [fullAppliance, ...prev]);
    addToast('success', 'Smart Appliance Registered', `${newApp.name} added to ${newApp.category}.`);
    addApplianceApi(newApp);
  }, [tariff.standardRate, addToast]);

  // Delete Appliance
  const deleteAppliance = useCallback((id: string) => {
    setAppliances(prev => {
      const app = prev.find(a => a.id === id);
      if (app) {
        addToast('info', 'Appliance Removed', `${app.name} removed from tracker.`);
      }
      return prev.filter(a => a.id !== id);
    });
    deleteApplianceApi(id);
  }, [addToast]);


  // Calculate Monthly Estimated Bill
  const calculateEstimatedMonthlyBill = useCallback(() => {
    const totalDailyKwh = appliances.reduce((sum, app) => {
      const activeKwh = app.isOn ? (app.powerWatts / 1000) * app.dailyAvgHours : 0;
      const standbyKwh = (app.standbyWatts / 1000) * (24 - (app.isOn ? app.dailyAvgHours : 0));
      return sum + activeKwh + standbyKwh;
    }, 0);

    const solarDailyKwh = solarState.dailyGenKwh;
    const netDailyKwh = Math.max(0, totalDailyKwh - solarDailyKwh * 0.7);
    
    // Average effective rate
    const blendedRate = tariff.useTou 
      ? (tariff.offPeakRate * 0.4 + tariff.standardRate * 0.4 + tariff.peakRate * 0.2)
      : tariff.flatRate;

    const baseCost = netDailyKwh * 30 * blendedRate;
    return Number(baseCost.toFixed(2));
  }, [appliances, solarState.dailyGenKwh, tariff]);

  // Calculate Carbon Footprint
  const calculateCarbonFootprint = useCallback(() => {
    const monthlyKwh = appliances.reduce((sum, app) => {
      return sum + (app.isOn ? (app.powerWatts / 1000) * app.dailyAvgHours * 30 : 0);
    }, 0);

    const co2Kg = Math.round(monthlyKwh * 0.385);
    const treesRequired = Math.round(co2Kg / 21.5); // ~21.5kg CO2 absorbed per tree per year
    return { co2Kg, treesRequired, monthlyKwh: Math.round(monthlyKwh) };
  }, [appliances]);

  // Calculate Home Energy Efficiency Score (0 - 100)
  const calculateEfficiencyScore = useCallback(() => {
    let score = 82; // Base baseline score
    
    // Solar presence boost
    if (solarState.capacityKw > 4) score += 8;
    
    // Smart scheduling ratio
    const scheduledApps = appliances.filter(a => a.isSmartSchedule).length;
    const scheduleRatio = scheduledApps / Math.max(1, appliances.length);
    score += Math.round(scheduleRatio * 6);

    // Standby waste penalty
    const highStandbyCount = appliances.filter(a => a.standbyWatts > 20).length;
    score -= highStandbyCount * 3;

    return Math.min(100, Math.max(45, score));
  }, [solarState.capacityKw, appliances]);

  return {
    appliances,
    toggleAppliance,
    addAppliance,
    deleteAppliance,
    telemetry,
    solarState,
    setSolarState,
    tariff,
    setTariff,
    aiInsights,
    setAiInsights,
    hourlyData,
    dailyData,
    monthlyData,
    isLiveTelemetryActive,
    setIsLiveTelemetryActive,
    simulationSpeed,
    setSimulationSpeed,
    gridVoltage,
    gridFrequency,
    simParams,
    setSimParams,
    estimatedMonthlyBill: calculateEstimatedMonthlyBill(),
    carbonStats: calculateCarbonFootprint(),
    efficiencyScore: calculateEfficiencyScore(),
    toasts,
    addToast,
    removeToast
  };
}
