export type RoomCategory = 'Living Room' | 'Kitchen' | 'Master Bedroom' | 'Home Office' | 'Garage & EV' | 'Utility Room' | 'Outdoor';

export interface Appliance {
  id: string;
  name: string;
  category: RoomCategory;
  powerWatts: number;
  isOn: boolean;
  isSmartSchedule: boolean;
  scheduleTime?: string;
  dailyAvgHours: number;
  iconName: string;
  priority: 'Essential' | 'Flexible' | 'High-Load';
  standbyWatts: number;
  monthlyCostEstimate: number;
}

export interface TelemetryPoint {
  timestamp: string;
  timeLabel: string;
  gridImportWatts: number;
  solarGenWatts: number;
  homeLoadWatts: number;
  batteryFlowWatts: number; // positive = charging, negative = discharging
  batterySocPercent: number;
  costRate: number; // $/kWh at this instant
  touTier: 'Off-Peak' | 'Standard' | 'Peak';
}

export interface HistoricalPoint {
  period: string; // e.g. "00:00", "Mon", "Jan"
  gridUsageKwh: number;
  solarGenKwh: number;
  totalLoadKwh: number;
  costDollars: number;
  co2Kg: number;
  peakDemandKw: number;
}

export interface TariffSchedule {
  currencySymbol: string;
  currencyCode: string;
  flatRate: number; // $/kWh
  useTou: boolean;
  offPeakRate: number;
  standardRate: number;
  peakRate: number;
  offPeakHours: string; // e.g. "23:00 - 07:00"
  peakHours: string;    // e.g. "16:00 - 21:00"
  monthlyBudget: number;
}

export interface SolarSystemState {
  capacityKw: number;
  currentGenWatts: number;
  dailyGenKwh: number;
  efficiencyPercent: number;
  batteryCapacityKwh: number;
  batterySocPercent: number;
  batteryHealthPercent: number;
  isBatteryDischarging: boolean;
  netExportRevenueToday: number;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: 'savings' | 'alert' | 'solar' | 'efficiency';
  impact: 'High' | 'Medium' | 'Low';
  estimatedMonthlySavings: number;
  actionText: string;
  actionType: 'toggle_appliance' | 'adjust_schedule' | 'set_budget' | 'view_solar';
  targetApplianceId?: string;
}

export interface SimulationParams {
  evChargeSchedule: 'anytime' | 'off-peak' | 'solar-only';
  hvacThermostatOffset: number; // e.g. +2 degrees in summer saves 12%
  solarCapacityBoostKw: number; // e.g. +3kW additional panels
  batteryUpgradeKwh: number;
}
