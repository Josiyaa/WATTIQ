import { Appliance, TariffSchedule, SolarSystemState, AIInsight, HistoricalPoint } from '../types/energy';

export const INITIAL_APPLIANCES: Appliance[] = [
  {
    id: 'app-hvac',
    name: 'Smart HVAC Climate Control',
    category: 'Living Room',
    powerWatts: 2400,
    isOn: true,
    isSmartSchedule: true,
    scheduleTime: '07:00 - 22:00',
    dailyAvgHours: 8.5,
    iconName: 'Wind',
    priority: 'Essential',
    standbyWatts: 15,
    monthlyCostEstimate: 58.20
  },
  {
    id: 'app-ev',
    name: 'Level 2 EV Charger',
    category: 'Garage & EV',
    powerWatts: 7200,
    isOn: false,
    isSmartSchedule: true,
    scheduleTime: '00:00 - 06:00 (Off-Peak)',
    dailyAvgHours: 3.0,
    iconName: 'Zap',
    priority: 'High-Load',
    standbyWatts: 5,
    monthlyCostEstimate: 64.80
  },
  {
    id: 'app-fridge',
    name: 'Inverter Refrigerator',
    category: 'Kitchen',
    powerWatts: 180,
    isOn: true,
    isSmartSchedule: false,
    dailyAvgHours: 24,
    iconName: 'Refrigerator',
    priority: 'Essential',
    standbyWatts: 120,
    monthlyCostEstimate: 12.96
  },
  {
    id: 'app-water-heater',
    name: 'Hybrid Heat Pump Water Heater',
    category: 'Utility Room',
    powerWatts: 1500,
    isOn: true,
    isSmartSchedule: true,
    scheduleTime: '04:00 & 18:00',
    dailyAvgHours: 4.0,
    iconName: 'Flame',
    priority: 'Flexible',
    standbyWatts: 10,
    monthlyCostEstimate: 18.00
  },
  {
    id: 'app-office-rig',
    name: 'Workstation & Multi-Monitors',
    category: 'Home Office',
    powerWatts: 420,
    isOn: true,
    isSmartSchedule: false,
    dailyAvgHours: 9.0,
    iconName: 'Monitor',
    priority: 'Flexible',
    standbyWatts: 22,
    monthlyCostEstimate: 11.34
  },
  {
    id: 'app-washer',
    name: 'Smart Eco Washer & Dryer',
    category: 'Utility Room',
    powerWatts: 1800,
    isOn: false,
    isSmartSchedule: true,
    scheduleTime: '13:00 - 15:00',
    dailyAvgHours: 1.2,
    iconName: 'Shirt',
    priority: 'Flexible',
    standbyWatts: 4,
    monthlyCostEstimate: 6.48
  },
  {
    id: 'app-entertainment',
    name: 'OLED TV & Spatial Audio',
    category: 'Living Room',
    powerWatts: 260,
    isOn: true,
    isSmartSchedule: false,
    dailyAvgHours: 4.5,
    iconName: 'Tv',
    priority: 'Flexible',
    standbyWatts: 18,
    monthlyCostEstimate: 3.51
  },
  {
    id: 'app-lights',
    name: 'Ambient LED Lighting Array',
    category: 'Living Room',
    powerWatts: 95,
    isOn: true,
    isSmartSchedule: true,
    scheduleTime: '18:30 - 23:30',
    dailyAvgHours: 5.0,
    iconName: 'Lightbulb',
    priority: 'Essential',
    standbyWatts: 2,
    monthlyCostEstimate: 1.42
  }
];

export const DEFAULT_TARIFF: TariffSchedule = {
  currencySymbol: '$',
  currencyCode: 'USD',
  flatRate: 0.18,
  useTou: true,
  offPeakRate: 0.10,
  standardRate: 0.18,
  peakRate: 0.32,
  offPeakHours: '23:00 - 07:00',
  peakHours: '16:00 - 21:00',
  monthlyBudget: 220
};

export const DEFAULT_SOLAR_STATE: SolarSystemState = {
  capacityKw: 6.5,
  currentGenWatts: 3420,
  dailyGenKwh: 24.8,
  efficiencyPercent: 94.2,
  batteryCapacityKwh: 13.5,
  batterySocPercent: 78,
  batteryHealthPercent: 98,
  isBatteryDischarging: false,
  netExportRevenueToday: 3.42
};

