import React from 'react';
import { 
  Zap, 
  Sun, 
  Battery, 
  BatteryCharging, 
  ArrowUpRight, 
  ArrowDownRight, 
  Home, 
  Globe, 
  Gauge, 
  Clock, 
  TrendingUp, 
  Leaf, 
  ShieldAlert
} from 'lucide-react';
import { TelemetryPoint, SolarSystemState, TariffSchedule, Appliance } from '../types/energy';

interface RealtimeOverviewProps {
  telemetry: TelemetryPoint;
  solarState: SolarSystemState;
  tariff: TariffSchedule;
  appliances: Appliance[];
  estimatedMonthlyBill: number;
  carbonStats: { co2Kg: number; treesRequired: number; monthlyKwh: number };
  efficiencyScore: number;
  onNavigateTab: (tab: any) => void;
}

export const RealtimeOverview: React.FC<RealtimeOverviewProps> = ({
  telemetry,
  solarState,
  tariff,
  appliances,
  estimatedMonthlyBill,
  carbonStats,
  efficiencyScore,
  onNavigateTab
}) => {
  const activeAppliancesCount = appliances.filter(a => a.isOn).length;
  const loadKw = (telemetry.homeLoadWatts / 1000).toFixed(2);
  const solarKw = (telemetry.solarGenWatts / 1000).toFixed(2);
  const isNetExporting = telemetry.gridImportWatts < 0;
  const gridBalanceKw = (Math.abs(telemetry.gridImportWatts) / 1000).toFixed(2);

  // Percentage for load gauge meter (max 10kW)
  const maxKw = 10;
  const loadGaugePercent = Math.min(100, (telemetry.homeLoadWatts / 1000 / maxKw) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Top 4 Quick Telemetry Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        
        {/* Card 1: Home Power Load */}
        <div className="glass-panel" style={{ padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Home Load</span>
            <div style={{ background: 'rgba(56, 189, 248, 0.15)', padding: '0.5rem', borderRadius: '10px' }}>
              <Zap size={20} color="#38bdf8" />
            </div>
          </div>
          <div style={{ marginTop: '0.75rem' }}>
            <span className="font-mono" style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc' }}>
              {loadKw}
            </span>
            <span style={{ fontSize: '1rem', color: '#38bdf8', fontWeight: 700, marginLeft: '0.3rem' }}>kW</span>
          </div>
          <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-dim)' }}>{activeAppliancesCount} of {appliances.length} active devices</span>
            <span className="badge badge-cyan">{telemetry.touTier} Tier</span>
          </div>
        </div>

        {/* Card 2: Solar PV Generation */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Solar PV Output</span>
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '0.5rem', borderRadius: '10px' }}>
              <Sun size={20} color="#f59e0b" />
            </div>
          </div>
          <div style={{ marginTop: '0.75rem' }}>
            <span className="font-mono" style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc' }}>
              {solarKw}
            </span>
            <span style={{ fontSize: '1rem', color: '#f59e0b', fontWeight: 700, marginLeft: '0.3rem' }}>kW</span>
          </div>
          <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-dim)' }}>Capacity: {solarState.capacityKw} kWp</span>
            <span className="badge badge-amber">{solarState.efficiencyPercent}% Eff</span>
          </div>
        </div>

        {/* Card 3: Battery Storage SOC */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Battery Storage</span>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.5rem', borderRadius: '10px' }}>
              {solarState.isBatteryDischarging ? <Battery size={20} color="#34d399" /> : <BatteryCharging size={20} color="#34d399" />}
            </div>
          </div>
          <div style={{ marginTop: '0.75rem' }}>
            <span className="font-mono" style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc' }}>
              {solarState.batterySocPercent}
            </span>
            <span style={{ fontSize: '1rem', color: '#34d399', fontWeight: 700, marginLeft: '0.2rem' }}>%</span>
          </div>
          <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-dim)' }}>{solarState.isBatteryDischarging ? 'Discharging to Load' : 'Standby / Charging'}</span>
            <span className="badge badge-emerald">{solarState.batteryCapacityKwh} kWh</span>
          </div>
        </div>

        {/* Card 4: Grid Balance & Cost Rate */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Grid Exchange</span>
            <div style={{ background: isNetExporting ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)', padding: '0.5rem', borderRadius: '10px' }}>
              {isNetExporting ? <ArrowUpRight size={20} color="#34d399" /> : <ArrowDownRight size={20} color="#fb7185" />}
            </div>
          </div>
          <div style={{ marginTop: '0.75rem' }}>
            <span className="font-mono" style={{ fontSize: '2.2rem', fontWeight: 800, color: isNetExporting ? '#34d399' : '#f8fafc' }}>
              {gridBalanceKw}
            </span>
            <span style={{ fontSize: '1rem', color: isNetExporting ? '#34d399' : '#fb7185', fontWeight: 700, marginLeft: '0.3rem' }}>
              kW {isNetExporting ? 'Export' : 'Import'}
            </span>
          </div>
          <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-dim)' }}>Current Rate</span>
            <span className="font-mono" style={{ color: '#38bdf8', fontWeight: 700 }}>
              {tariff.currencySymbol}{telemetry.costRate.toFixed(2)}/kWh
            </span>
          </div>
        </div>

      </div>

      {/* Main Grid: Interactive Energy Flow Diagram & Load Gauge */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.25rem' }}>
        
        {/* Animated Microgrid Flow Map (8 cols) */}
        <div className="glass-panel" style={{ gridColumn: 'span 8', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>Microgrid Energy Flow Vectors</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Real-time power routing topology between generation, storage, and home loads</p>
            </div>
            <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} onClick={() => onNavigateTab('solar')}>
              Manage Solar System →
            </button>
          </div>

          {/* Interactive SVG Flow Diagram */}
          <div style={{
            background: 'rgba(7, 9, 19, 0.7)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '1.5rem',
            position: 'relative',
            minHeight: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="100%" height="260" viewBox="0 0 650 260" style={{ overflow: 'visible' }}>
              <defs>
                <linearGradient id="grad-solar" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
                <linearGradient id="grad-battery" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
                <linearGradient id="grad-grid" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>

              {/* Vector Lines */}
              {/* Solar (100, 50) -> Home Hub (325, 130) */}
              <line x1="130" y1="65" x2="325" y2="130" stroke="url(#grad-solar)" strokeWidth="3" className="energy-line" />
              
              {/* Battery (100, 195) -> Home Hub (325, 130) */}
              <line x1="130" y1="195" x2="325" y2="130" stroke="url(#grad-battery)" strokeWidth="3" className={solarState.isBatteryDischarging ? "energy-line" : "energy-line-reverse"} />

              {/* Power Grid (520, 130) -> Home Hub (325, 130) */}
              <line x1="520" y1="130" x2="325" y2="130" stroke="url(#grad-grid)" strokeWidth="3" className={isNetExporting ? "energy-line-reverse" : "energy-line"} />

              {/* Node 1: Solar Array */}
              <g transform="translate(70, 40)">
                <circle cx="25" cy="25" r="32" fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b" strokeWidth="2" />
                <Sun x="9" y="9" size={32} color="#f59e0b" />
                <text x="25" y="72" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700">SOLAR PV</text>
                <text x="25" y="86" textAnchor="middle" fill="#f59e0b" fontSize="11" fontFamily="JetBrains Mono">{solarKw} kW</text>
              </g>

              {/* Node 2: Battery Storage */}
              <g transform="translate(70, 170)">
                <circle cx="25" cy="25" r="32" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" strokeWidth="2" />
                <Battery x="9" y="9" size={32} color="#34d399" />
                <text x="25" y="72" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700">BATTERY SOC</text>
                <text x="25" y="86" textAnchor="middle" fill="#34d399" fontSize="11" fontFamily="JetBrains Mono">{solarState.batterySocPercent}%</text>
              </g>

              {/* Central Hub: Smart Home */}
              <g transform="translate(300, 105)">
                <circle cx="25" cy="25" r="44" fill="rgba(2, 132, 199, 0.25)" stroke="#38bdf8" strokeWidth="3" style={{ filter: 'drop-shadow(0 0 15px rgba(56, 189, 248, 0.5))' }} />
                <Home x="3" y="3" size={44} color="#38bdf8" />
                <text x="25" y="84" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="800">SMART HOME LOAD</text>
                <text x="25" y="100" textAnchor="middle" fill="#38bdf8" fontSize="13" fontFamily="JetBrains Mono" fontWeight="700">{loadKw} kW</text>
              </g>

              {/* Node 4: Power Grid */}
              <g transform="translate(500, 105)">
                <circle cx="25" cy="25" r="32" fill="rgba(244, 63, 94, 0.15)" stroke="#f43f5e" strokeWidth="2" />
                <Globe x="9" y="9" size={32} color="#fb7185" />
                <text x="25" y="72" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700">UTILITY GRID</text>
                <text x="25" y="86" textAnchor="middle" fill={isNetExporting ? '#34d399' : '#fb7185'} fontSize="11" fontFamily="JetBrains Mono">
                  {isNetExporting ? `Export -${gridBalanceKw}` : `Import +${gridBalanceKw}`} kW
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* Live Load Meter & Efficiency Score (4 cols) */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Circular Gauge Card */}
          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Gauge size={18} color="#38bdf8" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>Power Capacity Gauge</h3>
            </div>

            {/* Circular Gauge Ring */}
            <div style={{ position: 'relative', width: '170px', height: '170px', margin: '0.5rem 0' }}>
              <svg width="170" height="170" viewBox="0 0 170 170">
                <circle cx="85" cy="85" r="70" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="12" />
                <circle 
                  cx="85" 
                  cy="85" 
                  r="70" 
                  fill="none" 
                  stroke="url(#gauge-grad)" 
                  strokeWidth="12"
                  strokeDasharray="440"
                  strokeDashoffset={440 - (440 * loadGaugePercent) / 100}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                  transform="rotate(-90 85 85)"
                />
                <defs>
                  <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="70%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#f43f5e" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span className="font-mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
                  {telemetry.homeLoadWatts}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>WATTS DRAWN</span>
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
              Peak Load Rating: 10.0 kW Max
            </p>
          </div>

          {/* Efficiency Score Card */}
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Home Efficiency Rating</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '0.25rem' }}>
                  <span className="font-mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399' }}>{efficiencyScore}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ 100</span>
                </div>
              </div>
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.65rem', borderRadius: '12px' }}>
                <Leaf size={24} color="#34d399" />
              </div>
            </div>

            <div style={{ marginTop: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '6px', height: '8px', overflow: 'hidden' }}>
              <div style={{ width: `${efficiencyScore}%`, height: '100%', background: 'linear-gradient(90deg, #10b981 0%, #38bdf8 100%)', borderRadius: '6px' }}></div>
            </div>
            
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
              🌲 Carbon Offset: ~{carbonStats.treesRequired} mature trees saved per year
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
