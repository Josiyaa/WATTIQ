import React from 'react';
import { 
  Sun, 
  Battery, 
  BatteryCharging, 
  Zap, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  Sliders 
} from 'lucide-react';
import { SolarSystemState, TariffSchedule, TelemetryPoint } from '../types/energy';

interface SolarMicrogridProps {
  solarState: SolarSystemState;
  tariff: TariffSchedule;
  telemetry: TelemetryPoint;
}

export const SolarMicrogrid: React.FC<SolarMicrogridProps> = ({
  solarState,
  tariff,
  telemetry
}) => {
  const currentGenKw = (solarState.currentGenWatts / 1000).toFixed(2);
  const selfConsumptionPercent = 86; // 86% absorbed locally
  const gridExportKw = Math.max(0, (telemetry.solarGenWatts - telemetry.homeLoadWatts) / 1000).toFixed(2);

  // Backup runtime calculation (Capacity * SOC% / current load)
  const availableKwh = (solarState.batteryCapacityKwh * solarState.batterySocPercent) / 100;
  const loadKw = Math.max(0.3, telemetry.homeLoadWatts / 1000);
  const backupHours = (availableKwh / loadKw).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sun color="#f59e0b" /> Solar PV & Battery Storage Microgrid
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Monitor real-time clean power generation, self-consumption ratio, net metering, and emergency battery backup capacity
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="badge badge-amber">6.5 kWp Monocrystalline</span>
          <span className="badge badge-emerald">13.5 kWh LFP Battery</span>
        </div>
      </div>

      {/* Grid Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.25rem' }}>
        
        {/* Card 1: Solar Production Meter (6 cols) */}
        <div className="glass-panel" style={{ gridColumn: 'span 6', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Instant Solar PV Generation</span>
              <div className="font-mono" style={{ fontSize: '2.4rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.25rem' }}>
                {currentGenKw} <span style={{ fontSize: '1.1rem' }}>kW</span>
              </div>
            </div>
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '0.85rem', borderRadius: '14px' }}>
              <Sun size={32} color="#f59e0b" />
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Daily Energy Harvested</span>
              <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>{solarState.dailyGenKwh} kWh</div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Self-Consumption Rate</span>
              <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#38bdf8' }}>{selfConsumptionPercent}%</div>
            </div>
          </div>

          <div style={{ marginTop: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', height: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${selfConsumptionPercent}%`, height: '100%', background: 'linear-gradient(90deg, #f59e0b 0%, #38bdf8 100%)' }}></div>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginTop: '0.4rem' }}>
            86% of solar generation directly powers home appliances; 14% charges battery/exports.
          </span>
        </div>

        {/* Card 2: Battery SOC & Emergency Backup Runtime (6 cols) */}
        <div className="glass-panel" style={{ gridColumn: 'span 6', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Battery Bank Charge (SOC)</span>
              <div className="font-mono" style={{ fontSize: '2.4rem', fontWeight: 800, color: '#34d399', marginTop: '0.25rem' }}>
                {solarState.batterySocPercent}%
              </div>
            </div>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.85rem', borderRadius: '14px' }}>
              <BatteryCharging size={32} color="#34d399" />
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Off-Grid Backup Runtime</span>
              <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={16} color="#38bdf8" /> ~{backupHours} Hours
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Net Export Revenue Today</span>
              <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#34d399' }}>
                +{tariff.currencySymbol}{solarState.netExportRevenueToday.toFixed(2)}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', height: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${solarState.batterySocPercent}%`, height: '100%', background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)' }}></div>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginTop: '0.4rem' }}>
            Usable Energy: {availableKwh.toFixed(1)} kWh remaining at current {loadKw.toFixed(2)} kW load rate.
          </span>
        </div>

      </div>

    </div>
  );
};