export const INITIAL_AI_INSIGHTS: AIInsight[] = [
  {
    id: 'ai-1',
    title: 'EV Charging Peak Time Avoidance',
    description: 'Your Level 2 EV Charger ran during Peak Rate ($0.32/kWh) yesterday at 17:30. Shifting to Off-Peak (00:00 - 06:00) saves 68% on EV fuel costs.',
    type: 'savings',
    impact: 'High',
    estimatedMonthlySavings: 44.50,
    actionText: 'Auto-Schedule Off-Peak',
    actionType: 'adjust_schedule',
    targetApplianceId: 'app-ev'
  },
  {
    id: 'ai-2',
    title: 'Solar Self-Consumption Optimization',
    description: 'Solar panel output peaks between 11:30 - 15:00. Run Smart Eco Washer during this window to absorb clean solar energy instead of grid power.',
    type: 'solar',
    impact: 'Medium',
    estimatedMonthlySavings: 18.20,
    actionText: 'Sync Washer with Solar',
    actionType: 'adjust_schedule',
    targetApplianceId: 'app-washer'
  },
  {
    id: 'ai-3',
    title: 'Vampire Draw Detection in Home Office',
    description: 'Workstation setup draws 22W continuously even when suspended. Enabling smart power strip shutdown cuts standby waste.',
    type: 'alert',
    impact: 'Low',
    estimatedMonthlySavings: 7.80,
    actionText: 'Enable Eco Standby',
    actionType: 'toggle_appliance',
    targetApplianceId: 'app-office-rig'
  },
  {
    id: 'ai-4',
    title: 'Thermostat Setpoint Adjustment',
    description: 'Adjusting HVAC temperature by +1.5°F during summer afternoon peak hours lowers cooling load by 14%.',
    type: 'efficiency',
    impact: 'High',
    estimatedMonthlySavings: 28.00,
    actionText: 'Optimize Thermostat',
    actionType: 'adjust_schedule',
    targetApplianceId: 'app-hvac'
  }
];

export const GENERATE_HOURLY_HISTORY = (): HistoricalPoint[] => {
  const hours = [
    '00:00', '02:00', '04:00', '06:00', '08:00', '10:00',
    '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'
  ];
  return hours.map((hour, idx) => {
    const isSolarPeak = idx >= 4 && idx <= 8;
    const isTouPeak = idx >= 8 && idx <= 10;
    const solarGenKwh = isSolarPeak ? Number((1.2 + Math.sin((idx - 4) * 0.75) * 3.5).toFixed(2)) : 0;
    const totalLoadKwh = Number((0.8 + Math.random() * 0.9 + (isTouPeak ? 1.8 : 0.4)).toFixed(2));
    const gridUsageKwh = Math.max(0, Number((totalLoadKwh - solarGenKwh * 0.8).toFixed(2)));
    const rate = isTouPeak ? 0.32 : isSolarPeak ? 0.18 : 0.10;
    const costDollars = Number((gridUsageKwh * rate).toFixed(2));
    const co2Kg = Number((gridUsageKwh * 0.385).toFixed(2)); // ~0.385 kg CO2 per kWh average grid
    
    return {
      period: hour,
      gridUsageKwh,
      solarGenKwh,
      totalLoadKwh,
      costDollars,
      co2Kg,
      peakDemandKw: Number((totalLoadKwh * 1.4).toFixed(2))
    };
  });
};

export const GENERATE_DAILY_HISTORY = (): HistoricalPoint[] => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => {
    const totalLoadKwh = Number((22 + Math.random() * 12).toFixed(1));
    const solarGenKwh = Number((18 + Math.random() * 10).toFixed(1));
    const gridUsageKwh = Math.max(2, Number((totalLoadKwh - solarGenKwh * 0.75).toFixed(1)));
    const costDollars = Number((gridUsageKwh * 0.19).toFixed(2));
    const co2Kg = Number((gridUsageKwh * 0.385).toFixed(1));

    return {
      period: day,
      gridUsageKwh,
      solarGenKwh,
      totalLoadKwh,
      costDollars,
      co2Kg,
      peakDemandKw: Number((3.5 + Math.random() * 2.2).toFixed(1))
    };
  });
};

export const GENERATE_MONTHLY_HISTORY = (): HistoricalPoint[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, idx) => {
    const isSummer = idx >= 5 && idx <= 8;
    const totalLoadKwh = Math.round(520 + (isSummer ? 280 : 0) + Math.random() * 90);
    const solarGenKwh = Math.round(410 + (isSummer ? 260 : -100) + Math.random() * 80);
    const gridUsageKwh = Math.max(50, totalLoadKwh - Math.round(solarGenKwh * 0.75));
    const costDollars = Number((gridUsageKwh * 0.185).toFixed(2));
    const co2Kg = Math.round(gridUsageKwh * 0.385);

    return {
      period: month,
      gridUsageKwh,
      solarGenKwh,
      totalLoadKwh,
      costDollars,
      co2Kg,
      peakDemandKw: Number((5.2 + (isSummer ? 2.5 : 0)).toFixed(1))
    };
  });
};
